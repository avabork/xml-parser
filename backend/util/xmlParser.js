import { parseStringPromise } from 'xml2js';

// Helper to safely access nested properties
const safeGet = (obj, path, defaultValue = null) => {
  const keys = Array.isArray(path) ? path : path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined || result === null) {
      return defaultValue;
    }
  }
  return result;
};

// Helper to parse arrays from xml2js (which doesn't always make arrays)
const asArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export const parseCreditReportXML = async (xmlString) => {
  try {
    // { explicitArray: false } makes navigation easier
    const result = await parseStringPromise(xmlString, { explicitArray: false });

    // --- START VALIDATION ---
    // Check if the expected root element exists.
    if (!result || !result.INProfileResponse) { // <-- ADDED
      throw new Error('Invalid XML structure: Missing <INProfileResponse> root element.'); // <-- ADDED
    }
    // --- END VALIDATION ---

    const report = result.INProfileResponse;

    // --- Basic Details ---
    // Use safeGet on 'report' to prevent crashes if main sections are missing
    const applicant = safeGet(report, 'Current_Application.Current_Application_Details.Current_Applicant_Details'); // <-- UPDATED
    const name = `${safeGet(applicant, 'First_Name', '')} ${safeGet(applicant, 'Last_Name', '')}`.trim(); 
    const mobile = safeGet(applicant, 'MobilePhoneNumber'); 
    
    const allAccounts = asArray(safeGet(report, 'CAIS_Account.CAIS_Account_DETAILS', []));
    const firstAccountHolder = safeGet(allAccounts, '0.CAIS_Holder_Details');
    const pan = safeGet(firstAccountHolder, 'Income_TAX_PAN'); 

    const creditScore = parseInt(safeGet(report, 'SCORE.BureauScore', 0), 10); 

    // --- Report Summary ---
    const summary = safeGet(report, 'CAIS_Account.CAIS_Summary'); // <-- UPDATED
    const totalAccounts = parseInt(safeGet(summary, 'Credit_Account.CreditAccountTotal', 0), 10); 
    const activeAccounts = parseInt(safeGet(summary, 'Credit_Account.CreditAccountActive', 0), 10); 
    const closedAccounts = parseInt(safeGet(summary, 'Credit_Account.CreditAccountClosed', 0), 10); 
    
    const balance = safeGet(summary, 'Total_Outstanding_Balance'); // <-- UPDATED
    const currentBalanceAmount = parseInt(safeGet(balance, 'Outstanding_Balance_All', 0), 10); 
    const securedAccountsAmount = parseInt(safeGet(balance, 'Outstanding_Balance_Secured', 0), 10); 
    const unsecuredAccountsAmount = parseInt(safeGet(balance, 'Outstanding_Balance_UnSecured', 0), 10); 
    const sevenDayEnquiries = parseInt(safeGet(report, 'TotalCAPS_Summary.TotalCAPSLast7Days', 0), 10); 

    // --- Credit Accounts & Addresses ---
    const creditCards = [];
    const addresses = new Map(); 

    for (const account of allAccounts) {
      // Filter for Credit Cards (Account_Type '10' is commonly Credit Card)
      if (safeGet(account, 'Account_Type') === '10') {
        creditCards.push({
          accountNumber: safeGet(account, 'Account_Number'), 
          bankName: safeGet(account, 'Subscriber_Name', '').trim(), 
          accountType: safeGet(account, 'Account_Type'),
          amountOverdue: parseInt(safeGet(account, 'Amount_Past_Due', 0), 10), 
          currentBalance: parseInt(safeGet(account, 'Current_Balance', 0), 10), 
        });
      }

      // Collect all unique addresses
      const addr = safeGet(account, 'CAIS_Holder_Address_Details');
      if (addr) {
        const full = `${safeGet(addr, 'First_Line_Of_Address_non_normalized', '')} ${safeGet(addr, 'Second_Line_Of_Address_non_normalized', '')} ${safeGet(addr, 'Third_Line_Of_Address_non_normalized', '')}`.trim();
        const zip = safeGet(addr, 'ZIP_Postal_Code_non_normalized');
        
        if (full && !addresses.has(full)) {
          addresses.set(full, {
            fullAddress: full.replace(/\s+/g, ' '), 
            city: safeGet(addr, 'City_non_normalized'),
            state: safeGet(addr, 'State_non_normalized'), 
            zip: zip,
          });
        }
      }
    }

    // --- Assemble Final JSON ---
    const extractedData = {
      basicDetails: {
        name,
        mobile,
        pan,
        creditScore,
      },
      reportSummary: {
        totalAccounts,
        activeAccounts,
        closedAccounts,
        currentBalanceAmount,
        securedAccountsAmount,
        unsecuredAccountsAmount,
        sevenDayEnquiries,
      },
      creditCards: creditCards,
      addresses: Array.from(addresses.values()),
    };

    return extractedData;
  } catch (error) {
    console.error('Error parsing XML:', error.message); // <-- UPDATED to log message
    // Pass the specific validation error message to the controller
    throw new Error(error.message || 'Failed to parse XML file.'); // <-- UPDATED
  }
};
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
    const report = result.INProfileResponse;

    // --- Basic Details --- [cite: 15]
    const applicant = report.Current_Application.Current_Application_Details.Current_Applicant_Details;
    const name = `${safeGet(applicant, 'First_Name', '')} ${safeGet(applicant, 'Last_Name', '')}`.trim(); // [cite: 16]
    const mobile = safeGet(applicant, 'MobilePhoneNumber'); // [cite: 17]
    
    // PAN and Addresses are often repeated per account; we'll take the first good one.
    const allAccounts = asArray(safeGet(report, 'CAIS_Account.CAIS_Account_DETAILS', []));
    const firstAccountHolder = safeGet(allAccounts, '0.CAIS_Holder_Details');
    const pan = safeGet(firstAccountHolder, 'Income_TAX_PAN'); // [cite: 18]

    const creditScore = parseInt(safeGet(report, 'SCORE.BureauScore', 0), 10); // [cite: 19]

    // --- Report Summary --- [cite: 20]
    const summary = report.CAIS_Account.CAIS_Summary;
    const totalAccounts = parseInt(safeGet(summary, 'Credit_Account.CreditAccountTotal', 0), 10); // [cite: 22]
    const activeAccounts = parseInt(safeGet(summary, 'Credit_Account.CreditAccountActive', 0), 10); // [cite: 23]
    const closedAccounts = parseInt(safeGet(summary, 'Credit_Account.CreditAccountClosed', 0), 10); // [cite: 24]
    
    const balance = summary.Total_Outstanding_Balance;
    const currentBalanceAmount = parseInt(safeGet(balance, 'Outstanding_Balance_All', 0), 10); // [cite: 25]
    const securedAccountsAmount = parseInt(safeGet(balance, 'Outstanding_Balance_Secured', 0), 10); // [cite: 26]
    const unsecuredAccountsAmount = parseInt(safeGet(balance, 'Outstanding_Balance_UnSecured', 0), 10); // [cite: 27]
    const sevenDayEnquiries = parseInt(safeGet(report, 'TotalCAPS_Summary.TotalCAPSLast7Days', 0), 10); // [cite: 28]

    // --- Credit Accounts & Addresses --- [cite: 29]
    const creditCards = [];
    const addresses = new Map(); // Use a Map to store unique addresses

    for (const account of allAccounts) {
      // Filter for Credit Cards (Account_Type '10' is commonly Credit Card) [cite: 30]
      if (safeGet(account, 'Account_Type') === '10') {
        creditCards.push({
          accountNumber: safeGet(account, 'Account_Number'), // [cite: 33]
          bankName: safeGet(account, 'Subscriber_Name', '').trim(), // [cite: 31]
          accountType: safeGet(account, 'Account_Type'),
          amountOverdue: parseInt(safeGet(account, 'Amount_Past_Due', 0), 10), // [cite: 34]
          currentBalance: parseInt(safeGet(account, 'Current_Balance', 0), 10), // [cite: 35]
        });
      }

      // Collect all unique addresses [cite: 32]
      const addr = safeGet(account, 'CAIS_Holder_Address_Details');
      if (addr) {
        const full = `${safeGet(addr, 'First_Line_Of_Address_non_normalized', '')} ${safeGet(addr, 'Second_Line_Of_Address_non_normalized', '')} ${safeGet(addr, 'Third_Line_Of_Address_non_normalized', '')}`.trim();
        const zip = safeGet(addr, 'ZIP_Postal_Code_non_normalized');
        
        if (full && !addresses.has(full)) {
          addresses.set(full, {
            fullAddress: full.replace(/\s+/g, ' '), // Clean up extra spaces
            city: safeGet(addr, 'City_non_normalized'),
            state: safeGet(addr, 'State_non_normalized'), // Note: This is a state code
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
    console.error('Error parsing XML:', error);
    throw new Error('Failed to parse XML file.');
  }
};
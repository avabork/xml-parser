import React from 'react';

// Helper for formatting
const formatCurrency = (num) => {
  if (typeof num !== 'number' || num === 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

// Accept 'onDelete' as a prop
const ReportDisplay = ({ report, onDelete }) => {
  const { basicDetails, reportSummary, creditCards, addresses, fileName, createdAt, genericData } = report;

  // --- RENDER GENERIC XML ---
  if (genericData) {
    return (
      <article className="report-item">
        <header className="report-item-header">
          <div>
            <h3>Generic XML Report: {fileName}</h3>
            <em>Processed On: {new Date(createdAt).toLocaleString()}</em>
          </div>
          <button className="delete-button" onClick={() => onDelete(report._id)} title="Delete report">
            &times;
          </button>
        </header>
        <div className="report-content">
          <section className="report-section">
            {/* Added class for icon */}
            <h4 className="section-icon-generic">Raw JSON Content</h4>
            <p>This file was not recognized as an Experian credit report. Displaying raw JSON output:</p>
            <pre className="generic-json-view">
              {JSON.stringify(genericData, null, 2)}
            </pre>
          </section>
        </div>
      </article>
    );
  }

  // --- RENDER CREDIT REPORT (Original Logic) ---
  return (
    <article className="report-item">
      <header className="report-item-header">
        <div>
          <h3>Credit Report: {fileName}</h3>
          <em>Processed On: {new Date(createdAt).toLocaleString()}</em>
        </div>
        <button className="delete-button" onClick={() => onDelete(report._id)} title="Delete report">
          &times;
        </button>
      </header>
      
      <div className="report-content">
        <div className="report-grid">
          {/* --- Basic Details --- */}
          <section className="report-section">
            {/* Added class for icon */}
            <h4 className="section-icon-user">Basic Details</h4>
            <p><strong>Name:</strong> <span>{basicDetails.name || 'N/A'}</span></p>
            <p><strong>Mobile:</strong> <span>{basicDetails.mobile || 'N/A'}</span></p>
            <p><strong>PAN:</strong> <span>{basicDetails.pan || 'N/A'}</span></p>
            <p><strong>Credit Score:</strong> <span className="credit-score">{basicDetails.creditScore || 'N/A'}</span></p>
          </section>

          {/* --- Report Summary --- */}
          <section className="report-section">
            {/* Added class for icon */}
            <h4 className="section-icon-summary">Report Summary</h4>
            <p><strong>Total Accounts:</strong> <span>{reportSummary.totalAccounts}</span></p>
            <p><strong>Active Accounts:</strong> <span>{reportSummary.activeAccounts}</span></p>
            <p><strong>Closed Accounts:</strong> <span>{reportSummary.closedAccounts}</span></p>
            <p><strong>Total Current Balance:</strong> <span>{formatCurrency(reportSummary.currentBalanceAmount)}</span></p>
            <p><strong>Secured Balance:</strong> <span>{formatCurrency(reportSummary.securedAccountsAmount)}</span></p>
            <p><strong>Unsecured Balance:</strong> <span>{formatCurrency(reportSummary.unsecuredAccountsAmount)}</span></p>
            <p><strong>Enquiries (Last 7 Days):</strong> <span>{reportSummary.sevenDayEnquiries}</span></p>
          </section>
        </div>

        {/* --- Credit Accounts --- */}
        <section className="report-table-section">
          {/* Added class for icon */}
          <h4 className="section-icon-card">Credit Card Accounts</h4>
          {creditCards && creditCards.length > 0 ? (
            <table>
              {/* ... table content ... */}
              <thead>
                <tr>
                  <th>Bank</th>
                  <th>Account No.</th>
                  <th>Current Balance</th>
                  <th>Amount Overdue</th>
                </tr>
              </thead>
              <tbody>
                {creditCards.map((card, index) => (
                  <tr key={index}>
                    <td>{card.bankName}</td>
                    <td>{card.accountNumber}</td>
                    <td>{formatCurrency(card.currentBalance)}</td>
                    <td>{formatCurrency(card.amountOverdue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No credit card accounts found in this report.</p>
          )}
        </section>

        {/* --- Addresses --- */}
        <section className="report-table-section">
          {/* Added class for icon */}
          <h4 className="section-icon-address">Addresses on File</h4>
          {addresses && addresses.length > 0 ? (
            <table>
              {/* ... table content ... */}
              <thead>
                <tr>
                  <th>Address</th>
                  <th>City</th>
                  <th>ZIP Code</th>
                </tr>
              </thead>
              <tbody>
                {addresses.map((addr, index) => (
                  <tr key={index}>
                    <td>{addr.fullAddress}</td>
                    <td>{addr.city}</td>
                    <td>{addr.zip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No addresses found in this report.</p>
          )}
        </section>
      </div>
    </article>
  );
};

export default ReportDisplay;
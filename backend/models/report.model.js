import mongoose from 'mongoose';

const creditAccountSchema = new mongoose.Schema({
  accountNumber: String,
  bankName: String,
  accountType: String, // e.g., 'Credit Card' or the code '10'
  amountOverdue: Number,
  currentBalance: Number,
});

const addressSchema = new mongoose.Schema({
  fullAddress: String,
  city: String,
  state: String,
  zip: String,
});

const reportSchema = new mongoose.Schema(
  {
    fileName: String,
    basicDetails: {
      name: String,
      mobile: String,
      pan: String,
      creditScore: Number,
    },
    reportSummary: {
      totalAccounts: Number,
      activeAccounts: Number,
      closedAccounts: Number,
      currentBalanceAmount: Number, // Total outstanding
      securedAccountsAmount: Number,
      unsecuredAccountsAmount: Number,
      sevenDayEnquiries: Number,
    },
    // We filter for credit cards as requested [cite: 30]
    creditCards: [creditAccountSchema],
    // Store all unique addresses found in the report [cite: 32]
    addresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
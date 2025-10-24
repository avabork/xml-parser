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

    // --- Specific Experian Fields (OPTIONAL) ---
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
    creditCards: [creditAccountSchema],
    addresses: [addressSchema],

    // --- Generic Field for OTHER XML types ---
    // This will store the raw JSON if it's not a credit report
    genericData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;

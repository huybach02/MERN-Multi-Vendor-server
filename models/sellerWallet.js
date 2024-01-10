const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var sellerWalletSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {timestamps: true}
);

//Export the model
module.exports = mongoose.model("sellerWallets", sellerWalletSchema);

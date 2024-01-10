const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var myShopWalletSchema = new mongoose.Schema(
  {
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
module.exports = mongoose.model("myShopWallets", myShopWalletSchema);

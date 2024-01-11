const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var withdrawalRequestSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    date: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

//Export the model
module.exports = mongoose.model("withdrawalRequests", withdrawalRequestSchema);

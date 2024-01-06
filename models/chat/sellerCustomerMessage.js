const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var sellerCustomerMessageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "unseen",
    },
  },
  {timestamps: true}
);

//Export the model
module.exports = mongoose.model(
  "seller_customer_message",
  sellerCustomerMessageSchema
);

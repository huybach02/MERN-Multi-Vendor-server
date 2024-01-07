const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var adminSellerMessageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      default: "",
    },
    receiverId: {
      type: String,
      default: "",
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
  "seller_admin_message",
  adminSellerMessageSchema
);

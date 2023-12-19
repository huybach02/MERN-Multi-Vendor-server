const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var sellerToCustomerSchema = new mongoose.Schema(
  {
    myId: {
      type: String,
      required: true,
    },
    myFriends: {
      type: Array,
      default: [],
    },
  },
  {timestamps: true}
);

//Export the model
module.exports = mongoose.model("seller_to_customer", sellerToCustomerSchema);

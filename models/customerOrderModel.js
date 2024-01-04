const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var customerOrderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
    shippingInfo: {
      type: Object,
      required: true,
    },
    delivery_status: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

//Export the model
module.exports = mongoose.model("customerOrders", customerOrderSchema);

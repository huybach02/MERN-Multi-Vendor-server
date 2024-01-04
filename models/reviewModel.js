const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

//Export the model
module.exports = mongoose.model("reviews", reviewSchema);

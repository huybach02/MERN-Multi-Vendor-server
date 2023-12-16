const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
});

//Export the model
module.exports = mongoose.model("admins", adminSchema);

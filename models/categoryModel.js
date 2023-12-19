const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

categorySchema.index({
  name: "text",
});

//Export the model
module.exports = mongoose.model("category", categorySchema);

const mongoose = require("mongoose");

module.exports.dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://khongten2002ct:urNIQcBZkyWoV2GN@cluster0.vjc9pkq.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewURLParser: true,
      }
    );
    console.log("Connect db successfully");
  } catch (error) {
    console.log(error.message);
  }
};

// module.exports = dbConnect;

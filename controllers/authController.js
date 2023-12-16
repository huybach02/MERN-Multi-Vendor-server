const adminModel = require("../models/adminModel");
const {responseReturn} = require("../utils/response");
const {createToken} = require("../utils/createToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const admin_login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const admin = await adminModel.findOne({email}).select("+password");
    if (admin) {
      const match = await bcrypt.compare(password, admin.password);
      if (match) {
        const token = await createToken({
          id: admin._id,
          role: admin.role,
        });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        responseReturn(res, 200, {token, success: true, msg: "Login success"});
      } else {
        responseReturn(res, 404, {
          error: "Email or password wrong",
        });
      }
    } else {
      responseReturn(res, 404, {
        error: "Email not found",
      });
    }
  } catch (error) {
    responseReturn(res, 500, {
      error: error.message,
    });
  }
};

const getUser = async (req, res) => {
  const {id, role} = req;

  try {
    if (role === "admin") {
      const user = await adminModel.findById(id);
      return responseReturn(res, 200, {
        userInfo: user,
      });
    } else {
      console.log("not is admin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const authController = {
  admin_login,
  getUser,
};

module.exports = authController;

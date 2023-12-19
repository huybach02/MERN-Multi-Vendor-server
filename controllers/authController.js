const adminModel = require("../models/adminModel");
const sellerModel = require("../models/sellerModel");
const sellerToCustomerModel = require("../models/chat/sellerToCustomerModel");
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

const seller_login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const seller = await sellerModel.findOne({email}).select("+password");
    if (seller) {
      const match = await bcrypt.compare(password, seller.password);
      if (match) {
        const token = await createToken({
          id: seller._id,
          role: seller.role,
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

const seller_register = async (req, res) => {
  const {email, name, password} = req.body;
  try {
    const getSeller = await sellerModel.findOne({email});
    if (getSeller) {
      responseReturn(res, 404, {error: "Email already exist"});
    } else {
      const seller = await sellerModel.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        method: "manual",
        shopInfo: {},
      });
      await sellerToCustomerModel.create({
        myId: seller._id,
      });
      const token = await createToken({id: seller._id, role: seller.role});
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      responseReturn(res, 201, {
        msg: "Register successfully",
        token,
        success: true,
      });
    }
  } catch (error) {
    responseReturn(res, 500, {error: "Something went wrong"});
  }
};

const getUser = async (req, res) => {
  const {id, role} = req;

  try {
    if (role === "admin") {
      const admin = await adminModel.findById(id);
      return responseReturn(res, 200, {
        userInfo: admin,
      });
    } else {
      const seller = await sellerModel.findById(id);
      return responseReturn(res, 200, {
        userInfo: seller,
      });
    }
  } catch (error) {
    responseReturn(res, 500, {error: "Something went wrong"});
  }
};

const authController = {
  admin_login,
  getUser,
  seller_register,
  seller_login,
};

module.exports = authController;

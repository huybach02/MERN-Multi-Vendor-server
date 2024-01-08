const adminModel = require("../models/adminModel");
const sellerModel = require("../models/sellerModel");
const sellerToCustomerModel = require("../models/chat/sellerToCustomerModel");
const {responseReturn} = require("../utils/response");
const {createToken} = require("../utils/createToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {formidable} = require("formidable");
const cloudinary = require("cloudinary").v2;

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

const profile_image_upload = async (req, res) => {
  const {id} = req;
  const form = formidable({multiples: true});
  form.parse(req, async (err, field, files) => {
    const {image} = files;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    try {
      const result = await cloudinary.uploader.upload(image.filepath, {
        folder: "profiles",
      });
      if (result) {
        await sellerModel.findByIdAndUpdate(id, {
          image: result.url,
        });
        responseReturn(res, 200, {
          msg: "Upload image successfully",
          success: true,
          image: result.url,
        });
      } else {
        responseReturn(res, 500, {error: "Upload image failed"});
      }
    } catch (error) {
      responseReturn(res, 500, {error: error.message});
    }
  });
};

const profile_info_add = async (req, res) => {
  const {id} = req;
  const {shopName, division, district, sub_district, phone} = req.body;

  try {
    const info = await sellerModel.findByIdAndUpdate(id, {
      shopInfo: {
        shopName,
        division,
        district,
        sub_district,
        phone,
      },
    });
    responseReturn(res, 200, {
      msg: "Saved info successfully",
      success: true,
      info,
    });
  } catch (error) {
    responseReturn(res, 500, {error: error.message});
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("accessToken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    responseReturn(res, 200, {msg: "Logout successfully", success: true});
  } catch (error) {
    responseReturn(res, 500, {error: error.message});
  }
};

const authController = {
  admin_login,
  getUser,
  seller_register,
  seller_login,
  profile_image_upload,
  profile_info_add,
  logout,
};

module.exports = authController;

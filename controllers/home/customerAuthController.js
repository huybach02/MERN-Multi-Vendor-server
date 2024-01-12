const customerModel = require("../../models/customerModel");
const sellerToCustomerModel = require("../../models/chat/sellerToCustomerModel");
const {responseReturn} = require("../../utils/response");
const bcrypt = require("bcrypt");
const {createToken} = require("../../utils/createToken");

const customer_register = async (req, res) => {
  const {name, email, password} = req.body;
  try {
    const customer = await customerModel.findOne({email});
    if (customer) {
      responseReturn(res, 404, {error: "Email already exist"});
    } else {
      const createCustomer = await customerModel.create({
        name: name.trim(),
        email: email.trim(),
        password: await bcrypt.hash(password, 10),
        method: "manually",
      });
      await sellerToCustomerModel.create({
        myId: createCustomer.id,
      });
      const token = await createToken({
        id: createCustomer.id,
        name: createCustomer.name,
        email: createCustomer.email,
        method: createCustomer.method,
      });
      res.cookie("customerToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      responseReturn(res, 201, {
        msg: "Register successfully",
        success: true,
        token,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const customer_login = async (req, res) => {
  const {email, password} = req.body;

  try {
    const customer = await customerModel.findOne({email}).select("+password");
    if (customer) {
      const match = await bcrypt.compare(password, customer.password);
      if (match) {
        const token = await createToken({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          method: customer.method,
        });
        res.cookie("customerToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        responseReturn(res, 201, {
          msg: "Login successfully",
          success: true,
          token,
        });
      } else {
        responseReturn(res, 404, {error: "Email or password incorrect"});
      }
    } else {
      responseReturn(res, 404, {error: "Email not found"});
    }
  } catch (error) {
    console.log(error);
  }
};

const customer_logout = async (req, res) => {
  res.cookie("customerToken", "", {
    expires: new Date(Date.now()),
  });
  responseReturn(res, 200, {msg: "Logout successfully"});
};

const customerAuthController = {
  customer_register,
  customer_login,
  customer_logout,
};

module.exports = customerAuthController;

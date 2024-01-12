const stripeModel = require("../../models/stripeModel");
const sellerModel = require("../../models/sellerModel");
const sellerWallet = require("../../models/sellerWallet");
const myShopWallet = require("../../models/myShopWallet");
const withdrawalRequestModel = require("../../models/withdrawlRequestModel");
const {v4: uuidV4} = require("uuid");
const {responseReturn} = require("../../utils/response");
const moment = require("moment");
const {
  mongo: {ObjectId},
} = require("mongoose");

const stripe = require("stripe")(
  "sk_test_51OMmpZJMERio1zjvspXEw929Gtd54xQSF5edl3kxeFScVJRotKPjfM3PUA2ftdNWlWzKvVSBYroe7L5UGI99vi5k006dG0E4KR"
);

const create_stripe_connect_account = async (req, res) => {
  const {id} = req;
  const uid = uuidV4();

  try {
    const stripeInfo = await stripeModel.findOne({sellerId: id});
    if (stripeInfo) {
      await stripeModel.deleteOne({sellerId: id});
      const account = await stripe.accounts.create({type: "express"});
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: "https://mern-multi-vendor-dashboard.vercel.app/refresh",
        return_url: `https://mern-multi-vendor-dashboard.vercel.app/success?activeCode=${uid}`,
        type: "account_onboarding",
      });
      await stripeModel.create({
        sellerId: id,
        stripeId: account.id,
        code: uid,
      });
      responseReturn(res, 200, {url: accountLink.url});
    } else {
      const account = await stripe.accounts.create({type: "express"});
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: "https://mern-multi-vendor-dashboard.vercel.app/refresh",
        return_url: `https://mern-multi-vendor-dashboard.vercel.app/success?activeCode=${uid}`,
        type: "account_onboarding",
      });
      await stripeModel.create({
        sellerId: id,
        stripeId: account.id,
        code: uid,
      });
      responseReturn(res, 200, {url: accountLink.url});
    }
  } catch (error) {
    console.log(error);
  }
};

const active_stripe_connect_account = async (req, res) => {
  const {activeCode} = req.params;
  const {id} = req;

  try {
    const userStripeInfo = await stripeModel.findOne({code: activeCode});
    if (userStripeInfo) {
      await sellerModel.findByIdAndUpdate(id, {
        payment: "active",
      });
      responseReturn(res, 200, {msg: "Payment active successfully!"});
    } else {
      responseReturn(res, 404, {error: "Payment active failed!"});
    }
  } catch (error) {
    console.log(error);
    responseReturn(res, 404, {error: "Something went wrong!"});
  }
};

const sumAmount = (data) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum = sum + +data[i].amount;
  }
  return sum;
};

const get_seller_payment_details = async (req, res) => {
  const {sellerId} = req.params;

  try {
    const payments = await sellerWallet.find({sellerId});
    const pendingWithdrawal = await withdrawalRequestModel
      .find({
        $and: [
          {
            sellerId: {
              $eq: sellerId,
            },
          },
          {
            status: {
              $eq: "Pending",
            },
          },
        ],
      })
      .sort({createdAt: -1});
    const successWithdrawal = await withdrawalRequestModel
      .find({
        $and: [
          {
            sellerId: {
              $eq: sellerId,
            },
          },
          {
            status: {
              $eq: "Success",
            },
          },
        ],
      })
      .sort({createdAt: -1});
    const pendingAmount = sumAmount(pendingWithdrawal);
    const withdrawalAmount = sumAmount(successWithdrawal);
    const totalAmount = sumAmount(payments);

    let availableAmount = 0;

    if (totalAmount > 0) {
      availableAmount = +totalAmount - +pendingAmount - +withdrawalAmount;
    }

    responseReturn(res, 200, {
      pendingWithdrawal,
      successWithdrawal,
      totalAmount,
      withdrawalAmount,
      availableAmount,
      pendingAmount,
    });
  } catch (error) {
    console.log(error);
  }
};

const send_withdrawal_request = async (req, res) => {
  const {amount, sellerId} = req.body;

  try {
    const time = moment(Date.now()).format("DD/MM/YYYY");
    const withdrawal = await withdrawalRequestModel.create({
      sellerId,
      amount: +amount,
      date: time,
    });
    responseReturn(res, 200, {msg: "Send request successfully"});
  } catch (error) {
    console.log(error);
    responseReturn(res, 404, {error: "Something went wrong!"});
  }
};

const get_payment_request = async (req, res) => {
  try {
    const withdrawalRequest = await withdrawalRequestModel.find({
      status: "Pending",
    });
    responseReturn(res, 200, {withdrawalRequest});
  } catch (error) {
    console.log(error);
  }
};

const confirm_payment_request = async (req, res) => {
  const {paymentId} = req.body;

  try {
    const payment = await withdrawalRequestModel.findById(paymentId);
    const {stripeId} = await stripeModel.findOne({
      sellerId: new Object(payment.sellerId),
    });

    await stripe.transfers.create({
      amount: +payment.amount * 100,
      currency: "usd",
      destination: stripeId,
    });

    await withdrawalRequestModel.findByIdAndUpdate(paymentId, {
      status: "Success",
    });

    responseReturn(res, 200, {msg: "Confirm request successfully"});
  } catch (error) {
    console.log(error);
    responseReturn(res, 404, {error: "Something went wrong!"});
  }
};

const paymentController = {
  create_stripe_connect_account,
  active_stripe_connect_account,
  get_seller_payment_details,
  send_withdrawal_request,
  get_payment_request,
  confirm_payment_request,
};

module.exports = paymentController;

const stripeModel = require("../../models/stripeModel");
const sellerModel = require("../../models/sellerModel");
const {v4: uuidV4} = require("uuid");
const {responseReturn} = require("../../utils/response");

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
        refresh_url: "http://localhost:3001/refresh",
        return_url: `http://localhost:3001/success?activeCode=${uid}`,
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
        refresh_url: "http://localhost:3001/refresh",
        return_url: `http://localhost:3001/success?activeCode=${uid}`,
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
    responseReturn(res, 200, {error: "Something went wrong!"});
  }
};

const paymentController = {
  create_stripe_connect_account,
  active_stripe_connect_account,
};

module.exports = paymentController;

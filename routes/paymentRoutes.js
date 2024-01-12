const paymentController = require("../controllers/payment/paymentController");
const {authMiddleware} = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post(
  "/payment/create-stripe-connect-account",
  paymentController.create_stripe_connect_account
);
router.put(
  "/payment/active-stripe-connect-account/:activeCode",
  paymentController.active_stripe_connect_account
);
router.get(
  "/payment/seller-payment-details/:sellerId",
  paymentController.get_seller_payment_details
);
router.post(
  "/payment/send-withdrawal-request",
  paymentController.send_withdrawal_request
);
router.get(
  "/payment/get-payment-request",
  paymentController.get_payment_request
);
router.post(
  "/payment/confirm-payment-request",
  paymentController.confirm_payment_request
);

module.exports = router;

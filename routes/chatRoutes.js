const chatController = require("../controllers/chat/chatController");
const {authMiddleware} = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post(
  "/chat/customer/add-customer-friend",
  chatController.add_customer_friend
);
router.post(
  "/chat/customer/send-message-to-seller",
  chatController.send_message_to_seller
);
router.get(
  "/chat/seller/get-customers/:sellerId",
  chatController.get_customers
);
router.get(
  "/chat/seller/get-customer-message/:customerId",
  authMiddleware,
  chatController.get_customer_message
);
router.post(
  "/chat/seller/send-message-to-customer",
  chatController.send_message_to_customer
);

module.exports = router;

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
router.get("/chat/admin/get-sellers", chatController.get_sellers);
router.get(
  "/chat/seller/get-customer-message/:customerId",
  authMiddleware,
  chatController.get_customer_message
);
router.get(
  "/chat/get-admin-message/:receiverId",
  authMiddleware,
  chatController.get_admin_message
);
router.get(
  "/chat/get-seller-message",
  authMiddleware,
  chatController.get_seller_message
);
router.post(
  "/chat/seller/send-message-to-customer",
  chatController.send_message_to_customer
);
router.post(
  "/chat/message-send-seller-admin",
  chatController.seller_admin_messages
);

module.exports = router;

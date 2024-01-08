const router = require("express").Router();
const orderController = require("../../controllers/order/orderController");

router.post("/order/place-order", orderController.place_order);
router.get(
  "/customer/get-dashboard-data/:userId",
  orderController.get_dashboard_data
);
router.get(
  "/customer/get-all-orders/:customerId/:status",
  orderController.get_all_orders
);
router.get("/customer/get-one-order/:orderId", orderController.get_one_order);
router.get("/admin/orders", orderController.get_all_admin_orders);
router.get("/seller/orders/:sellerId", orderController.get_all_seller_orders);
router.get("/admin/order/:orderId", orderController.get_one_admin_order);
router.get("/seller/order/:orderId", orderController.get_one_seller_order);
router.put(
  "/admin/order-status/update/:orderId",
  orderController.admin_update_status_order
);
router.put(
  "/seller/order-status/update/:orderId",
  orderController.seller_update_status_order
);

module.exports = router;

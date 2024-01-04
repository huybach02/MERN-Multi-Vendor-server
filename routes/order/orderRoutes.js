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

module.exports = router;

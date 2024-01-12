const dashboardController = require("../../controllers/dashboard/dashboardController");
const {authMiddleware} = require("../../middlewares/authMiddleware");

const router = require("express").Router();

router.post(
  "/seller/get-seller-dashboard-data",
  dashboardController.get_seller_dashboard_data
);
router.get(
  "/admin/get-admin-dashboard-data",
  dashboardController.get_admin_dashboard_data
);

module.exports = router;

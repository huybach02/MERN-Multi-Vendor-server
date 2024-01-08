const sellerController = require("../../controllers/dashboard/sellerController");
const {authMiddleware} = require("../../middlewares/authMiddleware");

const router = require("express").Router();

router.get(
  "/request-seller-get-all",
  authMiddleware,
  sellerController.get_all_seller_request
);
router.get("/sellers", authMiddleware, sellerController.get_all_active_seller);
router.get(
  "/deactive-sellers",
  authMiddleware,
  sellerController.get_all_deactive_seller
);
router.get("/seller-get-one/:sellerId", sellerController.get_one_seller);
router.post(
  "/seller-update-status",
  authMiddleware,
  sellerController.update_status_seller
);

module.exports = router;

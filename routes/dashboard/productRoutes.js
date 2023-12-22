const productController = require("../../controllers/dashboard/productController");
const {authMiddleware} = require("../../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/product-add", authMiddleware, productController.add_product);
router.get(
  "/product-get-all",
  authMiddleware,
  productController.get_all_products
);
router.get("/product-get-one/:productId", productController.get_one_product);
router.post(
  "/product-update",
  authMiddleware,
  productController.update_product
);
router.post(
  "/product-delete",
  authMiddleware,
  productController.delete_product
);

module.exports = router;

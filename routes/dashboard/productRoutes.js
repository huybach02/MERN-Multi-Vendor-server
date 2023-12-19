const productController = require("../../controllers/dashboard/productController");
const {authMiddleware} = require("../../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/product-add", authMiddleware, productController.add_product);
// router.get("/product-get-all", categoryController.get_category);

module.exports = router;

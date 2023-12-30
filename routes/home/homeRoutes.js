const router = require("express").Router();
const homeController = require("../../controllers/home/homeController");

router.get("/category-get-all", homeController.get_categories);
router.get("/product-get-all", homeController.get_all_products);
router.get("/product-price-range-latest", homeController.price_range_products);
router.get("/product-query", homeController.query_products);

module.exports = router;

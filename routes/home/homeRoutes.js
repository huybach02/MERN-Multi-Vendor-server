const router = require("express").Router();
const homeController = require("../../controllers/home/homeController");

router.get("/category-get-all", homeController.get_categories);
router.get("/product-get-all", homeController.get_all_products);
router.get("/product-get-one/:slug", homeController.get_one_product);
router.get("/product-price-range-latest", homeController.price_range_products);
router.get("/product-query", homeController.query_products);
router.post("/customer-rating", homeController.customer_rating);
router.get(
  "/get-customer-rating/:productId",
  homeController.get_customer_rating
);
router.post("/delete-customer-rating", homeController.delete_customer_rating);

module.exports = router;

const router = require("express").Router();
const cartController = require("../../controllers/home/cartController");

router.post("/product/add-to-cart", cartController.add_to_cart);
router.get(
  "/product/get-cart-products/:userId",
  cartController.get_cart_products
);
router.delete(
  "/product/delete-cart-product/:cartId",
  cartController.delete_product_from_cart
);
router.get(
  "/product/increment_quantity/:cartId",
  cartController.increment_quantity
);
router.get("/product/reduce_quantity/:cartId", cartController.reduce_quantity);

module.exports = router;

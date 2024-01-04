const router = require("express").Router();
const cartController = require("../../controllers/home/cartController");

router.post("/product/add-to-cart", cartController.add_to_cart);
router.post("/product/add-to-wishlist", cartController.add_to_wishlist);
router.get(
  "/product/get-cart-products/:userId",
  cartController.get_cart_products
);
router.get(
  "/product/get-wishlist-products/:userId",
  cartController.get_wishlist_products
);
router.get(
  "/product/remove-wishlist-product/:wishlistId",
  cartController.delete_product_from_wishlist
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

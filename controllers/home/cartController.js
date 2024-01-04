const cartModel = require("../../models/cartModel");
const wishlistModel = require("../../models/wishlistModel");
const {responseReturn} = require("../../utils/response");
const {
  mongo: {ObjectId},
} = require("mongoose");

const add_to_cart = async (req, res) => {
  const {userId, productId, quantity} = req.body;

  try {
    const product = await cartModel.findOne({
      $and: [
        {
          productId: {
            $eq: productId,
          },
        },
        {
          userId: {
            $eq: userId,
          },
        },
      ],
    });
    if (product) {
      responseReturn(res, 404, {error: "Product already exist in cart"});
    } else {
      const cart = await cartModel.create({
        userId,
        productId,
        quantity,
      });
      responseReturn(res, 201, {
        msg: "Added product to cart",
        success: true,
        cart,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const add_to_wishlist = async (req, res) => {
  const {userId, productId, name, price, image, discount, rating, slug} =
    req.body;

  try {
    const product = await wishlistModel.findOne({productId});
    if (product) {
      responseReturn(res, 404, {error: "Product already in wishlist"});
    } else {
      await wishlistModel.create({
        userId,
        productId,
        name,
        price,
        image,
        discount,
        rating,
        slug,
      });
      responseReturn(res, 201, {msg: "Added to wishlist"});
    }
  } catch (error) {
    console.log(error);
  }
};

const get_cart_products = async (req, res) => {
  const co = 5; //5% hoa hong/1 san pham
  const {userId} = req.params;
  try {
    const cartProducts = await cartModel.aggregate([
      {
        $match: {
          userId: {
            $eq: new ObjectId(userId),
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);
    let buyProductItem = 0;
    let calculatePrice = 0;
    let cartProductCount = 0;
    const outOfStockProducts = cartProducts.filter(
      (item) => item.product[0].stock < item.quantity
    );
    for (let i = 0; i < outOfStockProducts.length; i++) {
      cartProductCount = cartProductCount + outOfStockProducts[i].quantity;
    }
    const stockProducts = cartProducts.filter(
      (item) => item.product[0].stock >= item.quantity
    );
    for (let i = 0; i < stockProducts.length; i++) {
      cartProductCount = cartProductCount + stockProducts[i].quantity;
      buyProductItem = buyProductItem + stockProducts[i].quantity;
      const {price, discount} = stockProducts[i].product[0];
      const {quantity} = stockProducts[i];
      if (discount !== 0) {
        calculatePrice =
          calculatePrice +
          quantity * (price - Math.floor(price * discount) / 100);
      } else {
        calculatePrice = calculatePrice + quantity * price;
      }
    }
    const p = [];
    let unique = [
      ...new Set(
        stockProducts.map((item) => item.product[0].sellerId.toString())
      ),
    ];
    for (let i = 0; i < unique.length; i++) {
      let price = 0;
      for (let j = 0; j < stockProducts.length; j++) {
        const tempProduct = stockProducts[j].product[0];
        if (unique[i] === tempProduct.sellerId.toString()) {
          let pri = 0;
          if (tempProduct.discount !== 0) {
            pri =
              tempProduct.price -
              Math.floor((tempProduct.price * tempProduct.discount) / 100);
          } else {
            pri = tempProduct.price;
          }
          pri = pri - Math.floor((pri * co) / 100);
          price = price + pri * stockProducts[j].quantity;
          p[i] = {
            sellerId: unique[i],
            shopName: tempProduct.shopName,
            price,
            product: p[i]
              ? [
                  ...p[i].product,
                  {
                    _id: stockProducts[j]._id,
                    quantity: stockProducts[j].quantity,
                    productInfo: tempProduct,
                  },
                ]
              : [
                  {
                    _id: stockProducts[j]._id,
                    quantity: stockProducts[j].quantity,
                    productInfo: tempProduct,
                  },
                ],
          };
        }
      }
    }
    responseReturn(res, 200, {
      cartProducts: p,
      price: calculatePrice,
      cartProductCount,
      shippingFee: 10 * p.length,
      outOfStockProducts,
      buyProductItem,
    });
  } catch (error) {
    console.log(error);
  }
};

const get_wishlist_products = async (req, res) => {
  const {userId} = req.params;

  try {
    const wishListProducts = await wishlistModel.find({userId});
    const wishListCount = await wishlistModel.find({userId}).countDocuments();
    responseReturn(res, 201, {wishListCount, wishListProducts});
  } catch (error) {
    console.log(error);
  }
};

const delete_product_from_wishlist = async (req, res) => {
  const {wishlistId} = req.params;

  try {
    await wishlistModel.findByIdAndDelete(wishlistId);
    responseReturn(res, 200, {
      msg: "Removed product from wishlist",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const delete_product_from_cart = async (req, res) => {
  const {cartId} = req.params;

  try {
    await cartModel.findByIdAndDelete(cartId);
    responseReturn(res, 200, {msg: "Removed product from cart", success: true});
  } catch (error) {
    console.log(error);
  }
};

const increment_quantity = async (req, res) => {
  const {cartId} = req.params;

  try {
    const product = await cartModel.findById(cartId);
    const {quantity} = product;
    await cartModel.findByIdAndUpdate(cartId, {
      quantity: quantity + 1,
    });
    responseReturn(res, 200, {msg: "Success", success: true});
  } catch (error) {
    console.log(error);
  }
};

const reduce_quantity = async (req, res) => {
  const {cartId} = req.params;

  try {
    const product = await cartModel.findById(cartId);
    const {quantity} = product;
    await cartModel.findByIdAndUpdate(cartId, {
      quantity: quantity - 1,
    });
    responseReturn(res, 200, {msg: "Success", success: true});
  } catch (error) {
    console.log(error);
  }
};

const cartController = {
  add_to_cart,
  get_cart_products,
  delete_product_from_cart,
  increment_quantity,
  reduce_quantity,
  add_to_wishlist,
  get_wishlist_products,
  delete_product_from_wishlist,
};

module.exports = cartController;

const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const reviewModel = require("../../models/reviewModel");
const queryProducts = require("../../utils/queryProduct");
const {responseReturn} = require("../../utils/response");
const moment = require("moment");
const {
  mongo: {ObjectId},
} = require("mongoose");

const get_categories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    responseReturn(res, 200, {categories});
  } catch (error) {
    console.log(error);
  }
};

const formatProduct = (products) => {
  const productArr = [];
  let i = 0;
  while (i < products.length) {
    let temp = [];
    let j = i;
    while (j < i + 3) {
      if (products[j]) {
        temp.push(products[j]);
      }
      j++;
    }
    productArr.push([...temp]);
    i = j;
  }
  return productArr;
};

const get_all_products = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .limit(12)
      .sort({createdAt: -1});
    const allProducts = await productModel
      .find({})
      .limit(9)
      .sort({createdAt: -1});
    const latestProducts = formatProduct(allProducts);
    const allProducts2 = await productModel
      .find({})
      .limit(9)
      .sort({rating: -1});
    const topRatedProducts = formatProduct(allProducts2);
    const allProducts3 = await productModel
      .find({})
      .limit(9)
      .sort({discount: -1});
    const discountProducts = formatProduct(allProducts3);

    responseReturn(res, 200, {
      products,
      latestProducts,
      topRatedProducts,
      discountProducts,
    });
  } catch (error) {
    console.log(error);
  }
};

const price_range_products = async (req, res) => {
  try {
    const priceRange = {
      low: 0,
      high: 0,
    };
    const products = await productModel
      .find({})
      .limit(12)
      .sort({createdAt: -1});
    const getForPrice = await productModel.find({}).sort({price: 1});
    if (getForPrice.length > 0) {
      priceRange.high = getForPrice[getForPrice.length - 1].price;
      priceRange.low = getForPrice[0].price;
    }
    responseReturn(res, 200, {priceRange});
  } catch (error) {
    console.log(error);
  }
};

const query_products = async (req, res) => {
  const parPage = 12;
  req.query.parPage = parPage;
  try {
    const products = await productModel.find({}).sort({createdAt: -1});
    const {getProducts, countProducts} = queryProducts(products, req.query);

    const totalProduct = countProducts();
    const filteredProducts = getProducts();

    responseReturn(res, 200, {
      products: filteredProducts,
      totalProduct,
      parPage,
    });
  } catch (error) {
    console.log(error);
  }
};

const get_one_product = async (req, res) => {
  const {slug} = req.params;

  try {
    const product = await productModel.findOne({slug}).populate("sellerId");
    const relatedProducts = await productModel
      .find({
        category: product.category,
      })
      .limit(20);
    const moreProducts = await productModel
      .find({
        sellerId: product.sellerId,
      })
      .limit(3);

    responseReturn(res, 201, {product, relatedProducts, moreProducts});
  } catch (error) {
    console.log(error);
  }
};

const customer_rating = async (req, res) => {
  const {name, review, rating, productId, customerId} = req.body;

  try {
    await reviewModel.create({
      customerId,
      name,
      productId,
      review,
      rating,
      date: moment(Date.now()).format("LLL"),
    });
    let rat = 0;
    const reviews = await reviewModel.find({productId});
    for (let i = 0; i < reviews.length; i++) {
      rat = rat + reviews[i].rating;
    }
    let productRating = 0;
    if (reviews.length > 0) {
      productRating = (rat / reviews.length).toFixed(1);
    }
    await productModel.findByIdAndUpdate(productId, {
      rating: productRating,
    });
    responseReturn(res, 201, {msg: "Add review successfully"});
  } catch (error) {
    console.log(error);
  }
};

const get_customer_rating = async (req, res) => {
  const {productId} = req.params;
  const {pageNumber} = req.query;

  const limit = 5;
  const skipPage = limit * (pageNumber - 1);

  try {
    const ratings = await reviewModel.aggregate([
      {
        $match: {
          productId: {
            $eq: new ObjectId(productId),
          },
          rating: {
            $not: {
              $size: 0,
            },
          },
        },
      },
      {
        $unwind: "$rating",
      },
      {
        $group: {
          _id: "$rating",
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    let ratingArr = [
      {
        rating: 5,
        sum: 0,
      },
      {
        rating: 4,
        sum: 0,
      },
      {
        rating: 3,
        sum: 0,
      },
      {
        rating: 2,
        sum: 0,
      },
      {
        rating: 1,
        sum: 0,
      },
    ];
    for (let i = 0; i < ratingArr.length; i++) {
      for (let j = 0; j < ratings.length; j++) {
        if (ratingArr[i].rating === ratings[j]._id) {
          ratingArr[i].sum = ratings[j].count;
          break;
        }
      }
    }
    const allReviews = await reviewModel
      .find({
        productId,
      })
      .skip(skipPage)
      .limit(limit)
      .sort({createdAt: -1});
    const countReview = await reviewModel
      .find({
        productId,
      })
      .countDocuments();
    responseReturn(res, 200, {ratingArr, allReviews, countReview});
  } catch (error) {
    console.log(error);
  }
};

const delete_customer_rating = async (req, res) => {
  const {id, customerId} = req.body;

  try {
    const deleteReview = await reviewModel.findOneAndDelete({
      _id: id,
      customerId,
    });
    let rat = 0;
    const reviews = await reviewModel.find({productId: deleteReview.productId});
    for (let i = 0; i < reviews.length; i++) {
      rat = rat + reviews[i].rating;
    }
    let productRating = 0;
    if (reviews.length > 0) {
      productRating = (rat / reviews.length).toFixed(1);
    }
    await productModel.findByIdAndUpdate(deleteReview.productId, {
      rating: productRating,
    });
    responseReturn(res, 200, {msg: "Delete review successfully"});
  } catch (error) {
    console.log(error);
  }
};

const homeController = {
  get_categories,
  get_all_products,
  price_range_products,
  query_products,
  get_one_product,
  customer_rating,
  get_customer_rating,
  delete_customer_rating,
};

module.exports = homeController;

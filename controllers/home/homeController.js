const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const queryProducts = require("../../utils/queryProduct");
const {responseReturn} = require("../../utils/response");

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

const homeController = {
  get_categories,
  get_all_products,
  price_range_products,
  query_products,
};

module.exports = homeController;

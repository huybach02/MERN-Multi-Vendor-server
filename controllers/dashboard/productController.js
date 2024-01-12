const productModel = require("../../models/productModel");
const {formidable} = require("formidable");
const {responseReturn} = require("../../utils/response");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");

const add_product = async (req, res) => {
  const {accessToken} = req.params;

  const decodeToken = await jwt.verify(accessToken, process.env.SECRET_KEY);

  const {role, id} = decodeToken;

  const form = formidable({multiples: true});
  form.parse(req, async (err, field, files) => {
    const {
      name,
      brand,
      stock,
      price,
      discount,
      description,
      category,
      shopName,
    } = field;
    const {images} = files;
    const slug = slugify(name, {lower: true});

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    try {
      let allImageUrl = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i].filepath, {
          folder: "products",
        });
        allImageUrl = [...allImageUrl, result.url];
      }

      const product = await productModel.create({
        sellerId: id,
        name: name.trim(),
        slug,
        brand: brand.trim(),
        category: category.trim(),
        stock: +stock,
        price: +price,
        discount: +discount,
        description,
        images: allImageUrl,
        shopName,
      });
      responseReturn(res, 200, {
        msg: "Create product successfully",
        success: true,
        product,
      });
    } catch (error) {
      responseReturn(res, 500, {error: error.message});
    }
  });
};

const get_all_products = async (req, res) => {
  const {accessToken} = req.body;

  const decodeToken = await jwt.verify(accessToken, process.env.SECRET_KEY);

  const {role, id} = decodeToken;
  const {page, searchValue, parPage} = req.query;
  const skipPage = +parPage * (+page - 1);

  try {
    if (searchValue && page && parPage) {
      const products = await productModel
        .find({
          name: new RegExp(searchValue, "i"),
          sellerId: id,
        })
        .skip(skipPage)
        .limit(parPage)
        .sort({createdAt: -1});
      const totalProduct = await productModel
        .find({
          name: new RegExp(searchValue, "i"),
          sellerId: id,
        })
        .countDocuments();
      responseReturn(res, 200, {totalProduct, products});
    } else if (!searchValue && page && parPage) {
      const products = await productModel
        .find({
          name: new RegExp(searchValue, "i"),
          sellerId: id,
        })
        .skip(skipPage)
        .limit(parPage)
        .sort({createdAt: -1});
      const totalProduct = await productModel
        .find({
          name: new RegExp(searchValue, "i"),
          sellerId: id,
        })
        .countDocuments();
      responseReturn(res, 200, {totalProduct, products});
    } else {
      const products = await productModel
        .find({
          sellerId: id,
        })
        .sort({createdAt: -1});
      const totalProduct = await productModel
        .find({
          sellerId: id,
        })
        .countDocuments();
      responseReturn(res, 200, {totalProduct, products});
    }
  } catch (error) {
    responseReturn(res, 500, {error: error.message});
  }
};

const get_one_product = async (req, res) => {
  const {productId} = req.params;

  try {
    const product = await productModel.findById(productId);
    responseReturn(res, 200, {product});
  } catch (error) {
    responseReturn(res, 500, {error: error.message});
  }
};

const delete_product = async (req, res) => {
  const {productId} = req.body;

  try {
    const product = await productModel.findByIdAndDelete(productId);
    responseReturn(res, 200, {
      msg: "Delete product successfully",
      success: true,
    });
  } catch (error) {
    responseReturn(res, 500, {error: error.message});
  }
};

const update_product = async (req, res) => {
  const form = formidable({multiples: true});
  form.parse(req, async (err, field, files) => {
    const {
      name,
      brand,
      stock,
      price,
      discount,
      description,
      category,
      productId,
      oldImages,
    } = field;
    const {newImages} = files;
    const slug = slugify(name, {lower: true});

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    try {
      let allImageUrl = [...oldImages];
      if (newImages) {
        if (newImages.length) {
          for (let i = 0; i < newImages.length; i++) {
            const result = await cloudinary.uploader.upload(
              newImages[i].filepath,
              {
                folder: "products",
              }
            );
            allImageUrl.push(result.url);
          }
        } else {
          const result = await cloudinary.uploader.upload(newImages.filepath, {
            folder: "products",
          });
          allImageUrl.push(result.url);
        }
      }
      const product = await productModel.findByIdAndUpdate(productId, {
        name: name.trim(),
        slug,
        brand: brand.trim(),
        category: category.trim(),
        stock: +stock,
        price: +price,
        discount: +discount,
        description,
        images: allImageUrl,
      });

      responseReturn(res, 200, {
        msg: "Update product successfully",
        success: true,
        product,
      });
    } catch (error) {
      responseReturn(res, 500, {error: error.message});
    }
  });

  // const {productId, name, description, discount, price, brand, stock} =
  //   req.body;
  // const slug = slugify(name, {lower: true});

  // try {
  //   const product = await productModel.findByIdAndUpdate(productId, {
  //     name,
  //     description,
  //     discount,
  //     price,
  //     brand,
  //     stock,
  //     slug,
  //   });
  //   responseReturn(res, 200, {
  //     msg: "Update product successfully",
  //     success: true,
  //     product,
  //   });
  // } catch (error) {
  //   responseReturn(res, 500, {error: error.message});
  // }
};

const categoryController = {
  add_product,
  get_all_products,
  get_one_product,
  update_product,
  delete_product,
};

module.exports = categoryController;

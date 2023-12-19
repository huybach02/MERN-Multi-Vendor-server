const categoryModel = require("../../models/categoryModel");
const {formidable} = require("formidable");
const {responseReturn} = require("../../utils/response");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;

const add_category = async (req, res) => {
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) {
      responseReturn(res, 404, {error: "Something went wrong"});
    } else {
      const {name} = fields;
      const {image} = files;
      const slug = slugify(name, {lower: true});

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });

      try {
        const result = await cloudinary.uploader.upload(image.filepath, {
          folder: "categories",
        });

        if (result) {
          const category = await categoryModel.create({
            name,
            slug,
            image: result.url,
          });
          responseReturn(res, 201, {
            msg: "Add category successfully",
            success: true,
            category,
          });
        } else {
          responseReturn(res, 404, {error: "Upload image failed"});
        }
      } catch (error) {
        responseReturn(res, 500, {error: "Something went wrong"});
      }
    }
  });
};

const get_category = async (req, res) => {
  const {page, searchValue, parPage} = req.query;
  const skipPage = +parPage * (+page - 1);

  try {
    if (searchValue && page && parPage) {
      const categories = await categoryModel
        .find({
          name: new RegExp(searchValue, "i"),
        })
        .skip(skipPage)
        .limit(parPage)
        .sort({createdAt: -1});
      const totalCategory = await categoryModel
        .find({
          name: new RegExp(searchValue, "i"),
        })
        .countDocuments();
      responseReturn(res, 200, {totalCategory, categories});
    } else {
      const categories = await categoryModel.find({}).sort({createdAt: -1});
      const totalCategory = await categoryModel.find({}).countDocuments();
      responseReturn(res, 200, {totalCategory, categories});
    }
  } catch (error) {
    console.log(error.message);
  }
};

const categoryController = {
  add_category,
  get_category,
};

module.exports = categoryController;

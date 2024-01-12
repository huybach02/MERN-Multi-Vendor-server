const sellerModel = require("../../models/sellerModel");
const {responseReturn} = require("../../utils/response");
const jwt = require("jsonwebtoken");

const get_all_seller_request = async (req, res) => {
  const {page, searchValue, parPage} = req.query;
  const skipPage = +parPage * (+page - 1);

  try {
    if (searchValue && page && parPage) {
      const sellers = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "pending",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "pending",
            },
          ],
        })
        .skip(skipPage)
        .limit(+parPage)
        .sort({createdAt: -1});
      const totalSeller = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "pending",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "pending",
            },
          ],
        })
        .countDocuments();
      responseReturn(res, 200, {totalSeller, sellers});
    } else if (!searchValue && page && parPage) {
      const sellers = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "pending",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "pending",
            },
          ],
        })
        .skip(skipPage)
        .limit(+parPage)
        .sort({createdAt: -1});
      const totalSeller = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "pending",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "pending",
            },
          ],
        })
        .countDocuments();
      responseReturn(res, 200, {totalSeller, sellers});
    } else {
      const sellers = await sellerModel.find({}).sort({createdAt: -1});
      const totalSeller = await sellerModel.find({}).countDocuments();
      responseReturn(res, 200, {totalSeller, sellers});
    }
  } catch (error) {
    console.log(error.message);
  }
};

const get_one_seller = async (req, res) => {
  const {sellerId} = req.params;

  try {
    const seller = await sellerModel.findById(sellerId);
    responseReturn(res, 200, {seller});
  } catch (error) {
    responseReturn(res, 500, {error: error.message});
  }
};

const update_status_seller = async (req, res) => {
  const {sellerId, status} = req.body;

  try {
    const seller = await sellerModel.findByIdAndUpdate(
      sellerId,
      {status},
      {new: true}
    );
    responseReturn(res, 200, {
      msg: "Update status successfully",
      success: true,
      seller,
    });
  } catch (error) {
    responseReturn(res, 500, {error: error.message});
  }
};

const get_all_active_seller = async (req, res) => {
  const {page, searchValue, parPage} = req.query;
  const skipPage = +parPage * (+page - 1);

  try {
    if (searchValue && page && parPage) {
      const sellers = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "active",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "active",
            },
          ],
        })
        .skip(skipPage)
        .limit(+parPage)
        .sort({createdAt: -1});
      const totalSeller = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "active",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "active",
            },
          ],
        })
        .countDocuments();
      responseReturn(res, 200, {totalSeller, sellers});
    } else if (!searchValue && page && parPage) {
      const sellers = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "active",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "active",
            },
          ],
        })
        .skip(skipPage)
        .limit(+parPage)
        .sort({createdAt: -1});
      const totalSeller = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "active",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "active",
            },
          ],
        })
        .countDocuments();
      responseReturn(res, 200, {totalSeller, sellers});
    } else {
      const sellers = await sellerModel.find({}).sort({createdAt: -1});
      const totalSeller = await sellerModel.find({}).countDocuments();
      responseReturn(res, 200, {totalSeller, sellers});
    }
  } catch (error) {
    console.log(error.message);
  }
};

const get_all_deactive_seller = async (req, res) => {
  const {page, searchValue, parPage} = req.query;
  const skipPage = +parPage * (+page - 1);

  try {
    if (searchValue && page && parPage) {
      const sellers = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "deactive",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "deactive",
            },
          ],
        })
        .skip(skipPage)
        .limit(+parPage)
        .sort({createdAt: -1});
      const totalSeller = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "deactive",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "deactive",
            },
          ],
        })
        .countDocuments();
      responseReturn(res, 200, {totalSeller, sellers});
    } else if (!searchValue && page && parPage) {
      const sellers = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "deactive",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "deactive",
            },
          ],
        })
        .skip(skipPage)
        .limit(+parPage)
        .sort({createdAt: -1});
      const totalSeller = await sellerModel
        .find({
          $or: [
            {
              name: new RegExp(searchValue, "i"),
              status: "deactive",
            },
            {
              email: new RegExp(searchValue, "i"),
              status: "deactive",
            },
          ],
        })
        .countDocuments();
      responseReturn(res, 200, {totalSeller, sellers});
    } else {
      const sellers = await sellerModel.find({}).sort({createdAt: -1});
      const totalSeller = await sellerModel.find({}).countDocuments();
      responseReturn(res, 200, {totalSeller, sellers});
    }
  } catch (error) {
    console.log(error.message);
  }
};

const sellerController = {
  get_all_seller_request,
  get_one_seller,
  update_status_seller,
  get_all_active_seller,
  get_all_deactive_seller,
};

module.exports = sellerController;

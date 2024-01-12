const authorOrdersModel = require("../../models/authOrder");
const customerOrderModel = require("../../models/customerOrderModel");
const sellerWallet = require("../../models/sellerWallet");
const myShopWallet = require("../../models/myShopWallet");
const sellerModel = require("../../models/sellerModel");
const adminSellerMessage = require("../../models/chat/adminSellerMessage");
const sellerCustomerMessage = require("../../models/chat/sellerCustomerMessage");
const productModel = require("../../models/productModel");
const {
  mongo: {ObjectId},
} = require("mongoose");
const {responseReturn} = require("../../utils/response");

const get_seller_dashboard_data = async (req, res) => {
  const {id} = req;

  try {
    const totalSales = await sellerWallet.aggregate([
      {
        $match: {
          sellerId: {
            $eq: id,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalProducts = await productModel
      .find({
        sellerId: new ObjectId(id),
      })
      .countDocuments();

    const totalOrders = await authorOrdersModel
      .find({
        sellerId: new ObjectId(id),
      })
      .countDocuments();

    const totalPendingOrders = await authorOrdersModel
      .find({
        $and: [
          {
            sellerId: {
              $eq: new ObjectId(id),
            },
          },
          {
            delivery_status: {
              $eq: "Pending",
            },
          },
        ],
      })
      .countDocuments();

    const messages = await sellerCustomerMessage
      .find({
        receiverId: id,
      })
      .sort({createdAt: -1})
      .limit(5);

    const recentOrders = await authorOrdersModel
      .find({
        sellerId: new ObjectId(id),
      })
      .sort({createdAt: -1})
      .limit(5);

    responseReturn(res, 200, {
      totalSales: totalSales[0].totalAmount,
      totalProducts,
      totalOrders,
      totalPendingOrders,
      messages,
      recentOrders,
    });
  } catch (error) {
    console.log(error);
  }
};

const get_admin_dashboard_data = async (req, res) => {
  const {id} = req;

  try {
    const totalSales = await myShopWallet.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalProducts = await productModel.find({}).countDocuments();

    const totalOrders = await customerOrderModel.find({}).countDocuments();

    const totalSellers = await sellerModel.find({}).countDocuments();

    const messages = await adminSellerMessage
      .find({
        receiverId: "",
      })
      .sort({createdAt: -1})
      .limit(5);

    const recentOrders = await customerOrderModel
      .find({})
      .sort({createdAt: -1})
      .limit(5);

    responseReturn(res, 200, {
      totalSales: totalSales[0].totalAmount.toFixed(2),
      totalProducts,
      totalOrders,
      totalSellers,
      messages,
      recentOrders,
    });
  } catch (error) {
    console.log(error);
  }
};

const dashboardController = {
  get_seller_dashboard_data,
  get_admin_dashboard_data,
};

module.exports = dashboardController;

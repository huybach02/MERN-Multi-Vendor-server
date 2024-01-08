const authorOrdersModel = require("../../models/authOrder");
const customerOrderModel = require("../../models/customerOrderModel");
const cartModel = require("../../models/cartModel");
const moment = require("moment");
const {responseReturn} = require("../../utils/response");
const {
  mongo: {ObjectId},
} = require("mongoose");

const paymentCheck = async (id) => {
  try {
    const order = await customerOrderModel.findById(id);
    if (order.payment_status === "Unpaid") {
      await customerOrderModel.findByIdAndUpdate(id, {
        delivery_status: "Cancelled",
      });
      await authorOrdersModel.updateMany(
        {
          orderId: id,
        },
        {
          delivery_status: "Cancelled",
        }
      );
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};

const place_order = async (req, res) => {
  const {price, products, shipping_fee, shippingInfo, userId, items} = req.body;

  let authorOrderData = [];
  let cartId = [];
  const tempDate = moment(Date.now()).format("LLL");

  let customerOrderProducts = [];

  for (let i = 0; i < products.length; i++) {
    const pro = products[i].product;
    for (let j = 0; j < pro.length; j++) {
      let tempCusPro = pro[j].productInfo;
      tempCusPro.quantity = pro[j].quantity;
      customerOrderProducts.push(tempCusPro);
      if (pro[j]._id) {
        cartId.push(pro[j]._id);
      }
    }
  }
  try {
    const order = await customerOrderModel.create({
      customerId: userId,
      shippingInfo,
      products: customerOrderProducts,
      price: price + shipping_fee,
      delivery_status: "Pending",
      payment_status: "Unpaid",
      date: tempDate,
    });
    for (let i = 0; i < products.length; i++) {
      const pro = products[i].product;
      const pri = products[i].price;
      const sellerId = products[i].sellerId;
      let storePro = [];
      for (let j = 0; j < pro.length; j++) {
        let tempPro = pro[j].productInfo;
        tempPro.quantity = pro[j].quantity;
        storePro.push(tempPro);
      }
      authorOrderData.push({
        orderId: order.id,
        sellerId,
        products: storePro,
        price: pri,
        payment_status: "Unpaid",
        shippingInfo: order.shippingInfo,
        delivery_status: "Pending",
        date: tempDate,
      });
    }
    await authorOrdersModel.insertMany(authorOrderData);
    for (let k = 0; k < cartId.length; k++) {
      await cartModel.findByIdAndDelete(cartId[k]);
    }
    setTimeout(() => {
      paymentCheck(order.id);
    }, 15000);
    return responseReturn(res, 201, {
      msg: "Placed order successfully",
      orderId: order.id,
    });
  } catch (error) {
    console.log(error);
  }
};

const get_dashboard_data = async (req, res) => {
  const {userId} = req.params;

  try {
    const recentOrders = await customerOrderModel
      .find({
        customerId: new ObjectId(userId),
      })
      .sort({createdAt: -1});
    const totalOrders = await customerOrderModel
      .find({
        customerId: new ObjectId(userId),
      })
      .countDocuments();
    const pendingOrders = await customerOrderModel
      .find({
        customerId: new ObjectId(userId),
        delivery_status: "Pending",
      })
      .countDocuments();
    const cancelledOrders = await customerOrderModel
      .find({
        customerId: new ObjectId(userId),
        delivery_status: "Cancelled",
      })
      .countDocuments();
    responseReturn(res, 201, {
      recentOrders,
      totalOrders,
      pendingOrders,
      cancelledOrders,
    });
  } catch (error) {
    console.log(error);
  }
};

const get_all_orders = async (req, res) => {
  const {customerId, status} = req.params;

  try {
    let orders = [];
    if (status !== "all") {
      orders = await customerOrderModel
        .find({
          customerId: new ObjectId(customerId),
          delivery_status: status,
        })
        .sort({createdAt: -1});
    } else {
      orders = await customerOrderModel
        .find({
          customerId: new ObjectId(customerId),
        })
        .sort({createdAt: -1});
    }
    responseReturn(res, 200, {orders});
  } catch (error) {
    console.log(error);
  }
};

const get_one_order = async (req, res) => {
  const {orderId} = req.params;

  try {
    const order = await customerOrderModel
      .findById(orderId)
      .populate("customerId");

    responseReturn(res, 200, {order});
  } catch (error) {
    console.log(error);
  }
};

const get_all_admin_orders = async (req, res) => {
  const {page, parPage, searchValue} = req.query;
  const skipPage = +parPage * (+page - 1);

  try {
    if (searchValue) {
    } else {
      const orders = await customerOrderModel
        .aggregate([
          {
            $lookup: {
              from: "authororders",
              localField: "_id",
              foreignField: "orderId",
              as: "subOrder",
            },
          },
        ])
        .sort({createdAt: -1})
        .skip(skipPage)
        .limit(+parPage);
      const totalOrders = await customerOrderModel.aggregate([
        {
          $lookup: {
            from: "authororders",
            localField: "_id",
            foreignField: "orderId",
            as: "subOrder",
          },
        },
      ]);

      responseReturn(res, 200, {orders, totalOrders: totalOrders.length});
    }
  } catch (error) {
    console.log(error);
  }
};

const get_one_admin_order = async (req, res) => {
  const {orderId} = req.params;

  try {
    const order = await customerOrderModel.aggregate([
      {
        $match: {
          _id: new ObjectId(orderId),
        },
      },
      {
        $lookup: {
          from: "authororders",
          localField: "_id",
          foreignField: "orderId",
          as: "subOrder",
        },
      },
    ]);
    responseReturn(res, 200, {order});
  } catch (error) {
    console.log(error);
  }
};

const admin_update_status_order = async (req, res) => {
  const {orderId} = req.params;
  const {status} = req.body;

  try {
    await customerOrderModel.findByIdAndUpdate(orderId, {
      delivery_status: status,
    });
    responseReturn(res, 200, {msg: "Update status successfully"});
  } catch (error) {
    console.log(error);
  }
};

const get_all_seller_orders = async (req, res) => {
  const {sellerId} = req.params;
  const {page, parPage, searchValue} = req.query;
  const skipPage = +parPage * (+page - 1);

  try {
    if (searchValue) {
    } else {
      const orders = await authorOrdersModel
        .find({
          sellerId,
        })
        .sort({createdAt: -1})
        .skip(skipPage)
        .limit(+parPage);
      const totalOrders = await authorOrdersModel.find({
        sellerId,
      });
      responseReturn(res, 200, {orders, totalOrders: totalOrders.length});
    }
  } catch (error) {
    console.log(error);
  }
};

const get_one_seller_order = async (req, res) => {
  const {orderId} = req.params;

  try {
    const order = await authorOrdersModel.findById(orderId);
    responseReturn(res, 200, {order});
  } catch (error) {
    console.log(error);
  }
};

const seller_update_status_order = async (req, res) => {
  const {orderId} = req.params;
  const {status} = req.body;

  try {
    await authorOrdersModel.findByIdAndUpdate(orderId, {
      delivery_status: status,
    });
    responseReturn(res, 200, {msg: "Update status successfully"});
  } catch (error) {
    console.log(error);
  }
};

const cartController = {
  place_order,
  get_dashboard_data,
  get_all_orders,
  get_one_order,
  get_all_admin_orders,
  get_one_admin_order,
  admin_update_status_order,
  get_all_seller_orders,
  get_one_seller_order,
  seller_update_status_order,
};

module.exports = cartController;

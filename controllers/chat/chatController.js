const sellerModel = require("../../models/sellerModel");
const customerModel = require("../../models/customerModel");
const sellerToCustomerModel = require("../../models/chat/sellerToCustomerModel");
const sellerCustomerMessage = require("../../models/chat/sellerCustomerMessage");
const adminSellerMessage = require("../../models/chat/adminSellerMessage");
const {responseReturn} = require("../../utils/response");

const add_customer_friend = async (req, res) => {
  const {sellerId, userId} = req.body;

  try {
    if (sellerId !== "") {
      const seller = await sellerModel.findById(sellerId);
      const user = await customerModel.findById(userId);
      const checkSeller = await sellerToCustomerModel.findOne({
        $and: [
          {
            myId: {
              $eq: userId,
            },
          },
          {
            myFriends: {
              $elemMatch: {
                friendId: sellerId,
              },
            },
          },
        ],
      });
      if (!checkSeller) {
        await sellerToCustomerModel.updateOne(
          {
            myId: userId,
          },
          {
            $push: {
              myFriends: {
                friendId: sellerId,
                name: seller.shopInfo.shopName,
                image: seller.image,
              },
            },
          }
        );
      }

      const checkCustomer = await sellerToCustomerModel.findOne({
        $and: [
          {
            myId: {
              $eq: sellerId,
            },
          },
          {
            myFriends: {
              $elemMatch: {
                friendId: userId,
              },
            },
          },
        ],
      });
      if (!checkCustomer) {
        await sellerToCustomerModel.updateOne(
          {
            myId: sellerId,
          },
          {
            $push: {
              myFriends: {
                friendId: userId,
                name: user.name,
                image: "",
              },
            },
          }
        );
      }
      const messages = await sellerCustomerMessage.find({
        $or: [
          {
            $and: [
              {
                receiverId: {
                  $eq: sellerId,
                },
              },
              {
                senderId: {
                  $eq: userId,
                },
              },
            ],
          },
          {
            $and: [
              {
                receiverId: {
                  $eq: userId,
                },
              },
              {
                senderId: {
                  $eq: sellerId,
                },
              },
            ],
          },
        ],
      });
      const friends = await sellerToCustomerModel.findOne({myId: userId});
      const currentFriend = friends.myFriends.find(
        (i) => i.friendId === sellerId
      );
      responseReturn(res, 200, {
        myFriends: friends.myFriends,
        currentFriend,
        messages,
      });
    } else {
      const friends = await sellerToCustomerModel.findOne({myId: userId});
      responseReturn(res, 200, {myFriends: friends.myFriends});
    }
  } catch (error) {
    console.log(error);
  }
};

const send_message_to_seller = async (req, res) => {
  const {userId, text, sellerId, name} = req.body;

  try {
    const message = await sellerCustomerMessage.create({
      senderId: userId,
      senderName: name,
      receiverId: sellerId,
      message: text,
    });

    const data = await sellerToCustomerModel.findOne({myId: userId});
    let myFriends = data.myFriends;
    let index = myFriends.findIndex((i) => i.friendId === sellerId);
    while (index > 0) {
      let temp = myFriends[index];
      myFriends[index] = myFriends[index - 1];
      myFriends[index - 1] = temp;
      index--;
    }
    await sellerToCustomerModel.updateOne(
      {
        myId: userId,
      },
      {
        myFriends,
      }
    );
    const data1 = await sellerToCustomerModel.findOne({
      myId: sellerId,
    });
    let myFriends1 = data1.myFriends;
    let index1 = myFriends1.findIndex((i) => i.friendId === userId);
    while (index1 > 0) {
      let temp1 = myFriends1[index1];
      myFriends1[index1] = myFriends1[index1 - 1];
      myFriends1[index1 - 1] = temp1;
      index1--;
    }
    await sellerToCustomerModel.updateOne(
      {
        myId: sellerId,
      },
      {
        myFriends: myFriends1,
      }
    );
    responseReturn(res, 201, {message});
  } catch (error) {
    console.log(error);
  }
};

const get_customers = async (req, res) => {
  const {sellerId} = req.params;

  try {
    const data = await sellerToCustomerModel.findOne({myId: sellerId});
    responseReturn(res, 200, {customers: data.myFriends});
  } catch (error) {
    console.log(error);
  }
};

const get_customer_message = async (req, res) => {
  const {customerId} = req.params;
  const {id} = req;

  try {
    const messages = await sellerCustomerMessage.find({
      $or: [
        {
          $and: [
            {
              receiverId: {
                $eq: customerId,
              },
            },
            {
              senderId: {
                $eq: id,
              },
            },
          ],
        },
        {
          $and: [
            {
              receiverId: {
                $eq: id,
              },
            },
            {
              senderId: {
                $eq: customerId,
              },
            },
          ],
        },
      ],
    });

    const friends = await sellerToCustomerModel.findOne({myId: id});
    const currentCustomer = friends.myFriends.find(
      (i) => i.friendId === customerId
    );

    responseReturn(res, 200, {messages, currentCustomer});
  } catch (error) {
    console.log(error);
  }
};

const send_message_to_customer = async (req, res) => {
  const {senderId, text, receiverId, name} = req.body;

  try {
    const message = await sellerCustomerMessage.create({
      senderId: senderId,
      senderName: name,
      receiverId: receiverId,
      message: text,
    });

    const data = await sellerToCustomerModel.findOne({myId: senderId});
    let myFriends = data.myFriends;
    let index = myFriends.findIndex((i) => i.friendId === receiverId);
    while (index > 0) {
      let temp = myFriends[index];
      myFriends[index] = myFriends[index - 1];
      myFriends[index - 1] = temp;
      index--;
    }
    await sellerToCustomerModel.updateOne(
      {
        myId: senderId,
      },
      {
        myFriends,
      }
    );
    const data1 = await sellerToCustomerModel.findOne({
      myId: receiverId,
    });
    let myFriends1 = data1.myFriends;
    let index1 = myFriends1.findIndex((i) => i.friendId === senderId);
    while (index1 > 0) {
      let temp1 = myFriends1[index1];
      myFriends1[index1] = myFriends1[index1 - 1];
      myFriends1[index1 - 1] = temp1;
      index1--;
    }
    await sellerToCustomerModel.updateOne(
      {
        myId: receiverId,
      },
      {
        myFriends: myFriends1,
      }
    );
    responseReturn(res, 201, {message});
  } catch (error) {
    console.log(error);
  }
};

const get_sellers = async (req, res) => {
  try {
    const sellers = await sellerModel.find({});
    responseReturn(res, 200, {sellers});
  } catch (error) {
    console.log(error);
  }
};

const seller_admin_messages = async (req, res) => {
  const {senderId, message, receiverId, senderName} = req.body;

  try {
    const mess = await adminSellerMessage.create({
      senderId,
      receiverId,
      message,
      senderName,
    });
    responseReturn(res, 200, {message: mess});
  } catch (error) {
    console.log(error);
  }
};

const get_admin_message = async (req, res) => {
  const {receiverId} = req.params;
  const id = "";
  try {
    const messages = await adminSellerMessage.find({
      $or: [
        {
          $and: [
            {
              receiverId: {
                $eq: receiverId,
              },
            },
            {
              senderId: {
                $eq: id,
              },
            },
          ],
        },
        {
          $and: [
            {
              receiverId: {
                $eq: id,
              },
            },
            {
              senderId: {
                $eq: receiverId,
              },
            },
          ],
        },
      ],
    });
    let currentSeller = {};
    if (receiverId) {
      currentSeller = await sellerModel.findById(receiverId);
    }
    responseReturn(res, 200, {messages, currentSeller});
  } catch (error) {
    console.log(error);
  }
};

const get_seller_message = async (req, res) => {
  const {id} = req;
  const receiverId = "";
  try {
    const messages = await adminSellerMessage.find({
      $or: [
        {
          $and: [
            {
              receiverId: {
                $eq: receiverId,
              },
            },
            {
              senderId: {
                $eq: id,
              },
            },
          ],
        },
        {
          $and: [
            {
              receiverId: {
                $eq: id,
              },
            },
            {
              senderId: {
                $eq: receiverId,
              },
            },
          ],
        },
      ],
    });

    responseReturn(res, 200, {messages});
  } catch (error) {
    console.log(error);
  }
};

const chatController = {
  add_customer_friend,
  send_message_to_seller,
  get_customers,
  get_customer_message,
  send_message_to_customer,
  get_sellers,
  seller_admin_messages,
  get_admin_message,
  get_seller_message,
};

module.exports = chatController;

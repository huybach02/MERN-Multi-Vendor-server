const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {dbConnect} = require("./utils/dbConnect");
const http = require("http");
const socket = require("socket.io");

const app = express();

const server = http.createServer(app);

const PORT = process.env.PORT;
app.use(
  cors({
    origin: [
      "https://mern-multi-vendor-client.vercel.app",
      "https://mern-multi-vendor-dashboard.vercel.app",
    ],
    credentials: true,
  })
);

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

var allCustomer = [];
var allSeller = [];

const addUser = (customerId, socketId, userInfo) => {
  const checkUser = allCustomer.some((user) => user.customerId === customerId);
  if (!checkUser) {
    allCustomer.push({
      customerId,
      socketId,
      userInfo,
    });
  }
};

const addSeller = (sellerId, socketId, userInfo) => {
  const checkSeller = allSeller.some((user) => user.sellerId === sellerId);
  if (!checkSeller) {
    allSeller.push({
      sellerId,
      socketId,
      userInfo,
    });
  }
};

const findCustomer = (customerId) => {
  return allCustomer.find((i) => i.customerId === customerId);
};
const findSeller = (sellerId) => {
  return allSeller.find((i) => i.sellerId === sellerId);
};

const remove = (socketId) => {
  allCustomer = allCustomer.filter((i) => i.socketId !== socketId);
  allSeller = allSeller.filter((i) => i.socketId !== socketId);
};

let admin = {};

const removeAdmin = (socketId) => {
  if (admin.socketId === socketId) {
    admin = {};
  }
};

io.on("connection", (soc) => {
  console.log("Socket server is connected");
  soc.on("add_user", (customerId, userInfo) => {
    addUser(customerId, soc.id, userInfo);
    io.emit("activeSeller", allSeller);
    io.emit("activeCustomer", allCustomer);
  });
  soc.on("add_seller", (sellerId, userInfo) => {
    addSeller(sellerId, soc.id, userInfo);
    io.emit("activeSeller", allSeller);
    io.emit("activeCustomer", allCustomer);
    io.emit("activeAdmin", {status: true});
  });
  soc.on("add_admin", (adminInfo) => {
    delete adminInfo.email;
    admin = adminInfo;
    admin.socketId = soc.id;
    io.emit("activeSeller", allSeller);
    io.emit("activeAdmin", {status: true});
  });
  soc.on("send_seller_message", (msg) => {
    const customer = findCustomer(msg.receiverId);
    if (customer !== undefined) {
      soc.to(customer.socketId).emit("seller_message", msg);
    }
  });
  soc.on("send_customer_message", (msg) => {
    const seller = findSeller(msg.receiverId);
    if (seller !== undefined) {
      soc.to(seller.socketId).emit("customer_message", msg);
    }
  });
  soc.on("send_message_admin_to_seller", (msg) => {
    const seller = findSeller(msg.receiverId);
    if (seller !== undefined) {
      soc.to(seller.socketId).emit("received_admin_message", msg);
    }
  });
  soc.on("send_message_seller_to_admin", (msg) => {
    if (admin.socketId) {
      soc.to(admin.socketId).emit("received_seller_message", msg);
    }
  });
  soc.on("disconnect", () => {
    console.log("user disconnect");
    remove(soc.id);
    removeAdmin(soc.id);
    io.emit("activeAdmin", {status: false});
    io.emit("activeSeller", allSeller);
    io.emit("activeCustomer", allCustomer);
  });
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/home", require("./routes/home/homeRoutes"));
app.use("/api/home", require("./routes/home/cartRoutes"));
app.use("/api/home", require("./routes/order/orderRoutes"));
app.use("/api", require("./routes/home/customerAuthRoutes"));
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/dashboard/categoryRoutes"));
app.use("/api", require("./routes/dashboard/productRoutes"));
app.use("/api", require("./routes/dashboard/sellerRoutes"));
app.use("/api", require("./routes/dashboard/dashboardRoutes"));
app.use("/api", require("./routes/chatRoutes"));
app.use("/api", require("./routes/paymentRoutes"));

app.get("/", (req, res) => {
  res.send("Hello");
});

dbConnect();

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

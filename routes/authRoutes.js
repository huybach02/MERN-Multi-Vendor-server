const authController = require("../controllers/authController");
const {authMiddleware} = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/admin-login", authController.admin_login);
router.post("/get-user", authMiddleware, authController.getUser);

module.exports = router;

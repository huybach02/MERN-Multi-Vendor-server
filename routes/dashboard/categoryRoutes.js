const categoryController = require("../../controllers/dashboard/categoryController");
const {authMiddleware} = require("../../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/category-add", categoryController.add_category);
router.get("/category-get-all", categoryController.get_category);
router.get(
  "/category-get-one/:categoryId",
  categoryController.get_one_category
);
router.post("/category-update/:categoryId", categoryController.update_category);
router.get("/category-delete/:categoryId", categoryController.delete_category);

module.exports = router;

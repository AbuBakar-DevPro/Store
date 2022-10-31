const express = require("express");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

const Product = require("../models/product");
const router = express.Router();
const advancedResults = require("../middleware/advancedResults");
const auth = require("../middleware/auth");

router.post("/", auth, createProduct);

router.route("/").get(
  advancedResults(Product, {
    path: "userId",
    select: "name email",
  }),
  getProducts
);

router.get("/:id", auth, getProduct);
router.delete("/:id", auth, deleteProduct);
router.put("/:id", auth, updateProduct);
module.exports = router;

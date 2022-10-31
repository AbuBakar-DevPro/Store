const Product = require("../models/product");

//GETTING ALL PRODUCTS
exports.getProducts = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};
// GETTING SINGLE PRODUCT BY ID

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, msg: "Does not contain product with this id" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// CREATING PRODUCT

exports.createProduct = async (req, res) => {
  const { name, price } = req.body;
  console.log(req.userId);

  const newProduct = new Product({
    name: name,
    price: price,
    userId: req.userId,
  });

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//DELETING PRODUCT

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    let product = await Product.findById(id);
    if (product.userId.toString() !== req.userId) {
      return res.status(400).json({
        success: false,
        msg: "This user is not allowed to delete this product",
      });
    }
    product = await Product.findByIdAndRemove(id);
    res.status(202).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//UPDATING PRODUCT

exports.updateProduct = async (req, res, next) => {
  const id = req.params.id;
  const { name, price } = req.body;

  const newProduct = {
    name: name,
    price: price,
    userId: req.userId,
  };
  try {
    let product = await Product.findById(id);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, msg: "Product can not be found" });
    }

    if (product.userId.toString() !== req.userId) {
      return res.status(400).json({
        success: false,
        msg: "This user is not allowed to update this product",
      });
    }
    product = await Product.findByIdAndUpdate(id, newProduct, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

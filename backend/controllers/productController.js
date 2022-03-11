import { StatusCodes } from 'http-status-codes';
import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({
    length: products.length,
    products,
  });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Product not found');
  }
  res.status(StatusCodes.OK).json({ product });
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Product not found');
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ message: 'Product removed' });
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const product = await Product.create({
    name: 'Sample product',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpeg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  res.status(StatusCodes.CREATED).json(product);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } =
    req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Product not found');
  }

  product.name = name;
  product.price = price;
  product.image = image;
  product.brand = brand;
  product.category = category;
  product.countInStock = countInStock;
  product.description = description;

  await product.save();
  res.status(StatusCodes.CREATED).json(product);
};

export {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  createProduct,
  updateProduct,
};

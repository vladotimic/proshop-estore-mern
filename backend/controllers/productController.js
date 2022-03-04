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

export { getAllProducts, getSingleProduct };
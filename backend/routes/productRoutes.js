import express from 'express';
import {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  createProduct,
} from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllProducts).post([protect, isAdmin], createProduct);
router
  .route('/:id')
  .get(getSingleProduct)
  .put([protect, isAdmin], updateProduct)
  .delete([protect, isAdmin], deleteProduct);

export default router;

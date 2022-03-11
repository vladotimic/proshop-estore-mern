import express from 'express';
import {
  authUser,
  getUserProfile,
  updateUserProfile,
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get([protect, isAdmin], getUsers);
router.post('/login', authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .get([protect, isAdmin], getUserById)
  .put([protect, isAdmin], updateUser)
  .delete([protect, isAdmin], deleteUser);

export default router;

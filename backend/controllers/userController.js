import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('There is no user with this email');
  }

  const correctPassword = await user.matchPassword(password);
  if (!correctPassword) {
    throw new Error('Password is incorrect');
  }

  const { _id, email: userEmail, name, isAdmin } = user;
  const token = generateToken(_id);
  res.status(StatusCodes.OK).json({
    _id,
    name,
    email: userEmail,
    isAdmin,
    token,
  });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('User not found');
  }

  const { _id, name, email, isAdmin } = user;
  res.status(StatusCodes.OK).json({
    _id,
    name,
    email,
    isAdmin,
  });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  const { _id, name, email, isAdmin } = updatedUser;
  res.status(StatusCodes.OK).json({
    _id,
    name,
    email,
    isAdmin,
  });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('User already exist');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const { _id, email: userEmail, name: userName, isAdmin } = user;
  const token = generateToken(_id);
  res.status(StatusCodes.CREATED).json({
    _id,
    name: userName,
    email: userEmail,
    isAdmin,
    token,
  });
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({});
  if (!users) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Users not found');
  }

  res.status(StatusCodes.OK).json({
    users,
  });
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('User not found');
  }

  await user.remove();
  res.status(StatusCodes.OK).json({ message: 'User is deleted' });
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('User not found');
  }

  res.status(StatusCodes.OK).json(user);
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.isAdmin = req.body.isAdmin === true ? true : false;

  const updatedUser = await user.save();
  const { _id, name, email, isAdmin } = updatedUser;
  res.status(StatusCodes.OK).json({
    _id,
    name,
    email,
    isAdmin,
  });
};

export {
  authUser,
  getUserProfile,
  updateUserProfile,
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

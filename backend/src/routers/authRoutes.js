// auth routes 
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshJwtToken,
  getProfile,
  updateProfile,
  deleteProfile,
  forgotPassword,
  resetPassword,
  verifyEmail
} = require('../controllers/authController');

const { authenticateUser } = require('../middleware/authMiddleware');

const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyEmail
} = require('../middleware/authValidation');

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshJwtToken);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);
router.post('/verify-email', validateVerifyEmail, verifyEmail);

// Protected routes
router.get('/profile', authenticateUser, getProfile);
router.patch('/profile', authenticateUser, validateUpdateProfile, updateProfile);
router.delete('/profile', authenticateUser, deleteProfile);

module.exports = router;


// routes 

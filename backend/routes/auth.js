const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getWishlist, addToWishlist, removeFromWishlist, updateUserProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter, registerLimiter, passwordChangeLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerLimiter, registerUser);
router.post('/login', loginLimiter, loginUser);
router.get('/me', protect, getMe);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:id', protect, addToWishlist);
router.delete('/wishlist/:id', protect, removeFromWishlist);
router.put('/profile', protect, updateUserProfile);
router.put('/password',passwordChangeLimiter, protect, changePassword);

module.exports = router;

const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Wishlist = require('../models/Wishlist');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        // Create an empty profile and wishlist for the new user
        await Profile.create({ user: user._id });
        await Wishlist.create({ user: user._id });

        await sendEmail(
    user.email,
    'Welcome to Canvora',
    `Hi ${user.name},

Welcome to Canvora!

Your account has been created successfully.

Thank you for joining Canvora.`
);

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter all fields');
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Fetch profile data
        let profile = await Profile.findOne({ user: user._id });
        if (!profile) {
            profile = await Profile.create({ user: user._id });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            profileImage: profile.profileImage || "",
            location: profile.location || "",
            bio: profile.bio || "",
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    let profile = await Profile.findOne({ user: user._id });
    if (!profile) {
        profile = await Profile.create({ user: user._id });
    }

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        profileImage: profile.profileImage,
        location: profile.location,
        bio: profile.bio,
    });
});

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user.id });
    }

    // Filter out products that might have been deleted
    const activeProducts = (wishlist.products || []).filter(item => item !== null);
    res.json(activeProducts);
});

// @desc    Add item to wishlist
// @route   POST /api/auth/wishlist/:id
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
    } else {
        if (wishlist.products.includes(productId)) {
            res.status(400);
            throw new Error('Product already in wishlist');
        }
        wishlist.products.push(productId);
        await wishlist.save();
    }

    res.status(200).json({ message: 'Added to wishlist' });
});

// @desc    Remove item from wishlist
// @route   DELETE /api/auth/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (wishlist) {
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        await wishlist.save();
    }

    res.status(200).json({ message: 'Removed from wishlist' });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        // Update User basic info
        user.name = req.body.name !== undefined ? req.body.name : user.name;
        await user.save();

        // Update Profile detailed info
        let profile = await Profile.findOne({ user: user._id });
        if (!profile) {
            profile = new Profile({ user: user._id });
        }

        profile.location = req.body.location !== undefined ? req.body.location : profile.location;
        profile.bio = req.body.bio !== undefined ? req.body.bio : profile.bio;
        profile.profileImage = req.body.profileImage !== undefined ? req.body.profileImage : profile.profileImage;
        profile.updatedAt = Date.now();

        console.log('Updating user profile for:', user.email, { location: profile.location, bio: profile.bio });
        await profile.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            location: profile.location,
            bio: profile.bio,
            profileImage: profile.profileImage,
            createdAt: user.createdAt,
            token: generateToken(user._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (user && (await user.matchPassword(currentPassword))) {
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } else {
        res.status(401);
        throw new Error('Invalid current password');
    }
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    updateUserProfile,
    changePassword,
};

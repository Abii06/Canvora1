const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        trim: true,
    },
}, {
    timestamps: true, // replaces manual createdAt
});

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Artist is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    images: {
        type: [String],
        required: [true, 'At least one image is required'],
        validate: {
            validator: function (arr) {
                return arr && arr.length > 0;
            },
            message: 'Product must have at least one image',
        },
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        index: true, // frequently queried
    },
    reviews: [reviewSchema],
    copies: {
        type: Number,
        default: 1,
        min: [0, 'Copies cannot be negative'],
    },
    contactNumber: {
        type: String,
        trim: true,
        match: [
            /^[+]?[\d\s\-().]{7,20}$/,
            'Please provide a valid contact number',
        ],
    },
}, {
    timestamps: true, // auto createdAt + updatedAt, replaces manual createdAt
});

// Indexes for frequently queried fields
productSchema.index({ artist: 1 });
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    getMyProducts,
    updateProduct,
    deleteProduct,
    addReview,
    getReviews,
    deleteReview,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, createProduct);
router.route('/myartworks').get(protect, getMyProducts);
router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);


router.route('/:id/reviews')
    .get(getReviews)
    .post(protect, addReview);

router.route('/:productId/reviews/:reviewId')
    .delete(protect, deleteReview);
module.exports = router;

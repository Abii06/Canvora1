import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, ShoppingBag, ArrowLeft, Mail } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useRequests } from '../context/RequestContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as api from '../api';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { outgoingRequests, fetchUserRequests } = useRequests();
    const { user: currentUser } = useAuth();
    const { showToast } = useToast();
    const [requestSent, setRequestSent] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Reviews
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const { data } = await api.fetchProduct(id);
                setProduct(data);

                const reviewResponse = await api.fetchReviews(id);
                setReviews(reviewResponse.data);

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch product", error);
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    const isLiked = product ? isInWishlist(product._id) : false;
    const isOwner = product && currentUser && product.artist?._id === currentUser._id;

    // Check if this product is already in outgoing requests
    const hasExistingRequest = product ? outgoingRequests.some(req => req.product?._id === product._id) : false;

    const remainingCopies = product ? (product.copies - (product.soldCount || 0)) : 0;
    const isOutOfStock = remainingCopies <= 0;

    const handleSendRequest = async () => {
        if (!product) return;
        setShowConfirm(true);
    };

    const confirmRequest = async () => {
        try {
            await api.createRequest({
                productId: product._id,
                artistId: product.artist._id,
                price: product.price,
                message: "I am interested in purchasing this artwork."
            });
            await fetchUserRequests(); // Refresh requests list
            setRequestSent(true);
            setShowConfirm(false);
            showToast("Purchase request sent!", "success");
        } catch (error) {
            console.error("Failed to send request", error);
            showToast("Failed to send request", "error");
            setShowConfirm(false);
        }
    };

    if (loading) return <div className="text-white text-center pt-32">Loading...</div>;
    if (!product) return <div className="text-white text-center pt-32">Product not found</div>;

    const toggleWishlist = () => {
        if (isLiked) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `CANVORA | ${product.title}`,
                    text: `Check out this amazing artwork: ${product.title}`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard!", "success");
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Error sharing:", error);
            }
        }
    };

    const handleReviewSubmit = async () => {
        try {
            const { data } = await api.addReview(id, {
                rating,
                comment,
            });

            setReviews(data);
            setRating(0);
            setComment('');

            showToast('Review added successfully!', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to add review', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/collections" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Collections
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="aspect-4/5 bg-surface rounded-2xl overflow-hidden border border-white/5 relative group">
                            <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <img src={product.images[activeImageIndex]} alt={product.title} className="w-full h-full object-cover transition-all duration-500" />
                                ) : (
                                    <span className="text-6xl font-thin opacity-20 text-white">ART</span>
                                )}
                            </div>
                            <button
                                onClick={handleShare}
                                className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                            >
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveImageIndex(i)}
                                        className={`aspect-square bg-surface rounded-xl border cursor-pointer transition-all overflow-hidden ${activeImageIndex === i ? 'border-primary ring-2 ring-primary/20' : 'border-white/5 hover:border-white/20'}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className={`flex items-center gap-2 px-3 py-1 border rounded-full ${isOutOfStock ? 'bg-red-500/10 border-red-500/20' : 'bg-primary/10 border-primary/20'}`}>
                                    {!isOutOfStock && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${isOutOfStock ? 'text-red-500' : 'text-primary'}`}>
                                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                                    </span>
                                </div>
                                <span className="text-gray-400 text-sm">{product.category}</span>
                                {!isOutOfStock && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border flex items-center gap-1.5 ml-2 ${remainingCopies <= 3
                                            ? 'bg-amber-500/20 border-amber-500/30 text-amber-500 animate-pulse'
                                            : 'bg-white/5 border-white/10 text-gray-300'
                                            }`}
                                    >
                                        <div className={`h-1.5 w-1.5 rounded-full ${remainingCopies <= 3 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-gray-500'}`} />
                                        {remainingCopies} {remainingCopies === 1 ? 'copy' : 'copies'} left
                                    </motion.span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 bg-linear-to-tr from-purple-500 to-pink-500 rounded-full" />
                                    <div>
                                        <p className="text-xs text-gray-400">Owner</p>
                                        <span className="font-semibold text-white transition-colors">{product.artist?.name || 'Unknown User'}</span>
                                        <p className="text-xs text-primary mt-0.5">{product.artist?.email}</p>
                                    </div>
                                </div>
                                {/* Contact Button */}
                                {!isOwner && (
                                    <a
                                        href={`mailto:${product.artist?.email}`}
                                        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/5"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Contact Owner
                                    </a>
                                )}
                            </div>

                            <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 mb-8">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Description</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                            <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 mb-8">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
                                    Reviews & Ratings
                                </h3>

                                <div className="flex gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`text-3xl ${rating >= star
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-500'
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your review..."
                                    className="w-full p-3 rounded-lg bg-black/20 border border-white/10 mb-4"
                                />

                                <button
                                    onClick={handleReviewSubmit}
                                    className="bg-primary px-5 py-2 rounded-lg text-white font-semibold"
                                >
                                    Submit Review
                                </button>

                                <div className="mt-6 space-y-4">
                                    {reviews.map((review) => (
                                        <div
                                            key={review._id}
                                            className="border border-white/10 rounded-xl p-4"
                                        >
                                            <p className="font-semibold text-white">
                                                {review.user?.name || 'User'}
                                            </p>

                                            <p className="text-yellow-400">
                                                {'★'.repeat(review.rating)}
                                            </p>

                                            <p className="text-gray-300 mt-2">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Current Price</p>
                                    <p className="text-4xl font-bold font-mono text-white">Rs. {product.price}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleSendRequest}
                                    disabled={isOwner || hasExistingRequest || requestSent || isOutOfStock}
                                    className={`flex-1 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${isOwner || hasExistingRequest || requestSent || isOutOfStock
                                        ? (isOutOfStock ? 'bg-red-500/20 text-red-500 border border-red-500/20 cursor-not-allowed' : 'bg-green-500 text-white cursor-not-allowed')
                                        : 'bg-white text-black hover:bg-gray-100'
                                        }`}
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    {isOwner ? "Your Artwork" : (isOutOfStock ? "Out of Stock" : (hasExistingRequest || requestSent ? "Request Sent!" : "Send Request"))}
                                </button>
                                {!isOwner && (
                                    <button
                                        onClick={toggleWishlist}
                                        className={`px-6 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors ${isLiked ? 'text-red-500' : 'text-white'}`}
                                    >
                                        <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface border border-white/10 p-8 rounded-3xl max-w-md w-full relative z-10 shadow-2xl text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4">Send Purchase Request?</h2>
                        <p className="text-gray-400 mb-8">
                            Are you sure you want to send a purchase request for <span className="text-white font-medium">"{product.title}"</span>?
                            This will notify the owner of your interest.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRequest}
                                className="flex-1 py-3 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors"
                            >
                                Send Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;

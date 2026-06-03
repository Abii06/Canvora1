import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Monitor, ArrowUpRight, ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import { useEffect } from 'react';

import ProtectedRoute from '../components/ProtectedRoute';

const Marketplace = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const { data } = await api.fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        loadProducts();
    }, []);

    const categories = ['All', 'Painting', 'Abstract', 'Digital Art', 
        'Photography', 'Sculpture', 'Mixed Media'];

    const handleWishlistToggle = (e, product) => {
        e.preventDefault(); // Prevent Link navigation
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">Explore Collections</h1>
                        <p className="text-gray-400 max-w-xl">
                            Browse through a curated selection of unique digital and physical artworks from creators around the globe.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-surface p-2 rounded-xl border border-white/5 w-full md:w-auto">
                        <Search className="h-5 w-5 text-gray-400 ml-2" />
                        <input
                            type="text"
                            placeholder="Search art, artists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 w-full md:w-64"
                        />
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                            <Filter className="h-5 w-5 text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${activeCategory === cat
                                ? 'bg-primary border-primary text-white'
                                : 'bg-surface border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
        <>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products
                        .filter(p => !user || p.artist?._id !== user._id)
                        .filter(p => activeCategory === 'All' || p.category === activeCategory)
                        .filter(p =>
                            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((product) => {
                            const isLiked = isInWishlist(product._id);
                            const isSoldOut = (product.copies - (product.soldCount || 0)) <= 0;
                            return (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -5 }}
                                    className="bg-surface rounded-2xl overflow-hidden border border-white/5 group"
                                >
                                    <div className="relative aspect-[4/5] bg-gray-800 overflow-hidden">
                                        <div className="absolute top-4 right-4 z-30 flex gap-2">
                                            {!user || product.artist?._id !== user._id ? (
                                                <button
                                                    onClick={(e) => handleWishlistToggle(e, product)}
                                                    className={`p-2 backdrop-blur-md rounded-full transition-colors ${isLiked
                                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                                        : 'bg-black/20 text-white hover:bg-white/20'
                                                        }`}
                                                >
                                                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                                                </button>
                                            ) : null}
                                        </div>

                                        {/* Image with Scarcity Highlights */}
                                        <div className={`w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden transition-all duration-500 ${isSoldOut ? 'grayscale scale-105' : ''}`}>
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl text-white/10 font-bold">ART</span>
                                            )}
                                        </div>

                                        {/* Out of Stock Overlay */}
                                        {isSoldOut && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10 pointer-events-none">
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="bg-red-500 text-white font-black text-sm tracking-tighter px-6 py-2.5 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.5)] border-2 border-white/20"
                                                >
                                                    OUT OF STOCK
                                                </motion.div>
                                            </div>
                                        )}

                                        <Link to={`/product/${product._id}`} className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 z-20">
                                            <button className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-xl">
                                                <ShoppingBag className="h-4 w-4" /> {isSoldOut ? 'View Archive' : 'View Details'}
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-white truncate pr-2">{product.title}</h3>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-md font-medium">
                                                    {product.category}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-4">Owner: {product.artist?.name || 'Unknown'}</p>
                                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Price</p>
                                                <p className="font-bold text-white">Rs. {product.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                </div>
        </>
            </div>
        </div>
    );
};

export default Marketplace;

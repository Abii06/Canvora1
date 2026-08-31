import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingBag, Heart, X, ChevronDown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';

const CATEGORIES = ['All', 'Painting', 'Abstract', 'Digital Art', 'Photography', 'Sculpture', 'Mixed Media'];

const Marketplace = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortName, setSortName] = useState(null);
    const [sortPrice, setSortPrice] = useState(null);
    const [sortArtist, setSortArtist] = useState(null);

    const filterRef = useRef(null);
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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const clearAllFilters = () => {
        setActiveCategory('All');
        setSortName(null);
        setSortPrice(null);
        setSortArtist(null);
        setSearchQuery('');
    };

    const activeFilterCount = [
        sortName !== null,
        sortPrice !== null,
        sortArtist !== null,
    ].filter(Boolean).length;

    const applyFiltersAndSort = (list) => {
        let result = [...list]
            .filter(p => !user || p.artist?._id !== user._id)
            .filter(p => activeCategory === 'All' || p.category === activeCategory)
            .filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );

        if (sortName) result.sort((a, b) => sortName === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
        if (sortPrice) result.sort((a, b) => sortPrice === 'asc' ? a.price - b.price : b.price - a.price);
        if (sortArtist) result.sort((a, b) => (a.artist?.name || '').localeCompare(b.artist?.name || ''));

        return result;
    };

    const filteredProducts = applyFiltersAndSort(products);

    const handleWishlistToggle = (e, product) => {
        e.preventDefault();
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

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-white/5 flex-1 md:w-64">
                            <Search className="h-5 w-5 text-gray-400 ml-2 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search art, artists..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 w-full"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Filter Button */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setFilterOpen(prev => !prev)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-sm font-medium whitespace-nowrap ${filterOpen || activeFilterCount > 0
                                    ? 'bg-primary border-primary text-white'
                                    : 'bg-surface border-white/5 text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                                {activeFilterCount > 0 && (
                                    <span className="bg-white text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                                <ChevronDown className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {filterOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-64 bg-surface border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        {/* Sort by Name */}
                                        <div className="px-4 pt-4 pb-3 border-b border-white/5">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Sort by Name</p>
                                            <div className="flex gap-2">
                                                {[{ label: 'A → Z', value: 'asc' }, { label: 'Z → A', value: 'desc' }].map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => setSortName(sortName === opt.value ? null : opt.value)}
                                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${sortName === opt.value
                                                            ? 'bg-primary/20 border-primary text-primary'
                                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                                            }`}
                                                    >
                                                        {sortName === opt.value && <Check className="h-3 w-3" />}
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sort by Price */}
                                        <div className="px-4 pt-3 pb-3 border-b border-white/5">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Sort by Price</p>
                                            <div className="flex gap-2">
                                                {[{ label: 'Low → High', value: 'asc' }, { label: 'High → Low', value: 'desc' }].map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => setSortPrice(sortPrice === opt.value ? null : opt.value)}
                                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${sortPrice === opt.value
                                                            ? 'bg-primary/20 border-primary text-primary'
                                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                                            }`}
                                                    >
                                                        {sortPrice === opt.value && <Check className="h-3 w-3" />}
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sort by Artist */}
                                        <div className="px-4 pt-3 pb-3 border-b border-white/5">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Sort by Artist</p>
                                            <button
                                                onClick={() => setSortArtist(sortArtist ? null : 'asc')}
                                                className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${sortArtist
                                                    ? 'bg-primary/20 border-primary text-primary'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                                    }`}
                                            >
                                                {sortArtist && <Check className="h-3 w-3" />}
                                                Artist A → Z
                                            </button>
                                        </div>

                                        {/* Clear All */}
                                        <div className="px-4 py-3">
                                            <button
                                                onClick={() => { clearAllFilters(); setFilterOpen(false); }}
                                                disabled={activeFilterCount === 0}
                                                className="w-full py-2 rounded-lg text-xs font-semibold border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                Clear All Filters
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Category Pills — unchanged from original */}
                <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
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

                {/* Active Filter Tags */}
                {(activeFilterCount > 0 || searchQuery) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {searchQuery && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-xs rounded-full font-medium">
                                Search: "{searchQuery}"
                                <button onClick={() => setSearchQuery('')}><X className="h-3 w-3" /></button>
                            </span>
                        )}
                        {sortName && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-xs rounded-full font-medium">
                                Name: {sortName === 'asc' ? 'A→Z' : 'Z→A'}
                                <button onClick={() => setSortName(null)}><X className="h-3 w-3" /></button>
                            </span>
                        )}
                        {sortPrice && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-xs rounded-full font-medium">
                                Price: {sortPrice === 'asc' ? 'Low→High' : 'High→Low'}
                                <button onClick={() => setSortPrice(null)}><X className="h-3 w-3" /></button>
                            </span>
                        )}
                        {sortArtist && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-xs rounded-full font-medium">
                                Artist: A→Z
                                <button onClick={() => setSortArtist(null)}><X className="h-3 w-3" /></button>
                            </span>
                        )}
                        <button
                            onClick={clearAllFilters}
                            className="px-3 py-1 text-xs text-gray-500 hover:text-white transition-colors underline underline-offset-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* Results Count */}
                <p className="text-sm text-gray-500 mb-6">
                    Showing {filteredProducts.length} artwork{filteredProducts.length !== 1 ? 's' : ''}
                </p>

                {/* Empty State */}
                {filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-24 text-center"
                    >
                        <div className="text-6xl mb-4">🎨</div>
                        <h3 className="text-xl font-bold text-white mb-2">No artworks found</h3>
                        <p className="text-gray-400 max-w-sm mb-6">
                            {searchQuery
                                ? `No results for "${searchQuery}". Try a different search term or category.`
                                : `No artworks match your current filters.`}
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/80 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => {
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

                                        <div className={`w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden transition-all duration-500 ${isSoldOut ? 'grayscale scale-105' : ''}`}>
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl text-white/10 font-bold">ART</span>
                                            )}
                                        </div>

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
                                            <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-md font-medium shrink-0">
                                                {product.category}
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
                )}
            </div>
        </div>
    );
};

export default Marketplace;
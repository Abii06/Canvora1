import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ShoppingBag, ArrowRight, Palette } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useAuth } from '../context/AuthContext';
import SoftAuthModal from '../components/SoftAuthModal';

const demoArtworks = [
    {
        _id: "demo1",
        title: "Nebula Dreams",
        category: "Digital",
        price: "15,000",
        copies: 10,
        images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"]
    },
    {
        _id: "demo2",
        title: "Chiaroscuro Study",
        category: "Painting",
        price: "75,000",
        copies: 1,
        images: ["https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop"]
    }
];

const MyArtworks = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showSoftAuth, setShowSoftAuth] = useState(false);
    const [softAuthMessage, setSoftAuthMessage] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            setArtworks(demoArtworks);
            setLoading(false);
            return;
        }

        const loadMyArtworks = async () => {
            try {
                const { data } = await api.fetchMyArtworks();
                setArtworks(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch my artworks", error);
                setLoading(false);
            }
        };
        loadMyArtworks();
    }, [isAuthenticated]);

    return (
        <div className="min-h-screen bg-transparent pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Artworks</h1>
                        <p className="text-gray-400">Manage the masterpieces you've shared with the world.</p>
                    </div>
                    <Link
                        to="/upload"
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                    >
                        <Plus className="h-5 w-5" /> Upload New Art
                    </Link>
                </div>

                {/* Guest Callout Banner */}
                {!isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 p-6 bg-gradient-to-r from-primary/20 via-surface/80 to-secondary/20 border border-white/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-primary">
                                <Palette className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Showcase your masterpiece</h3>
                                <p className="text-sm text-gray-400">Sign in to start uploading, editing, and sharing your art with collectors worldwide.</p>
                            </div>
                        </div>
                        <Link
                            to="/auth"
                            state={{ from: "/myartworks" }}
                            className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
                        >
                            Sign In / Create Account <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading CANVORA...</div>
                ) : artworks.length === 0 ? (
                    <div className="text-center py-20 bg-surface/30 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-300 mb-2">You haven't uploaded any art yet</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start your journey as an artist by sharing your first masterpiece with our community.</p>
                        <Link to="/upload" className="inline-flex bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                            Upload Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {artworks.map((art) => (
                            <motion.div
                                key={art._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-surface rounded-2xl overflow-hidden border border-white/5 group relative"
                            >
                                <div className="relative aspect-[4/5] bg-gray-800 overflow-hidden">
                                    {art.images && art.images.length > 0 ? (
                                        <img src={art.images[0]} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                            <span className="text-4xl text-white/10 font-bold">ART</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                        {!isAuthenticated ? (
                                            <button
                                                onClick={() => {
                                                    setSoftAuthMessage("Sign in to manage and view artwork details.");
                                                    setShowSoftAuth(true);
                                                }}
                                                className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                                                title="View Details"
                                            >
                                                <ShoppingBag className="h-5 w-5" />
                                            </button>
                                        ) : (
                                            <Link
                                                to={`/product/${art._id}`}
                                                className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                                                title="View Details"
                                            >
                                                <ShoppingBag className="h-5 w-5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white truncate pr-2">{art.title}</h3>
                                        <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                            {art.category}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Price</p>
                                            <p className="font-bold text-white font-mono">Rs. {art.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Copies</p>
                                            <p className="font-medium text-gray-300">{art.copies}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Soft Auth Modal */}
            <SoftAuthModal
                isOpen={showSoftAuth}
                onClose={() => setShowSoftAuth(false)}
                message={softAuthMessage}
                redirectPath="/myartworks"
            />
        </div>
    );
};

export default MyArtworks;

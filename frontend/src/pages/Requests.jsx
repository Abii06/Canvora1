import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, X, ArrowUpRight, ArrowDownLeft, Send, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import * as api from '../api';
import { useAuth } from '../context/AuthContext';
import SoftAuthModal from '../components/SoftAuthModal';

const mockIncomingRequests = [
    {
        _id: "mock-inc-1",
        product: {
            title: "Cosmic Resonance",
            images: ["https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop"]
        },
        requester: { name: "Alice Vance" },
        price: "35,000",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: "pending"
    },
    {
        _id: "mock-inc-2",
        product: {
            title: "Surreal Mindscape",
            images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"]
        },
        requester: { name: "David Sterling" },
        price: "82,000",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "accepted"
    }
];

const mockOutgoingRequests = [
    {
        _id: "mock-out-1",
        product: {
            title: "Absolute Zero",
            images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop"]
        },
        artist: { name: "Sophia Reynolds" },
        price: "60,000",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: "pending"
    }
];

const Requests = () => {
    const [activeTab, setActiveTab] = useState('incoming');
    const [showConfirm, setShowConfirm] = useState(false);
    const [requestToCancel, setRequestToCancel] = useState(null);
    const { incomingRequests, outgoingRequests, fetchUserRequests } = useRequests();
    const { isAuthenticated } = useAuth();
    
    const [showSoftAuth, setShowSoftAuth] = useState(false);
    const [softAuthMessage, setSoftAuthMessage] = useState('');

    const incomingList = isAuthenticated ? incomingRequests : mockIncomingRequests;
    const outgoingList = isAuthenticated ? outgoingRequests : mockOutgoingRequests;

    const handleUpdateStatus = async (id, status) => {
        if (!isAuthenticated) {
            setSoftAuthMessage("Sign in to accept or decline purchase requests.");
            setShowSoftAuth(true);
            return;
        }
        try {
            await api.updateRequestStatus(id, status);
            fetchUserRequests();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleCancelRequest = (id) => {
        if (!isAuthenticated) {
            setSoftAuthMessage("Sign in to manage your outgoing requests.");
            setShowSoftAuth(true);
            return;
        }
        setRequestToCancel(id);
        setShowConfirm(true);
    };

    const confirmCancel = async () => {
        if (!requestToCancel) return;
        try {
            await api.cancelRequest(requestToCancel);
            fetchUserRequests();
            setShowConfirm(false);
            setRequestToCancel(null);
        } catch (error) {
            console.error("Failed to cancel request", error);
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Requests & Offers</h1>
                        <p className="text-gray-400">Manage your art requests and offers.</p>
                    </div>

                    <div className="flex bg-surface/50 backdrop-blur-md p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setActiveTab('incoming')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'incoming'
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Incoming <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-xs">{incomingList.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('outgoing')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'outgoing'
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Outgoing <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-xs">{outgoingList.length}</span>
                        </button>
                    </div>
                </div>

                {/* Guest Callout Banner */}
                {!isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-6 bg-gradient-to-r from-primary/20 via-surface/80 to-secondary/20 border border-white/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-primary">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Manage your purchase requests</h3>
                                <p className="text-sm text-gray-400">Sign in to buy art, manage your sales, and coordinate with collectors.</p>
                            </div>
                        </div>
                        <Link
                            to="/auth"
                            state={{ from: "/requests" }}
                            className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
                        >
                            Sign In / Create Account <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                )}

                <div className="space-y-4">
                    {activeTab === 'incoming' ? (
                        <>
                            {incomingList.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">No incoming requests yet.</div>
                            ) : incomingList.map((req) => (
                                <motion.div
                                    key={req._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="h-16 w-16 bg-gray-700 rounded-lg flex-shrink-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 overflow-hidden relative">
                                            {req.product?.images && req.product.images.length > 0 ? (
                                                <img src={req.product.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-xs text-white/20 font-bold">IMG</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">{req.product?.title || "Unknown Art"}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <ArrowDownLeft className="h-4 w-4 text-green-400" />
                                                <span>Offer from <span className="text-white font-medium">{req.requester?.name || "Unknown"}</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <p className="text-2xl font-bold font-mono text-white">Rs. {req.price}</p>
                                            <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                                                <Clock className="h-3 w-3" /> {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            {req.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(req._id, 'accepted')}
                                                        className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded-lg border border-green-500/50 transition-colors"
                                                        title="Accept"
                                                    >
                                                        <Check className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(req._id, 'rejected')}
                                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg border border-red-500/50 transition-colors"
                                                        title="Decline"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${req.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                                                    }`}>
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </>
                    ) : (
                        <>
                            {outgoingList.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">No outgoing requests sent.</div>
                            ) : outgoingList.map((req) => (
                                <motion.div
                                    key={req._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="h-16 w-16 bg-gray-700 rounded-lg flex-shrink-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 overflow-hidden relative">
                                            {req.product?.images && req.product.images.length > 0 ? (
                                                <img src={req.product.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-xs text-white/20 font-bold">IMG</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">{req.product?.title || "Unknown Art"}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <ArrowUpRight className="h-4 w-4 text-primary" />
                                                <span>Request to <span className="text-white font-medium">{req.artist?.name || "Artist"}</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <p className="text-2xl font-bold font-mono text-white">Rs. {req.price}</p>
                                            <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                                                <Clock className="h-3 w-3" /> {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${req.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                                req.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                    'bg-surface border-white/10 text-gray-400'
                                                }`}>
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </span>
                                            {req.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancelRequest(req._id)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-colors"
                                                    title="Cancel Request"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="flex justify-center mt-8">
                                <Link to="/collections" className="flex items-center gap-2 text-primary hover:text-white transition-colors">
                                    <Send className="h-4 w-4" /> Send New Request
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface border border-white/10 p-8 rounded-3xl max-w-md w-full relative z-10 shadow-2xl text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4">Cancel Request?</h2>
                        <p className="text-gray-400 mb-8">
                            Are you sure you want to cancel this purchase request? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                            >
                                No, Keep it
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-650 text-white font-bold rounded-xl transition-colors"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Soft Auth Modal */}
            <SoftAuthModal
                isOpen={showSoftAuth}
                onClose={() => setShowSoftAuth(false)}
                message={softAuthMessage}
                redirectPath="/requests"
            />
        </div>
    );
};

export default Requests;

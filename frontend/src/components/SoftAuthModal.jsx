import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SoftAuthModal = ({ isOpen, onClose, message, redirectPath }) => {
    const navigate = useNavigate();

    const handleSignIn = () => {
        onClose();
        navigate('/auth', { state: { from: redirectPath || window.location.pathname } });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white dark:bg-surface border border-gray-200 dark:border-white/10 p-8 rounded-3xl max-w-md w-full relative z-[1001] shadow-2xl text-center overflow-hidden"
                    >
                        {/* Decorative Background Glows */}
                        <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Icon */}
                        <div className="h-16 w-16 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                            <KeyRound className="h-8 w-8 text-white" />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                            Login Required
                        </h2>

                        {/* Message */}
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed font-medium">
                            {message || "Sign in to save your progress and access all the premium creator features on Canvora."}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3.5 px-6 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-150 dark:hover:bg-white/5 transition-all text-sm uppercase tracking-wider active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSignIn}
                                className="flex-1 py-3.5 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 text-sm uppercase tracking-wider active:scale-[0.98]"
                            >
                                Sign In
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SoftAuthModal;

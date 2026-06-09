import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, Image as ImageIcon, X, Plus, AlertCircle } from 'lucide-react';
import * as api from '../api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import SoftAuthModal from '../components/SoftAuthModal';

const Upload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [price, setPrice] = useState('');
    const [availability, setAvailability] = useState(1);
    const [customAvailability, setCustomAvailability] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const { isAuthenticated } = useAuth();
    const [showSoftAuth, setShowSoftAuth] = useState(false);
    const [softAuthMessage, setSoftAuthMessage] = useState('');

    const categories = ['Painting', 'Abstract', 'Digital', 'Photography', 'Sculpture', 'Mixed Media'];
    const availabilityOptions = [1, 2, 3, 4, 5, 'Other'];

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const id = query.get('edit');
        if (id) {
            setIsEditing(true);
            setEditId(id);
            loadProductData(id);
        }
    }, [location]);

    const loadProductData = async (id) => {
        try {
            const { data } = await api.fetchProduct(id);
            setTitle(data.title);
            setSelectedCategory(data.category);
            setPrice(data.price);
            if ([1, 2, 3, 4, 5].includes(data.copies)) {
                setAvailability(data.copies);
            } else {
                setAvailability('Other');
                setCustomAvailability(data.copies);
            }
            setDescription(data.description);
            setSelectedImages(data.images || []);
        } catch (error) {
            console.error("Failed to load product for editing", error);
            showToast("Failed to load artwork data", "error");
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (files) => {
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImages(prev => [...prev, e.target.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setSoftAuthMessage("Sign in to upload and publish your artwork.");
            setShowSoftAuth(true);
            return;
        }
        setLoading(true);

        const productData = {
            title,
            category: selectedCategory,
            price: Number(price),
            copies: availability === 'Other' ? Number(customAvailability) : Number(availability),
            description,
            images: selectedImages // Array of Base64 strings
        };

        try {
            if (isEditing) {
                await api.updateProduct(editId, productData);
            } else {
                await api.createProduct(productData);
            }
            setLoading(false);
            showToast(`${isEditing ? 'Artwork updated' : 'Artwork uploaded'} successfully!`, "success");
            navigate('/collections');
        } catch (error) {
            console.error(error);
            setLoading(false);
            showToast(`Failed to ${isEditing ? 'update' : 'upload'} artwork`, "error");
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-4xl font-bold mb-2">{isEditing ? 'Edit Your Artwork' : 'Upload Your Artwork'}</h1>
                <p className="text-gray-400">Share your masterpiece with collectors worldwide</p>
            </div>

            {/* Guest Callout Banner */}
            {!isAuthenticated && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto mb-8 p-5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center gap-4 backdrop-blur-xl"
                >
                    <AlertCircle className="h-6 w-6 flex-shrink-0" />
                    <div className="text-left">
                        <h4 className="font-bold text-white">Creator Studio Preview</h4>
                        <p className="text-sm text-gray-400 font-medium">You are free to try the form, but you must sign in to submit and publish artwork.</p>
                    </div>
                </motion.div>
            )}

            <div className="max-w-2xl mx-auto bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit}>
                    {/* Image Upload Section */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Artwork Image</label>
                        <div
                            className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors ${dragActive ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20 bg-black/20"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleChange}
                                accept="image/*"
                                multiple
                            />

                            {selectedImages.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 relative z-20">
                                    {selectedImages.map((img, index) => (
                                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                                            <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage(index);
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex flex-col items-center justify-center border border-white/10 rounded-lg hover:bg-white/5 transition-colors cursor-pointer min-h-[100px]">
                                        <Plus className="h-6 w-6 text-gray-500" />
                                        <span className="text-xs text-gray-500 mt-1">Add More</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="h-16 w-16 bg-surface/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <ImageIcon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-1">Drop your artworks here</h3>
                                    <p className="text-sm text-gray-500 mb-6">or click to browse from your device</p>
                                    <p className="text-xs text-gray-600">PNG, JPG or WEBP (Multiple allowed)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Artwork Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder="Give your artwork a captivating title"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Category */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedCategory === cat
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-surface border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Price (INR)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">Rs. </span>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-14 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Available Copies</label>
                                <div className="flex bg-black/20 rounded-xl p-1 border border-white/10">
                                    {availabilityOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setAvailability(opt)}
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${availability === opt
                                                ? 'bg-primary text-white shadow-lg'
                                                : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {availability === 'Other' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <input
                                        type="number"
                                        value={customAvailability}
                                        onChange={(e) => setCustomAvailability(e.target.value)}
                                        placeholder="Enter number of copies"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </motion.div>
                            )}
                            <p className="text-xs text-gray-500">How many copies of this artwork are available for sale?</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell the story behind your artwork, the inspiration, medium used, dimensions..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <UploadIcon className="h-5 w-5" /> {loading ? (isEditing ? 'Updating...' : 'Uploading...') : (isEditing ? 'Update Artwork' : 'Upload Artwork')}
                    </button>
                </form>
            </div>

            {/* Soft Auth Modal */}
            <SoftAuthModal
                isOpen={showSoftAuth}
                onClose={() => setShowSoftAuth(false)}
                message={softAuthMessage}
                redirectPath="/upload"
            />
        </div>
    );
};

export default Upload;

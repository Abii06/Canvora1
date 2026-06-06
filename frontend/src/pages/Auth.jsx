import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Eye, EyeOff, Lock, Mail, ArrowRight, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login, register, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            if (isLogin) {
                await login(formData, navigate);
                showToast("Welcome back!", "success");

            } else {
                await register(formData, navigate);
            
                showToast("Account created successfully!", "success");
            }
        } catch (error) {
            showToast(error.response?.data?.message || (isLogin ? "Login failed" : "Registration failed"), "error");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Blobs - kept for depth but background is now global gradient */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl aspect-[16/9] bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10"
            >
                {/* Creative Left Panel */}
                <div className="w-full md:w-1/2 relative hidden md:block overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"
                        alt="Art Inspiration"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-background/40 to-secondary/60 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />

                    <div className="absolute bottom-12 left-12 right-12 z-20">
                        <Link to="/" className="flex items-center gap-4 mb-6 group cursor-pointer">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 group-hover:bg-white/20 transition-all">
                                <Palette className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-3xl font-black text-white tracking-tighter">CANVORA</span>
                        </Link>
                        <h1 className="text-5xl font-black text-white leading-tight mb-4">
                            Unleash Your <br />
                            <span className="text-primary italic">Creative Soul</span>
                        </h1>
                        <p className="text-gray-300 text-lg font-medium max-w-md">
                            Join a global community of elite artisans and collectors where every pixel matters.
                        </p>
                    </div>

                    {/* Decorative Art Grid */}
                    <div className="absolute top-12 right-12 flex flex-col gap-4 opacity-40">
                        <div className="w-20 h-20 bg-white/10 rounded-2xl rotate-12 border border-white/20" />
                        <div className="w-20 h-20 bg-white/10 rounded-2xl -rotate-12 border border-white/20 translate-x-4" />
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-black/20">
                    <Link to="/" className="md:hidden text-center mb-10 flex flex-col items-center">
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-primary to-secondary rounded-2xl mb-6 shadow-lg shadow-primary/20">
                            <Palette className="h-8 w-8 text-white" />
                        </div>
                    </Link>

                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-4xl font-black text-white mb-3">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-gray-400 font-medium">
                            {isLogin ? 'Access your creative sanctuary' : 'Start your journey at CANVORA'}
                        </p>
                    </div>

                    <form className="space-y-12" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full bg-transparent border-b-2 border-white/10 py-3 text-white focus:outline-none focus:border-primary transition-all placeholder:opacity-0"
                                    placeholder="Full Name"
                                />
                                <label className="absolute left-0 -top-6 text-primary text-xs transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-primary peer-focus:text-xs font-black uppercase tracking-widest">
                                    Full Name
                                </label>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all peer-focus:w-full" />
                            </div>
                        )}

                        <div className="relative group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="peer w-full bg-transparent border-b-2 border-white/10 py-3 text-white focus:outline-none focus:border-primary transition-all placeholder:opacity-0"
                                placeholder="Email Address"
                            />
                            <label className="absolute left-0 -top-6 text-primary text-xs transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-primary peer-focus:text-xs font-black uppercase tracking-widest">
                                Email Address
                            </label>
                            <Mail className="absolute right-0 top-3 h-5 w-5 text-gray-600 peer-focus:text-primary transition-colors" />
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all peer-focus:w-full" />
                        </div>

                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="peer w-full bg-transparent border-b-2 border-white/10 py-3 text-white focus:outline-none focus:border-primary transition-all placeholder:opacity-0"
                                placeholder="Password"
                            />
                            <label className="absolute left-0 -top-6 text-primary text-xs transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-primary peer-focus:text-xs font-black uppercase tracking-widest">
                                Password
                            </label>
                            <div className="absolute right-0 top-3 flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-600 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                <Lock className="h-5 w-5 text-gray-600 peer-focus:text-primary transition-colors" />
                            </div>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all peer-focus:w-full" />
                        </div>

                        <button className="relative w-full group overflow-hidden rounded-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)]">
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isLogin ? 'Log In' : 'Get Started'}
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-white font-black hover:text-primary transition-colors underline decoration-primary/30 underline-offset-8"
                            >
                                {isLogin ? 'Create account' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;

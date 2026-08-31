import React, { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    percent: 0,
    label: "",
    color: "bg-red-500",
  });
  const { login, register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return { percent: 0, label: "", color: "bg-red-500" };

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const percent = Math.min(100, (score / 5) * 100);

    let label = "Weak";
    let color = "bg-red-500";
    if (percent >= 80) {
      label = "Strong";
      color = "bg-green-400";
    } else if (percent >= 40) {
      label = "Medium";
      color = "bg-yellow-400";
    }

    return { percent, label, color };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password" && !isLogin) {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  React.useEffect(() => {
    if (isLogin) {
      setPasswordStrength({ percent: 0, label: "", color: "bg-red-500" });
    }
  }, [isLogin]);

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
      showToast(
        error.response?.data?.message ||
          (isLogin ? "Login failed" : "Registration failed"),
        "error",
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card w-full max-w-4xl xl:max-w-5xl backdrop-blur-2xl border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col xl:flex-row relative z-10"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          maxHeight: "calc(100vh - 4rem)",
        }}
      >
        {/* Creative Left Panel */}
        <div className="w-full xl:w-1/2 relative hidden xl:block overflow-hidden auth-left-panel">
          <img
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"
            alt="Art Inspiration"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-transparent to-secondary/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

          <div className="absolute bottom-12 left-12 right-12 z-20">
            <Link
              to="/"
              className="flex items-center gap-4 mb-6 group cursor-pointer"
            >
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 group-hover:bg-white/20 transition-all">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-black text-white tracking-tighter">
                CANVORA
              </span>
            </Link>
            <h1 className="text-5xl font-black text-white leading-tight mb-4">
              Unleash Your <br />
              <span className="text-primary italic">Creative Soul</span>
            </h1>
            <p className="text-gray-200 text-lg font-medium max-w-md">
              Join a global community of elite artisans and collectors where
              every pixel matters.
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div
          className="w-full lg:w-1/2 p-6 md:p-10 lg:p-16 flex flex-col justify-center min-h-0 auth-form-panel"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="mb-8 text-center lg:text-left">
            <h2
              className="text-3xl md:text-4xl font-black mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p
              style={{ color: "var(--text-secondary)" }}
              className="text-sm md:text-base font-medium max-w-xl mx-auto lg:mx-0"
            >
              {isLogin
                ? "Access your creative sanctuary"
                : "Start your journey at CANVORA"}
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="peer w-full bg-transparent border-b-2 py-3 md:py-4 focus:outline-none focus:border-primary transition-all placeholder:opacity-0"
                  style={{
                    color: "var(--text-primary)",
                    borderColor: "var(--border-color)",
                  }}
                  placeholder="Full Name"
                />
                <label className="absolute left-0 -top-6 text-primary text-xs transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-primary peer-focus:text-xs font-black uppercase tracking-widest">
                  Full Name
                </label>
              </div>
            )}

            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="peer w-full bg-transparent border-b-2 py-3 focus:outline-none focus:border-primary transition-all placeholder:opacity-0"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
                placeholder="Email Address"
              />
              <label className="absolute left-0 -top-6 text-primary text-xs transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-primary peer-focus:text-xs font-black uppercase tracking-widest">
                Email Address
              </label>
              <Mail className="absolute right-0 top-3 h-5 w-5 opacity-40 peer-focus:text-primary transition-colors" />
            </div>

            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="peer w-full bg-transparent border-b-2 py-3 focus:outline-none focus:border-primary transition-all placeholder:opacity-0"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
                placeholder="Password"
              />
              <label className="absolute left-0 -top-6 text-primary text-xs transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-primary peer-focus:text-xs font-black uppercase tracking-widest">
                Password
              </label>
              <div className="absolute right-0 top-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: "var(--text-secondary)" }}
                  className="hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <Lock className="h-5 w-5 opacity-40 peer-focus:text-primary transition-colors" />
              </div>
            </div>

            {!isLogin && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Password strength
                  </span>
                  <span
                    className="text-sm font-black uppercase tracking-wide"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {passwordStrength.label || "Too short"}
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--bg-primary)" }}
                >
                  <div
                    className={`${passwordStrength.color} h-full transition-all`}
                    style={{ width: `${passwordStrength.percent}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}
            <button className="relative w-full group overflow-hidden rounded-full py-4 md:py-5 bg-primary text-white font-black uppercase tracking-[0.16em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLogin ? "Log In" : "Get Started"}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </form>

          <div
            className="mt-8 pt-6 border-t text-center"
            style={{ borderTopColor: "var(--border-color)" }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-black hover:text-primary transition-colors underline decoration-primary/30 underline-offset-8"
                style={{ color: "var(--text-primary)" }}
              >
                {isLogin ? "Create account" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;

import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loading components for performance
const Home = lazy(() => import('./pages/Home'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Auth = lazy(() => import('./pages/Auth'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Requests = lazy(() => import('./pages/Requests'));
const Upload = lazy(() => import('./pages/Upload'));
const MyArtworks = lazy(() => import('./pages/MyArtworks'));
const Profile = lazy(() => import('./pages/Profile'));

import ProtectedRoute from './components/ProtectedRoute';

// Sleek Loading Component
const PageLoading = () => (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl">
        <div className="h-1 w-48 bg-white/10 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary animate-progress" />
        </div>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-white/40 animate-pulse">Loading CANVORA</p>
    </div>
);




function App() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/auth';

    // Also hide navbar/footer for some other routes if needed, but usually just auth

    return (
        <div className="min-h-screen bg-background text-text selection:bg-primary selection:text-white flex flex-col">
            {!isAuthPage && <Navbar />}

            <main className="flex-grow">
                <Suspense fallback={<PageLoading />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />

                        <Route path="/collections" element={<Marketplace />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/requests" element={<Requests />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/myartworks" element={<MyArtworks />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </Suspense>
            </main>

            {!isAuthPage && <Footer />}
        </div>
    );
}

export default App;

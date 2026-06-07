import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Add token to headers if it exists
API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
});

// Add response interceptor to handle 401s
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('isAuth');
            // We can't use navigate() outside of a component easily without a custom history object
            // but we can at least clear the storage. The app state might still think it's logged in
            // until a refresh or state update.
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

// Auth
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const getMe = () => API.get('/auth/me');
export const fetchWishlist = () => API.get('/auth/wishlist');
export const addToWishlist = (id) => API.post(`/auth/wishlist/${id}`);
export const removeFromWishlist = (id) => API.delete(`/auth/wishlist/${id}`);
export const updateUserProfile = (updatedUser) => API.put('/auth/profile', updatedUser);
export const changePassword = (passwords) => API.put('/auth/password', passwords);

// Products
export const fetchProducts = () => API.get('/products');
export const fetchProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (newProduct) => API.post('/products', newProduct);
export const fetchMyArtworks = () => API.get('/products/myartworks');
export const updateProduct = (id, updatedProduct) => API.put(`/products/${id}`, updatedProduct);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const fetchReviews = (id) =>
    API.get(`/products/${id}/reviews`);

export const addReview = (id, review) =>
    API.post(`/products/${id}/reviews`, review);

export const deleteReview = (productId, reviewId) =>
    API.delete(`/products/${productId}/reviews/${reviewId}`);

// Requests
export const fetchRequests = () => API.get('/requests/myrequests');
export const createRequest = (newRequest) => API.post('/requests', newRequest);
export const updateRequestStatus = (id, status) => API.put(`/requests/${id}`, { status });
export const cancelRequest = (id) => API.delete(`/requests/${id}`);

export default API;

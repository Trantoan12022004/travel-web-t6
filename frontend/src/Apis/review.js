import axios from "axios";

const API_URL = "https://travel-web-t6.onrender.com/api";

// Tạo axios instance với config
const reviewApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor để thêm token vào mọi request
reviewApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ========== PUBLIC APIs ==========

// Lấy danh sách reviews của tour
export const getReviewsByTour = async (tourId, params) => {
    try {
        const response = await reviewApi.get(`/review/tours/${tourId}`, { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Lấy thống kê rating của tour
export const getTourRatingStats = async (tourId) => {
    try {
        const response = await reviewApi.get(`/review/tours/${tourId}/stats`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// ========== USER APIs ==========

// Tạo review mới
export const createReview = async (tourId, reviewData) => {
    try {
        const response = await reviewApi.post(`/review/tours/${tourId}`, reviewData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Lấy review của user cho một tour
export const getUserReviewForTour = async (tourId) => {
    try {
        const response = await reviewApi.get(`/review/tours/${tourId}/me`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Lấy tất cả reviews của user
export const getMyReviews = async (params) => {
    try {
        const response = await reviewApi.get("/review/me", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Cập nhật review
export const updateReview = async (reviewId, reviewData) => {
    try {
        const response = await reviewApi.put(`/review/${reviewId}`, reviewData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Xóa review
export const deleteReview = async (reviewId) => {
    try {
        const response = await reviewApi.delete(`/review/${reviewId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// ========== ADMIN APIs ==========

// Ẩn/hiện review (Admin only)
export const toggleReviewStatus = async (reviewId, status) => {
    try {
        const response = await reviewApi.patch(`/review/${reviewId}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default {
    getReviewsByTour,
    getTourRatingStats,
    createReview,
    getUserReviewForTour,
    getMyReviews,
    updateReview,
    deleteReview,
    toggleReviewStatus,
};

import axios from "axios";

const API_URL = "https://travel-web-t6.onrender.com/api";

// Tạo axios instance với config
const bookingApi = axios.create({
    baseURL: `${API_URL}/bookings`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor để thêm token vào mọi request
bookingApi.interceptors.request.use(
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

// ========== USER APIs ==========

// Tạo booking mới
export const createBooking = async (bookingData) => {
    try {
        const response = await bookingApi.post("/", bookingData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Lấy danh sách bookings của user
export const getMyBookings = async (params) => {
    try {
        const response = await bookingApi.get("/my-bookings", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Lấy chi tiết booking
export const getBookingById = async (id) => {
    try {
        const response = await bookingApi.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Hủy booking
export const cancelBooking = async (id, reason) => {
    try {
        const response = await bookingApi.patch(`/${id}/cancel`, { reason });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Tạo payment cho booking
export const createPayment = async (id, paymentData) => {
    try {
        const response = await bookingApi.post(`/${id}/payment`, paymentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// ========== ADMIN APIs ==========

// Lấy tất cả bookings (Admin)
export const getAllBookings = async (params) => {
    try {
        const response = await bookingApi.get("/admin/all", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Lấy thống kê bookings (Admin)
export const getBookingStats = async (params) => {
    try {
        const response = await bookingApi.get("/admin/stats", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Cập nhật trạng thái booking (Admin)
export const updateBookingStatus = async (id, status) => {
    try {
        const response = await bookingApi.patch(`/admin/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    createPayment,
    getAllBookings,
    getBookingStats,
    updateBookingStatus,
};

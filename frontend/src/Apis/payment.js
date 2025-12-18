import axios from "axios";

const API_URL = "https://travel-web-t6.onrender.com/api";

// Tạo axios instance với config mặc định
const paymentApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor để tự động thêm token
paymentApi.interceptors.request.use(
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

// Interceptor xử lý response error
paymentApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

/**
 * Tạo payment mới cho booking
 * @param {number} bookingId - ID của booking
 * @param {object} paymentData - Dữ liệu payment (method)
 * @returns {Promise}
 */
export const createPayment = async (bookingId, paymentData) => {
    try {
        const response = await paymentApi.post(`/payments/bookings/${bookingId}`, paymentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lấy danh sách payments của booking
 * @param {number} bookingId - ID của booking
 * @returns {Promise}
 */
export const getPaymentsByBooking = async (bookingId) => {
    try {
        const response = await paymentApi.get(`/payments/bookings/${bookingId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lấy chi tiết payment
 * @param {number} paymentId - ID của payment
 * @returns {Promise}
 */
export const getPaymentById = async (paymentId) => {
    try {
        const response = await paymentApi.get(`/payments/${paymentId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Xác nhận thanh toán thành công
 * @param {number} paymentId - ID của payment
 * @returns {Promise}
 */
export const confirmPayment = async (paymentId) => {
    try {
        const response = await paymentApi.post(`/payments/${paymentId}/confirm`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Hủy payment
 * @param {number} paymentId - ID của payment
 * @returns {Promise}
 */
export const cancelPayment = async (paymentId) => {
    try {
        const response = await paymentApi.post(`/payments/${paymentId}/cancel`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Hoàn tiền (Admin only)
 * @param {number} paymentId - ID của payment
 * @returns {Promise}
 */
export const refundPayment = async (paymentId) => {
    try {
        const response = await paymentApi.post(`/payments/${paymentId}/refund`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lấy thống kê payments (Admin only)
 * @param {string} startDate - Ngày bắt đầu
 * @param {string} endDate - Ngày kết thúc
 * @returns {Promise}
 */
export const getPaymentStats = async (startDate, endDate) => {
    try {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await paymentApi.get("/payments/stats", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export default {
    createPayment,
    getPaymentsByBooking,
    getPaymentById,
    confirmPayment,
    cancelPayment,
    refundPayment,
    getPaymentStats,
};

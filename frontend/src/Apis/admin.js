import axios from "axios";

const API_URL = "https://travel-web-t6.onrender.com/api";

// Tạo axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - thêm token vào header
apiClient.interceptors.request.use(
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

class AdminAPI {
    // =====================================================
    // THỐNG KÊ
    // =====================================================

    /**
     * Lấy thống kê dashboard
     * GET /api/admin/dashboard
     */
    static async getDashboardStats() {
        try {
            const response = await apiClient.get("/admin/dashboard");
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy thống kê doanh thu theo tháng
     * GET /api/admin/stats/revenue?year=2024
     */
    static async getRevenueByMonth(year) {
        try {
            const params = year ? { year } : {};
            const response = await apiClient.get("/admin/stats/revenue", { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy top tours
     * GET /api/admin/stats/top-tours?type=revenue&limit=10
     */
    static async getTopTours(type = "revenue", limit = 10) {
        try {
            const response = await apiClient.get("/admin/stats/top-tours", {
                params: { type, limit },
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // =====================================================
    // QUẢN LÝ TOURS
    // =====================================================

    /**
     * Lấy danh sách tours (Admin)
     * GET /api/admin/tours
     */
    static async getAllTours(filters = {}) {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach((key) => {
                if (filters[key] !== null && filters[key] !== undefined) {
                    params.append(key, filters[key]);
                }
            });

            const response = await apiClient.get(`/admin/tours?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy chi tiết tour (Admin)
     * GET /api/admin/tours/:id
     */
    static async getTourById(tourId) {
        try {
            const response = await apiClient.get(`/admin/tours/${tourId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Tạo tour mới
     * POST /api/admin/tours
     */
    static async createTour(tourData) {
        try {
            const response = await apiClient.post("/admin/tours", tourData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Cập nhật tour
     * PUT /api/admin/tours/:id
     */
    static async updateTour(tourId, tourData) {
        try {
            const response = await apiClient.put(`/admin/tours/${tourId}`, tourData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Xóa tour
     * DELETE /api/admin/tours/:id
     */
    static async deleteTour(tourId) {
        try {
            const response = await apiClient.delete(`/admin/tours/${tourId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Thay đổi trạng thái tour
     * PATCH /api/admin/tours/:id/status
     */
    static async updateTourStatus(tourId, status) {
        try {
            const response = await apiClient.patch(`/admin/tours/${tourId}/status`, {
                status,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy thống kê chi tiết tour
     * GET /api/admin/tours/:id/stats
     */
    static async getTourStats(tourId) {
        try {
            const response = await apiClient.get(`/admin/tours/${tourId}/stats`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // =====================================================
    // QUẢN LÝ BOOKINGS
    // =====================================================

    /**
     * Lấy danh sách bookings
     * GET /api/admin/bookings
     */
    static async getAllBookings(filters = {}) {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach((key) => {
                if (filters[key] !== null && filters[key] !== undefined) {
                    params.append(key, filters[key]);
                }
            });

            const response = await apiClient.get(`/admin/bookings?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy chi tiết booking
     * GET /api/admin/bookings/:id
     */
    static async getBookingById(bookingId) {
        try {
            const response = await apiClient.get(`/admin/bookings/${bookingId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Cập nhật trạng thái booking
     * PATCH /api/admin/bookings/:id/status
     */
    static async updateBookingStatus(bookingId, status) {
        try {
            const response = await apiClient.patch(`/admin/bookings/${bookingId}/status`, {
                status,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Cập nhật trạng thái thanh toán booking
     * PATCH /api/admin/bookings/:id/payment-status
     */
    static async updateBookingPaymentStatus(bookingId, paymentStatus) {
        try {
            const response = await apiClient.patch(`/admin/bookings/${bookingId}/payment-status`, {
                paymentStatus,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Xóa booking
     * DELETE /api/admin/bookings/:id
     */
    static async deleteBooking(bookingId) {
        try {
            const response = await apiClient.delete(`/admin/bookings/${bookingId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // =====================================================
    // QUẢN LÝ PAYMENTS
    // =====================================================

    /**
     * Lấy danh sách payments
     * GET /api/admin/payments
     */
    static async getAllPayments(filters = {}) {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach((key) => {
                if (filters[key] !== null && filters[key] !== undefined) {
                    params.append(key, filters[key]);
                }
            });

            const response = await apiClient.get(`/admin/payments?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy chi tiết payment
     * GET /api/admin/payments/:id
     */
    static async getPaymentById(paymentId) {
        try {
            const response = await apiClient.get(`/admin/payments/${paymentId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Cập nhật trạng thái payment
     * PATCH /api/admin/payments/:id/status
     */
    static async updatePaymentStatus(paymentId, status) {
        try {
            const response = await apiClient.patch(`/admin/payments/${paymentId}/status`, {
                status,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy thống kê payment
     * GET /api/admin/payments/stats
     */
    static async getPaymentStats() {
        try {
            const response = await apiClient.get("/admin/payments/stats");
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // =====================================================
    // CATEGORIES
    // =====================================================

    /**
     * Lấy danh sách categories
     * GET /api/admin/categories
     */
    static async getAllCategories() {
        try {
            const response = await apiClient.get("/admin/categories");
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // =====================================================
    // ERROR HANDLER
    // =====================================================

    static handleError(error) {
        if (error.response) {
            // Server trả về lỗi
            const err = new Error(error.response.data.message || "Có lỗi xảy ra");
            err.status = error.response.status;
            err.isAuthError = error.response.status === 401 || error.response.status === 403;
            return err;
        } else if (error.request) {
            // Request được gửi nhưng không nhận được response
            const err = new Error("Không thể kết nối đến server");
            err.status = 0;
            return err;
        } else {
            // Lỗi khác
            const err = new Error(error.message || "Có lỗi xảy ra");
            return err;
        }
    }
}

export default AdminAPI;

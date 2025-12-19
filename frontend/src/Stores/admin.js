import { create } from "zustand";
import AdminAPI from "../Apis/admin";

const useAdminStore = create((set, get) => ({
    // =====================================================
    // STATE
    // =====================================================

    // Dashboard
    dashboardStats: null,
    revenueByMonth: [],
    topTours: [],

    // Tours
    tours: [],
    currentTour: null,
    tourStats: null,
    tourPagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },

    // Bookings
    bookings: [],
    currentBooking: null,
    bookingPagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },

    // Payments
    payments: [],
    currentPayment: null,
    paymentStats: null,
    paymentPagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },

    // Categories
    categories: [],

    // Loading & Error
    loading: false,
    error: null,

    // =====================================================
    // ACTIONS - THỐNG KÊ
    // =====================================================

    /**
     * Lấy thống kê dashboard
     */
    fetchDashboardStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getDashboardStats();
            set({
                dashboardStats: response.data,
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Lấy thống kê doanh thu theo tháng
     */
    fetchRevenueByMonth: async (year) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getRevenueByMonth(year);
            set({
                revenueByMonth: response.data,
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Lấy top tours
     */
    fetchTopTours: async (type = "revenue", limit = 10) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getTopTours(type, limit);
            set({
                topTours: response.data,
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // =====================================================
    // ACTIONS - QUẢN LÝ TOURS
    // =====================================================

    /**
     * Lấy danh sách tours
     */
    fetchTours: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getAllTours(filters);
            set({
                tours: response.data.tours,
                tourPagination: response.data.pagination,
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Lấy chi tiết tour
     */
    fetchTourById: async (tourId) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getTourById(tourId);
            set({
                currentTour: response.data,
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Tạo tour mới
     */
    createTour: async (tourData) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.createTour(tourData);

            // Refresh danh sách tours
            await get().fetchTours({ page: 1, limit: 10 });

            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Cập nhật tour
     */
    updateTour: async (tourId, tourData) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.updateTour(tourId, tourData);

            // Update current tour nếu đang xem
            if (get().currentTour?.tourId === tourId) {
                set({ currentTour: response.data });
            }

            // Refresh danh sách tours
            await get().fetchTours({
                page: get().tourPagination.page,
                limit: get().tourPagination.limit,
            });

            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Xóa tour
     */
    deleteTour: async (tourId) => {
        set({ loading: true, error: null });
        try {
            await AdminAPI.deleteTour(tourId);

            // Xóa khỏi danh sách local
            set((state) => ({
                tours: state.tours.filter((tour) => tour.tourId !== tourId),
                loading: false,
            }));

            // Refresh danh sách
            await get().fetchTours({
                page: get().tourPagination.page,
                limit: get().tourPagination.limit,
            });

            return true;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Thay đổi trạng thái tour
     */
    updateTourStatus: async (tourId, status) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.updateTourStatus(tourId, status);

            // Update trong danh sách local
            set((state) => ({
                tours: state.tours.map((tour) =>
                    tour.tourId === tourId ? { ...tour, status } : tour
                ),
                loading: false,
            }));

            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Lấy thống kê chi tiết tour
     */
    fetchTourStats: async (tourId) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getTourStats(tourId);
            set({
                tourStats: response.data,
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // =====================================================
    // ACTIONS - QUẢN LÝ BOOKINGS
    // =====================================================

    /**
     * Lấy danh sách bookings
     */
    fetchBookings: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getAllBookings(filters);
            set({
                bookings: response.data.bookings,
                bookingPagination: response.data.pagination,
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Lấy chi tiết booking
     */
    fetchBookingById: async (bookingId) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getBookingById(bookingId);
            set({
                currentBooking: response.data,
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Cập nhật trạng thái booking
     */
    updateBookingStatus: async (bookingId, status) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.updateBookingStatus(bookingId, status);

            // Update trong danh sách local
            set((state) => ({
                bookings: state.bookings.map((booking) =>
                    booking.bookingId === bookingId ? { ...booking, status } : booking
                ),
                loading: false,
            }));

            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Cập nhật trạng thái thanh toán booking
     */
    updateBookingPaymentStatus: async (bookingId, paymentStatus) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.updateBookingPaymentStatus(bookingId, paymentStatus);

            // Update trong danh sách local
            set((state) => ({
                bookings: state.bookings.map((booking) =>
                    booking.bookingId === bookingId ? { ...booking, paymentStatus } : booking
                ),
                loading: false,
            }));

            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Xóa booking
     */
    deleteBooking: async (bookingId) => {
        set({ loading: true, error: null });
        try {
            await AdminAPI.deleteBooking(bookingId);

            // Xóa khỏi danh sách local
            set((state) => ({
                bookings: state.bookings.filter((booking) => booking.bookingId !== bookingId),
                loading: false,
            }));

            // Refresh danh sách
            await get().fetchBookings({
                page: get().bookingPagination.page,
                limit: get().bookingPagination.limit,
            });

            return true;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // =====================================================
    // ACTIONS - QUẢN LÝ PAYMENTS
    // =====================================================

    /**
     * Lấy danh sách payments
     */
    fetchPayments: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getAllPayments(filters);
            set({
                payments: response.data.payments,
                paymentPagination: response.data.pagination,
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Lấy chi tiết payment
     */
    fetchPaymentById: async (paymentId) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getPaymentById(paymentId);
            set({
                currentPayment: response.data,
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Cập nhật trạng thái payment
     */
    updatePaymentStatus: async (paymentId, status) => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.updatePaymentStatus(paymentId, status);

            // Update trong danh sách local
            set((state) => ({
                payments: state.payments.map((payment) =>
                    payment.paymentId === paymentId ? { ...payment, status } : payment
                ),
                loading: false,
            }));

            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    /**
     * Lấy thống kê payment
     */
    fetchPaymentStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getPaymentStats();
            set({
                paymentStats: response.data,
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // =====================================================
    // UTILITY ACTIONS
    // =====================================================

    /**
     * Clear error
     */
    clearError: () => set({ error: null }),

    /**
     * Clear current tour
     */
    clearCurrentTour: () => set({ currentTour: null }),

    /**
     * Clear current booking
     */
    clearCurrentBooking: () => set({ currentBooking: null }),

    /**
     * Clear current payment
     */
    clearCurrentPayment: () => set({ currentPayment: null }),

    /**
     * Reset store
     */
    reset: () =>
        set({
            dashboardStats: null,
            revenueByMonth: [],
            topTours: [],
            tours: [],
            currentTour: null,
            tourStats: null,
            tourPagination: {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
            },
            bookings: [],
            currentBooking: null,
            bookingPagination: {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
            },
            payments: [],
            currentPayment: null,
            paymentStats: null,
            paymentPagination: {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
            },
            categories: [],
            loading: false,
            error: null,
        }),

    // =====================================================
    // ACTIONS - CATEGORIES
    // =====================================================

    /**
     * Lấy danh sách categories
     */
    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const response = await AdminAPI.getAllCategories();
            set({
                categories: response.data || [],
                loading: false,
            });
        } catch (err) {
            set({
                error: err.message,
                loading: false,
            });
            throw err;
        }
    },
}));

export default useAdminStore;

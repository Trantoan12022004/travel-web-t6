import { create } from "zustand";
import * as bookingApi from "../Apis/booking";

const useBookingStore = create((set, get) => ({
    // State
    bookings: [],
    currentBooking: null,
    bookingStats: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },

    // Actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // ========== USER Actions ==========

    // Tạo booking mới
    createBooking: async (bookingData) => {
        set({ loading: true, error: null });
        try {
            const response = await bookingApi.createBooking(bookingData);
            const booking = response.data?.booking || response.booking || response.data;

            set((state) => ({
                bookings: [booking, ...state.bookings],
                currentBooking: booking,
                loading: false,
            }));
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to create booking", loading: false });
            throw error;
        }
    },

    // Lấy bookings của user
    fetchMyBookings: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await bookingApi.getMyBookings(params);

            // Debug: Log toàn bộ response
            console.log("Full API Response:", response);
            console.log("Response structure:", {
                hasSuccess: !!response.success,
                hasData: !!response.data,
                hasBookings: !!response.data?.bookings,
                bookingsType: Array.isArray(response.data?.bookings)
                    ? "array"
                    : typeof response.data?.bookings,
            });

            // Xử lý cấu trúc: { success: true, data: { bookings: [], pagination: {} } }
            let bookingsData = [];
            let paginationData = {};

            if (response.data && response.data.bookings) {
                // Cấu trúc: response.data.bookings
                bookingsData = Array.isArray(response.data.bookings) ? response.data.bookings : [];
                paginationData = response.data.pagination || {};
            } else if (response.bookings) {
                // Cấu trúc: response.bookings
                bookingsData = Array.isArray(response.bookings) ? response.bookings : [];
                paginationData = response.pagination || {};
            } else if (response.data && Array.isArray(response.data)) {
                // Cấu trúc: response.data là array
                bookingsData = response.data;
            } else if (Array.isArray(response)) {
                // Cấu trúc: response là array
                bookingsData = response;
            }

            console.log("Processed bookings:", bookingsData);
            console.log("Pagination:", paginationData);

            set({
                bookings: bookingsData,
                pagination: paginationData,
                loading: false,
            });

            return response;
        } catch (error) {
            console.error("Fetch bookings error:", error);
            set({
                error: error.message || "Failed to fetch bookings",
                loading: false,
                bookings: [],
            });
            throw error;
        }
    },

    // Lấy chi tiết booking
    fetchBookingById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await bookingApi.getBookingById(id);
            const booking = response.data?.booking || response.booking || response.data;

            set({
                currentBooking: booking,
                loading: false,
            });
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to fetch booking", loading: false });
            throw error;
        }
    },

    // Hủy booking
    cancelBooking: async (id, reason) => {
        set({ loading: true, error: null });
        try {
            const response = await bookingApi.cancelBooking(id, reason);

            set((state) => ({
                bookings: state.bookings.map((booking) =>
                    booking.bookingId === id || booking._id === id
                        ? { ...booking, status: "CANCELLED" }
                        : booking
                ),
                currentBooking:
                    state.currentBooking?.bookingId === id || state.currentBooking?._id === id
                        ? { ...state.currentBooking, status: "CANCELLED" }
                        : state.currentBooking,
                loading: false,
            }));
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to cancel booking", loading: false });
            throw error;
        }
    },

    // Tạo payment
    createPayment: async (id, paymentData) => {
        set({ loading: true, error: null });
        try {
            const response = await bookingApi.createPayment(id, paymentData);
            const booking = response.data?.booking || response.booking;

            set((state) => ({
                currentBooking: booking || state.currentBooking,
                loading: false,
            }));
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to create payment", loading: false });
            throw error;
        }
    },

    // ========== ADMIN Actions ==========

    // Lấy tất cả bookings (Admin)
    fetchAllBookings: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await bookingApi.getAllBookings(params);

            let bookingsData = [];
            let paginationData = {};

            if (response.data && response.data.bookings) {
                bookingsData = Array.isArray(response.data.bookings) ? response.data.bookings : [];
                paginationData = response.data.pagination || {};
            } else if (response.bookings) {
                bookingsData = Array.isArray(response.bookings) ? response.bookings : [];
                paginationData = response.pagination || {};
            } else if (response.data && Array.isArray(response.data)) {
                bookingsData = response.data;
            } else if (Array.isArray(response)) {
                bookingsData = response;
            }

            set({
                bookings: bookingsData,
                pagination: paginationData,
                loading: false,
            });
            return response;
        } catch (error) {
            set({
                error: error.message || "Failed to fetch all bookings",
                loading: false,
                bookings: [],
            });
            throw error;
        }
    },

    // Lấy thống kê (Admin)
    fetchBookingStats: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await bookingApi.getBookingStats(params);
            const stats = response.data?.stats || response.stats || response.data;

            set({
                bookingStats: stats,
                loading: false,
            });
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to fetch stats", loading: false });
            throw error;
        }
    },

    // Cập nhật trạng thái (Admin)
    updateBookingStatus: async (id, status) => {
        set({ loading: true, error: null });
        try {
            const response = await bookingApi.updateBookingStatus(id, status);

            set((state) => ({
                bookings: state.bookings.map((booking) =>
                    booking.bookingId === id || booking._id === id
                        ? { ...booking, status }
                        : booking
                ),
                currentBooking:
                    state.currentBooking?.bookingId === id || state.currentBooking?._id === id
                        ? { ...state.currentBooking, status }
                        : state.currentBooking,
                loading: false,
            }));
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to update status", loading: false });
            throw error;
        }
    },

    // Lấy tất cả bookings (Admin)
    getAllBookings: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await bookingApi.getAllBookings(params);
            const bookingsData =
                response.data?.bookings || response.bookings || response.data || [];
            const paginationData = response.data?.pagination || response.pagination || {};

            set({
                bookings: Array.isArray(bookingsData) ? bookingsData : [],
                pagination: paginationData,
                loading: false,
            });
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to fetch all bookings", loading: false });
            throw error;
        }
    },

    // Reset store
    resetStore: () =>
        set({
            bookings: [],
            currentBooking: null,
            bookingStats: null,
            loading: false,
            error: null,
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
            },
        }),
}));

export default useBookingStore;

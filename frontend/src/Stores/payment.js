import { create } from "zustand";
import {
    createPayment,
    getPaymentsByBooking,
    getPaymentById,
    confirmPayment,
    cancelPayment,
    refundPayment,
    getPaymentStats,
} from "../Apis/payment";

const usePaymentStore = create((set, get) => ({
    // State
    payments: [],
    currentPayment: null,
    paymentStats: null,
    loading: false,
    error: null,

    // Actions

    /**
     * Tạo payment mới
     */
    createPayment: async (bookingId, paymentData) => {
        set({ loading: true, error: null });
        try {
            const response = await createPayment(bookingId, paymentData);
            if (response.success) {
                set((state) => ({
                    payments: [...state.payments, response.data.payment],
                    currentPayment: response.data.payment,
                    loading: false,
                }));
                return response.data.payment;
            }
        } catch (error) {
            set({
                error: error.message || "Không thể tạo payment",
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Lấy danh sách payments của booking
     */
    fetchPaymentsByBooking: async (bookingId) => {
        set({ loading: true, error: null });
        try {
            const response = await getPaymentsByBooking(bookingId);
            if (response.success) {
                set({
                    payments: response.data.payments,
                    loading: false,
                });
                return response.data.payments;
            }
        } catch (error) {
            set({
                error: error.message || "Không thể lấy danh sách payments",
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Lấy chi tiết payment
     */
    fetchPaymentById: async (paymentId) => {
        set({ loading: true, error: null });
        try {
            const response = await getPaymentById(paymentId);
            if (response.success) {
                set({
                    currentPayment: response.data.payment,
                    loading: false,
                });
                return response.data.payment;
            }
        } catch (error) {
            set({
                error: error.message || "Không thể lấy thông tin payment",
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Xác nhận thanh toán
     */
    confirmPayment: async (paymentId) => {
        set({ loading: true, error: null });
        try {
            const response = await confirmPayment(paymentId);
            if (response.success) {
                // Cập nhật payment trong state
                set((state) => ({
                    currentPayment: response.data.payment,
                    payments: state.payments.map((p) =>
                        p.paymentId === paymentId ? response.data.payment : p
                    ),
                    loading: false,
                }));
                return response.data;
            }
        } catch (error) {
            set({
                error: error.message || "Không thể xác nhận thanh toán",
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Hủy payment
     */
    cancelPayment: async (paymentId) => {
        set({ loading: true, error: null });
        try {
            const response = await cancelPayment(paymentId);
            if (response.success) {
                set((state) => ({
                    currentPayment: response.data.payment,
                    payments: state.payments.map((p) =>
                        p.paymentId === paymentId ? response.data.payment : p
                    ),
                    loading: false,
                }));
                return response.data.payment;
            }
        } catch (error) {
            set({
                error: error.message || "Không thể hủy payment",
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Hoàn tiền (Admin)
     */
    refundPayment: async (paymentId) => {
        set({ loading: true, error: null });
        try {
            const response = await refundPayment(paymentId);
            if (response.success) {
                set({ loading: false });
                return response.data;
            }
        } catch (error) {
            set({
                error: error.message || "Không thể hoàn tiền",
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Lấy thống kê payments (Admin)
     */
    fetchPaymentStats: async (startDate, endDate) => {
        set({ loading: true, error: null });
        try {
            const response = await getPaymentStats(startDate, endDate);
            if (response.success) {
                set({
                    paymentStats: response.data.stats,
                    loading: false,
                });
                return response.data.stats;
            }
        } catch (error) {
            set({
                error: error.message || "Không thể lấy thống kê",
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Clear error
     */
    clearError: () => set({ error: null }),

    /**
     * Reset store
     */
    reset: () =>
        set({
            payments: [],
            currentPayment: null,
            paymentStats: null,
            loading: false,
            error: null,
        }),
}));

export default usePaymentStore;

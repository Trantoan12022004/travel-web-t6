const paymentService = require("../services/paymentsService");

class PaymentController {
    /**
     * Tạo payment mới
     * POST /api/payments/bookings/:bookingId
     */
    async createPayment(req, res) {
        try {
            const { bookingId } = req.params;
            const userId = req.user.userId;
            const { method } = req.body;

            // Validate method
            const validMethods = ["BANK_TRANSFER", "CREDIT_CARD", "CASH", "E_WALLET"];
            if (!validMethods.includes(method)) {
                return res.status(400).json({
                    success: false,
                    message: "Phương thức thanh toán không hợp lệ",
                });
            }

            const payment = await paymentService.createPayment(bookingId, {
                method,
                userId,
            });

            res.status(201).json({
                success: true,
                message: "Tạo payment thành công",
                data: { payment },
            });
        } catch (error) {
            console.error("Create payment error:", error);
            res.status(400).json({
                success: false,
                message: error.message || "Không thể tạo payment",
            });
        }
    }

    /**
     * Xác nhận thanh toán
     * POST /api/payments/:paymentId/confirm
     */
    async confirmPayment(req, res) {
        try {
            const { paymentId } = req.params;
            const userId = req.user.userId;

            const result = await paymentService.confirmPayment(paymentId, userId);

            res.json({
                success: true,
                message: "Xác nhận thanh toán thành công",
                data: result,
            });
        } catch (error) {
            console.error("Confirm payment error:", error);
            res.status(400).json({
                success: false,
                message: error.message || "Không thể xác nhận thanh toán",
            });
        }
    }

    /**
     * Hủy payment
     * POST /api/payments/:paymentId/cancel
     */
    async cancelPayment(req, res) {
        try {
            const { paymentId } = req.params;
            const userId = req.user.userId;

            const payment = await paymentService.cancelPayment(paymentId, userId);

            res.json({
                success: true,
                message: "Hủy payment thành công",
                data: { payment },
            });
        } catch (error) {
            console.error("Cancel payment error:", error);
            res.status(400).json({
                success: false,
                message: error.message || "Không thể hủy payment",
            });
        }
    }

    /**
     * Lấy danh sách payments của booking
     * GET /api/payments/bookings/:bookingId
     */
    async getPaymentsByBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const userId = req.user.userId;

            const payments = await paymentService.getPaymentsByBooking(bookingId, userId);

            res.json({
                success: true,
                data: { payments },
            });
        } catch (error) {
            console.error("Get payments error:", error);
            res.status(400).json({
                success: false,
                message: error.message || "Không thể lấy danh sách payments",
            });
        }
    }

    /**
     * Lấy chi tiết payment
     * GET /api/payments/:paymentId
     */
    async getPaymentById(req, res) {
        try {
            const { paymentId } = req.params;
            const userId = req.user.userId;

            const payment = await paymentService.getPaymentById(paymentId, userId);

            res.json({
                success: true,
                data: { payment },
            });
        } catch (error) {
            console.error("Get payment error:", error);
            res.status(400).json({
                success: false,
                message: error.message || "Không thể lấy thông tin payment",
            });
        }
    }

    /**
     * Xử lý webhook từ payment gateway
     * POST /api/payments/webhook
     */
    async handleWebhook(req, res) {
        try {
            const webhookData = req.body;

            const result = await paymentService.handlePaymentWebhook(webhookData);

            res.json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            console.error("Webhook error:", error);
            res.status(400).json({
                success: false,
                message: error.message || "Webhook processing failed",
            });
        }
    }

    /**
     * Hoàn tiền (Admin only)
     * POST /api/payments/:paymentId/refund
     */
    async refundPayment(req, res) {
        try {
            const { paymentId } = req.params;
            const adminUserId = req.user.userId;

            // Kiểm tra quyền admin
            if (req.user.role !== "ADMIN") {
                return res.status(403).json({
                    success: false,
                    message: "Bạn không có quyền thực hiện thao tác này",
                });
            }

            const result = await paymentService.refundPayment(paymentId, adminUserId);

            res.json({
                success: true,
                message: "Hoàn tiền thành công",
                data: result,
            });
        } catch (error) {
            console.error("Refund error:", error);
            res.status(400).json({
                success: false,
                message: error.message || "Không thể hoàn tiền",
            });
        }
    }

    /**
     * Lấy thống kê payments (Admin only)
     * GET /api/payments/stats
     */
    async getPaymentStats(req, res) {
        try {
            // Kiểm tra quyền admin
            if (req.user.role !== "ADMIN") {
                return res.status(403).json({
                    success: false,
                    message: "Bạn không có quyền xem thống kê",
                });
            }

            const { startDate, endDate } = req.query;

            const stats = await paymentService.getPaymentStats(startDate, endDate);

            res.json({
                success: true,
                data: { stats },
            });
        } catch (error) {
            console.error("Get stats error:", error);
            res.status(400).json({
                success: false,
                message: error.message || "Không thể lấy thống kê",
            });
        }
    }
}

module.exports = new PaymentController();

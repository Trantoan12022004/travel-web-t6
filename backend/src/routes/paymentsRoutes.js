const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentsController");
const { authMiddleware } = require("../middlewares/authMiddleware");

/**
 * @route   POST /api/payments/bookings/:bookingId
 * @desc    Tạo payment mới cho booking
 * @access  Private
 */
router.post("/bookings/:bookingId", authMiddleware, paymentController.createPayment);

/**
 * @route   GET /api/payments/bookings/:bookingId
 * @desc    Lấy danh sách payments của booking
 * @access  Private
 */
router.get("/bookings/:bookingId", authMiddleware, paymentController.getPaymentsByBooking);

/**
 * @route   GET /api/payments/:paymentId
 * @desc    Lấy chi tiết payment
 * @access  Private
 */
router.get("/:paymentId", authMiddleware, paymentController.getPaymentById);

/**
 * @route   POST /api/payments/:paymentId/confirm
 * @desc    Xác nhận thanh toán thành công
 * @access  Private
 */
router.post("/:paymentId/confirm", authMiddleware, paymentController.confirmPayment);

/**
 * @route   POST /api/payments/:paymentId/cancel
 * @desc    Hủy payment
 * @access  Private
 */
router.post("/:paymentId/cancel", authMiddleware, paymentController.cancelPayment);

/**
 * @route   POST /api/payments/:paymentId/refund
 * @desc    Hoàn tiền (Admin only)
 * @access  Private (Admin)
 */
router.post("/:paymentId/refund", authMiddleware, paymentController.refundPayment);

/**
 * @route   POST /api/payments/webhook
 * @desc    Xử lý webhook từ payment gateway
 * @access  Public (nhưng cần verify signature)
 */
router.post("/webhook", paymentController.handleWebhook);

/**
 * @route   GET /api/payments/stats
 * @desc    Lấy thống kê payments (Admin)
 * @access  Private (Admin)
 */
router.get("/stats", authMiddleware, paymentController.getPaymentStats);

module.exports = router;

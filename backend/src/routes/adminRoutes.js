const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

// =====================================================
// MIDDLEWARE: Tất cả routes yêu cầu ADMIN role
// =====================================================
router.use(authMiddleware);
router.use(adminMiddleware);

// =====================================================
// THỐNG KÊ
// =====================================================

// Dashboard tổng quan
router.get("/dashboard", AdminController.getDashboard);

// Thống kê doanh thu theo tháng
router.get("/stats/revenue", AdminController.getRevenueStats);

// Top tours
router.get("/stats/top-tours", AdminController.getTopTours);

// =====================================================
// QUẢN LÝ TOURS
// =====================================================

// Lấy danh sách tours
router.get("/tours", AdminController.getAllTours);

// Lấy chi tiết tour
router.get("/tours/:id", AdminController.getTourById);

// Tạo tour mới
router.post("/tours", AdminController.createTour);

// Cập nhật tour
router.put("/tours/:id", AdminController.updateTour);

// Xóa tour
router.delete("/tours/:id", AdminController.deleteTour);

// Thay đổi trạng thái tour
router.patch("/tours/:id/status", AdminController.updateTourStatus);

// Thống kê chi tiết 1 tour
router.get("/tours/:id/stats", AdminController.getTourStats);

// =====================================================
// QUẢN LÝ BOOKINGS
// =====================================================

// Lấy danh sách bookings
router.get("/bookings", AdminController.getAllBookings);

// Lấy chi tiết booking
router.get("/bookings/:id", AdminController.getBookingById);

// Cập nhật trạng thái booking
router.patch("/bookings/:id/status", AdminController.updateBookingStatus);

// Cập nhật trạng thái thanh toán booking
router.patch("/bookings/:id/payment-status", AdminController.updateBookingPaymentStatus);

// Xóa booking
router.delete("/bookings/:id", AdminController.deleteBooking);

// =====================================================
// QUẢN LÝ PAYMENTS
// =====================================================

// Thống kê payment
router.get("/payments/stats", AdminController.getPaymentStats);

// Lấy danh sách payments
router.get("/payments", AdminController.getAllPayments);

// Lấy chi tiết payment
router.get("/payments/:id", AdminController.getPaymentById);

// Cập nhật trạng thái payment
router.patch("/payments/:id/status", AdminController.updatePaymentStatus);

// =====================================================
// QUẢN LÝ CATEGORIES
// =====================================================

// Lấy danh sách categories
router.get("/categories", AdminController.getAllCategories);

module.exports = router;

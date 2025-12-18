const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingsController");
const { adminMiddleware, authMiddleware } = require("../middlewares/authMiddleware");

// ========== USER ROUTES ==========
// Tạo booking mới
router.post("/", authMiddleware, bookingController.createBooking);
// Lấy bookings của user hiện tại
router.get("/my-bookings", authMiddleware, bookingController.getMyBookings);

// Lấy chi tiết booking
router.get("/:id", authMiddleware, bookingController.getBookingById);

// Hủy booking
router.patch("/:id/cancel", authMiddleware, bookingController.cancelBooking);

// Tạo payment cho booking
router.post("/:id/payment", authMiddleware, bookingController.createPayment);

// ========== ADMIN ROUTES ==========
// Lấy tất cả bookings
router.get("/admin/all", authMiddleware, adminMiddleware, bookingController.getAllBookings);

// Thống kê booking
router.get("/admin/stats", authMiddleware, adminMiddleware, bookingController.getBookingStats);

// Cập nhật trạng thái booking
router.patch(
    "/admin/:id/status",
    authMiddleware,
    adminMiddleware,
    bookingController.updateBookingStatus
);

module.exports = router;

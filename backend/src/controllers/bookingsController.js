const bookingService = require("../services/bookingsService");

class BookingController {
    // Tạo booking mới
    async createBooking(req, res) {
        try {
            const userId = req.user.userId;
            const booking = await bookingService.createBooking(userId, req.body);

            res.status(201).json({
                success: true,
                message: "Booking created successfully",
                data: booking,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Lấy bookings của user hiện tại
    async getMyBookings(req, res) {
        try {
            const userId = req.user.userId;
            const result = await bookingService.getUserBookings(userId, req.query);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Lấy chi tiết booking
    async getBookingById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.role === "ADMIN" ? null : req.user.userId;
            const booking = await bookingService.getBookingById(id, userId);

            res.json({
                success: true,
                data: booking,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Hủy booking
    async cancelBooking(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const booking = await bookingService.cancelBooking(id, userId);

            res.json({
                success: true,
                message: "Booking cancelled successfully",
                data: booking,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Tạo payment cho booking
    async createPayment(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.role === "ADMIN" ? null : req.user.userId;
            const payment = await bookingService.createPayment(id, req.body, userId);

            res.status(201).json({
                success: true,
                message: "Payment created successfully",
                data: payment,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ========== ADMIN ENDPOINTS ==========

    // Lấy tất cả bookings
    async getAllBookings(req, res) {
        try {
            const result = await bookingService.getAllBookings(req.query);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Cập nhật trạng thái booking
    async updateBookingStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const booking = await bookingService.updateBookingStatus(id, status);

            res.json({
                success: true,
                message: "Booking status updated",
                data: booking,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Thống kê booking
    async getBookingStats(req, res) {
        try {
            const stats = await bookingService.getBookingStats();

            res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new BookingController();

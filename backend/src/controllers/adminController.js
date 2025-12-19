const AdminService = require("../services/adminService");

class AdminController {
    // =====================================================
    // THỐNG KÊ
    // =====================================================

    /**
     * GET /api/admin/dashboard
     */
    static async getDashboard(req, res, next) {
        try {
            const stats = await AdminService.getDashboardStats();

            res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/admin/stats/revenue?year=2024
     */
    static async getRevenueStats(req, res, next) {
        try {
            const { year } = req.query;
            const revenue = await AdminService.getRevenueByMonth(year ? parseInt(year) : undefined);

            res.json({
                success: true,
                data: revenue,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/admin/stats/top-tours
     */
    static async getTopTours(req, res, next) {
        try {
            const { type = "revenue", limit = 10 } = req.query;

            let tours;
            if (type === "revenue") {
                tours = await AdminService.getTopToursByRevenue(parseInt(limit));
            } else {
                tours = await AdminService.getTopToursByRating(parseInt(limit));
            }

            res.json({
                success: true,
                data: tours,
            });
        } catch (error) {
            next(error);
        }
    }

    // =====================================================
    // QUẢN LÝ TOURS
    // =====================================================

    /**
     * GET /api/admin/tours
     */
    static async getAllTours(req, res, next) {
        try {
            const result = await AdminService.getAllTours(req.query);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/admin/tours/:id
     */
    static async getTourById(req, res, next) {
        try {
            const tour = await AdminService.getTourById(req.params.id);

            res.json({
                success: true,
                data: tour,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/admin/tours
     */
    static async createTour(req, res, next) {
        try {
            const tour = await AdminService.createTour(req.body);

            res.status(201).json({
                success: true,
                message: "Tạo tour thành công",
                data: tour,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/admin/tours/:id
     */
    static async updateTour(req, res, next) {
        try {
            const tour = await AdminService.updateTour(req.params.id, req.body);

            res.json({
                success: true,
                message: "Cập nhật tour thành công",
                data: tour,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/admin/tours/:id
     */
    static async deleteTour(req, res, next) {
        try {
            await AdminService.deleteTour(req.params.id);

            res.json({
                success: true,
                message: "Xóa tour thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/admin/tours/:id/status
     */
    static async updateTourStatus(req, res, next) {
        try {
            const { status } = req.body;
            const tour = await AdminService.updateTourStatus(req.params.id, status);

            res.json({
                success: true,
                message: "Cập nhật trạng thái thành công",
                data: tour,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/admin/tours/:id/stats
     */
    static async getTourStats(req, res, next) {
        try {
            const stats = await AdminService.getTourStats(req.params.id);

            res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }

    // =====================================================
    // QUẢN LÝ BOOKINGS
    // =====================================================

    /**
     * GET /api/admin/bookings
     */
    static async getAllBookings(req, res, next) {
        try {
            const result = await AdminService.getAllBookings(req.query);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/admin/bookings/:id
     */
    static async getBookingById(req, res, next) {
        try {
            const booking = await AdminService.getBookingById(req.params.id);

            res.json({
                success: true,
                data: booking,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/admin/bookings/:id/status
     */
    static async updateBookingStatus(req, res, next) {
        try {
            const { status } = req.body;
            const booking = await AdminService.updateBookingStatus(req.params.id, status);

            res.json({
                success: true,
                message: "Cập nhật trạng thái booking thành công",
                data: booking,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/admin/bookings/:id/payment-status
     */
    static async updateBookingPaymentStatus(req, res, next) {
        try {
            const { paymentStatus } = req.body;
            const booking = await AdminService.updateBookingPaymentStatus(
                req.params.id,
                paymentStatus
            );

            res.json({
                success: true,
                message: "Cập nhật trạng thái thanh toán thành công",
                data: booking,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/admin/bookings/:id
     */
    static async deleteBooking(req, res, next) {
        try {
            await AdminService.deleteBooking(req.params.id);

            res.json({
                success: true,
                message: "Xóa booking thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    // =====================================================
    // QUẢN LÝ PAYMENTS
    // =====================================================

    /**
     * GET /api/admin/payments
     */
    static async getAllPayments(req, res, next) {
        try {
            const result = await AdminService.getAllPayments(req.query);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/admin/payments/:id
     */
    static async getPaymentById(req, res, next) {
        try {
            const payment = await AdminService.getPaymentById(req.params.id);

            res.json({
                success: true,
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/admin/payments/:id/status
     */
    static async updatePaymentStatus(req, res, next) {
        try {
            const { status } = req.body;
            const payment = await AdminService.updatePaymentStatus(req.params.id, status);

            res.json({
                success: true,
                message: "Cập nhật trạng thái payment thành công",
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/admin/payments/stats
     */
    static async getPaymentStats(req, res, next) {
        try {
            const stats = await AdminService.getPaymentStats();

            res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }

    // =====================================================
    // QUẢN LÝ CATEGORIES
    // =====================================================

    /**
     * GET /api/admin/categories
     */
    static async getAllCategories(req, res, next) {
        try {
            const categories = await AdminService.getAllCategories();

            res.json({
                success: true,
                data: categories,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AdminController;

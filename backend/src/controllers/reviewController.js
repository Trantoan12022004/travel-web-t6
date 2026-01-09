const reviewService = require("../services/reviewService");

class ReviewController {
    // Tạo review mới
    async createReview(req, res) {
        try {
            const userId = req.user.userId;
            const { tourId } = req.params;
            const { rating, comment } = req.body;

            // Validate
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: "Rating phải từ 1 đến 5",
                });
            }

            const review = await reviewService.createReview(userId, tourId, rating, comment);

            res.status(201).json({
                success: true,
                message: "Tạo review thành công",
                data: review,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Lấy danh sách review của tour
    async getReviewsByTour(req, res) {
        try {
            const { tourId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const result = await reviewService.getReviewsByTour(
                tourId,
                parseInt(page),
                parseInt(limit)
            );

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Lấy review của user cho một tour
    async getUserReviewForTour(req, res) {
        try {
            const userId = req.user.userId;
            const { tourId } = req.params;

            const review = await reviewService.getUserReviewForTour(userId, tourId);

            res.json({
                success: true,
                data: review,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Lấy tất cả review của user
    async getMyReviews(req, res) {
        try {
            const userId = req.user.userId;
            const { page = 1, limit = 10 } = req.query;

            const result = await reviewService.getReviewsByUser(
                userId,
                parseInt(page),
                parseInt(limit)
            );

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Cập nhật review
    async updateReview(req, res) {
        try {
            const userId = req.user.userId;
            const { reviewId } = req.params;
            const { rating, comment } = req.body;

            // Validate
            if (rating && (rating < 1 || rating > 5)) {
                return res.status(400).json({
                    success: false,
                    message: "Rating phải từ 1 đến 5",
                });
            }

            const review = await reviewService.updateReview(reviewId, userId, rating, comment);

            res.json({
                success: true,
                message: "Cập nhật review thành công",
                data: review,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Xóa review
    async deleteReview(req, res) {
        try {
            const userId = req.user.userId;
            const userRole = req.user.role;
            const { reviewId } = req.params;

            const result = await reviewService.deleteReview(reviewId, userId, userRole);

            res.json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Ẩn/hiện review (admin only)
    async toggleReviewStatus(req, res) {
        try {
            const { reviewId } = req.params;
            const { status } = req.body;

            if (!["VISIBLE", "HIDDEN"].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Status không hợp lệ",
                });
            }

            const review = await reviewService.toggleReviewStatus(reviewId, status);

            res.json({
                success: true,
                message: "Cập nhật trạng thái review thành công",
                data: review,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Lấy thống kê rating của tour
    async getTourRatingStats(req, res) {
        try {
            const { tourId } = req.params;

            const stats = await reviewService.getTourRatingStats(tourId);

            res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new ReviewController();

const prisma = require("../config/prisma");

class ReviewService {
    // Tạo review mới
    async createReview(userId, tourId, rating, comment) {
        // Kiểm tra user đã review tour này chưa
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_tourId: {
                    userId,
                    tourId: parseInt(tourId),
                },
            },
        });

        if (existingReview) {
            throw new Error("Bạn đã review tour này rồi");
        }

        // Kiểm tra tour có tồn tại không
        const tour = await prisma.tour.findUnique({
            where: { tourId: parseInt(tourId) },
        });

        if (!tour) {
            throw new Error("Tour không tồn tại");
        }

        // Tạo review
        const review = await prisma.review.create({
            data: {
                userId,
                tourId: parseInt(tourId),
                rating: parseInt(rating),
                comment,
            },
            include: {
                user: {
                    select: {
                        userId: true,
                        userName: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // Cập nhật rating trung bình của tour
        await this.updateTourRating(parseInt(tourId));

        return review;
    }

    // Lấy danh sách review của một tour
    async getReviewsByTour(tourId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: {
                    tourId: parseInt(tourId),
                    status: "VISIBLE",
                },
                include: {
                    user: {
                        select: {
                            userId: true,
                            userName: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma.review.count({
                where: {
                    tourId: parseInt(tourId),
                    status: "VISIBLE",
                },
            }),
        ]);

        return {
            reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Lấy review của user cho một tour
    async getUserReviewForTour(userId, tourId) {
        const review = await prisma.review.findUnique({
            where: {
                userId_tourId: {
                    userId,
                    tourId: parseInt(tourId),
                },
            },
            include: {
                user: {
                    select: {
                        userId: true,
                        userName: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return review;
    }

    // Lấy tất cả review của user
    async getReviewsByUser(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: {
                    userId,
                },
                include: {
                    tour: {
                        select: {
                            tourId: true,
                            title: true,
                            coverImage: true,
                            location: true,
                            price: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma.review.count({
                where: {
                    userId,
                },
            }),
        ]);

        return {
            reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Cập nhật review
    async updateReview(reviewId, userId, rating, comment) {
        const review = await prisma.review.findUnique({
            where: { reviewId: parseInt(reviewId) },
        });

        if (!review) {
            throw new Error("Review không tồn tại");
        }

        if (review.userId !== userId) {
            throw new Error("Bạn không có quyền cập nhật review này");
        }

        const updatedReview = await prisma.review.update({
            where: { reviewId: parseInt(reviewId) },
            data: {
                rating: rating ? parseInt(rating) : review.rating,
                comment: comment !== undefined ? comment : review.comment,
            },
            include: {
                user: {
                    select: {
                        userId: true,
                        userName: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // Cập nhật rating trung bình của tour
        await this.updateTourRating(review.tourId);

        return updatedReview;
    }

    // Xóa review
    async deleteReview(reviewId, userId, userRole) {
        const review = await prisma.review.findUnique({
            where: { reviewId: parseInt(reviewId) },
        });

        if (!review) {
            throw new Error("Review không tồn tại");
        }

        // Chỉ chủ review hoặc admin mới có quyền xóa
        if (review.userId !== userId && userRole !== "ADMIN") {
            throw new Error("Bạn không có quyền xóa review này");
        }

        await prisma.review.delete({
            where: { reviewId: parseInt(reviewId) },
        });

        // Cập nhật rating trung bình của tour
        await this.updateTourRating(review.tourId);

        return { message: "Xóa review thành công" };
    }

    // Ẩn/hiện review (admin only)
    async toggleReviewStatus(reviewId, status) {
        const review = await prisma.review.update({
            where: { reviewId: parseInt(reviewId) },
            data: {
                status,
            },
        });

        // Cập nhật rating trung bình của tour
        await this.updateTourRating(review.tourId);

        return review;
    }

    // Cập nhật rating trung bình của tour
    async updateTourRating(tourId) {
        const stats = await prisma.review.aggregate({
            where: {
                tourId: parseInt(tourId),
                status: "VISIBLE",
            },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        await prisma.tour.update({
            where: { tourId: parseInt(tourId) },
            data: {
                ratingAvg: stats._avg.rating || 0,
                ratingCount: stats._count.rating || 0,
            },
        });
    }

    // Lấy thống kê rating của tour
    async getTourRatingStats(tourId) {
        const stats = await prisma.review.groupBy({
            by: ["rating"],
            where: {
                tourId: parseInt(tourId),
                status: "VISIBLE",
            },
            _count: {
                rating: true,
            },
        });

        const ratingDistribution = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };

        stats.forEach((stat) => {
            ratingDistribution[stat.rating] = stat._count.rating;
        });

        const total = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
        const average =
            total > 0
                ? Object.entries(ratingDistribution).reduce(
                      (sum, [rating, count]) => sum + parseInt(rating) * count,
                      0
                  ) / total
                : 0;

        return {
            average: parseFloat(average.toFixed(2)),
            total,
            distribution: ratingDistribution,
        };
    }
}

module.exports = new ReviewService();

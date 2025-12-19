const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AdminService {
    // =====================================================
    // THỐNG KÊ TỔNG QUAN
    // =====================================================

    /**
     * Lấy thống kê tổng quan
     */
    static async getDashboardStats() {
        const [
            totalTours,
            activeTours,
            totalBookings,
            totalRevenue,
            pendingBookings,
            totalUsers,
            totalReviews,
            avgRating,
        ] = await Promise.all([
            // Tổng số tours
            prisma.tour.count(),

            // Số tours đang active
            prisma.tour.count({ where: { status: "ACTIVE" } }),

            // Tổng số bookings
            prisma.booking.count(),

            // Tổng doanh thu
            prisma.booking.aggregate({
                where: { paymentStatus: "PAID" },
                _sum: { totalPrice: true },
            }),

            // Bookings chờ xác nhận
            prisma.booking.count({ where: { status: "PENDING" } }),

            // Tổng số users
            prisma.user.count(),

            // Tổng số reviews
            prisma.review.count(),

            // Rating trung bình
            prisma.review.aggregate({
                _avg: { rating: true },
            }),
        ]);

        return {
            totalTours,
            activeTours,
            inactiveTours: totalTours - activeTours,
            totalBookings,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            pendingBookings,
            totalUsers,
            totalReviews,
            avgRating: avgRating._avg.rating || 0,
        };
    }

    /**
     * Thống kê doanh thu theo tháng
     */
    static async getRevenueByMonth(year = new Date().getFullYear()) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const bookings = await prisma.booking.findMany({
            where: {
                paymentStatus: "PAID",
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                createdAt: true,
                totalPrice: true,
            },
        });

        // Group by month
        const revenueByMonth = Array(12).fill(0);
        bookings.forEach((booking) => {
            const month = booking.createdAt.getMonth();
            revenueByMonth[month] += parseFloat(booking.totalPrice);
        });

        return revenueByMonth.map((revenue, index) => ({
            month: index + 1,
            revenue,
        }));
    }

    /**
     * Top tours theo doanh thu
     */
    static async getTopToursByRevenue(limit = 10) {
        const tours = await prisma.tour.findMany({
            include: {
                bookings: {
                    where: { paymentStatus: "PAID" },
                    select: { totalPrice: true },
                },
            },
        });

        const toursWithRevenue = tours.map((tour) => ({
            tourId: tour.tourId,
            title: tour.title,
            totalRevenue: tour.bookings.reduce(
                (sum, booking) => sum + parseFloat(booking.totalPrice),
                0
            ),
            totalBookings: tour.bookings.length,
        }));

        return toursWithRevenue.sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, limit);
    }

    /**
     * Top tours theo rating
     */
    static async getTopToursByRating(limit = 10) {
        return await prisma.tour.findMany({
            where: {
                ratingCount: { gt: 0 },
            },
            orderBy: [{ ratingAvg: "desc" }, { ratingCount: "desc" }],
            take: limit,
            select: {
                tourId: true,
                title: true,
                ratingAvg: true,
                ratingCount: true,
                coverImage: true,
                price: true,
            },
        });
    }

    // =====================================================
    // QUẢN LÝ TOURS - CRUD
    // =====================================================

    /**
     * Lấy danh sách tours (Admin)
     */
    static async getAllTours({
        page = 1,
        limit = 10,
        status,
        categoryId,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
    }) {
        const skip = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;
        if (categoryId) where.categoryId = parseInt(categoryId);
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
            ];
        }

        const [tours, total] = await Promise.all([
            prisma.tour.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    category: true,
                    _count: {
                        select: {
                            bookings: true,
                            reviews: true,
                        },
                    },
                },
            }),
            prisma.tour.count({ where }),
        ]);

        return {
            tours,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Lấy chi tiết tour (Admin)
     */
    static async getTourById(tourId) {
        const tour = await prisma.tour.findUnique({
            where: { tourId: parseInt(tourId) },
            include: {
                category: true,
                images: true,
                schedules: {
                    orderBy: { dayNumber: "asc" },
                },
                _count: {
                    select: {
                        bookings: true,
                        reviews: true,
                    },
                },
            },
        });

        if (!tour) {
            throw new Error("Tour không tồn tại");
        }

        return tour;
    }

    /**
     * Tạo tour mới
     */
    static async createTour(data) {
        const { images, schedules, ...tourData } = data;

        const tour = await prisma.tour.create({
            data: {
                ...tourData,
                price: parseFloat(tourData.price),
                categoryId: tourData.categoryId ? parseInt(tourData.categoryId) : null,
                images: images
                    ? {
                          create: images.map((img, index) => ({
                              imageUrl: img.imageUrl,
                              isCover: index === 0,
                          })),
                      }
                    : undefined,
                schedules: schedules
                    ? {
                          create: schedules.map((schedule) => ({
                              dayNumber: parseInt(schedule.dayNumber),
                              title: schedule.title,
                              description: schedule.description,
                              image: schedule.image,
                          })),
                      }
                    : undefined,
            },
            include: {
                category: true,
                images: true,
                schedules: true,
            },
        });

        return tour;
    }

    /**
     * Cập nhật tour
     */
    static async updateTour(tourId, data) {
        const { images, schedules, ...tourData } = data;

        // Xóa images và schedules cũ nếu có data mới
        if (images) {
            await prisma.tourImage.deleteMany({
                where: { tourId: parseInt(tourId) },
            });
        }

        if (schedules) {
            await prisma.tourSchedule.deleteMany({
                where: { tourId: parseInt(tourId) },
            });
        }

        // Update tour
        const tour = await prisma.tour.update({
            where: { tourId: parseInt(tourId) },
            data: {
                ...tourData,
                price: tourData.price ? parseFloat(tourData.price) : undefined,
                categoryId: tourData.categoryId ? parseInt(tourData.categoryId) : undefined,
                images: images
                    ? {
                          create: images.map((img, index) => ({
                              imageUrl: img.imageUrl,
                              isCover: index === 0,
                          })),
                      }
                    : undefined,
                schedules: schedules
                    ? {
                          create: schedules.map((schedule) => ({
                              dayNumber: parseInt(schedule.dayNumber),
                              title: schedule.title,
                              description: schedule.description,
                              image: schedule.image,
                          })),
                      }
                    : undefined,
            },
            include: {
                category: true,
                images: true,
                schedules: true,
            },
        });

        return tour;
    }

    /**
     * Xóa tour
     */
    static async deleteTour(tourId) {
        // Kiểm tra xem tour có booking không
        const bookingCount = await prisma.booking.count({
            where: { tourId: parseInt(tourId) },
        });

        if (bookingCount > 0) {
            throw new Error(
                "Không thể xóa tour đã có booking. Vui lòng chuyển sang trạng thái INACTIVE."
            );
        }

        await prisma.tour.delete({
            where: { tourId: parseInt(tourId) },
        });

        return true;
    }

    /**
     * Thay đổi trạng thái tour
     */
    static async updateTourStatus(tourId, status) {
        const tour = await prisma.tour.update({
            where: { tourId: parseInt(tourId) },
            data: { status },
        });

        return tour;
    }

    /**
     * Thống kê chi tiết của 1 tour
     */
    static async getTourStats(tourId) {
        const [tour, totalBookings, totalRevenue, completedBookings, avgRating, bookingsByMonth] =
            await Promise.all([
                prisma.tour.findUnique({
                    where: { tourId: parseInt(tourId) },
                    select: {
                        tourId: true,
                        title: true,
                        price: true,
                        status: true,
                    },
                }),

                prisma.booking.count({
                    where: { tourId: parseInt(tourId) },
                }),

                prisma.booking.aggregate({
                    where: {
                        tourId: parseInt(tourId),
                        paymentStatus: "PAID",
                    },
                    _sum: { totalPrice: true },
                }),

                prisma.booking.count({
                    where: {
                        tourId: parseInt(tourId),
                        status: "COMPLETED",
                    },
                }),

                prisma.review.aggregate({
                    where: { tourId: parseInt(tourId) },
                    _avg: { rating: true },
                    _count: true,
                }),

                prisma.booking.groupBy({
                    by: ["createdAt"],
                    where: { tourId: parseInt(tourId) },
                    _count: true,
                }),
            ]);

        if (!tour) {
            throw new Error("Tour không tồn tại");
        }

        return {
            tour,
            totalBookings,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            completedBookings,
            avgRating: avgRating._avg.rating || 0,
            totalReviews: avgRating._count,
            bookingsByMonth: bookingsByMonth.length,
        };
    }

    // =====================================================
    // QUẢN LÝ BOOKINGS
    // =====================================================

    /**
     * Lấy danh sách bookings
     */
    static async getAllBookings({
        page = 1,
        limit = 10,
        status,
        paymentStatus,
        tourId,
        userId,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
    }) {
        const skip = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;
        if (paymentStatus) where.paymentStatus = paymentStatus;
        if (tourId) where.tourId = parseInt(tourId);
        if (userId) where.userId = userId;
        if (search) {
            where.OR = [
                { tour: { title: { contains: search, mode: "insensitive" } } },
                { user: { email: { contains: search, mode: "insensitive" } } },
            ];
        }

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    user: {
                        select: {
                            userId: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    tour: {
                        select: {
                            tourId: true,
                            title: true,
                            location: true,
                            price: true,
                            coverImage: true,
                        },
                    },
                    payments: true,
                },
            }),
            prisma.booking.count({ where }),
        ]);

        return {
            bookings,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Lấy chi tiết booking
     */
    static async getBookingById(bookingId) {
        const booking = await prisma.booking.findUnique({
            where: { bookingId: parseInt(bookingId) },
            include: {
                user: {
                    select: {
                        userId: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        userName: true,
                    },
                },
                tour: {
                    include: {
                        category: true,
                        images: true,
                    },
                },
                payments: true,
            },
        });

        if (!booking) {
            throw new Error("Booking không tồn tại");
        }

        return booking;
    }

    /**
     * Cập nhật trạng thái booking
     */
    static async updateBookingStatus(bookingId, status) {
        const booking = await prisma.booking.update({
            where: { bookingId: parseInt(bookingId) },
            data: { status },
        });

        return booking;
    }

    /**
     * Cập nhật trạng thái thanh toán booking
     */
    static async updateBookingPaymentStatus(bookingId, paymentStatus) {
        const booking = await prisma.booking.update({
            where: { bookingId: parseInt(bookingId) },
            data: { paymentStatus },
        });

        return booking;
    }

    /**
     * Xóa booking
     */
    static async deleteBooking(bookingId) {
        // Kiểm tra trạng thái booking
        const booking = await prisma.booking.findUnique({
            where: { bookingId: parseInt(bookingId) },
        });

        if (!booking) {
            throw new Error("Booking không tồn tại");
        }

        if (booking.paymentStatus === "PAID") {
            throw new Error("Không thể xóa booking đã thanh toán");
        }

        await prisma.booking.delete({
            where: { bookingId: parseInt(bookingId) },
        });

        return true;
    }

    // =====================================================
    // QUẢN LÝ PAYMENTS
    // =====================================================

    /**
     * Lấy danh sách payments
     */
    static async getAllPayments({
        page = 1,
        limit = 10,
        status,
        method,
        bookingId,
        sortBy = "createdAt",
        sortOrder = "desc",
    }) {
        const skip = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;
        if (method) where.method = method;
        if (bookingId) where.bookingId = parseInt(bookingId);

        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    booking: {
                        include: {
                            user: {
                                select: {
                                    userId: true,
                                    email: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                            tour: {
                                select: {
                                    tourId: true,
                                    title: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.payment.count({ where }),
        ]);

        return {
            payments,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Lấy chi tiết payment
     */
    static async getPaymentById(paymentId) {
        const payment = await prisma.payment.findUnique({
            where: { paymentId: parseInt(paymentId) },
            include: {
                booking: {
                    include: {
                        user: {
                            select: {
                                userId: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                userName: true,
                            },
                        },
                        tour: true,
                    },
                },
            },
        });

        if (!payment) {
            throw new Error("Payment không tồn tại");
        }

        return payment;
    }

    /**
     * Cập nhật trạng thái payment
     */
    static async updatePaymentStatus(paymentId, status) {
        const payment = await prisma.payment.update({
            where: { paymentId: parseInt(paymentId) },
            data: {
                status,
                paidAt: status === "SUCCESS" ? new Date() : null,
            },
        });

        // Nếu payment SUCCESS, cập nhật booking paymentStatus
        if (status === "SUCCESS") {
            await prisma.booking.update({
                where: { bookingId: payment.bookingId },
                data: { paymentStatus: "PAID" },
            });
        }

        return payment;
    }

    /**
     * Thống kê payment
     */
    static async getPaymentStats() {
        const [totalPayments, successPayments, pendingPayments, failedPayments, totalAmount] =
            await Promise.all([
                prisma.payment.count(),
                prisma.payment.count({ where: { status: "SUCCESS" } }),
                prisma.payment.count({ where: { status: "PENDING" } }),
                prisma.payment.count({ where: { status: "FAILED" } }),
                prisma.payment.aggregate({
                    where: { status: "SUCCESS" },
                    _sum: { amount: true },
                }),
            ]);

        return {
            totalPayments,
            successPayments,
            pendingPayments,
            failedPayments,
            totalAmount: totalAmount._sum.amount || 0,
        };
    }

    // =====================================================
    // QUẢN LÝ CATEGORIES
    // =====================================================

    /**
     * Lấy danh sách tất cả categories
     */
    static async getAllCategories() {
        const categories = await prisma.tourCategory.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { tours: true },
                },
            },
        });

        return categories;
    }
}

module.exports = AdminService;

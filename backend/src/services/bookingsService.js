const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class BookingService {
    // Tạo booking mới
    async createBooking(userId, bookingData) {
        const { tourId, startDate, adults, children = 0 } = bookingData;

        // Kiểm tra tour tồn tại và active
        const tour = await prisma.tour.findUnique({
            where: { tourId: parseInt(tourId) },
        });

        if (!tour || tour.status !== "ACTIVE") {
            throw new Error("Tour not found or inactive");
        }

        // Tính tổng giá (có thể customize logic)
        const totalPrice = tour.price * adults + tour.price * children * 0.7;

        const booking = await prisma.booking.create({
            data: {
                userId,
                tourId: parseInt(tourId),
                startDate: new Date(startDate),
                adults: parseInt(adults),
                children: parseInt(children),
                totalPrice,
                status: "PENDING",
                paymentStatus: "UNPAID",
            },
            include: {
                tour: {
                    include: {
                        category: true,
                        images: {
                            where: { isCover: true },
                            take: 1,
                        },
                    },
                },
            },
        });

        return booking;
    }

    // Lấy danh sách bookings của user
    async getUserBookings(userId, filters = {}) {
        const { page = 1, limit = 10, status, paymentStatus } = filters;

        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        const where = {
            userId,
            ...(status && { status }),
            ...(paymentStatus && { paymentStatus }),
        };

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    tour: {
                        include: {
                            category: true,
                            images: {
                                where: { isCover: true },
                                take: 1,
                            },
                        },
                    },
                    payments: {
                        orderBy: { createdAt: "desc" },
                        take: 1,
                    },
                },
            }),
            prisma.booking.count({ where }),
        ]);

        return {
            bookings,
            pagination: {
                page: parseInt(page),
                limit: take,
                total,
                totalPages: Math.ceil(total / take),
            },
        };
    }

    // Lấy chi tiết booking
    async getBookingById(bookingId, userId = null) {
        const booking = await prisma.booking.findUnique({
            where: { bookingId: parseInt(bookingId) },
            include: {
                user: {
                    select: {
                        userId: true,
                        userName: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                tour: {
                    include: {
                        category: true,
                        images: true,
                        schedules: {
                            orderBy: { dayNumber: "asc" },
                        },
                    },
                },
                payments: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!booking) {
            throw new Error("Booking not found");
        }

        // Kiểm tra quyền truy cập (nếu không phải admin)
        if (userId && booking.userId !== userId) {
            throw new Error("Unauthorized access");
        }

        return booking;
    }

    // Cập nhật trạng thái booking
    async updateBookingStatus(bookingId, status, userId = null) {
        const booking = await prisma.booking.findUnique({
            where: { bookingId: parseInt(bookingId) },
        });

        if (!booking) {
            throw new Error("Booking not found");
        }

        if (userId && booking.userId !== userId) {
            throw new Error("Unauthorized access");
        }

        const updatedBooking = await prisma.booking.update({
            where: { bookingId: parseInt(bookingId) },
            data: { status },
            include: {
                tour: true,
            },
        });

        return updatedBooking;
    }

    // Hủy booking
    async cancelBooking(bookingId, userId) {
        const booking = await prisma.booking.findUnique({
            where: { bookingId: parseInt(bookingId) },
        });

        if (!booking) {
            throw new Error("Booking not found");
        }

        if (booking.userId !== userId) {
            throw new Error("Unauthorized access");
        }

        if (booking.status === "CANCELLED") {
            throw new Error("Booking already cancelled");
        }

        const updatedBooking = await prisma.booking.update({
            where: { bookingId: parseInt(bookingId) },
            data: {
                status: "CANCELLED",
                paymentStatus: booking.paymentStatus === "PAID" ? "REFUNDED" : "UNPAID",
            },
        });

        return updatedBooking;
    }

    // Tạo payment cho booking
    async createPayment(bookingId, paymentData, userId = null) {
        const booking = await prisma.booking.findUnique({
            where: { bookingId: parseInt(bookingId) },
        });

        if (!booking) {
            throw new Error("Booking not found");
        }

        if (userId && booking.userId !== userId) {
            throw new Error("Unauthorized access");
        }

        if (booking.paymentStatus === "PAID") {
            throw new Error("Booking already paid");
        }

        const { method, transactionId } = paymentData;

        const payment = await prisma.payment.create({
            data: {
                bookingId: parseInt(bookingId),
                amount: booking.totalPrice,
                method,
                transactionId,
                status: "SUCCESS",
                paidAt: new Date(),
            },
        });

        // Cập nhật booking status
        await prisma.booking.update({
            where: { bookingId: parseInt(bookingId) },
            data: {
                paymentStatus: "PAID",
                status: "CONFIRMED",
            },
        });

        return payment;
    }

    // Lấy tất cả bookings (Admin)
    async getAllBookings(filters = {}) {
        const { page = 1, limit = 20, status, paymentStatus, search } = filters;

        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        const where = {
            ...(status && { status }),
            ...(paymentStatus && { paymentStatus }),
            ...(search && {
                OR: [
                    { user: { email: { contains: search, mode: "insensitive" } } },
                    { tour: { title: { contains: search, mode: "insensitive" } } },
                ],
            }),
        };

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: {
                            userId: true,
                            userName: true,
                            email: true,
                        },
                    },
                    tour: {
                        select: {
                            tourId: true,
                            title: true,
                            location: true,
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
                page: parseInt(page),
                limit: take,
                total,
                totalPages: Math.ceil(total / take),
            },
        };
    }

    // Thống kê booking
    async getBookingStats() {
        const [total, pending, confirmed, cancelled] = await Promise.all([
            prisma.booking.count(),
            prisma.booking.count({ where: { status: "PENDING" } }),
            prisma.booking.count({ where: { status: "CONFIRMED" } }),
            prisma.booking.count({ where: { status: "CANCELLED" } }),
        ]);

        const revenue = await prisma.payment.aggregate({
            where: { status: "SUCCESS" },
            _sum: { amount: true },
        });

        return {
            total,
            pending,
            confirmed,
            cancelled,
            totalRevenue: revenue._sum.amount || 0,
        };
    }
}

module.exports = new BookingService();

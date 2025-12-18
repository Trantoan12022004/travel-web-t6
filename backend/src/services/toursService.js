const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TourService {
    // Lấy danh sách tours với filter, search, pagination
    async getTours(filters = {}) {
        const {
            page = 1,
            limit = 12,
            categoryId,
            minPrice,
            maxPrice,
            minDuration,
            maxDuration,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
            status = "ACTIVE",
        } = filters;

        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        // Build where clause
        const where = {
            status,
            ...(categoryId && { categoryId: parseInt(categoryId) }),
            ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
            ...(maxPrice && { price: { ...where.price, lte: parseFloat(maxPrice) } }),
            ...(minDuration && { durationDays: { gte: parseInt(minDuration) } }),
            ...(maxDuration && {
                durationDays: { ...where.durationDays, lte: parseInt(maxDuration) },
            }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { location: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }),
        };

        // Execute query
        const [tours, total] = await Promise.all([
            prisma.tour.findMany({
                where,
                skip,
                take,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    category: true,
                    images: {
                        where: { isCover: true },
                        take: 1,
                    },
                    _count: {
                        select: { reviews: true },
                    },
                },
            }),
            prisma.tour.count({ where }),
        ]);

        return {
            tours,
            pagination: {
                page: parseInt(page),
                limit: take,
                total,
                totalPages: Math.ceil(total / take),
            },
        };
    }

    // Lấy chi tiết 1 tour
    async getTourById(tourId) {
        const tour = await prisma.tour.findUnique({
            where: { tourId: parseInt(tourId) },
            include: {
                category: true,
                images: {
                    orderBy: { isCover: "desc" },
                },
                schedules: {
                    orderBy: { dayNumber: "asc" },
                },
                reviews: {
                    where: { status: "VISIBLE" },
                    include: {
                        user: {
                            select: {
                                userName: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
                _count: {
                    select: { bookings: true, reviews: true },
                },
            },
        });

        if (!tour) {
            throw new Error("Tour not found");
        }

        return tour;
    }

    // Lấy tours liên quan (cùng category)
    async getRelatedTours(tourId, limit = 4) {
        const currentTour = await prisma.tour.findUnique({
            where: { tourId: parseInt(tourId) },
            select: { categoryId: true },
        });

        if (!currentTour) return [];

        return prisma.tour.findMany({
            where: {
                categoryId: currentTour.categoryId,
                tourId: { not: parseInt(tourId) },
                status: "ACTIVE",
            },
            take: parseInt(limit),
            orderBy: { ratingAvg: "desc" },
            include: {
                category: true,
                images: {
                    where: { isCover: true },
                    take: 1,
                },
            },
        });
    }

    // Lấy tours phổ biến (top rated)
    async getPopularTours(limit = 6) {
        return prisma.tour.findMany({
            where: { status: "ACTIVE" },
            take: parseInt(limit),
            orderBy: [{ ratingAvg: "desc" }, { ratingCount: "desc" }],
            include: {
                category: true,
                images: {
                    where: { isCover: true },
                    take: 1,
                },
            },
        });
    }

    // Lấy tours mới nhất
    async getLatestTours(limit = 6) {
        return prisma.tour.findMany({
            where: { status: "ACTIVE" },
            take: parseInt(limit),
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                images: {
                    where: { isCover: true },
                    take: 1,
                },
            },
        });
    }

    // Tìm kiếm tours
    async searchTours(keyword, limit = 10) {
        return prisma.tour.findMany({
            where: {
                status: "ACTIVE",
                OR: [
                    { title: { contains: keyword, mode: "insensitive" } },
                    { location: { contains: keyword, mode: "insensitive" } },
                ],
            },
            take: parseInt(limit),
            include: {
                category: true,
                images: {
                    where: { isCover: true },
                    take: 1,
                },
            },
        });
    }
}

module.exports = new TourService();

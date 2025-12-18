const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Bắt đầu seed database...");

    // =========================================================
    // 1. XÓA DỮ LIỆU CŨ (nếu có)
    // =========================================================
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.tourSchedule.deleteMany();
    await prisma.tourImage.deleteMany();
    await prisma.tour.deleteMany();
    await prisma.tourCategory.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Đã xóa dữ liệu cũ");

    // =========================================================
    // 2. TẠO USERS
    // =========================================================
    const passwordHash = await bcrypt.hash("123456", 10);

    const admin = await prisma.user.create({
        data: {
            userName: "admin",
            firstName: "Admin",
            lastName: "System",
            email: "admin@travel.com",
            passwordHash,
            role: "ADMIN",
        },
    });

    const user1 = await prisma.user.create({
        data: {
            userName: "nguyenvana",
            firstName: "Nguyễn Văn",
            lastName: "A",
            email: "nguyenvana@gmail.com",
            passwordHash,
            role: "USER",
        },
    });

    const user2 = await prisma.user.create({
        data: {
            userName: "tranthib",
            firstName: "Trần Thị",
            lastName: "B",
            email: "tranthib@gmail.com",
            passwordHash,
            role: "USER",
        },
    });

    console.log("✅ Đã tạo 3 users (password: 123456)");

    // =========================================================
    // 3. TẠO TOUR CATEGORIES
    // =========================================================
    const categories = await Promise.all([
        prisma.tourCategory.create({
            data: {
                name: "Du lịch biển",
                description: "Các tour du lịch biển, nghỉ dưỡng",
            },
        }),
        prisma.tourCategory.create({
            data: {
                name: "Du lịch văn hóa",
                description: "Khám phá văn hóa, lịch sử",
            },
        }),
        prisma.tourCategory.create({
            data: {
                name: "Du lịch phượt",
                description: "Mạo hiểm, khám phá thiên nhiên",
            },
        }),
        prisma.tourCategory.create({
            data: {
                name: "Du lịch ẩm thực",
                description: "Trải nghiệm ẩm thực địa phương",
            },
        }),
    ]);

    console.log("✅ Đã tạo 4 tour categories");

    // =========================================================
    // 4. TẠO TOURS
    // =========================================================
    const tour1 = await prisma.tour.create({
        data: {
            title: "Du lịch Phú Quốc - Đảo Ngọc 4N3Đ",
            description: "Khám phá vẻ đẹp hoang sơ của đảo ngọc Phú Quốc với bãi biển tuyệt đẹp, ẩm thực phong phú và nhiều trải nghiệm thú vị.",
            categoryId: categories[0].categoryId,
            location: "Phú Quốc, Kiên Giang",
            durationDays: 4,
            price: 5990000,
            coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
            basicInfo: {
                departure: "TP. Hồ Chí Minh",
                transport: "Máy bay",
                hotel: "4 sao",
                meal: "3 bữa/ngày",
            },
            highlightInfo: {
                highlights: [
                    "Tham quan Hòn Thơm Cable Car - cáp treo vượt biển dài nhất thế giới",
                    "Lặn biển ngắm san hô tại Hòn Móng Tay",
                    "Check-in cầu Hôn tình yêu",
                    "Thưởng thức hải sản tươi sống",
                ],
            },
            status: "ACTIVE",
        },
    });

    const tour2 = await prisma.tour.create({
        data: {
            title: "Hà Nội - Sapa - Fansipan 3N2Đ",
            description: "Chinh phục nóc nhà Đông Dương, khám phá văn hóa độc đáo của các dân tộc thiểu số tại Sapa.",
            categoryId: categories[2].categoryId,
            location: "Sapa, Lào Cai",
            durationDays: 3,
            price: 3990000,
            coverImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
            basicInfo: {
                departure: "Hà Nội",
                transport: "Xe giường nằm + Cáp treo",
                hotel: "3 sao",
                meal: "2 bữa/ngày",
            },
            highlightInfo: {
                highlights: [
                    "Chinh phục đỉnh Fansipan 3143m bằng cáp treo",
                    "Tham quan bản Cát Cát, Tả Van",
                    "Thác Bạc, Cầu Mây",
                    "Chợ tình Sapa",
                ],
            },
            status: "ACTIVE",
        },
    });

    const tour3 = await prisma.tour.create({
        data: {
            title: "Đà Nẵng - Hội An - Bà Nà Hills 3N2Đ",
            description: "Trải nghiệm thành phố đáng sống nhất Việt Nam với bãi biển đẹp, phố cổ Hội An và Bà Nà Hills huyền thoại.",
            categoryId: categories[1].categoryId,
            location: "Đà Nẵng - Hội An",
            durationDays: 3,
            price: 4490000,
            coverImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
            basicInfo: {
                departure: "TP. Hồ Chí Minh",
                transport: "Máy bay",
                hotel: "4 sao",
                meal: "3 bữa/ngày",
            },
            highlightInfo: {
                highlights: [
                    "Cầu Vàng - biểu tượng mới của du lịch Việt Nam",
                    "Phố cổ Hội An - Di sản văn hóa thế giới",
                    "Bãi biển Mỹ Khê",
                    "Chùa Linh Ứng - tượng Phật Bà cao nhất Việt Nam",
                ],
            },
            status: "ACTIVE",
        },
    });

    const tour4 = await prisma.tour.create({
        data: {
            title: "Nha Trang - Đảo Điệp Sơn 3N2Đ",
            description: "Khám phá vịnh biển đẹp nhất Việt Nam với hải sản tươi ngon và con đường giữa biển độc đáo.",
            categoryId: categories[0].categoryId,
            location: "Nha Trang, Khánh Hòa",
            durationDays: 3,
            price: 3790000,
            coverImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
            basicInfo: {
                departure: "TP. Hồ Chí Minh",
                transport: "Máy bay + Canoe",
                hotel: "3 sao",
                meal: "3 bữa/ngày",
            },
            highlightInfo: {
                highlights: [
                    "Đảo Điệp Sơn - con đường giữa biển",
                    "Vinpearl Land Nha Trang",
                    "Tắm bùn k광̀ng",
                    "Chợ đêm Nha Trang",
                ],
            },
            status: "ACTIVE",
        },
    });

    console.log("✅ Đã tạo 4 tours");

    // =========================================================
    // 5. TẠO TOUR IMAGES
    // =========================================================
    await Promise.all([
        // Tour 1 - Phú Quốc
        prisma.tourImage.create({
            data: {
                tourId: tour1.tourId,
                imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
                isCover: true,
            },
        }),
        prisma.tourImage.create({
            data: {
                tourId: tour1.tourId,
                imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
                isCover: false,
            },
        }),

        // Tour 2 - Sapa
        prisma.tourImage.create({
            data: {
                tourId: tour2.tourId,
                imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
                isCover: true,
            },
        }),

        // Tour 3 - Đà Nẵng
        prisma.tourImage.create({
            data: {
                tourId: tour3.tourId,
                imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
                isCover: true,
            },
        }),

        // Tour 4 - Nha Trang
        prisma.tourImage.create({
            data: {
                tourId: tour4.tourId,
                imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
                isCover: true,
            },
        }),
    ]);

    console.log("✅ Đã tạo tour images");

    // =========================================================
    // 6. TẠO TOUR SCHEDULES
    // =========================================================
    // Tour 1 - Phú Quốc
    await Promise.all([
        prisma.tourSchedule.create({
            data: {
                tourId: tour1.tourId,
                dayNumber: 1,
                title: "TP.HCM - Phú Quốc - Check-in resort",
                description: "Khởi hành từ sân bay Tân Sơn Nhất đến Phú Quốc. Nhận phòng khách sạn, tự do tắm biển.",
            },
        }),
        prisma.tourSchedule.create({
            data: {
                tourId: tour1.tourId,
                dayNumber: 2,
                title: "Khám phá Nam đảo",
                description: "Tham quan Hòn Thơm Cable Car, lặn ngắm san hô, chiều check-in Sunset Sanato Beach Club.",
            },
        }),
        prisma.tourSchedule.create({
            data: {
                tourId: tour1.tourId,
                dayNumber: 3,
                title: "Tour Bắc đảo",
                description: "Vinpearl Safari, VinWonders, Grand World Phú Quốc.",
            },
        }),
        prisma.tourSchedule.create({
            data: {
                tourId: tour1.tourId,
                dayNumber: 4,
                title: "Tự do - Trở về",
                description: "Tự do mua sắm, tắm biển. Chiều ra sân bay về TP.HCM.",
            },
        }),
    ]);

    // Tour 2 - Sapa
    await Promise.all([
        prisma.tourSchedule.create({
            data: {
                tourId: tour2.tourId,
                dayNumber: 1,
                title: "Hà Nội - Sapa",
                description: "Khởi hành từ Hà Nội đi Sapa bằng xe giường nằm.",
            },
        }),
        prisma.tourSchedule.create({
            data: {
                tourId: tour2.tourId,
                dayNumber: 2,
                title: "Chinh phục Fansipan",
                description: "Đi cáp treo lên đỉnh Fansipan 3143m, chiều tham quan bản Cát Cát.",
            },
        }),
        prisma.tourSchedule.create({
            data: {
                tourId: tour2.tourId,
                dayNumber: 3,
                title: "Sapa - Hà Nội",
                description: "Tham quan Thác Bạc, Cầu Mây. Chiều về Hà Nội.",
            },
        }),
    ]);

    console.log("✅ Đã tạo tour schedules");

    // =========================================================
    // 7. TẠO BOOKINGS
    // =========================================================
    const booking1 = await prisma.booking.create({
        data: {
            userId: user1.userId,
            tourId: tour1.tourId,
            startDate: new Date("2025-01-15"),
            adults: 2,
            children: 1,
            totalPrice: 11980000,
            status: "CONFIRMED",
            paymentStatus: "PAID",
        },
    });

    const booking2 = await prisma.booking.create({
        data: {
            userId: user2.userId,
            tourId: tour2.tourId,
            startDate: new Date("2025-02-01"),
            adults: 2,
            children: 0,
            totalPrice: 7980000,
            status: "PENDING",
            paymentStatus: "UNPAID",
        },
    });

    console.log("✅ Đã tạo 2 bookings");

    // =========================================================
    // 8. TẠO PAYMENTS
    // =========================================================
    await prisma.payment.create({
        data: {
            bookingId: booking1.bookingId,
            amount: 11980000,
            method: "BANK_TRANSFER",
            transactionId: "TXN123456789",
            status: "SUCCESS",
            paidAt: new Date(),
        },
    });

    console.log("✅ Đã tạo payments");

    // =========================================================
    // 9. TẠO REVIEWS
    // =========================================================
    await Promise.all([
        prisma.review.create({
            data: {
                userId: user1.userId,
                tourId: tour1.tourId,
                rating: 5,
                comment: "Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, khách sạn đẹp, ăn uống ngon. Sẽ quay lại lần sau.",
                status: "VISIBLE",
            },
        }),
        prisma.review.create({
            data: {
                userId: user2.userId,
                tourId: tour3.tourId,
                rating: 4,
                comment: "Tour tốt, tuy nhiên lịch trình hơi gấp. Cầu Vàng và phố cổ Hội An rất đẹp.",
                status: "VISIBLE",
            },
        }),
    ]);

    // Cập nhật rating cho tours
    await prisma.tour.update({
        where: { tourId: tour1.tourId },
        data: {
            ratingAvg: 5.0,
            ratingCount: 1,
        },
    });

    await prisma.tour.update({
        where: { tourId: tour3.tourId },
        data: {
            ratingAvg: 4.0,
            ratingCount: 1,
        },
    });

    console.log("✅ Đã tạo reviews");

    console.log("\n🎉 Seed database thành công!");
    console.log("\n📝 Thông tin đăng nhập:");
    console.log("Admin: admin@travel.com / 123456");
    console.log("User 1: nguyenvana@gmail.com / 123456");
    console.log("User 2: tranthib@gmail.com / 123456");
}

main()
    .catch((e) => {
        console.error("❌ Lỗi khi seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
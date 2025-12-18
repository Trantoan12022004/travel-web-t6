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

    const users = await Promise.all([
        prisma.user.create({
            data: {
                userName: "nguyenvana",
                firstName: "Nguyễn Văn",
                lastName: "A",
                email: "nguyenvana@gmail.com",
                passwordHash,
                role: "USER",
            },
        }),
        prisma.user.create({
            data: {
                userName: "tranthib",
                firstName: "Trần Thị",
                lastName: "B",
                email: "tranthib@gmail.com",
                passwordHash,
                role: "USER",
            },
        }),
        prisma.user.create({
            data: {
                userName: "phamvanc",
                firstName: "Phạm Văn",
                lastName: "C",
                email: "phamvanc@gmail.com",
                passwordHash,
                role: "USER",
            },
        }),
        prisma.user.create({
            data: {
                userName: "letd",
                firstName: "Lê Thị",
                lastName: "D",
                email: "letd@gmail.com",
                passwordHash,
                role: "USER",
            },
        }),
        prisma.user.create({
            data: {
                userName: "hoangvane",
                firstName: "Hoàng Văn",
                lastName: "E",
                email: "hoangvane@gmail.com",
                passwordHash,
                role: "USER",
            },
        }),
    ]);

    console.log("✅ Đã tạo 6 users (password: 123456)");

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
        prisma.tourCategory.create({
            data: {
                name: "Du lịch sinh thái",
                description: "Khám phá thiên nhiên hoang dã",
            },
        }),
        prisma.tourCategory.create({
            data: {
                name: "Du lịch tâm linh",
                description: "Hành hương các địa điểm tâm linh",
            },
        }),
    ]);

    console.log("✅ Đã tạo 6 tour categories");

    // =========================================================
    // 4. TẠO TOURS
    // =========================================================
    const tours = await Promise.all([
        // Tour 1 - Phú Quốc
        prisma.tour.create({
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
        }),
        // Tour 2 - Sapa
        prisma.tour.create({
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
        }),
        // Tour 3 - Đà Nẵng
        prisma.tour.create({
            data: {
                title: "Đà Nẵng - Hội An - Bà Nà Hills 3N2Đ",
                description: "Trải nghiệm thành phố đáng sống nhất Việt Nam với bãi biển đẹp, phố cổ Hội An và Bà Nà Hills huyền thoại.",
                categoryId: categories[1].categoryId,
                location: "Đà Nẵng - Hội An",
                durationDays: 3,
                price: 4490000,
                coverImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
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
        }),
        // Tour 4 - Nha Trang
        prisma.tour.create({
            data: {
                title: "Nha Trang - Đảo Điệp Sơn 3N2Đ",
                description: "Khám phá vịnh biển đẹp nhất Việt Nam với hải sản tươi ngon và con đường giữa biển độc đáo.",
                categoryId: categories[0].categoryId,
                location: "Nha Trang, Khánh Hòa",
                durationDays: 3,
                price: 3790000,
                coverImage: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96",
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
                        "Tắm bùn khoáng",
                        "Chợ đêm Nha Trang",
                    ],
                },
                status: "ACTIVE",
            },
        }),
        // Tour 5 - Huế
        prisma.tour.create({
            data: {
                title: "Huế - Động Phong Nha 3N2Đ",
                description: "Khám phá cố đô Huế và kỳ quan thiên nhiên thế giới Phong Nha – Kẻ Bàng.",
                categoryId: categories[1].categoryId,
                location: "Huế - Quảng Bình",
                durationDays: 3,
                price: 3590000,
                coverImage: "https://images.unsplash.com/photo-1541417904950-b855846fe074",
                basicInfo: {
                    departure: "Đà Nẵng",
                    transport: "Ô tô",
                    hotel: "3 sao",
                    meal: "3 bữa/ngày",
                },
                highlightInfo: {
                    highlights: [
                        "Đại Nội Huế",
                        "Chùa Thiên Mụ",
                        "Động Phong Nha",
                        "Sông Son",
                    ],
                },
                status: "ACTIVE",
            },
        }),
        // Tour 6 - Hạ Long
        prisma.tour.create({
            data: {
                title: "Hạ Long - Tuần Châu 2N1Đ",
                description: "Du ngoạn vịnh Hạ Long – kỳ quan thiên nhiên thế giới với du thuyền cao cấp.",
                categoryId: categories[0].categoryId,
                location: "Hạ Long, Quảng Ninh",
                durationDays: 2,
                price: 2890000,
                coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                basicInfo: {
                    departure: "Hà Nội",
                    transport: "Ô tô",
                    hotel: "Du thuyền",
                    meal: "3 bữa/ngày",
                },
                highlightInfo: {
                    highlights: [
                        "Du thuyền vịnh Hạ Long",
                        "Động Thiên Cung",
                        "Đảo Tuần Châu",
                        "Chèo kayak",
                    ],
                },
                status: "ACTIVE",
            },
        }),
        // Tour 7 - Phan Thiết
        prisma.tour.create({
            data: {
                title: "Phan Thiết - Mũi Né 2N1Đ",
                description: "Nghỉ dưỡng biển Mũi Né với đồi cát bay và làng chài truyền thống.",
                categoryId: categories[0].categoryId,
                location: "Phan Thiết, Bình Thuận",
                durationDays: 2,
                price: 2590000,
                coverImage: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96",
                basicInfo: {
                    departure: "TP. Hồ Chí Minh",
                    transport: "Xe du lịch",
                    hotel: "3 sao",
                    meal: "2 bữa/ngày",
                },
                highlightInfo: {
                    highlights: [
                        "Đồi cát bay Mũi Né",
                        "Làng chài Mũi Né",
                        "Suối Tiên",
                        "Biển Hàm Tiến",
                    ],
                },
                status: "ACTIVE",
            },
        }),
        // Tour 8 - Cần Thơ
        prisma.tour.create({
            data: {
                title: "Cần Thơ - Chợ Nổi Cái Răng 2N1Đ",
                description: "Trải nghiệm cuộc sống sông nước miền Tây và nét văn hóa chợ nổi đặc sắc.",
                categoryId: categories[3].categoryId,
                location: "Cần Thơ",
                durationDays: 2,
                price: 2190000,
                coverImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
                basicInfo: {
                    departure: "TP. Hồ Chí Minh",
                    transport: "Ô tô",
                    hotel: "3 sao",
                    meal: "2 bữa/ngày",
                },
                highlightInfo: {
                    highlights: [
                        "Chợ nổi Cái Răng",
                        "Nhà cổ Bình Thủy",
                        "Bến Ninh Kiều",
                        "Ẩm thực miền Tây",
                    ],
                },
                status: "ACTIVE",
            },
        }),
        // Tour 9 - Quy Nhơn
        prisma.tour.create({
            data: {
                title: "Quy Nhơn - Eo Gió - Kỳ Co 3N2Đ",
                description: "Khám phá thiên đường biển hoang sơ Quy Nhơn với nước biển xanh ngọc.",
                categoryId: categories[0].categoryId,
                location: "Quy Nhơn, Bình Định",
                durationDays: 3,
                price: 3690000,
                coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                basicInfo: {
                    departure: "TP. Hồ Chí Minh",
                    transport: "Máy bay",
                    hotel: "4 sao",
                    meal: "3 bữa/ngày",
                },
                highlightInfo: {
                    highlights: [
                        "Eo Gió",
                        "Biển Kỳ Co",
                        "Tháp Đôi Chăm Pa",
                        "Hải sản Quy Nhơn",
                    ],
                },
                status: "ACTIVE",
            },
        }),
        // Tour 10 - Đà Lạt
        prisma.tour.create({
            data: {
                title: "Đà Lạt - Thành Phố Ngàn Hoa 3N2Đ",
                description: "Khám phá thành phố sương mù với khí hậu mát mẻ, thác Datanla, hồ Tuyền Lâm.",
                categoryId: categories[2].categoryId,
                location: "Đà Lạt, Lâm Đồng",
                durationDays: 3,
                price: 3290000,
                coverImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
                basicInfo: {
                    departure: "TP. Hồ Chí Minh",
                    transport: "Ô tô",
                    hotel: "3 sao",
                    meal: "3 bữa/ngày",
                },
                highlightInfo: {
                    highlights: [
                        "Thác Datanla",
                        "Hồ Tuyền Lâm",
                        "Làng hoa Vạn Thành",
                        "Chợ đêm Đà Lạt",
                    ],
                },
                status: "ACTIVE",
            },
        }),
        // Tour 11 - Côn Đảo
        prisma.tour.create({
            data: {
                title: "Côn Đảo - Thiên Đường Biển Đảo 3N2Đ",
                description: "Khám phá vẻ đẹp hoang sơ của Côn Đảo với biển xanh trong vắt và lịch sử anh hùng.",
                categoryId: categories[0].categoryId,
                location: "Côn Đảo, Bà Rịa - Vũng Tàu",
                durationDays: 3,
                price: 6990000,
                coverImage: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96",
                basicInfo: {
                    departure: "TP. Hồ Chí Minh",
                    transport: "Máy bay",
                    hotel: "4 sao",
                    meal: "3 bữa/ngày",
                },
                highlightInfo: {
                    highlights: [
                        "Nhà tù Côn Đảo",
                        "Lặn ngắm san hô",
                        "Bãi Đầm Trầu",
                        "Mũi Cá Mập",
                    ],
                },
                status: "ACTIVE",
            },
        }),
        // Tour 12 - Ninh Bình
        prisma.tour.create({
            data: {
                title: "Ninh Bình - Tràng An - Bái Đính 2N1Đ",
                description: "Khám phá di sản thế giới Tràng An và quần thể chùa Bái Đính lớn nhất Việt Nam.",
                categoryId: categories[5].categoryId,
                location: "Ninh Bình",
                durationDays: 2,
                price: 2390000,
                coverImage: "https://images.unsplash.com/photo-1541417904950-b855846fe074",
                basicInfo: {
                    departure: "Hà Nội",
                    transport: "Ô tô",
                    hotel: "3 sao",
                    meal: "3 bữa/ngày",
                },
                highlightInfo: {
                    highlights: [
                        "Quần thể danh thắng Tràng An",
                        "Chùa Bái Đính",
                        "Hang Múa",
                        "Tam Cốc - Bích Động",
                    ],
                },
                status: "ACTIVE",
            },
        }),
        // Tour 13 - Hà Giang
        prisma.tour.create({
            data: {
                title: "Hà Giang - Cao Nguyên Đá Đồng Văn 4N3Đ",
                description: "Chinh phục cung đường hạnh phúc với phong cảnh núi non hùng vĩ.",
                categoryId: categories[2].categoryId,
                location: "Hà Giang",
                durationDays: 4,
                price: 4590000,
                coverImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
                basicInfo: {
                    departure: "Hà Nội",
                    transport: "Ô tô",
                    hotel: "Nhà nghỉ",
                    meal: "3 bữa/ngày",
                },
                highlightInfo: {
                    highlights: [
                        "Đèo Mã Pì Lèng",
                        "Cao nguyên đá Đồng Văn",
                        "Dinh Vua Mèo",
                        "Cột cờ Lũng Cú",
                    ],
                },
                status: "ACTIVE",
            },
        }),
        // Tour 14 - Vũng Tàu
        prisma.tour.create({
            data: {
                title: "Vũng Tàu - Hồ Cốc 2N1Đ",
                description: "Nghỉ dưỡng gần Sài Gòn với bãi biển đẹp và hải sản tươi ngon.",
                categoryId: categories[0].categoryId,
                location: "Vũng Tàu, Bà Rịa - Vũng Tàu",
                durationDays: 2,
                price: 1990000,
                coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                basicInfo: {
                    departure: "TP. Hồ Chí Minh",
                    transport: "Ô tô",
                    hotel: "3 sao",
                    meal: "2 bữa/ngày",
                },
                highlightInfo: {
                    highlights: [
                        "Tượng Chúa Kitô",
                        "Bãi Sau",
                        "Hồ Cốc",
                        "Hải đăng Vũng Tàu",
                    ],
                },
                status: "ACTIVE",
            },
        }),
        // Tour 15 - Mộc Châu
        prisma.tour.create({
            data: {
                title: "Mộc Châu - Cao Nguyên Trắng 2N1Đ",
                description: "Khám phá đồi chè xanh mướt và thưởng thức sữa tươi Mộc Châu.",
                categoryId: categories[4].categoryId,
                location: "Mộc Châu, Sơn La",
                durationDays: 2,
                price: 2690000,
                coverImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
                basicInfo: {
                    departure: "Hà Nội",
                    transport: "Ô tô",
                    hotel: "3 sao",
                    meal: "2 bữa/ngày",
                },
                highlightInfo: {
                    highlights: [
                        "Đồi chè Trái Tim",
                        "Thác Dải Yếm",
                        "Làng sữa Mộc Châu",
                        "Đồng cừu Suối Giàng",
                    ],
                },
                status: "ACTIVE",
            },
        }),
    ]);

    console.log("✅ Đã tạo 15 tours");

    // =========================================================
    // 5. TẠO TOUR IMAGES
    // =========================================================
    const tourImages = [];
    for (let i = 0; i < tours.length; i++) {
        const imageUrls = [
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
            "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96",
            "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
            "https://images.unsplash.com/photo-1541417904950-b855846fe074",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        ];

        for (let j = 0; j < 3; j++) {
            tourImages.push(
                prisma.tourImage.create({
                    data: {
                        tourId: tours[i].tourId,
                        imageUrl: imageUrls[j % imageUrls.length],
                        isCover: j === 0,
                    },
                })
            );
        }
    }
    await Promise.all(tourImages);

    console.log("✅ Đã tạo tour images");

    // =========================================================
    // 6. TẠO TOUR SCHEDULES
    // =========================================================
    const schedules = [];
    for (let i = 0; i < tours.length; i++) {
        const durationDays = tours[i].durationDays;
        for (let day = 1; day <= durationDays; day++) {
            schedules.push(
                prisma.tourSchedule.create({
                    data: {
                        tourId: tours[i].tourId,
                        dayNumber: day,
                        title: `Ngày ${day}: ${
                            day === 1
                                ? "Khởi hành"
                                : day === durationDays
                                ? "Kết thúc chuyến đi"
                                : "Tham quan"
                        }`,
                        description: `Lịch trình chi tiết ngày ${day} của tour ${tours[i].title}`,
                    },
                })
            );
        }
    }
    await Promise.all(schedules);

    console.log("✅ Đã tạo tour schedules");

    // =========================================================
    // 7. TẠO BOOKINGS
    // =========================================================
    const bookings = [];
    const statuses = ["CONFIRMED", "PENDING", "COMPLETED", "CANCELLED"];
    const paymentStatuses = ["PAID", "UNPAID", "PAID", "UNPAID"];

    for (let i = 0; i < 20; i++) {
        const randomTour = tours[Math.floor(Math.random() * tours.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const paymentStatus =
            randomStatus === "CONFIRMED" || randomStatus === "COMPLETED"
                ? "PAID"
                : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

        const startDate = new Date();
        startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60) + 1);

        const adults = Math.floor(Math.random() * 3) + 1;
        const children = Math.floor(Math.random() * 2);
        const totalPrice = randomTour.price * adults + randomTour.price * 0.7 * children;

        bookings.push(
            prisma.booking.create({
                data: {
                    userId: randomUser.userId,
                    tourId: randomTour.tourId,
                    startDate,
                    adults,
                    children,
                    totalPrice,
                    status: randomStatus,
                    paymentStatus,
                },
            })
        );
    }
    const createdBookings = await Promise.all(bookings);

    console.log("✅ Đã tạo 20 bookings");

    // =========================================================
    // 8. TẠO PAYMENTS
    // =========================================================
    const payments = [];
    const paymentMethods = ["BANK_TRANSFER", "CREDIT_CARD", "CASH", "E_WALLET"];

    for (let booking of createdBookings) {
        if (booking.paymentStatus === "PAID") {
            payments.push(
                prisma.payment.create({
                    data: {
                        bookingId: booking.bookingId,
                        amount: booking.totalPrice,
                        method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
                        status: "SUCCESS",
                        paidAt: new Date(),
                    },
                })
            );
        }
    }
    await Promise.all(payments);

    console.log("✅ Đã tạo payments");

    // =========================================================
    // 9. TẠO REVIEWS (SỬA: Tránh duplicate userId + tourId)
    // =========================================================
    const reviews = [];
    const comments = [
        "Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, khách sạn đẹp, ăn uống ngon.",
        "Chuyến đi đáng nhớ, phong cảnh đẹp, lịch trình hợp lý.",
        "Tour tốt nhưng lịch trình hơi gấp. Tuy nhiên vẫn rất đáng để trải nghiệm.",
        "Dịch vụ xuất sắc, sẽ giới thiệu cho bạn bè.",
        "Giá cả hợp lý, tour guides rất am hiểu và thân thiện.",
        "Trải nghiệm tuyệt vời, mọi thứ đều hoàn hảo!",
        "Tour khá ổn, tuy nhiên thời tiết không được thuận lợi lắm.",
        "Rất hài lòng với chuyến đi này. Sẽ quay lại lần sau.",
    ];

    // Tạo Set để track các cặp (userId, tourId) đã dùng
    const usedPairs = new Set();

    // Mỗi user review tối đa 3 tours khác nhau
    for (let user of users) {
        const numReviews = Math.min(3, Math.floor(Math.random() * 4)); // 0-3 reviews
        const reviewedTours = [];

        for (let i = 0; i < numReviews; i++) {
            let randomTour;
            let attempts = 0;
            const maxAttempts = 10;

            // Tìm tour chưa được user này review
            do {
                randomTour = tours[Math.floor(Math.random() * tours.length)];
                attempts++;
            } while (
                reviewedTours.includes(randomTour.tourId) &&
                attempts < maxAttempts
            );

            if (attempts >= maxAttempts) continue;

            const pairKey = `${user.userId}-${randomTour.tourId}`;
            if (usedPairs.has(pairKey)) continue;

            usedPairs.add(pairKey);
            reviewedTours.push(randomTour.tourId);

            const rating = Math.floor(Math.random() * 2) + 4; // 4-5 sao

            reviews.push(
                prisma.review.create({
                    data: {
                        userId: user.userId,
                        tourId: randomTour.tourId,
                        rating,
                        comment: comments[Math.floor(Math.random() * comments.length)],
                        status: "VISIBLE",
                    },
                })
            );
        }
    }

    await Promise.all(reviews);

    // Cập nhật rating cho tours
    for (let tour of tours) {
        const tourReviews = await prisma.review.findMany({
            where: { tourId: tour.tourId, status: "VISIBLE" },
        });

        if (tourReviews.length > 0) {
            const avgRating =
                tourReviews.reduce((sum, r) => sum + r.rating, 0) / tourReviews.length;
            await prisma.tour.update({
                where: { tourId: tour.tourId },
                data: {
                    ratingAvg: avgRating,
                    ratingCount: tourReviews.length,
                },
            });
        }
    }

    console.log(`✅ Đã tạo ${reviews.length} reviews`);

    console.log("\n🎉 Seed database thành công!");
    console.log("\n📊 Thống kê:");
    console.log(`- Users: ${users.length + 1} (admin + ${users.length} users)`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Tours: ${tours.length}`);
    console.log(`- Images: ${tourImages.length}`);
    console.log(`- Schedules: ${schedules.length}`);
    console.log(`- Bookings: ${createdBookings.length}`);
    console.log(`- Payments: ${payments.length}`);
    console.log(`- Reviews: ${reviews.length}`);
    console.log("\n📝 Thông tin đăng nhập:");
    console.log("Admin: admin@travel.com / 123456");
    console.log("User 1: nguyenvana@gmail.com / 123456");
    console.log("User 2: tranthib@gmail.com / 123456");
    console.log("User 3: phamvanc@gmail.com / 123456");
    console.log("User 4: letd@gmail.com / 123456");
    console.log("User 5: hoangvane@gmail.com / 123456");
}

main()
    .catch((e) => {
        console.error("❌ Lỗi khi seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
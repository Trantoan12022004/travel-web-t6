const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class PaymentService {
    /**
     * Tạo payment mới cho booking
     */
    async createPayment(bookingId, paymentData) {
        try {
            // Kiểm tra booking tồn tại
            const booking = await prisma.booking.findUnique({
                where: { bookingId: parseInt(bookingId) },
                include: { tour: true },
            });

            if (!booking) {
                throw new Error("Booking không tồn tại");
            }

            // Kiểm tra đã thanh toán chưa
            if (booking.paymentStatus === "PAID") {
                throw new Error("Booking này đã được thanh toán");
            }

            // Tạo transaction ID nếu không có
            const transactionId =
                paymentData.transactionId || `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;

            // Tạo payment
            const payment = await prisma.payment.create({
                data: {
                    bookingId: parseInt(bookingId),
                    amount: booking.totalPrice,
                    method: paymentData.method,
                    transactionId,
                    status: "PENDING",
                    createdAt: new Date(),
                },
            });

            return payment;
        } catch (error) {
            console.error("Create payment error:", error);
            throw error;
        }
    }

    /**
     * Xác nhận thanh toán thành công
     */
    async confirmPayment(paymentId, userId) {
        try {
            // Lấy payment và kiểm tra quyền
            const payment = await prisma.payment.findUnique({
                where: { paymentId: parseInt(paymentId) },
                include: {
                    booking: {
                        include: { user: true, tour: true },
                    },
                },
            });

            if (!payment) {
                throw new Error("Payment không tồn tại");
            }

            // Kiểm tra quyền sở hữu
            if (payment.booking.userId !== userId) {
                throw new Error("Bạn không có quyền xác nhận payment này");
            }

            // Kiểm tra trạng thái
            if (payment.status === "SUCCESS") {
                throw new Error("Payment đã được xác nhận trước đó");
            }

            // Cập nhật payment và booking trong transaction
            const result = await prisma.$transaction(async (tx) => {
                // Cập nhật payment
                const updatedPayment = await tx.payment.update({
                    where: { paymentId: parseInt(paymentId) },
                    data: {
                        status: "SUCCESS",
                        paidAt: new Date(),
                    },
                });

                // Cập nhật booking
                const updatedBooking = await tx.booking.update({
                    where: { bookingId: payment.bookingId },
                    data: {
                        paymentStatus: "PAID",
                        // status: "CONFIRMED",
                    },
                });

                return { payment: updatedPayment, booking: updatedBooking };
            });

            return result;
        } catch (error) {
            console.error("Confirm payment error:", error);
            throw error;
        }
    }

    /**
     * Hủy payment (thanh toán thất bại)
     */
    async cancelPayment(paymentId, userId) {
        try {
            const payment = await prisma.payment.findUnique({
                where: { paymentId: parseInt(paymentId) },
                include: { booking: true },
            });

            if (!payment) {
                throw new Error("Payment không tồn tại");
            }

            if (payment.booking.userId !== userId) {
                throw new Error("Bạn không có quyền hủy payment này");
            }

            if (payment.status === "SUCCESS") {
                throw new Error("Không thể hủy payment đã thành công");
            }

            const updatedPayment = await prisma.payment.update({
                where: { paymentId: parseInt(paymentId) },
                data: {
                    status: "FAILED",
                },
            });

            return updatedPayment;
        } catch (error) {
            console.error("Cancel payment error:", error);
            throw error;
        }
    }

    /**
     * Lấy danh sách payments của một booking
     */
    async getPaymentsByBooking(bookingId, userId) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { bookingId: parseInt(bookingId) },
            });

            if (!booking) {
                throw new Error("Booking không tồn tại");
            }

            if (booking.userId !== userId) {
                throw new Error("Bạn không có quyền xem payments này");
            }

            const payments = await prisma.payment.findMany({
                where: { bookingId: parseInt(bookingId) },
                orderBy: { createdAt: "desc" },
            });

            return payments;
        } catch (error) {
            console.error("Get payments error:", error);
            throw error;
        }
    }

    /**
     * Lấy chi tiết một payment
     */
    async getPaymentById(paymentId, userId) {
        try {
            const payment = await prisma.payment.findUnique({
                where: { paymentId: parseInt(paymentId) },
                include: {
                    booking: {
                        include: {
                            user: {
                                select: {
                                    userId: true,
                                    userName: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
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

            if (payment.booking.userId !== userId) {
                throw new Error("Bạn không có quyền xem payment này");
            }

            return payment;
        } catch (error) {
            console.error("Get payment detail error:", error);
            throw error;
        }
    }

    /**
     * Xử lý webhook từ payment gateway (VNPay, Momo, ...)
     */
    async handlePaymentWebhook(webhookData) {
        try {
            // Parse webhook data
            const { transactionId, status, amount } = webhookData;

            // Tìm payment theo transactionId
            const payment = await prisma.payment.findFirst({
                where: { transactionId },
                include: { booking: true },
            });

            if (!payment) {
                throw new Error("Payment không tồn tại");
            }

            // Xử lý theo status từ gateway
            if (status === "SUCCESS" || status === "00") {
                await this.confirmPayment(payment.paymentId, payment.booking.userId);
                return { success: true, message: "Payment confirmed" };
            } else {
                await this.cancelPayment(payment.paymentId, payment.booking.userId);
                return { success: false, message: "Payment failed" };
            }
        } catch (error) {
            console.error("Webhook handler error:", error);
            throw error;
        }
    }

    /**
     * Hoàn tiền (refund)
     */
    async refundPayment(paymentId, adminUserId) {
        try {
            const payment = await prisma.payment.findUnique({
                where: { paymentId: parseInt(paymentId) },
                include: { booking: true },
            });

            if (!payment) {
                throw new Error("Payment không tồn tại");
            }

            if (payment.status !== "SUCCESS") {
                throw new Error("Chỉ có thể hoàn tiền cho payment đã thành công");
            }

            const result = await prisma.$transaction(async (tx) => {
                // Tạo payment hoàn tiền
                const refundPayment = await tx.payment.create({
                    data: {
                        bookingId: payment.bookingId,
                        amount: -payment.amount, // Số âm để đánh dấu hoàn tiền
                        method: payment.method,
                        transactionId: `REFUND_${payment.transactionId}`,
                        status: "SUCCESS",
                        paidAt: new Date(),
                    },
                });

                // Cập nhật booking
                const updatedBooking = await tx.booking.update({
                    where: { bookingId: payment.bookingId },
                    data: {
                        paymentStatus: "REFUNDED",
                        status: "CANCELLED",
                    },
                });

                return { refundPayment, booking: updatedBooking };
            });

            return result;
        } catch (error) {
            console.error("Refund payment error:", error);
            throw error;
        }
    }

    /**
     * Lấy thống kê payments (Admin)
     */
    async getPaymentStats(startDate, endDate) {
        try {
            const stats = await prisma.payment.groupBy({
                by: ["status", "method"],
                where: {
                    createdAt: {
                        gte: startDate ? new Date(startDate) : undefined,
                        lte: endDate ? new Date(endDate) : undefined,
                    },
                },
                _sum: {
                    amount: true,
                },
                _count: true,
            });

            return stats;
        } catch (error) {
            console.error("Get payment stats error:", error);
            throw error;
        }
    }
}

module.exports = new PaymentService();

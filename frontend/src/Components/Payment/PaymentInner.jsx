import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useBookingStore from "../../Stores/booking";
import usePaymentStore from "../../Stores/payment";
import { PaymentMethod, PaymentMethodText } from "../../Types/payment";

const PaymentInner = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const { currentBooking, fetchBookingById, loading: bookingLoading } = useBookingStore();
    const { createPayment, confirmPayment, loading: paymentLoading, error } = usePaymentStore();

    const [selectedMethod, setSelectedMethod] = useState(PaymentMethod.BANK_TRANSFER);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Vui lòng đăng nhập");
            navigate("/login");
            return;
        }

        if (bookingId) {
            fetchBookingById(bookingId).catch((err) => {
                console.error("Fetch booking error:", err);
                if (err.response?.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn");
                    navigate("/login");
                } else if (err.response?.status === 404) {
                    toast.error("Không tìm thấy booking");
                    navigate("/bookings");
                }
            });
        }
    }, [bookingId, fetchBookingById, navigate]);

    // Kiểm tra booking đã thanh toán chưa
    useEffect(() => {
        if (currentBooking?.paymentStatus === "PAID") {
            toast.info("Booking này đã được thanh toán");
            navigate(`/bookings/${bookingId}`);
        }
    }, [currentBooking, bookingId, navigate]);

    const handlePayment = async () => {
        const result = await Swal.fire({
            title: "Xác nhận thanh toán",
            html: `Bạn có chắc chắn muốn thanh toán<br/><strong>${Number(
                currentBooking.totalPrice || 0
            ).toLocaleString("vi-VN")} ₫</strong> cho booking này?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Xác nhận thanh toán",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setProcessing(true);

            // Bước 1: Tạo payment
            const payment = await createPayment(bookingId, {
                method: selectedMethod,
            });

            // Bước 2: Giả lập xử lý thanh toán (trong thực tế redirect đến payment gateway)
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Bước 3: Xác nhận thanh toán thành công
            await confirmPayment(payment.paymentId);

            toast.success("Thanh toán thành công!");
            setTimeout(() => navigate(`/bookings/${bookingId}`), 1000);
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Thanh toán thất bại: " + (error.message || "Lỗi không xác định"));
        } finally {
            setProcessing(false);
        }
    };

    // Loading state
    if (bookingLoading || paymentLoading || !currentBooking) {
        return (
            <section className="space">
                <div className="container">
                    <div className="text-center py-50">
                        <div
                            className="spinner-border text-theme"
                            role="status"
                            style={{ width: "3rem", height: "3rem" }}
                        >
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p className="mt-3 text-muted fs-18">Đang tải thông tin thanh toán...</p>
                    </div>
                </div>
            </section>
        );
    }

    const booking = currentBooking;

    return (
        <section className="space bg-smoke">
            <div className="container">
                {/* Back Button */}
                <div className="row mb-3">
                    <div className="col-12">
                        <button
                            className="th-btn style3"
                            onClick={() => navigate(`/bookings/${bookingId}`)}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Quay lại chi tiết booking
                        </button>
                    </div>
                </div>

                {/* Page Title */}
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="bg-white rounded-10 shadow-sm p-3">
                            <h3 className="box-title mb-2">
                                <i className="fas fa-credit-card text-theme me-2"></i>
                                Thanh Toán Booking #{booking.bookingId}
                            </h3>
                            <p className="mb-0 text-body">
                                <i className="fas fa-info-circle me-2"></i>
                                Vui lòng chọn phương thức thanh toán và hoàn tất giao dịch
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row gy-30">
                    {/* Payment Form - Left Side */}
                    <div className="col-lg-8">
                        <div className="bg-white rounded-10 shadow-sm">
                            <div className="bg-theme text-white rounded-10 p-3">
                                <h4 className="mb-0 text-white">
                                    <i className="fas fa-wallet me-2"></i>
                                    Phương Thức Thanh Toán
                                </h4>
                            </div>
                            <div className="p-3">
                                {/* Payment Methods */}
                                <div className="payment-methods mb-4">
                                    {Object.entries(PaymentMethod).map(([key, value]) => (
                                        <div
                                            key={value}
                                            className={`payment-method-item p-3 mb-3 rounded-10`}
                                            onClick={() => setSelectedMethod(value)}
                                            style={{
                                                border:
                                                    selectedMethod === value
                                                        ? "2px solid var(--theme-color)"
                                                        : "1px solid #ddd",
                                                cursor: "pointer",
                                                transition: "all 0.3s",
                                                backgroundColor:
                                                    selectedMethod === value
                                                        ? "rgba(var(--theme-color-rgb), 0.05)"
                                                        : "transparent",
                                            }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    checked={selectedMethod === value}
                                                    onChange={() => setSelectedMethod(value)}
                                                    className="me-3"
                                                    style={{ width: "20px", height: "20px" }}
                                                />
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1">
                                                        {PaymentMethodText[value]}
                                                    </h6>
                                                    <small className="text-muted">
                                                        {value === PaymentMethod.BANK_TRANSFER &&
                                                            "Chuyển khoản qua tài khoản ngân hàng"}
                                                        {value === PaymentMethod.CREDIT_CARD &&
                                                            "Thanh toán bằng thẻ tín dụng/ghi nợ"}
                                                        {value === PaymentMethod.CASH &&
                                                            "Thanh toán tiền mặt tại văn phòng"}
                                                        {value === PaymentMethod.E_WALLET &&
                                                            "Thanh toán qua ví điện tử (Momo, ZaloPay...)"}
                                                    </small>
                                                </div>
                                                <div
                                                    className="payment-icon text-theme"
                                                    style={{ fontSize: "2.5rem" }}
                                                >
                                                    {value === PaymentMethod.BANK_TRANSFER && (
                                                        <i className="fas fa-university"></i>
                                                    )}
                                                    {value === PaymentMethod.CREDIT_CARD && (
                                                        <i className="fas fa-credit-card"></i>
                                                    )}
                                                    {value === PaymentMethod.CASH && (
                                                        <i className="fas fa-money-bill-wave"></i>
                                                    )}
                                                    {value === PaymentMethod.E_WALLET && (
                                                        <i className="fas fa-wallet"></i>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Payment Instructions */}
                                <div className="payment-instructions">
                                    {selectedMethod === PaymentMethod.BANK_TRANSFER && (
                                        <div className="alert alert-info border-0">
                                            <h6 className="mb-3">
                                                <i className="fas fa-info-circle me-2"></i>
                                                Hướng dẫn chuyển khoản:
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <p className="mb-1">
                                                        <strong>Ngân hàng:</strong>
                                                    </p>
                                                    <p className="mb-0">
                                                        Vietcombank - Chi nhánh TP.HCM
                                                    </p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="mb-1">
                                                        <strong>Số tài khoản:</strong>
                                                    </p>
                                                    <p className="mb-0">1234567890</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="mb-1">
                                                        <strong>Chủ tài khoản:</strong>
                                                    </p>
                                                    <p className="mb-0">CONG TY TOURM</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="mb-1">
                                                        <strong>Nội dung chuyển khoản:</strong>
                                                    </p>
                                                    <p className="mb-0 text-danger fw-bold">
                                                        BOOKING{booking.bookingId}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedMethod === PaymentMethod.CREDIT_CARD && (
                                        <div className="alert alert-info border-0">
                                            <i className="fas fa-info-circle me-2"></i>
                                            Bạn sẽ được chuyển đến cổng thanh toán an toàn để nhập
                                            thông tin thẻ.
                                        </div>
                                    )}

                                    {selectedMethod === PaymentMethod.CASH && (
                                        <div className="alert alert-info border-0">
                                            <i className="fas fa-info-circle me-2"></i>
                                            Vui lòng đến văn phòng của chúng tôi để thanh toán tiền
                                            mặt. Địa chỉ: 123 Nguyễn Văn Linh, Q.7, TP.HCM
                                        </div>
                                    )}

                                    {selectedMethod === PaymentMethod.E_WALLET && (
                                        <div className="alert alert-info border-0">
                                            <i className="fas fa-info-circle me-2"></i>
                                            Bạn sẽ được chuyển đến ứng dụng ví điện tử để hoàn tất
                                            thanh toán.
                                        </div>
                                    )}
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="alert alert-danger border-0">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {error}
                                    </div>
                                )}

                                {/* Payment Button */}
                                <div className="d-grid gap-2 mt-4">
                                    <button
                                        className="th-btn"
                                        onClick={handlePayment}
                                        disabled={processing}
                                        style={{ fontSize: "16px", padding: "15px" }}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Đang xử lý thanh toán...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-check-circle me-2"></i>
                                                Xác nhận thanh toán{" "}
                                                {Number(booking.totalPrice || 0).toLocaleString(
                                                    "vi-VN"
                                                )}{" "}
                                                ₫
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary - Right Side */}
                    <div className="col-lg-4">
                        <div className="position-sticky" style={{ top: "100px" }}>
                            {/* Order Summary Card */}
                            <div className="bg-white rounded-10 shadow-sm mb-3">
                                <div className="bg-theme text-white rounded-10 p-3">
                                    <h5 className="mb-0 text-white">
                                        <i className="fas fa-receipt me-2"></i>
                                        Thông Tin Đơn Hàng
                                    </h5>
                                </div>
                                <div className="p-3">
                                    {/* Tour Image & Title */}
                                    <div className="mb-3">
                                        <div className="tour-box_img rounded-10 overflow-hidden mb-3">
                                            <img
                                                src={
                                                    booking.tour?.coverImage ||
                                                    "/images/default-tour.jpg"
                                                }
                                                alt={booking.tour?.title}
                                                className="w-100"
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                        </div>
                                        <h6 className="mb-2">{booking.tour?.title}</h6>
                                        <p className="text-muted small mb-0">
                                            <i className="fas fa-location-dot me-2 text-theme"></i>
                                            {booking.tour?.location}
                                        </p>
                                    </div>

                                    <hr />

                                    {/* Booking Details */}
                                    <div className="booking-details">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-body">Ngày khởi hành:</span>
                                            <strong className="text-title">
                                                {booking.startDate
                                                    ? new Date(
                                                          booking.startDate
                                                      ).toLocaleDateString("vi-VN")
                                                    : "N/A"}
                                            </strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-body">Thời gian:</span>
                                            <strong className="text-title">
                                                {booking.tour?.durationDays || 0} ngày{" "}
                                                {booking.tour?.durationNights || 0} đêm
                                            </strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-body">Người lớn:</span>
                                            <strong className="text-title">
                                                {booking.adults} người
                                            </strong>
                                        </div>
                                        {booking.children > 0 && (
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-body">Trẻ em:</span>
                                                <strong className="text-title">
                                                    {booking.children} người
                                                </strong>
                                            </div>
                                        )}
                                        <div className="d-flex justify-content-between">
                                            <span className="text-body">Mã booking:</span>
                                            <strong className="text-title">
                                                #{booking.bookingId}
                                            </strong>
                                        </div>
                                    </div>

                                    <hr />

                                    {/* Total Price */}
                                    <div className="p-3 rounded-10 gr-bg1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <small className="text-black d-block mb-1 opacity-75">
                                                    Tổng thanh toán
                                                </small>
                                                <h4 className="text-black mb-0">
                                                    {Number(booking.totalPrice || 0).toLocaleString(
                                                        "vi-VN"
                                                    )}{" "}
                                                    ₫
                                                </h4>
                                            </div>
                                            <i
                                                className="fas fa-money-bill-wave text-white opacity-25"
                                                style={{ fontSize: "2rem" }}
                                            ></i>
                                        </div>
                                    </div>

                                    {/* Security Note */}
                                    <div className="alert alert-success border-0 mt-3 mb-0">
                                        <i className="fas fa-shield-halved me-2"></i>
                                        <small>Giao dịch được bảo mật và mã hóa</small>
                                    </div>
                                </div>
                            </div>

                            {/* Support Card */}
                            <div className="bg-white rounded-10 shadow-sm">
                                <div className="p-3">
                                    <h6 className="box-title mb-3">
                                        <i className="fas fa-headset text-theme me-2"></i>
                                        Cần hỗ trợ?
                                    </h6>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-box bg-smoke rounded-circle p-2 me-3">
                                                <i className="fas fa-phone text-theme"></i>
                                            </div>
                                            <div>
                                                <small className="text-body d-block">
                                                    Hotline 24/7
                                                </small>
                                                <strong className="text-title">1900 xxxx</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex align-items-center">
                                            <div className="icon-box bg-smoke rounded-circle p-2 me-3">
                                                <i className="fas fa-envelope text-theme"></i>
                                            </div>
                                            <div>
                                                <small className="text-body d-block">
                                                    Email hỗ trợ
                                                </small>
                                                <strong className="text-title">
                                                    support@tourm.com
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentInner;

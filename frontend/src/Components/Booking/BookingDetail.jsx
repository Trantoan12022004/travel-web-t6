import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useBookingStore from "../../Stores/booking";
import { BookingStatus } from "../../Types/booking";

const BookingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentBooking, loading, error, fetchBookingById, cancelBooking, completeBooking } =
        useBookingStore();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Vui lòng đăng nhập");
            navigate("/login");
            return;
        }

        if (id) {
            fetchBookingById(id).catch((err) => {
                console.error("Fetch booking detail error:", err);
                if (err.response?.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn");
                    navigate("/login");
                } else if (err.response?.status === 404) {
                    toast.error("Không tìm thấy booking");
                    navigate("/bookings");
                }
            });
        }
    }, [id, fetchBookingById, navigate]);

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            toast.warning("Vui lòng nhập lý do hủy");
            return;
        }

        try {
            await cancelBooking(id, cancelReason);
            toast.success("Hủy booking thành công");
            setShowCancelModal(false);
            fetchBookingById(id);
        } catch (error) {
            toast.error("Không thể hủy booking: " + (error.message || "Lỗi không xác định"));
        }
    };

    const handleComplete = async () => {
        const result = await Swal.fire({
            title: "Xác nhận hoàn thành",
            text: "Đánh dấu booking này là hoàn thành?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await completeBooking(id);
            toast.success("Đánh dấu hoàn thành thành công");
            fetchBookingById(id);
        } catch (error) {
            toast.error("Không thể hoàn thành booking: " + (error.message || "Lỗi không xác định"));
        }
    };

    const handlePayment = () => {
        navigate(`/bookings/${id}/payment`);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "PENDING":
                return "badge bg-warning text-dark";
            case "CONFIRMED":
                return "badge bg-success";
            case "COMPLETED":
                return "badge bg-info";
            case "CANCELLED":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            PENDING: "Chờ xác nhận",
            CONFIRMED: "Đã xác nhận",
            COMPLETED: "Hoàn thành",
            CANCELLED: "Đã hủy",
        };
        return statusMap[status] || status;
    };

    const getPaymentStatusText = (paymentStatus) => {
        const statusMap = {
            PAID: "Đã thanh toán",
            UNPAID: "Chưa thanh toán",
            REFUNDED: "Đã hoàn tiền",
        };
        return statusMap[paymentStatus] || paymentStatus;
    };

    const getPaymentBoxStyle = (paymentStatus) => {
        switch (paymentStatus) {
            case "PAID":
                return {
                    backgroundColor: "rgba(25, 135, 84, 0.1)",
                    border: "2px solid #198754",
                };
            case "REFUNDED":
                return {
                    backgroundColor: "rgba(13, 202, 240, 0.1)",
                    border: "2px solid #0dcaf0",
                };
            case "UNPAID":
            default:
                return {
                    backgroundColor: "rgba(255, 193, 7, 0.1)",
                    border: "2px solid #ffc107",
                };
        }
    };

    const getPaymentMethodText = (method) => {
        const methodMap = {
            BANK_TRANSFER: "Chuyển khoản ngân hàng",
            CREDIT_CARD: "Thẻ tín dụng/ghi nợ",
            CASH: "Tiền mặt",
            E_WALLET: "Ví điện tử",
        };
        return methodMap[method] || method;
    };

    const isTourEnded = () => {
        if (!currentBooking?.startDate || !currentBooking?.tour?.durationDays) {
            return false;
        }
        const endDate = new Date(currentBooking.startDate);
        endDate.setDate(endDate.getDate() + currentBooking.tour.durationDays);
        return new Date() > endDate;
    };

    // Loading state
    if (loading) {
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
                        <p className="mt-3 text-muted fs-18">Đang tải thông tin booking...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="space">
                <div className="container">
                    <div className="text-center py-50">
                        <div className="alert alert-danger" role="alert">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            <h4 className="alert-heading mb-3">Có lỗi xảy ra!</h4>
                            <hr />
                            <p className="mb-0">{error}</p>
                        </div>
                        <button className="th-btn mt-3" onClick={() => navigate("/bookings")}>
                            <i className="fas fa-arrow-left me-2"></i>Quay lại danh sách
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (!currentBooking) {
        return (
            <section className="space">
                <div className="container">
                    <div className="text-center py-50">
                        <i
                            className="fas fa-file-circle-xmark text-muted mb-3"
                            style={{ fontSize: "4rem" }}
                        ></i>
                        <h4 className="text-muted mb-3">Không tìm thấy thông tin booking</h4>
                        <button className="th-btn" onClick={() => navigate("/bookings")}>
                            <i className="fas fa-arrow-left me-2"></i>Quay lại danh sách
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    const booking = currentBooking;
    console.log("Booking Detail:", booking);
    const latestPayment =
        booking.payments && booking.payments.length > 0
            ? booking.payments[booking.payments.length - 1]
            : null;

    return (
        <section className="space bg-smoke">
            <div className="container">
                {/* Back Button */}
                <div className="row mb-3">
                    <div className="col-12">
                        <button className="th-btn style3" onClick={() => navigate("/bookings")}>
                            <i className="fas fa-arrow-left me-2"></i>
                            Quay lại danh sách
                        </button>
                    </div>
                </div>

                {/* Header Section */}
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="bg-white rounded-10 shadow-sm p-3">
                            <div className="row align-items-center gy-3">
                                <div className="col-md-8 p-4">
                                    <h3 className="box-title mb-2">
                                        <i className="fas fa-ticket text-theme me-2"></i>
                                        Booking #{booking.bookingId}
                                    </h3>
                                    <p className="mb-0 text-body">
                                        <i className="fas fa-clock me-2"></i>
                                        Đặt lúc:{" "}
                                        {booking.createdAt
                                            ? new Date(booking.createdAt).toLocaleString("vi-VN")
                                            : "N/A"}
                                    </p>
                                </div>
                                <div className="col-md-4 text-md-end">
                                    <span
                                        className={`${getStatusBadgeClass(
                                            booking.status
                                        )} fs-6 px-4 py-2`}
                                    >
                                        {getStatusText(booking.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row gy-30">
                    {/* Main Content */}
                    <div className="col-lg-8">
                        {/* Tour Info */}
                        <div className="bg-white rounded-10 shadow-sm mb-3">
                            <div className="bg-theme text-white rounded-10 p-3 mb-4">
                                <h4 className="mb-0 text-white">
                                    <i className="fas fa-map-marked-alt me-2"></i>
                                    Thông Tin Tour
                                </h4>
                            </div>
                            <div className="p-3">
                                <div className="row g-4">
                                    <div className="col-md-4">
                                        <div className="tour-box_img rounded-10 overflow-hidden">
                                            <img
                                                src={
                                                    booking.tour?.coverImage ||
                                                    "/images/default-tour.jpg"
                                                }
                                                alt={booking.tour?.title}
                                                className="w-100"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <h4 className="box-title mb-3">
                                            {booking.tour?.title || "N/A"}
                                        </h4>
                                        <div className="tour-info-list">
                                            <p className="mb-2">
                                                <i className="fas fa-location-dot me-2 text-theme"></i>
                                                <strong>Địa điểm:</strong>{" "}
                                                {booking.tour?.location || "N/A"}
                                            </p>
                                            <p className="mb-2">
                                                <i className="fas fa-clock me-2 text-theme"></i>
                                                <strong>Thời gian:</strong>{" "}
                                                {booking.tour?.durationDays || 0} ngày{" "}
                                                {booking.tour?.durationNights || 0} đêm
                                            </p>
                                            {booking.tour?.basicInfo && (
                                                <>
                                                    <p className="mb-2">
                                                        <i className="fas fa-utensils me-2 text-theme"></i>
                                                        <strong>Bữa ăn:</strong>{" "}
                                                        {booking.tour.basicInfo.meal}
                                                    </p>
                                                    <p className="mb-2">
                                                        <i className="fas fa-hotel me-2 text-theme"></i>
                                                        <strong>Khách sạn:</strong>{" "}
                                                        {booking.tour.basicInfo.hotel}
                                                    </p>
                                                    <p className="mb-0">
                                                        <i className="fas fa-plane-departure me-2 text-theme"></i>
                                                        <strong>Phương tiện:</strong>{" "}
                                                        {booking.tour.basicInfo.transport}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="bg-white rounded-10 shadow-sm mb-3">
                            <div className="bg-theme text-white rounded-10 p-3 mb-4">
                                <h4 className="mb-0 text-white">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Chi Tiết Đặt Tour
                                </h4>
                            </div>
                            <div className="p-3">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="info-box p-3 bg-smoke rounded-10">
                                            <small className="text-body d-block mb-1">
                                                Ngày khởi hành
                                            </small>
                                            <strong className="d-flex align-items-center text-title">
                                                <i className="fas fa-calendar-days text-theme me-2"></i>
                                                {booking.startDate
                                                    ? new Date(
                                                          booking.startDate
                                                      ).toLocaleDateString("vi-VN", {
                                                          weekday: "long",
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
                                                      })
                                                    : "N/A"}
                                            </strong>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="info-box p-3 bg-smoke rounded-10">
                                            <small className="text-body d-block mb-1">
                                                Số lượng khách
                                            </small>
                                            <strong className="d-flex align-items-center text-title">
                                                <i className="fas fa-users text-theme me-2"></i>
                                                {booking.adults || 0} người lớn
                                                {booking.children > 0 &&
                                                    `, ${booking.children} trẻ em`}
                                            </strong>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="info-box p-4 rounded-10 gr-bg1">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <small className="text-black d-block mb-1 opacity-75">
                                                        Tổng tiền
                                                    </small>
                                                    <h3 className="text-black mb-0">
                                                        {Number(
                                                            booking.totalPrice || 0
                                                        ).toLocaleString("vi-VN")}{" "}
                                                        ₫
                                                    </h3>
                                                </div>
                                                <i
                                                    className="fas fa-money-bill-wave text-white opacity-25"
                                                    style={{ fontSize: "2.5rem" }}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-10 shadow-sm">
                            <div className="bg-theme text-white rounded-10 p-3 mb-4">
                                <h4 className="mb-0 text-white">
                                    <i className="fas fa-credit-card me-2"></i>
                                    Thông Tin Thanh Toán
                                </h4>
                            </div>
                            <div className="p-3">
                                <div
                                    className="p-4 rounded-10 mb-4"
                                    style={getPaymentBoxStyle(booking.paymentStatus)}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-2">Trạng thái thanh toán</h6>
                                            <span
                                                className={
                                                    booking.paymentStatus === "PAID"
                                                        ? "badge bg-success fs-6 px-3 py-2"
                                                        : booking.paymentStatus === "REFUNDED"
                                                        ? "badge bg-info fs-6 px-3 py-2"
                                                        : "badge bg-warning text-dark fs-6 px-3 py-2"
                                                }
                                            >
                                                {booking.paymentStatus === "PAID" && (
                                                    <i className="fas fa-check-circle me-2"></i>
                                                )}
                                                {booking.paymentStatus === "REFUNDED" && (
                                                    <i className="fas fa-rotate-left me-2"></i>
                                                )}
                                                {booking.paymentStatus === "UNPAID" && (
                                                    <i className="fas fa-clock me-2"></i>
                                                )}
                                                {getPaymentStatusText(booking.paymentStatus)}
                                            </span>
                                        </div>
                                        {booking.paymentStatus === "PAID" && (
                                            <i
                                                className="fas fa-circle-check text-success"
                                                style={{ fontSize: "3rem" }}
                                            ></i>
                                        )}
                                        {booking.paymentStatus === "REFUNDED" && (
                                            <i
                                                className="fas fa-rotate-left text-info"
                                                style={{ fontSize: "3rem" }}
                                            ></i>
                                        )}
                                        {booking.paymentStatus === "UNPAID" && (
                                            <i
                                                className="fas fa-exclamation-circle text-warning"
                                                style={{ fontSize: "3rem" }}
                                            ></i>
                                        )}
                                    </div>
                                </div>

                                {latestPayment &&
                                (booking.paymentStatus === "PAID" ||
                                    booking.paymentStatus === "REFUNDED") ? (
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="p-3 bg-smoke rounded-10">
                                                <small className="text-body d-block mb-1">
                                                    Phương thức
                                                </small>
                                                <strong className="d-flex align-items-center text-title">
                                                    <i className="fas fa-wallet text-theme me-2"></i>
                                                    {getPaymentMethodText(latestPayment.method)}
                                                </strong>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-3 bg-smoke rounded-10">
                                                <small className="text-body d-block mb-1">
                                                    Mã giao dịch
                                                </small>
                                                <strong className="d-flex align-items-center text-title">
                                                    <i className="fas fa-hashtag text-theme me-2"></i>
                                                    {latestPayment.transactionId}
                                                </strong>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-3 bg-smoke rounded-10">
                                                <small className="text-body d-block mb-1">
                                                    Số tiền
                                                </small>
                                                <strong
                                                    className={`d-flex align-items-center ${
                                                        booking.paymentStatus === "REFUNDED"
                                                            ? "text-info"
                                                            : "text-success"
                                                    }`}
                                                >
                                                    <i className="fas fa-money-bill me-2"></i>
                                                    {Number(
                                                        latestPayment.amount || 0
                                                    ).toLocaleString("vi-VN")}{" "}
                                                    ₫
                                                </strong>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-3 bg-smoke rounded-10">
                                                <small className="text-body d-block mb-1">
                                                    {booking.paymentStatus === "REFUNDED"
                                                        ? "Thời gian hoàn tiền"
                                                        : "Thời gian thanh toán"}
                                                </small>
                                                <strong className="d-flex align-items-center text-title">
                                                    <i className="fas fa-clock text-theme me-2"></i>
                                                    {latestPayment.paidAt
                                                        ? new Date(
                                                              latestPayment.paidAt
                                                          ).toLocaleString("vi-VN")
                                                        : "N/A"}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="alert alert-warning border-0 mb-0">
                                        <div className="d-flex align-items-center">
                                            <i
                                                className="fas fa-info-circle me-3"
                                                style={{ fontSize: "1.5rem" }}
                                            ></i>
                                            <div>
                                                <strong className="d-block mb-1">
                                                    Chưa thanh toán
                                                </strong>
                                                <small>
                                                    Vui lòng thanh toán để xác nhận booking của bạn
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        <div className="position-sticky" style={{ top: "100px" }}>
                            {/* Actions */}
                            <div className="bg-white rounded-10 shadow-sm mb-3">
                                <div className="bg-theme text-white rounded-10 p-3 mb-4">
                                    <h5 className="mb-0 text-white">
                                        <i className="fas fa-bolt me-2"></i>
                                        Hành Động
                                    </h5>
                                </div>
                                <div className="p-3">
                                    <div className="d-grid gap-2">
                                        {/* Payment Button */}
                                        {booking.paymentStatus !== "PAID" &&
                                            booking.paymentStatus !== "REFUNDED" &&
                                            (booking.status === "PENDING" ||
                                                booking.status === "CONFIRMED") && (
                                                <button className="th-btn" onClick={handlePayment}>
                                                    <i className="fas fa-credit-card me-2"></i>
                                                    Thanh toán ngay
                                                </button>
                                            )}

                                        {/* Complete Button */}
                                        {booking.status === "CONFIRMED" &&
                                            booking.paymentStatus === "PAID" &&
                                            isTourEnded() && (
                                                <button
                                                    className="th-btn style2"
                                                    onClick={handleComplete}
                                                >
                                                    <i className="fas fa-check-circle me-2"></i>
                                                    Đánh dấu hoàn thành
                                                </button>
                                            )}

                                        {/* Cancel Button */}
                                        {booking.status === "PENDING" &&
                                            booking.paymentStatus !== "PAID" &&
                                            booking.paymentStatus !== "REFUNDED" && (
                                                <button
                                                    className="th-btn style4"
                                                    onClick={() => setShowCancelModal(true)}
                                                >
                                                    <i className="fas fa-times me-2"></i>
                                                    Hủy booking
                                                </button>
                                            )}

                                        {/* Print Button */}
                                        <button
                                            className="th-btn style3"
                                            onClick={() => window.print()}
                                        >
                                            <i className="fas fa-print me-2"></i>
                                            In thông tin
                                        </button>
                                    </div>

                                    {/* Status Messages */}
                                    <div className="mt-3">
                                        {booking.paymentStatus === "PAID" &&
                                            booking.status !== "COMPLETED" && (
                                                <div className="alert alert-success mb-4">
                                                    <i className="fas fa-circle-check me-2"></i>
                                                    <strong>Đã thanh toán thành công!</strong>
                                                    <p className="mb-0 small mt-2">
                                                        Chúng tôi sẽ liên hệ với bạn để xác nhận chi
                                                        tiết tour.
                                                    </p>
                                                </div>
                                            )}

                                        {booking.status === "COMPLETED" && (
                                            <div className="alert alert-info mb-4">
                                                <i className="fas fa-circle-check me-2"></i>
                                                <strong>Chuyến đi đã hoàn thành!</strong>
                                                <p className="mb-0 small mt-2">
                                                    Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                                                </p>
                                            </div>
                                        )}

                                        {booking.paymentStatus === "REFUNDED" && (
                                            <div className="alert alert-info mb-4">
                                                <i className="fas fa-rotate-left me-2"></i>
                                                <strong>Đã hoàn tiền</strong>
                                                <p className="mb-0 small mt-2">
                                                    Số tiền đã được hoàn lại vào tài khoản của bạn.
                                                </p>
                                            </div>
                                        )}

                                        {booking.status === "CANCELLED" &&
                                            booking.paymentStatus !== "REFUNDED" && (
                                                <div className="alert alert-danger mb-4">
                                                    <i className="fas fa-circle-xmark me-2"></i>
                                                    <strong>Booking đã bị hủy</strong>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* Support Info */}
                            <div className="bg-white rounded-10 shadow-sm">
                                <div className="p-3">
                                    <h5 className="box-title mb-3">
                                        <i className="fas fa-headset text-theme me-2"></i>
                                        Cần hỗ trợ?
                                    </h5>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-box bg-smoke rounded-circle p-2 me-3">
                                                <i className="fas fa-phone text-theme"></i>
                                            </div>
                                            <div>
                                                <small className="text-body d-block">Hotline</small>
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
                                                <small className="text-body d-block">Email</small>
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

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">
                                    <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                                    Hủy Booking
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowCancelModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-body mb-3">
                                    Vui lòng cho chúng tôi biết lý do bạn muốn hủy booking này:
                                </p>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Nhập lý do hủy..."
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="modal-footer border-0">
                                <button
                                    type="button"
                                    className="th-btn style3"
                                    onClick={() => setShowCancelModal(false)}
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    className="th-btn style4"
                                    onClick={handleCancel}
                                >
                                    <i className="fas fa-check me-2"></i>
                                    Xác nhận hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default BookingDetail;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useBookingStore from "../../Stores/booking";
import { BookingStatus } from "../../Types/booking";

const BookingsInner = () => {
    const navigate = useNavigate();
    const { bookings, loading, error, fetchMyBookings, cancelBooking, pagination } =
        useBookingStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Vui lòng đăng nhập");
            navigate("/login");
            return;
        }

        loadBookings();
    }, [currentPage, filterStatus]);

    const loadBookings = () => {
        const params = {
            page: currentPage,
            limit: 10,
        };

        if (filterStatus !== "all") {
            params.status = filterStatus;
        }

        fetchMyBookings(params).catch((err) => {
            console.error("Fetch bookings error:", err);
            if (err.response?.status === 401) {
                toast.error("Phiên đăng nhập đã hết hạn");
                navigate("/login");
            }
        });
    };

    const handleCancel = async (bookingId) => {
        const result = await Swal.fire({
            title: "Xác nhận hủy booking",
            text: "Bạn có chắc chắn muốn hủy booking này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Hủy booking",
            cancelButtonText: "Không",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await cancelBooking(bookingId, "User requested cancellation");
            toast.success("Hủy booking thành công");
        } catch (error) {
            toast.error("Không thể hủy booking: " + (error.message || "Lỗi không xác định"));
        }
    };

    const handleViewDetail = (bookingId) => {
        navigate(`/bookings/${bookingId}`);
    };

    const handlePayment = (bookingId) => {
        navigate(`/bookings/${bookingId}/payment`);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case BookingStatus.PENDING:
            case "PENDING":
                return "badge bg-warning text-dark";
            case BookingStatus.CONFIRMED:
            case "CONFIRMED":
                return "badge bg-success";
            case BookingStatus.COMPLETED:
            case "COMPLETED":
                return "badge bg-info";
            case BookingStatus.CANCELLED:
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

    const getPaymentStatusBadgeClass = (paymentStatus) => {
        switch (paymentStatus) {
            case "PAID":
                return "text-success";
            case "UNPAID":
                return "text-warning";
            case "REFUNDED":
                return "text-info";
            default:
                return "text-secondary";
        }
    };

    const getPaymentStatusText = (paymentStatus) => {
        const statusMap = {
            PAID: "Đã thanh toán",
            UNPAID: "Chưa thanh toán",
            REFUNDED: "Đã hoàn tiền",
        };
        return statusMap[paymentStatus] || paymentStatus;
    };

    const getPaymentMethodText = (method) => {
        const methodMap = {
            BANK_TRANSFER: "Chuyển khoản",
            CREDIT_CARD: "Thẻ tín dụng",
            CASH: "Tiền mặt",
            E_WALLET: "Ví điện tử",
        };
        return methodMap[method] || method;
    };

    const getPaymentBoxStyle = (paymentStatus) => {
        switch (paymentStatus) {
            case "PAID":
                return {
                    backgroundColor: "rgba(25, 135, 84, 0.1)",
                    border: "1px solid #198754",
                };
            case "REFUNDED":
                return {
                    backgroundColor: "rgba(13, 202, 240, 0.1)",
                    border: "1px solid #0dcaf0",
                };
            case "UNPAID":
            default:
                return {
                    backgroundColor: "rgba(255, 193, 7, 0.1)",
                    border: "1px solid #ffc107",
                };
        }
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
                        <p className="mt-3 text-muted fs-18">Đang tải danh sách booking...</p>
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
                        <button className="th-btn mt-3" onClick={loadBookings}>
                            <i className="fas fa-sync-alt me-2"></i>Thử lại
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    const bookingsList = Array.isArray(bookings) ? bookings : [];

    return (
        <section className="space bg-smoke">
            <div className="container">
                {/* Filter Bar */}
                <div className="row mb-40">
                    <div className="col-12">
                        <div className="bg-white rounded-10 p-4 shadow-sm">
                            <div className="row align-items-center gy-3">
                                <div className="col-lg-8 col-md-6">
                                    <h3 className="box-title mb-0">
                                        <i className="fas fa-calendar-check me-2 text-theme"></i>
                                        Danh Sách Booking Của Tôi
                                    </h3>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div>
                                        <label className="form-label text-muted mb-2 fs-xs">
                                            Lọc theo trạng thái
                                        </label>
                                        <select
                                            className="form-select"
                                            value={filterStatus}
                                            onChange={(e) => {
                                                setFilterStatus(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <option value="all">Tất cả trạng thái</option>
                                            <option value="PENDING">Chờ xác nhận</option>
                                            <option value="CONFIRMED">Đã xác nhận</option>
                                            <option value="COMPLETED">Hoàn thành</option>
                                            <option value="CANCELLED">Đã hủy</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                {bookingsList.length === 0 ? (
                    <div className="row">
                        <div className="col-12">
                            <div className="bg-white rounded-10 text-center py-50 px-4">
                                <i
                                    className="fas fa-calendar-times text-body"
                                    style={{ fontSize: "5rem", opacity: "0.3" }}
                                ></i>
                                <h4 className="mb-3 mt-4 text-title">Bạn chưa có booking nào</h4>
                                <p className="text-body mb-4">
                                    Hãy đặt tour du lịch của bạn ngay hôm nay!
                                </p>
                                <button className="th-btn" onClick={() => navigate("/destination")}>
                                    <i className="fas fa-compass me-2"></i>Khám phá các tour
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="row gy-30">
                            {bookingsList.map((booking) => {
                                const id = booking.bookingId || booking._id;
                                const latestPayment =
                                    booking.payments && booking.payments.length > 0
                                        ? booking.payments[booking.payments.length - 1]
                                        : null;

                                return (
                                    <div key={id} className="col-12">
                                        <div className="bg-white rounded-10 overflow-hidden">
                                            <div className="row g-0 align-items-center">
                                                {/* Tour Image */}
                                                <div className="col-lg-3 col-md-4">
                                                    <div
                                                        className="position-relative"
                                                        style={{ height: "250px" }}
                                                    >
                                                        <img
                                                            src={
                                                                booking.tour?.coverImage ||
                                                                "/images/default-tour.jpg"
                                                            }
                                                            alt={booking.tour?.title || "Tour"}
                                                            className="w-100 h-100"
                                                            style={{ objectFit: "cover" }}
                                                        />
                                                        {/* Status Badge */}
                                                        <span
                                                            className={`position-absolute top-0 start-0 m-3 ${getStatusBadgeClass(
                                                                booking.status
                                                            )} px-3 py-2`}
                                                        >
                                                            {getStatusText(booking.status)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Booking Details */}
                                                <div className="col-lg-6 col-md-8">
                                                    <div className="p-30 p-md-4">
                                                        <h5 className="box-title mb-3">
                                                            {booking.tour?.title || "N/A"}
                                                        </h5>

                                                        <div className="mb-3">
                                                            <p className="mb-2">
                                                                <i className="fas fa-calendar-alt text-theme me-2"></i>
                                                                <span className="text-muted fs-xs me-2">
                                                                    Ngày khởi hành:
                                                                </span>
                                                                <span className="fw-semibold">
                                                                    {booking.startDate
                                                                        ? new Date(
                                                                              booking.startDate
                                                                          ).toLocaleDateString(
                                                                              "vi-VN"
                                                                          )
                                                                        : "N/A"}
                                                                </span>
                                                            </p>

                                                            <p className="mb-2">
                                                                <i className="fas fa-users text-theme me-2"></i>
                                                                <span className="text-muted fs-xs me-2">
                                                                    Số khách:
                                                                </span>
                                                                <span className="fw-semibold">
                                                                    {booking.adults || 0} người lớn
                                                                    {booking.children > 0 &&
                                                                        `, ${booking.children} trẻ em`}
                                                                </span>
                                                            </p>

                                                            <p className="mb-3">
                                                                <i className="fas fa-money-bill-wave text-theme me-2"></i>
                                                                <span className="text-muted fs-xs me-2">
                                                                    Tổng tiền:
                                                                </span>
                                                                <span className="text-theme fw-bold fs-18">
                                                                    {Number(
                                                                        booking.totalPrice || 0
                                                                    ).toLocaleString("vi-VN")}{" "}
                                                                    ₫
                                                                </span>
                                                            </p>
                                                        </div>

                                                        {/* Payment Info */}
                                                        <div
                                                            className="p-3 rounded-10"
                                                            style={getPaymentBoxStyle(
                                                                booking.paymentStatus
                                                            )}
                                                        >
                                                            {booking.paymentStatus === "PAID" ? (
                                                                <>
                                                                    <div className="d-flex align-items-center mb-2">
                                                                        <i className="fas fa-check-circle text-success me-2"></i>
                                                                        <strong className="text-success">
                                                                            Đã thanh toán
                                                                        </strong>
                                                                    </div>
                                                                    {latestPayment && (
                                                                        <div className="fs-xs text-muted">
                                                                            <p className="mb-1">
                                                                                <i className="fas fa-wallet me-2"></i>
                                                                                {getPaymentMethodText(
                                                                                    latestPayment.method
                                                                                )}
                                                                            </p>
                                                                            <p className="mb-1">
                                                                                <i className="fas fa-hashtag me-2"></i>
                                                                                {
                                                                                    latestPayment.transactionId
                                                                                }
                                                                            </p>
                                                                            <p className="mb-0">
                                                                                <i className="fas fa-clock me-2"></i>
                                                                                {latestPayment.paidAt
                                                                                    ? new Date(
                                                                                          latestPayment.paidAt
                                                                                      ).toLocaleString(
                                                                                          "vi-VN"
                                                                                      )
                                                                                    : "N/A"}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : booking.paymentStatus ===
                                                              "REFUNDED" ? (
                                                                <>
                                                                    <div className="d-flex align-items-center mb-2">
                                                                        <i className="fas fa-rotate-left text-info me-2"></i>
                                                                        <strong className="text-info">
                                                                            Đã hoàn tiền
                                                                        </strong>
                                                                    </div>
                                                                    {latestPayment && (
                                                                        <div className="fs-xs text-muted">
                                                                            <p className="mb-1">
                                                                                <i className="fas fa-wallet me-2"></i>
                                                                                {getPaymentMethodText(
                                                                                    latestPayment.method
                                                                                )}
                                                                            </p>
                                                                            <p className="mb-1">
                                                                                <i className="fas fa-hashtag me-2"></i>
                                                                                {
                                                                                    latestPayment.transactionId
                                                                                }
                                                                            </p>
                                                                            <p className="mb-0">
                                                                                <i className="fas fa-clock me-2"></i>
                                                                                Hoàn tiền:{" "}
                                                                                {latestPayment.paidAt
                                                                                    ? new Date(
                                                                                          latestPayment.paidAt
                                                                                      ).toLocaleString(
                                                                                          "vi-VN"
                                                                                      )
                                                                                    : "N/A"}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <div className="d-flex align-items-center">
                                                                    <i className="fas fa-exclamation-circle text-warning me-2"></i>
                                                                    <span className="fs-xs text-muted">
                                                                        Vui lòng thanh toán để xác
                                                                        nhận booking
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="col-lg-3 col-12">
                                                    <div className="p-30 p-md-4 bg-smoke2 h-100">
                                                        <div className="d-grid gap-2">
                                                            {/* Chi tiết */}
                                                            <button
                                                                className="th-btn style3"
                                                                onClick={() => handleViewDetail(id)}
                                                            >
                                                                <i className="fas fa-eye me-2"></i>
                                                                Chi tiết
                                                            </button>

                                                            {/* Thanh toán */}
                                                            {booking.paymentStatus !== "PAID" &&
                                                                booking.paymentStatus !==
                                                                    "REFUNDED" &&
                                                                (booking.status === "PENDING" ||
                                                                    booking.status ===
                                                                        "CONFIRMED") && (
                                                                    <button
                                                                        className="th-btn"
                                                                        onClick={() =>
                                                                            handlePayment(id)
                                                                        }
                                                                    >
                                                                        <i className="fas fa-credit-card me-2"></i>
                                                                        Thanh toán
                                                                    </button>
                                                                )}

                                                            {/* Hủy */}
                                                            {booking.status === "PENDING" &&
                                                                booking.paymentStatus !== "PAID" &&
                                                                booking.paymentStatus !==
                                                                    "REFUNDED" && (
                                                                    <button
                                                                        className="th-btn style4"
                                                                        onClick={() =>
                                                                            handleCancel(id)
                                                                        }
                                                                    >
                                                                        <i className="fas fa-times me-2"></i>
                                                                        Hủy booking
                                                                    </button>
                                                                )}

                                                            {/* Status messages */}
                                                            {booking.paymentStatus === "PAID" && (
                                                                <div className="alert alert-success mb-0 py-2 text-center fs-xs">
                                                                    <i className="fas fa-check-circle me-1"></i>
                                                                    Đã thanh toán
                                                                </div>
                                                            )}

                                                            {booking.paymentStatus ===
                                                                "REFUNDED" && (
                                                                <div className="alert alert-info mb-0 py-2 text-center fs-xs">
                                                                    <i className="fas fa-rotate-left me-1"></i>
                                                                    Đã hoàn tiền
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="row mt-50">
                                <div className="col-12">
                                    <div className="th-pagination text-center">
                                        <ul>
                                            <li>
                                                <button
                                                    className={`page-link ${
                                                        currentPage === 1 ? "disabled" : ""
                                                    }`}
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.max(1, prev - 1)
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                >
                                                    <i className="fas fa-chevron-left"></i>
                                                </button>
                                            </li>

                                            {[...Array(pagination.totalPages)].map((_, index) => (
                                                <li key={index + 1}>
                                                    <button
                                                        className={`page-link ${
                                                            currentPage === index + 1
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                        onClick={() => setCurrentPage(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                </li>
                                            ))}

                                            <li>
                                                <button
                                                    className={`page-link ${
                                                        currentPage === pagination.totalPages
                                                            ? "disabled"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.min(
                                                                pagination.totalPages,
                                                                prev + 1
                                                            )
                                                        )
                                                    }
                                                    disabled={currentPage === pagination.totalPages}
                                                >
                                                    <i className="fas fa-chevron-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default BookingsInner;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../../Stores/admin";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const BookingManagement = () => {
    const navigate = useNavigate();
    const {
        bookings,
        bookingPagination,
        fetchBookings,
        deleteBooking,
        updateBookingStatus,
        updateBookingPaymentStatus,
        loading,
    } = useAdminStore();

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: "",
        paymentStatus: "",
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        loadBookings();
    }, [filters]);

    const loadBookings = async () => {
        try {
            await fetchBookings(filters);
        } catch (err) {
            if (err.isAuthError || err.status === 401 || err.status === 403) {
                toast.error("Bạn không có quyền truy cập trang này");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                toast.error("Không thể tải danh sách bookings");
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters({ ...filters, page: 1 });
    };

    const handleDelete = async (bookingId, tourTitle) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa booking?",
            html: `Bạn có chắc muốn xóa booking cho tour <strong>"${tourTitle}"</strong>?<br/><br/><small class="text-muted">Lưu ý: Không thể xóa booking đã thanh toán.</small>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await deleteBooking(bookingId);
                toast.success("Xóa booking thành công!");
            } catch (err) {
                toast.error(err.message || "Không thể xóa booking");
            }
        }
    };

    const handleStatusChange = async (bookingId, currentStatus) => {
        const { value: newStatus } = await Swal.fire({
            title: "Thay đổi trạng thái booking",
            input: "select",
            inputOptions: {
                PENDING: "Chờ xác nhận",
                CONFIRMED: "Đã xác nhận",
                CANCELLED: "Đã hủy",
                COMPLETED: "Hoàn thành",
            },
            inputValue: currentStatus,
            showCancelButton: true,
            confirmButtonText: "Cập nhật",
            cancelButtonText: "Hủy",
            inputValidator: (value) => {
                if (!value) {
                    return "Vui lòng chọn trạng thái!";
                }
            },
        });

        if (newStatus && newStatus !== currentStatus) {
            try {
                await updateBookingStatus(bookingId, newStatus);
                toast.success("Cập nhật trạng thái thành công!");
            } catch (err) {
                toast.error("Không thể cập nhật trạng thái");
            }
        }
    };

    const handlePaymentStatusChange = async (bookingId, currentPaymentStatus) => {
        const { value: newStatus } = await Swal.fire({
            title: "Thay đổi trạng thái thanh toán",
            input: "select",
            inputOptions: {
                UNPAID: "Chưa thanh toán",
                PAID: "Đã thanh toán",
                REFUNDED: "Đã hoàn tiền",
            },
            inputValue: currentPaymentStatus,
            showCancelButton: true,
            confirmButtonText: "Cập nhật",
            cancelButtonText: "Hủy",
            inputValidator: (value) => {
                if (!value) {
                    return "Vui lòng chọn trạng thái!";
                }
            },
        });

        if (newStatus && newStatus !== currentPaymentStatus) {
            try {
                await updateBookingPaymentStatus(bookingId, newStatus);
                toast.success("Cập nhật trạng thái thanh toán thành công!");
            } catch (err) {
                toast.error("Không thể cập nhật trạng thái thanh toán");
            }
        }
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    const handleViewDetail = (booking) => {
        setSelectedBooking(booking);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { text: "Chờ xác nhận", class: "bg-warning text-dark" },
            CONFIRMED: { text: "Đã xác nhận", class: "bg-info text-white" },
            CANCELLED: { text: "Đã hủy", class: "bg-danger text-white" },
            COMPLETED: { text: "Hoàn thành", class: "bg-success text-white" },
        };
        const info = statusMap[status] || { text: status, class: "bg-secondary" };
        return <span className={`badge ${info.class}`}>{info.text}</span>;
    };

    const getPaymentStatusBadge = (status) => {
        const statusMap = {
            UNPAID: { text: "Chưa thanh toán", class: "bg-danger text-white" },
            PAID: { text: "Đã thanh toán", class: "bg-success text-white" },
            REFUNDED: { text: "Đã hoàn tiền", class: "bg-secondary text-white" },
        };
        const info = statusMap[status] || { text: status, class: "bg-secondary" };
        return <span className={`badge ${info.class}`}>{info.text}</span>;
    };

    if (loading && !bookings.length) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-management">
            {/* Filters */}
            <div className="booking-form mb-3 mt-4">
                <form onSubmit={handleSearch}>
                    <div className="row gy-3">
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm (email, tour)..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>

                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters({ ...filters, status: e.target.value, page: 1 })
                                }
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="PENDING">Chờ xác nhận</option>
                                <option value="CONFIRMED">Đã xác nhận</option>
                                <option value="CANCELLED">Đã hủy</option>
                                <option value="COMPLETED">Hoàn thành</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={filters.paymentStatus}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        paymentStatus: e.target.value,
                                        page: 1,
                                    })
                                }
                            >
                                <option value="">Tất cả thanh toán</option>
                                <option value="UNPAID">Chưa thanh toán</option>
                                <option value="PAID">Đã thanh toán</option>
                                <option value="REFUNDED">Đã hoàn tiền</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={`${filters.sortBy}-${filters.sortOrder}`}
                                onChange={(e) => {
                                    const [sortBy, sortOrder] = e.target.value.split("-");
                                    setFilters({ ...filters, sortBy, sortOrder, page: 1 });
                                }}
                            >
                                <option value="createdAt-desc">Mới nhất</option>
                                <option value="createdAt-asc">Cũ nhất</option>
                                <option value="totalPrice-desc">Giá cao - thấp</option>
                                <option value="totalPrice-asc">Giá thấp - cao</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <button type="submit" className="th-btn w-100">
                                <i className="fa-solid fa-search me-2"></i>
                                Tìm
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Stats */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5>
                        Tổng: <strong>{bookingPagination.total}</strong> bookings
                    </h5>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="booking-form mt-4">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "50px" }}>#</th>
                                <th>Tour</th>
                                <th>Khách hàng</th>
                                <th className="text-center">Ngày đi</th>
                                <th className="text-center">Số người</th>
                                <th className="text-end">Tổng tiền</th>
                                <th className="text-center">Trạng thái</th>
                                <th className="text-center">Thanh toán</th>
                                <th className="text-center" style={{ width: "200px" }}>
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <tr key={booking.bookingId}>
                                    <td>
                                        {(bookingPagination.page - 1) * bookingPagination.limit +
                                            index +
                                            1}
                                    </td>
                                    <td>
                                        <strong>{booking.tour?.title}</strong>
                                        <br />
                                        <small className="text-muted">
                                            {booking.tour?.location}
                                        </small>
                                    </td>
                                    <td>
                                        <strong>
                                            {booking.user?.firstName} {booking.user?.lastName}
                                        </strong>
                                        <br />
                                        <small className="text-muted">{booking.user?.email}</small>
                                    </td>
                                    <td className="text-center">{formatDate(booking.startDate)}</td>
                                    <td className="text-center">
                                        <span className="">
                                            {booking.adults} người lớn
                                        </span>
                                        {booking.children > 0 && (
                                            <>
                                                <br />
                                                <span className="">
                                                    {booking.children} trẻ em
                                                </span>
                                            </>
                                        )}
                                    </td>
                                    <td className="text-end">
                                        <strong>{formatCurrency(booking.totalPrice)}</strong>
                                    </td>
                                    <td className="text-center">
                                        {booking.status}
                                    </td>
                                    <td className="text-center">
                                        {booking.paymentStatus}
                                    </td>
                                    <td>
                                        <div className="btn-group btn-group-sm" role="group">
                                            {/* <button
                                                className="btn btn-outline-info"
                                                onClick={() => handleViewDetail(booking)}
                                                title="Chi tiết"
                                            >
                                                <i className="fa-solid fa-eye"></i>
                                            </button> */}
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() =>
                                                    handleStatusChange(
                                                        booking.bookingId,
                                                        booking.status
                                                    )
                                                }
                                                title="Đổi trạng thái"
                                            >
                                                <i className="fa-solid fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-outline-success"
                                                onClick={() =>
                                                    handlePaymentStatusChange(
                                                        booking.bookingId,
                                                        booking.paymentStatus
                                                    )
                                                }
                                                title="Đổi trạng thái thanh toán"
                                            >
                                                <i className="fa-solid fa-dollar-sign"></i>
                                            </button>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleDelete(
                                                        booking.bookingId,
                                                        booking.tour?.title
                                                    )
                                                }
                                                title="Xóa"
                                                disabled={booking.paymentStatus === "PAID"}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {bookings.length === 0 && (
                        <div className="text-center py-5">
                            <i
                                className="fa-solid fa-inbox fa-3x text-muted mb-3"
                                style={{ opacity: 0.3 }}
                            ></i>
                            <p className="text-muted">Không có booking nào</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {bookingPagination.totalPages > 1 && (
                    <div className="th-pagination text-center mt-4">
                        <ul>
                            <li>
                                <button
                                    onClick={() => handlePageChange(bookingPagination.page - 1)}
                                    disabled={bookingPagination.page === 1}
                                    className={bookingPagination.page === 1 ? "disabled" : ""}
                                >
                                    <i className="fa-solid fa-angle-left"></i>
                                </button>
                            </li>
                            {[...Array(bookingPagination.totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                if (
                                    pageNum === 1 ||
                                    pageNum === bookingPagination.totalPages ||
                                    (pageNum >= bookingPagination.page - 2 &&
                                        pageNum <= bookingPagination.page + 2)
                                ) {
                                    return (
                                        <li key={pageNum}>
                                            <button
                                                onClick={() => handlePageChange(pageNum)}
                                                className={
                                                    bookingPagination.page === pageNum
                                                        ? "active"
                                                        : ""
                                                }
                                            >
                                                {pageNum}
                                            </button>
                                        </li>
                                    );
                                } else if (
                                    pageNum === bookingPagination.page - 3 ||
                                    pageNum === bookingPagination.page + 3
                                ) {
                                    return <li key={pageNum}>...</li>;
                                }
                                return null;
                            })}
                            <li>
                                <button
                                    onClick={() => handlePageChange(bookingPagination.page + 1)}
                                    disabled={
                                        bookingPagination.page === bookingPagination.totalPages
                                    }
                                    className={
                                        bookingPagination.page === bookingPagination.totalPages
                                            ? "disabled"
                                            : ""
                                    }
                                >
                                    <i className="fa-solid fa-angle-right"></i>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedBooking && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={() => setSelectedBooking(null)}
                >
                    <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết Booking</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedBooking(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row gy-3">
                                    <div className="col-md-6">
                                        <h6>Thông tin Tour</h6>
                                        <p>
                                            <strong>Tên tour:</strong> {selectedBooking.tour?.title}
                                        </p>
                                        <p>
                                            <strong>Địa điểm:</strong>{" "}
                                            {selectedBooking.tour?.location}
                                        </p>
                                        <p>
                                            <strong>Giá tour:</strong>{" "}
                                            {formatCurrency(selectedBooking.tour?.price)}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Thông tin Khách hàng</h6>
                                        <p>
                                            <strong>Họ tên:</strong>{" "}
                                            {selectedBooking.user?.firstName}{" "}
                                            {selectedBooking.user?.lastName}
                                        </p>
                                        <p>
                                            <strong>Email:</strong> {selectedBooking.user?.email}
                                        </p>
                                    </div>
                                    <div className="col-12">
                                        <hr />
                                        <h6>Thông tin Booking</h6>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p>
                                                    <strong>Ngày đi:</strong>{" "}
                                                    {formatDate(selectedBooking.startDate)}
                                                </p>
                                                <p>
                                                    <strong>Người lớn:</strong>{" "}
                                                    {selectedBooking.adults}
                                                </p>
                                                <p>
                                                    <strong>Trẻ em:</strong>{" "}
                                                    {selectedBooking.children}
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <p>
                                                    <strong>Tổng tiền:</strong>{" "}
                                                    {formatCurrency(selectedBooking.totalPrice)}
                                                </p>
                                                <p>
                                                    <strong>Trạng thái:</strong>{" "}
                                                    {getStatusBadge(selectedBooking.status)}
                                                </p>
                                                <p>
                                                    <strong>Thanh toán:</strong>{" "}
                                                    {getPaymentStatusBadge(
                                                        selectedBooking.paymentStatus
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <p>
                                            <strong>Ngày đặt:</strong>{" "}
                                            {formatDate(selectedBooking.createdAt)}
                                        </p>
                                    </div>
                                    {selectedBooking.payments &&
                                        selectedBooking.payments.length > 0 && (
                                            <div className="col-12">
                                                <hr />
                                                <h6>Lịch sử Thanh toán</h6>
                                                <table className="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Ngày</th>
                                                            <th>Số tiền</th>
                                                            <th>Phương thức</th>
                                                            <th>Trạng thái</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedBooking.payments.map((payment) => (
                                                            <tr key={payment.paymentId}>
                                                                <td>
                                                                    {formatDate(payment.createdAt)}
                                                                </td>
                                                                <td>
                                                                    {formatCurrency(payment.amount)}
                                                                </td>
                                                                <td>{payment.method}</td>
                                                                <td>
                                                                    <span
                                                                        className={`badge ${
                                                                            payment.status ===
                                                                            "SUCCESS"
                                                                                ? "bg-success"
                                                                                : payment.status ===
                                                                                  "PENDING"
                                                                                ? "bg-warning"
                                                                                : "bg-danger"
                                                                        }`}
                                                                    >
                                                                        {payment.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedBooking(null)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;

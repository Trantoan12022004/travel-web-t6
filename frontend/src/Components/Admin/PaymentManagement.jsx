import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../../Stores/admin";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const PaymentManagement = () => {
    const navigate = useNavigate();
    const {
        payments,
        paymentPagination,
        paymentStats,
        fetchPayments,
        fetchPaymentStats,
        updatePaymentStatus,
        loading,
    } = useAdminStore();

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: "",
        method: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadPayments();
    }, [filters]);

    const loadData = async () => {
        try {
            await fetchPaymentStats();
        } catch (err) {
            console.error("Error loading payment stats:", err);
        }
    };

    const loadPayments = async () => {
        try {
            await fetchPayments(filters);
        } catch (err) {
            if (err.isAuthError || err.status === 401 || err.status === 403) {
                toast.error("Bạn không có quyền truy cập trang này");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                toast.error("Không thể tải danh sách payments");
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters({ ...filters, page: 1 });
    };

    const handleStatusChange = async (paymentId, currentStatus) => {
        const { value: newStatus } = await Swal.fire({
            title: "Thay đổi trạng thái payment",
            input: "select",
            inputOptions: {
                PENDING: "Đang xử lý",
                SUCCESS: "Thành công",
                FAILED: "Thất bại",
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
                await updatePaymentStatus(paymentId, newStatus);
                toast.success("Cập nhật trạng thái payment thành công!");
                // Reload để cập nhật booking payment status
                loadPayments();
            } catch (err) {
                toast.error("Không thể cập nhật trạng thái payment");
            }
        }
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    const handleViewDetail = (payment) => {
        setSelectedPayment(payment);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { text: "Đang xử lý", class: "bg-warning text-dark" },
            SUCCESS: { text: "Thành công", class: "bg-success text-white" },
            FAILED: { text: "Thất bại", class: "bg-danger text-white" },
        };
        const info = statusMap[status] || { text: status, class: "bg-secondary" };
        return <span className={`badge ${info.class}`}>{info.text}</span>;
    };

    if (loading && !payments.length && !paymentStats) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-management">
            {/* Payment Stats */}
            {paymentStats && (
                <div className="row gy-4 mb-4 p-4">
                    <div className="col-xl-3 col-md-6">
                        <div className="counter-card style2">
                            <div className="counter-card_icon">
                                <i className="fa-solid fa-credit-card"></i>
                            </div>
                            <div className="media-body">
                                <h3 className="counter-card_number">
                                    <span className="counter-number">
                                        {paymentStats.totalPayments || 0}
                                    </span>
                                </h3>
                                <p className="counter-card_text">Tổng Payments</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6">
                        <div className="counter-card style2">
                            <div className="counter-card_icon">
                                <i className="fa-solid fa-check-circle"></i>
                            </div>
                            <div className="media-body">
                                <h3 className="counter-card_number">
                                    <span className="counter-number">
                                        {paymentStats.successPayments || 0}
                                    </span>
                                </h3>
                                <p className="counter-card_text">Thành công</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6">
                        <div className="counter-card style2">
                            <div className="counter-card_icon">
                                <i className="fa-solid fa-clock"></i>
                            </div>
                            <div className="media-body">
                                <h3 className="counter-card_number">
                                    <span className="counter-number">
                                        {paymentStats.pendingPayments || 0}
                                    </span>
                                </h3>
                                <p className="counter-card_text">Đang xử lý</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6">
                        <div className="counter-card style2">
                            <div className="counter-card_icon">
                                <i className="fa-solid fa-sack-dollar"></i>
                            </div>
                            <div className="media-body">
                                <h3 className="counter-card_number">
                                    {formatCurrency(paymentStats.totalAmount || 0)}
                                </h3>
                                <p className="counter-card_text">Tổng Thu</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="booking-form mb-4 mt-4 p-4">
                <form onSubmit={handleSearch}>
                    <div className="row gy-3">
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters({ ...filters, status: e.target.value, page: 1 })
                                }
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="PENDING">Đang xử lý</option>
                                <option value="SUCCESS">Thành công</option>
                                <option value="FAILED">Thất bại</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filters.method}
                                onChange={(e) =>
                                    setFilters({ ...filters, method: e.target.value, page: 1 })
                                }
                            >
                                <option value="">Tất cả phương thức</option>
                                <option value="VNPAY">VNPay</option>
                                <option value="MOMO">MoMo</option>
                                <option value="BANK_TRANSFER">Chuyển khoản</option>
                                <option value="CASH">Tiền mặt</option>
                            </select>
                        </div>

                        <div className="col-md-4">
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
                                <option value="amount-desc">Số tiền cao - thấp</option>
                                <option value="amount-asc">Số tiền thấp - cao</option>
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
            <div className="d-flex justify-content-between align-items-center mb-4 p-4">
                <div>
                    <h5>
                        Tổng: <strong>{paymentPagination.total}</strong> payments
                    </h5>
                </div>
            </div>

            {/* Payments Table */}
            <div className="booking-form mb-4 p-4">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "50px" }}>#</th>
                                <th>Booking ID</th>
                                <th>Tour</th>
                                <th>Khách hàng</th>
                                <th className="text-end">Số tiền</th>
                                <th className="text-center">Phương thức</th>
                                <th className="text-center">Trạng thái</th>
                                <th className="text-center">Thời gian</th>
                                <th className="text-center" style={{ width: "150px" }}>
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={payment.paymentId}>
                                    <td>
                                        {(paymentPagination.page - 1) * paymentPagination.limit +
                                            index +
                                            1}
                                    </td>
                                    <td>
                                        <span className="text-primary">
                                            #{payment.bookingId}
                                        </span>
                                    </td>
                                    <td>
                                        <strong>{payment.booking?.tour?.title}</strong>
                                    </td>
                                    <td>
                                        <strong>
                                            {payment.booking?.user?.firstName}{" "}
                                            {payment.booking?.user?.lastName}
                                        </strong>
                                        <br />
                                        <small className="text-muted">
                                            {payment.booking?.user?.email}
                                        </small>
                                    </td>
                                    <td className="text-end">
                                        <strong>{formatCurrency(payment.amount)}</strong>
                                    </td>
                                    <td className="text-center">
                                        <span className="text-muted">
                                            {payment.method}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        {payment.status}
                                    </td>
                                    <td className="text-center">
                                        <small>{formatDate(payment.createdAt)}</small>
                                        {payment.paidAt && (
                                            <>
                                                <br />
                                                <small className="text-success">
                                                    Paid: {formatDate(payment.paidAt)}
                                                </small>
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        <div className="btn-group btn-group-sm" role="group">
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() =>
                                                    handleStatusChange(
                                                        payment.paymentId,
                                                        payment.status
                                                    )
                                                }
                                                title="Đổi trạng thái"
                                            >
                                                <i className="fa-solid fa-edit"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {payments.length === 0 && (
                        <div className="text-center py-5">
                            <i
                                className="fa-solid fa-inbox fa-3x text-muted mb-3 p-4"
                                style={{ opacity: 0.3 }}
                            ></i>
                            <p className="text-muted">Không có payment nào</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {paymentPagination.totalPages > 1 && (
                    <div className="th-pagination text-center mt-4">
                        <ul>
                            <li>
                                <button
                                    onClick={() => handlePageChange(paymentPagination.page - 1)}
                                    disabled={paymentPagination.page === 1}
                                    className={paymentPagination.page === 1 ? "disabled" : ""}
                                >
                                    <i className="fa-solid fa-angle-left"></i>
                                </button>
                            </li>
                            {[...Array(paymentPagination.totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                if (
                                    pageNum === 1 ||
                                    pageNum === paymentPagination.totalPages ||
                                    (pageNum >= paymentPagination.page - 2 &&
                                        pageNum <= paymentPagination.page + 2)
                                ) {
                                    return (
                                        <li key={pageNum}>
                                            <button
                                                onClick={() => handlePageChange(pageNum)}
                                                className={
                                                    paymentPagination.page === pageNum
                                                        ? "active"
                                                        : ""
                                                }
                                            >
                                                {pageNum}
                                            </button>
                                        </li>
                                    );
                                } else if (
                                    pageNum === paymentPagination.page - 3 ||
                                    pageNum === paymentPagination.page + 3
                                ) {
                                    return <li key={pageNum}>...</li>;
                                }
                                return null;
                            })}
                            <li>
                                <button
                                    onClick={() => handlePageChange(paymentPagination.page + 1)}
                                    disabled={
                                        paymentPagination.page === paymentPagination.totalPages
                                    }
                                    className={
                                        paymentPagination.page === paymentPagination.totalPages
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
            {selectedPayment && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={() => setSelectedPayment(null)}
                >
                    <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết Payment</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedPayment(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row gy-3">
                                    <div className="col-md-6">
                                        <h6>Thông tin Payment</h6>
                                        <p>
                                            <strong>Payment ID:</strong> #
                                            {selectedPayment.paymentId}
                                        </p>
                                        <p>
                                            <strong>Booking ID:</strong> #
                                            {selectedPayment.bookingId}
                                        </p>
                                        <p>
                                            <strong>Số tiền:</strong>{" "}
                                            {formatCurrency(selectedPayment.amount)}
                                        </p>
                                        <p>
                                            <strong>Phương thức:</strong> {selectedPayment.method}
                                        </p>
                                        <p>
                                            <strong>Trạng thái:</strong>{" "}
                                            {getStatusBadge(selectedPayment.status)}
                                        </p>
                                        {selectedPayment.transactionId && (
                                            <p>
                                                <strong>Transaction ID:</strong>{" "}
                                                {selectedPayment.transactionId}
                                            </p>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Thông tin Booking</h6>
                                        <p>
                                            <strong>Tour:</strong>{" "}
                                            {selectedPayment.booking?.tour?.title}
                                        </p>
                                        <p>
                                            <strong>Khách hàng:</strong>{" "}
                                            {selectedPayment.booking?.user?.firstName}{" "}
                                            {selectedPayment.booking?.user?.lastName}
                                        </p>
                                        <p>
                                            <strong>Email:</strong>{" "}
                                            {selectedPayment.booking?.user?.email}
                                        </p>
                                        <p>
                                            <strong>Ngày đi:</strong>{" "}
                                            {formatDate(selectedPayment.booking?.startDate)}
                                        </p>
                                    </div>
                                    <div className="col-12">
                                        <hr />
                                        <h6>Thời gian</h6>
                                        <p>
                                            <strong>Ngày tạo:</strong>{" "}
                                            {formatDate(selectedPayment.createdAt)}
                                        </p>
                                        {selectedPayment.paidAt && (
                                            <p>
                                                <strong>Ngày thanh toán:</strong>{" "}
                                                {formatDate(selectedPayment.paidAt)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedPayment(null)}
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

export default PaymentManagement;

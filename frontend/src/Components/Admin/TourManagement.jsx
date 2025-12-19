import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../../Stores/admin";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const TourManagement = ({ onEdit, onCreate }) => {
    const navigate = useNavigate();
    const { tours, tourPagination, fetchTours, deleteTour, updateTourStatus, loading, error } =
        useAdminStore();
    console.log("Tours in TourManagement:", tours);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: "",
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    useEffect(() => {
        loadTours();
    }, [filters]);

    const loadTours = async () => {
        try {
            await fetchTours(filters);
        } catch (err) {
            // Kiểm tra nếu là lỗi quyền truy cập
            if (err.isAuthError || err.status === 401 || err.status === 403) {
                toast.error("Bạn không có quyền truy cập trang này");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                toast.error("Không thể tải danh sách tours");
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters({ ...filters, page: 1 });
    };

    const handleDelete = async (tourId, tourTitle) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa tour?",
            html: `Bạn có chắc muốn xóa tour <strong>"${tourTitle}"</strong>?<br/><br/><small class="text-muted">Lưu ý: Tour có booking sẽ không thể xóa.</small>`,
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
                await deleteTour(tourId);
                toast.success("Xóa tour thành công!");
            } catch (err) {
                toast.error(err.message || "Không thể xóa tour");
            }
        }
    };

    const handleStatusToggle = async (tourId, currentStatus) => {
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        try {
            await updateTourStatus(tourId, newStatus);
            toast.success(`Đã chuyển tour sang trạng thái ${newStatus}`);
        } catch (err) {
            toast.error("Không thể thay đổi trạng thái");
        }
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
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

    if (loading && !tours.length) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="tour-management">
            {/* Filters */}
            <div className="booking-form mb-3 mt-4">
                <form onSubmit={handleSearch}>
                    <div className="row gy-3">
                        <div className="col-md-4">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm kiếm tour..."
                                    value={filters.search}
                                    onChange={(e) =>
                                        setFilters({ ...filters, search: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="form-group">
                                <select
                                    className="form-select"
                                    value={filters.status}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            status: e.target.value,
                                            page: 1,
                                        })
                                    }
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="ACTIVE">Đang hoạt động</option>
                                    <option value="INACTIVE">Không hoạt động</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="form-group">
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
                                    <option value="price-asc">Giá thấp - cao</option>
                                    <option value="price-desc">Giá cao - thấp</option>
                                    <option value="ratingAvg-desc">Rating cao nhất</option>
                                </select>
                            </div>
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

            {/* Action Bar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5>
                        Tổng: <strong>{tourPagination.total}</strong> tours
                    </h5>
                </div>
                <button className="th-btn" onClick={onCreate}>
                    <i className="fa-solid fa-plus me-2"></i>
                    Tạo Tour Mới
                </button>
            </div>

            {/* Tours Table */}
            <div className="booking-form mt-4">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "50px" }}>#</th>
                                <th>Tên Tour</th>
                                <th>Địa điểm</th>
                                <th className="text-center">Thời gian</th>
                                <th className="text-end">Giá</th>
                                <th className="text-center">Rating</th>
                                <th className="text-center">Bookings</th>
                                <th className="text-center">Trạng thái</th>
                                <th className="text-center" style={{ width: "200px" }}>
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tours.map((tour, index) => (
                                <tr key={tour.tourId}>
                                    <td>
                                        {(tourPagination.page - 1) * tourPagination.limit +
                                            index +
                                            1}
                                    </td>
                                    <td>
                                        <strong>{tour.title}</strong>
                                        <br />
                                        <small className="text-muted">
                                            {tour.category?.name || "N/A"}
                                        </small>
                                    </td>
                                    <td>{tour.location}</td>
                                    <td className="text-center">{tour.durationDays} ngày</td>
                                    <td className="text-end">
                                        <strong>{formatCurrency(tour.price)}</strong>
                                    </td>
                                    <td className="text-center">
                                        <small className="text-muted">
                                            {tour.ratingAvg || 0} ⭐
                                        </small>
                                    </td>
                                    <td className="text-center">
                                        <span className="text-muted">
                                            {tour._count?.bookings || 0}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <span className="text-muted">{tour.status}</span>
                                        {/* <span
                                            className={`badge ${
                                                tour.status === "ACTIVE"
                                                    ? "bg-success"
                                                    : "bg-secondary"
                                            }`}
                                        >
                                            {tour.status === "ACTIVE"
                                                ? "Hoạt động"
                                                : "Không hoạt động"}
                                        </span> */}
                                    </td>
                                    <td>
                                        <div className="btn-group btn-group-sm" role="group">
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => onEdit(tour)}
                                                title="Chỉnh sửa"
                                            >
                                                <i className="fa-solid fa-edit"></i>
                                            </button>
                                            <button
                                                className={`btn ${
                                                    tour.status === "ACTIVE"
                                                        ? "btn-outline-warning"
                                                        : "btn-outline-success"
                                                }`}
                                                onClick={() =>
                                                    handleStatusToggle(tour.tourId, tour.status)
                                                }
                                                title={
                                                    tour.status === "ACTIVE"
                                                        ? "Vô hiệu hóa"
                                                        : "Kích hoạt"
                                                }
                                            >
                                                <i
                                                    className={`fa-solid ${
                                                        tour.status === "ACTIVE"
                                                            ? "fa-eye-slash"
                                                            : "fa-eye"
                                                    }`}
                                                ></i>
                                            </button>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleDelete(tour.tourId, tour.title)
                                                }
                                                title="Xóa"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {tours.length === 0 && (
                        <div className="text-center py-5">
                            <i
                                className="fa-solid fa-inbox fa-3x text-muted mb-3"
                                style={{ opacity: 0.3 }}
                            ></i>
                            <p className="text-muted">Không có tour nào</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {tourPagination.totalPages > 1 && (
                    <div className="th-pagination text-center mt-4">
                        <ul>
                            <li>
                                <button
                                    onClick={() => handlePageChange(tourPagination.page - 1)}
                                    disabled={tourPagination.page === 1}
                                    className={tourPagination.page === 1 ? "disabled" : ""}
                                >
                                    <i className="fa-solid fa-angle-left"></i>
                                </button>
                            </li>
                            {[...Array(tourPagination.totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                // Hiển thị 5 trang xung quanh trang hiện tại
                                if (
                                    pageNum === 1 ||
                                    pageNum === tourPagination.totalPages ||
                                    (pageNum >= tourPagination.page - 2 &&
                                        pageNum <= tourPagination.page + 2)
                                ) {
                                    return (
                                        <li key={pageNum}>
                                            <button
                                                onClick={() => handlePageChange(pageNum)}
                                                className={
                                                    tourPagination.page === pageNum ? "active" : ""
                                                }
                                            >
                                                {pageNum}
                                            </button>
                                        </li>
                                    );
                                } else if (
                                    pageNum === tourPagination.page - 3 ||
                                    pageNum === tourPagination.page + 3
                                ) {
                                    return <li key={pageNum}>...</li>;
                                }
                                return null;
                            })}
                            <li>
                                <button
                                    onClick={() => handlePageChange(tourPagination.page + 1)}
                                    disabled={tourPagination.page === tourPagination.totalPages}
                                    className={
                                        tourPagination.page === tourPagination.totalPages
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
        </div>
    );
};

export default TourManagement;

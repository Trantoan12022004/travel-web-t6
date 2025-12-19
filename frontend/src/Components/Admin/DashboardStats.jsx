import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../../Stores/admin";
import { toast } from "react-toastify";

const DashboardStats = () => {
    const navigate = useNavigate();
    const {
        dashboardStats,
        revenueByMonth,
        topTours,
        fetchDashboardStats,
        fetchRevenueByMonth,
        fetchTopTours,
        loading,
        error,
    } = useAdminStore();

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [topToursType, setTopToursType] = useState("revenue");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            await Promise.all([
                fetchDashboardStats(),
                fetchRevenueByMonth(selectedYear),
                fetchTopTours(topToursType, 5),
            ]);
        } catch (err) {
            // Kiểm tra nếu là lỗi quyền truy cập
            if (err.isAuthError || err.status === 401 || err.status === 403) {
                toast.error("Bạn không có quyền truy cập trang này");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                toast.error("Không thể tải dữ liệu thống kê");
            }
        }
    };

    useEffect(() => {
        if (selectedYear) {
            fetchRevenueByMonth(selectedYear);
        }
    }, [selectedYear]);

    useEffect(() => {
        fetchTopTours(topToursType, 5);
    }, [topToursType]);

    if (loading && !dashboardStats) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <i className="fa-solid fa-exclamation-triangle me-2"></i>
                {error}
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const monthNames = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

    return (
        <div className="dashboard-stats">
            {/* Overview Stats Cards */}
            <div className="row gy-4 mb-4 p-4">
                <div className="col-xl-3 col-md-6">
                    <div className="counter-card style2">
                        <div className="counter-card_icon">
                            <i className="fa-solid fa-map-location-dot"></i>
                        </div>
                        <div className="media-body">
                            <h3 className="counter-card_number">
                                <span className="counter-number">
                                    {dashboardStats?.totalTours || 0}
                                </span>
                            </h3>
                            <p className="counter-card_text">Tổng Tours</p>
                            <span className="badge bg-success">
                                {dashboardStats?.activeTours || 0} Đang hoạt động
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="counter-card style2">
                        <div className="counter-card_icon">
                            <i className="fa-solid fa-calendar-check"></i>
                        </div>
                        <div className="media-body">
                            <h3 className="counter-card_number">
                                <span className="counter-number">
                                    {dashboardStats?.totalBookings || 0}
                                </span>
                            </h3>
                            <p className="counter-card_text">Tổng Bookings</p>
                            <span className="badge bg-warning text-dark">
                                {dashboardStats?.pendingBookings || 0} Chờ xác nhận
                            </span>
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
                                {formatCurrency(dashboardStats?.totalRevenue || 0)}
                            </h3>
                            <p className="counter-card_text">Tổng Doanh Thu</p>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="counter-card style2">
                        <div className="counter-card_icon">
                            <i className="fa-solid fa-users"></i>
                        </div>
                        <div className="media-body">
                            <h3 className="counter-card_number">
                                <span className="counter-number">
                                    {dashboardStats?.totalUsers || 0}
                                </span>
                            </h3>
                            <p className="counter-card_text">Tổng Users</p>
                            <span className="badge bg-info">
                                ⭐ {dashboardStats?.avgRating?.toFixed(1) || 0} Đánh giá TB
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="row mb-5 p-4">
                <div className="col-12">
                    <div className="booking-form">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="booking-form_title">Doanh Thu Theo Tháng</h4>
                            <select
                                className="form-select w-auto"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                <option value={2025}>2025</option>
                                <option value={2024}>2024</option>
                                <option value={2023}>2023</option>
                            </select>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        {monthNames.map((month, index) => (
                                            <th key={index} className="text-center">
                                                {month}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {revenueByMonth?.map((item, index) => (
                                            <td key={index} className="text-center">
                                                <small>{formatCurrency(item.revenue || 0)}</small>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Tours */}
            <div className="row p-4">
                <div className="col-12">
                    <div className="booking-form">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="booking-form_title">Top Tours</h4>
                            <div className="btn-group" role="group">
                                <button
                                    type="button"
                                    className={`btn btn-sm ${
                                        topToursType === "revenue"
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                    }`}
                                    onClick={() => setTopToursType("revenue")}
                                >
                                    Doanh Thu
                                </button>
                                <button
                                    type="button"
                                    className={`btn btn-sm ${
                                        topToursType === "rating"
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                    }`}
                                    onClick={() => setTopToursType("rating")}
                                >
                                    Đánh Giá
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên Tour</th>
                                        {topToursType === "revenue" ? (
                                            <>
                                                <th className="text-end">Doanh Thu</th>
                                                <th className="text-end">Bookings</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="text-center">Rating</th>
                                                <th className="text-center">Số Đánh Giá</th>
                                                <th className="text-end">Giá</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {topTours?.map((tour, index) => (
                                        <tr key={tour.tourId}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <strong>{tour.title}</strong>
                                            </td>
                                            {topToursType === "revenue" ? (
                                                <>
                                                    <td className="text-end">
                                                        <span className="badge bg-success">
                                                            {formatCurrency(tour.totalRevenue || 0)}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        {tour.totalBookings || 0}
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="text-center">
                                                        <span className="badge bg-warning text-dark">
                                                            ⭐{" "}
                                                            {tour.ratingAvg
                                                                ? Number(tour.ratingAvg).toFixed(1)
                                                                : "0.0"}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        {tour.ratingCount || 0}
                                                    </td>
                                                    <td className="text-end">
                                                        {formatCurrency(tour.price || 0)}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;

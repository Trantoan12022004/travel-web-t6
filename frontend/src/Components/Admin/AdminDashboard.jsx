import React, { useState } from "react";
import DashboardStats from "./DashboardStats";
import TourManagement from "./TourManagement";
import TourForm from "./TourForm";
import BookingManagement from "./BookingManagement";
import PaymentManagement from "./PaymentManagement";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [editingTour, setEditingTour] = useState(null);

    const handleEditTour = (tour) => {
        setEditingTour(tour);
        setActiveTab("form");
    };

    const handleCreateTour = () => {
        setEditingTour(null);
        setActiveTab("form");
    };

    const handleFormClose = () => {
        setEditingTour(null);
        setActiveTab("tours");
    };

    return (
        <div className="th-booking-sec space">
            <div className="container">
                {/* Admin Navigation Tabs */}
                <div className="row">
                    <div className="col-12">
                        <div className="booking-tab-nav mb-4">
                            <ul className="nav nav-tabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "dashboard" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveTab("dashboard")}
                                        type="button"
                                    >
                                        <i className="fa-solid fa-chart-line me-2"></i>
                                        Thống Kê
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "tours" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveTab("tours")}
                                        type="button"
                                    >
                                        <i className="fa-solid fa-map-location-dot me-2"></i>
                                        Quản Lý Tours
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "form" ? "active" : ""
                                        }`}
                                        onClick={handleCreateTour}
                                        type="button"
                                    >
                                        <i className="fa-solid fa-plus me-2"></i>
                                        Tạo Tour Mới
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "bookings" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveTab("bookings")}
                                        type="button"
                                    >
                                        <i className="fa-solid fa-calendar-check me-2"></i>
                                        Quản Lý Bookings
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "payments" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveTab("payments")}
                                        type="button"
                                    >
                                        <i className="fa-solid fa-credit-card me-2"></i>
                                        Quản Lý Payments
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="row">
                    <div className="col-12">
                        {activeTab === "dashboard" && <DashboardStats />}
                        {activeTab === "tours" && (
                            <TourManagement onEdit={handleEditTour} onCreate={handleCreateTour} />
                        )}
                        {activeTab === "form" && (
                            <TourForm tour={editingTour} onClose={handleFormClose} />
                        )}
                        {activeTab === "bookings" && <BookingManagement />}
                        {activeTab === "payments" && <PaymentManagement />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

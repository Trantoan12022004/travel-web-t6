import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useTourStore from "../../Stores/tour";
import useBookingStore from "../../Stores/booking";
import useAuthStore from "../../Stores/auth";

const BookingInner = () => {
    const { tourId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    const { currentTour, getTourById, isLoading: tourLoading } = useTourStore();
    const { createBooking, loading: bookingLoading, error } = useBookingStore();

    // Form state
    const [formData, setFormData] = useState({
        startDate: "",
        adults: 1,
        children: 0,
        specialRequests: "",
    });

    const [agreed, setAgreed] = useState(false);
    const hasShownToast = useRef(false);

    useEffect(() => {
        if (!isAuthenticated) {
            if (!hasShownToast.current) {
                toast.error("Vui lòng đăng nhập để đặt tour");
                hasShownToast.current = true;
            }
            navigate("/");
            return;
        }

        if (tourId) {
            getTourById(tourId).catch((err) => {
                console.error("Fetch tour error:", err);
                if (err.response?.status === 404) {
                    toast.error("Không tìm thấy tour");
                    navigate("/tour");
                }
            });
        }
    }, [tourId, isAuthenticated, getTourById, navigate]);

    // Calculate total price
    const calculateTotalPrice = () => {
        if (!currentTour?.price) return 0;

        const adultPrice = currentTour.price * formData.adults;
        const childPrice = currentTour.price * 0.7 * formData.children; // 70% giá người lớn

        return adultPrice + childPrice;
    };

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "adults" || name === "children" ? parseInt(value) || 0 : value,
        }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreed) {
            toast.warning("Vui lòng đồng ý với điều khoản và điều kiện");
            return;
        }

        if (!formData.startDate) {
            toast.warning("Vui lòng chọn ngày khởi hành");
            return;
        }

        if (formData.adults < 1) {
            toast.warning("Số lượng người lớn phải ít nhất là 1");
            return;
        }

        // Check ngày khởi hành phải từ hôm nay trở đi
        const selectedDate = new Date(formData.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            toast.error("Ngày khởi hành không được là ngày trong quá khứ");
            return;
        }

        try {
            const bookingData = {
                tourId: parseInt(tourId),
                startDate: formData.startDate,
                adults: formData.adults,
                children: formData.children,
                totalPrice: calculateTotalPrice(),
                specialRequests: formData.specialRequests || undefined,
            };

            const response = await createBooking(bookingData);

            toast.success("Đặt tour thành công!");

            // Chuyển đến trang chi tiết booking hoặc thanh toán
            const bookingId = response.data?.booking?.bookingId || response.booking?.bookingId;
            if (bookingId) {
                setTimeout(() => navigate(`/bookings/${bookingId}`), 1000);
            } else {
                setTimeout(() => navigate("/bookings"), 1000);
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Đặt tour thất bại: " + (error.message || "Lỗi không xác định"));
        }
    };

    // Loading state
    if (tourLoading || !currentTour) {
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
                        <p className="mt-3 text-muted fs-18">Đang tải thông tin tour...</p>
                    </div>
                </div>
            </section>
        );
    }

    const tour = currentTour;
    console.log("Current Tour in BookingInner:", tour);
    const totalPrice = calculateTotalPrice();

    return (
        <section className="space bg-smoke">
            <div className="container">
                {/* Back Button */}
                <div className="row mb-3">
                    <div className="col-12">
                        <button
                            className="th-btn style3"
                            onClick={() => navigate(`/destination/${tourId}`)}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Quay lại chi tiết tour
                        </button>
                    </div>
                </div>

                {/* Page Title */}
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="bg-white rounded-10 shadow-sm p-3">
                            <h3 className="box-title mb-2">
                                <i className="fas fa-calendar-check text-theme me-2"></i>
                                Đặt Tour
                            </h3>
                            <p className="mb-0 text-body">
                                <i className="fas fa-info-circle me-2"></i>
                                Vui lòng điền đầy đủ thông tin để hoàn tất đặt tour
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row gy-30">
                    {/* Booking Form - Left Side */}
                    <div className="col-lg-8">
                        <form onSubmit={handleSubmit}>
                            {/* Tour Information */}
                            <div className="bg-white rounded-10 shadow-sm mb-3">
                                <div className="bg-theme text-white rounded-10 p-3">
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
                                                        tour.coverImage ||
                                                        "/images/default-tour.jpg"
                                                    }
                                                    alt={tour.title}
                                                    className="w-100"
                                                    style={{ height: "200px", objectFit: "cover" }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <h4 className="box-title mb-3">{tour.title}</h4>
                                            <div className="tour-info-list">
                                                <p className="mb-2">
                                                    <i className="fas fa-location-dot me-2 text-theme"></i>
                                                    <strong>Địa điểm:</strong> {tour.location}
                                                </p>
                                                <p className="mb-2">
                                                    <i className="fas fa-clock me-2 text-theme"></i>
                                                    <strong>Thời lượng:</strong> {tour.durationDays}{" "}
                                                    ngày
                                                </p>
                                                <p className="mb-2">
                                                    <i className="fas fa-money-bill-wave me-2 text-theme"></i>
                                                    <strong>Giá:</strong>{" "}
                                                    {Number(tour.price || 0).toLocaleString(
                                                        "vi-VN"
                                                    )}{" "}
                                                    ₫/người
                                                </p>
                                                <p className="mb-0">
                                                    <i className="fas fa-child me-2 text-theme"></i>
                                                    <strong>Giá trẻ em:</strong>{" "}
                                                    {Number((tour.price || 0) * 0.7).toLocaleString(
                                                        "vi-VN"
                                                    )}{" "}
                                                    ₫/trẻ (70% giá người lớn)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details Form */}
                            <div className="bg-white rounded-10 shadow-sm mb-3">
                                <div className="bg-theme text-white rounded-10 p-3">
                                    <h4 className="mb-0 text-white">
                                        <i className="fas fa-edit me-2"></i>
                                        Chi Tiết Đặt Tour
                                    </h4>
                                </div>
                                <div className="p-3">
                                    <div className="row g-3">
                                        {/* Start Date */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="fas fa-calendar-days me-2 text-theme"></i>
                                                Ngày khởi hành{" "}
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                className="form-control"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split("T")[0]}
                                                required
                                            />
                                        </div>

                                        {/* Adults */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="fas fa-users me-2 text-theme"></i>
                                                Số người lớn <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="adults"
                                                className="form-control"
                                                value={formData.adults}
                                                onChange={handleChange}
                                                min="1"
                                                max="20"
                                                required
                                            />
                                            <small className="text-muted">Từ 12 tuổi trở lên</small>
                                        </div>

                                        {/* Children */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="fas fa-child me-2 text-theme"></i>
                                                Số trẻ em
                                            </label>
                                            <input
                                                type="number"
                                                name="children"
                                                className="form-control"
                                                value={formData.children}
                                                onChange={handleChange}
                                                min="0"
                                                max="10"
                                            />
                                            <small className="text-muted">Dưới 12 tuổi</small>
                                        </div>

                                        {/* Total Guests Display */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="fas fa-user-group me-2 text-theme"></i>
                                                Tổng số khách
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={`${
                                                    formData.adults + formData.children
                                                } người`}
                                                disabled
                                            />
                                        </div>

                                        {/* Special Requests */}
                                        <div className="col-12">
                                            <label className="form-label">
                                                <i className="fas fa-comment-dots me-2 text-theme"></i>
                                                Yêu cầu đặc biệt (tùy chọn)
                                            </label>
                                            <textarea
                                                name="specialRequests"
                                                className="form-control"
                                                rows="4"
                                                placeholder="Ví dụ: Dị ứng thực phẩm, yêu cầu phòng riêng, cần xe đưa đón..."
                                                value={formData.specialRequests}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="bg-white rounded-10 shadow-sm mb-3">
                                <div className="p-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="agreeTerms"
                                            checked={agreed}
                                            onChange={(e) => setAgreed(e.target.checked)}
                                            style={{ width: "20px", height: "20px" }}
                                        />
                                        <label
                                            className="form-check-label ms-2"
                                            htmlFor="agreeTerms"
                                        >
                                            Tôi đồng ý với{" "}
                                            <a href="/terms" target="_blank" className="text-theme">
                                                điều khoản và điều kiện
                                            </a>{" "}
                                            của công ty
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-danger mb-3">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="d-grid gap-2">
                                <button
                                    type="submit"
                                    className="th-btn"
                                    disabled={bookingLoading || !agreed}
                                    style={{ fontSize: "16px", padding: "15px" }}
                                >
                                    {bookingLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-check-circle me-2"></i>
                                            Xác nhận đặt tour
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary - Right Side */}
                    <div className="col-lg-4">
                        <div className="position-sticky" style={{ top: "100px" }}>
                            <div className="bg-white rounded-10 shadow-sm">
                                <div className="bg-theme text-white rounded-10 p-3">
                                    <h5 className="mb-0 text-white">
                                        <i className="fas fa-receipt me-2"></i>
                                        Tóm Tắt Đơn Hàng
                                    </h5>
                                </div>
                                <div className="p-3">
                                    {/* Price Breakdown */}
                                    <div className="price-breakdown mb-3">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-body">
                                                Người lớn ({formData.adults}):
                                            </span>
                                            <strong className="text-title">
                                                {(
                                                    (tour.price || 0) * formData.adults
                                                ).toLocaleString("vi-VN")}{" "}
                                                ₫
                                            </strong>
                                        </div>
                                        {formData.children > 0 && (
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-body">
                                                    Trẻ em ({formData.children}):
                                                </span>
                                                <strong className="text-title">
                                                    {(
                                                        (tour.price || 0) *
                                                        0.7 *
                                                        formData.children
                                                    ).toLocaleString("vi-VN")}{" "}
                                                    ₫
                                                </strong>
                                            </div>
                                        )}
                                    </div>

                                    <hr />

                                    {/* Total Price */}
                                    <div className="p-3 rounded-10 gr-bg1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <small className="text-black d-block mb-1 opacity-75">
                                                    Tổng tiền
                                                </small>
                                                <h4 className="text-black mb-0">
                                                    {totalPrice.toLocaleString("vi-VN")} ₫
                                                </h4>
                                            </div>
                                            <i
                                                className="fas fa-money-bill-wave text-white opacity-25"
                                                style={{ fontSize: "2rem" }}
                                            ></i>
                                        </div>
                                    </div>

                                    {/* Booking Info */}
                                    <div className="mt-3">
                                        <div className="alert alert-info border-0 mb-0">
                                            <small>
                                                <i className="fas fa-info-circle me-2"></i>
                                                <strong>Lưu ý:</strong> Sau khi đặt tour, bạn cần
                                                thanh toán để xác nhận booking.
                                            </small>
                                        </div>
                                    </div>

                                    {/* Support Info */}
                                    <hr />
                                    <div>
                                        <h6 className="mb-3">
                                            <i className="fas fa-headset text-theme me-2"></i>
                                            Cần hỗ trợ?
                                        </h6>
                                        <div className="mb-2">
                                            <small className="text-body d-block">
                                                Hotline 24/7
                                            </small>
                                            <strong className="text-title">1900 xxxx</strong>
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
        </section>
    );
};

export default BookingInner;

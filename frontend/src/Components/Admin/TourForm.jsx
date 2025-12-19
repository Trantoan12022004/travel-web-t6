import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../../Stores/admin";
import { toast } from "react-toastify";

const TourForm = ({ tour, onClose }) => {
    const navigate = useNavigate();
    const { createTour, updateTour, loading, categories, fetchCategories } = useAdminStore();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        durationDays: 1,
        price: 0,
        categoryId: "",
        status: "ACTIVE",
        coverImage: "",
        images: [],
        schedules: [],
    });

    const [newImage, setNewImage] = useState("");
    const [newSchedule, setNewSchedule] = useState({
        dayNumber: 1,
        title: "",
        description: "",
        image: "",
    });

    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        // Fetch categories khi component mount
        fetchCategories();
    }, []);

    useEffect(() => {
        if (tour) {
            setFormData({
                title: tour.title || "",
                description: tour.description || "",
                location: tour.location || "",
                durationDays: tour.durationDays || 1,
                price: tour.price || 0,
                categoryId: tour.categoryId || "",
                status: tour.status || "ACTIVE",
                coverImage: tour.coverImage || "",
                images: tour.images || [],
                schedules: tour.schedules || [],
            });
        }
    }, [tour]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddImage = () => {
        if (newImage.trim()) {
            setFormData({
                ...formData,
                images: [...formData.images, { imageUrl: newImage.trim() }],
            });
            setNewImage("");
        }
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        });
    };

    const handleAddSchedule = () => {
        if (newSchedule.title.trim() && newSchedule.description.trim()) {
            setFormData({
                ...formData,
                schedules: [
                    ...formData.schedules,
                    { ...newSchedule, dayNumber: Number(newSchedule.dayNumber) },
                ],
            });
            setNewSchedule({
                dayNumber: formData.schedules.length + 2,
                title: "",
                description: "",
                image: "",
            });
        }
    };

    const handleRemoveSchedule = (index) => {
        setFormData({
            ...formData,
            schedules: formData.schedules.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error("Vui lòng nhập tên tour");
            return;
        }
        if (!formData.location.trim()) {
            toast.error("Vui lòng nhập địa điểm");
            return;
        }
        if (formData.price <= 0) {
            toast.error("Giá tour phải lớn hơn 0");
            return;
        }

        try {
            const submitData = {
                ...formData,
                durationDays: Number(formData.durationDays),
                price: Number(formData.price),
                categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
            };

            if (tour) {
                await updateTour(tour.tourId, submitData);
                toast.success("Cập nhật tour thành công!");
            } else {
                await createTour(submitData);
                toast.success("Tạo tour mới thành công!");
            }
            onClose();
        } catch (err) {
            // Kiểm tra nếu là lỗi quyền truy cập
            if (err.isAuthError || err.status === 401 || err.status === 403) {
                toast.error("Bạn không có quyền thực hiện thao tác này");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                toast.error(err.message || "Có lỗi xảy ra");
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat.categoryId === Number(categoryId));
        return category ? category.name : "Chưa chọn";
    };

    return (
        <div className="tour-form">
            <div className="booking-form">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="booking-form_title">
                        {tour ? "Chỉnh Sửa Tour" : "Tạo Tour Mới"}
                    </h4>
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className={`btn ${showPreview ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            <i className={`fa-solid fa-${showPreview ? "edit" : "eye"} me-2`}></i>
                            {showPreview ? "Chỉnh sửa" : "Xem trước"}
                        </button>
                        <button className="btn btn-outline-secondary" onClick={onClose}>
                            <i className="fa-solid fa-times me-2"></i>
                            Đóng
                        </button>
                    </div>
                </div>

                {!showPreview ? (
                    <form onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <div className="row gy-3 mb-4">
                            <div className="col-md-8">
                                <div className="form-group">
                                    <label className="form-label">
                                        Tên Tour <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="form-label">
                                        Trạng thái <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        className="form-select"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="ACTIVE">Hoạt động</option>
                                        <option value="INACTIVE">Không hoạt động</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <label className="form-label">
                                        Mô tả <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="4"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">
                                        Địa điểm <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-control"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="form-label">
                                        Thời gian (ngày) <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="durationDays"
                                        className="form-control"
                                        min="1"
                                        value={formData.durationDays}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="form-label">
                                        Giá (VNĐ) <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="form-control"
                                        min="0"
                                        step="1000"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Danh mục (Optional)</label>
                                    <select
                                        name="categoryId"
                                        className="form-select"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.categoryId}
                                                value={category.categoryId}
                                            >
                                                {category.name} ({category._count?.tours || 0}{" "}
                                                tours)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Cover Image URL</label>
                                    <input
                                        type="url"
                                        name="coverImage"
                                        className="form-control"
                                        value={formData.coverImage}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Images Section */}
                        <div className="mb-4">
                            <h5 className="mb-3">Hình Ảnh Tour</h5>
                            <div className="row gy-2 mb-3">
                                <div className="col-md-10">
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="Nhập URL hình ảnh..."
                                        value={newImage}
                                        onChange={(e) => setNewImage(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary w-100"
                                        onClick={handleAddImage}
                                    >
                                        <i className="fa-solid fa-plus"></i> Thêm
                                    </button>
                                </div>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="list-group">
                                    {formData.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <div className="d-flex align-items-center">
                                                <span className="">{index + 1}</span>
                                                <small
                                                    className="text-truncate"
                                                    style={{ maxWidth: "500px" }}
                                                >
                                                    {img.imageUrl}
                                                </small>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Schedules Section */}
                        <div className="mb-4">
                            <h5 className="mb-3">Lịch Trình Tour</h5>
                            <div className="card mb-3">
                                <div className="card-body">
                                    <div className="row gy-2">
                                        <div className="col-md-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Ngày"
                                                min="1"
                                                value={newSchedule.dayNumber}
                                                onChange={(e) =>
                                                    setNewSchedule({
                                                        ...newSchedule,
                                                        dayNumber: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="col-md-10">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Tiêu đề lịch trình..."
                                                value={newSchedule.title}
                                                onChange={(e) =>
                                                    setNewSchedule({
                                                        ...newSchedule,
                                                        title: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="col-12">
                                            <textarea
                                                className="form-control"
                                                placeholder="Mô tả chi tiết..."
                                                rows="2"
                                                value={newSchedule.description}
                                                onChange={(e) =>
                                                    setNewSchedule({
                                                        ...newSchedule,
                                                        description: e.target.value,
                                                    })
                                                }
                                            ></textarea>
                                        </div>
                                        <div className="col-md-10">
                                            <input
                                                type="url"
                                                className="form-control"
                                                placeholder="URL hình ảnh (optional)..."
                                                value={newSchedule.image}
                                                onChange={(e) =>
                                                    setNewSchedule({
                                                        ...newSchedule,
                                                        image: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary w-100"
                                                onClick={handleAddSchedule}
                                            >
                                                <i className="fa-solid fa-plus"></i> Thêm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {formData.schedules.length > 0 && (
                                <div className="list-group">
                                    {formData.schedules
                                        .sort((a, b) => a.dayNumber - b.dayNumber)
                                        .map((schedule, index) => (
                                            <div key={index} className="list-group-item">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="flex-grow-1">
                                                        <h6>
                                                            <span className="badge bg-primary me-2">
                                                                Ngày {schedule.dayNumber}
                                                            </span>
                                                            {schedule.title}
                                                        </h6>
                                                        <p className="mb-0 text-muted small">
                                                            {schedule.description}
                                                        </p>
                                                        {schedule.image && (
                                                            <small className="text-muted">
                                                                <i className="fa-solid fa-image me-1"></i>
                                                                Có hình ảnh
                                                            </small>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger ms-3"
                                                        onClick={() => handleRemoveSchedule(index)}
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button type="submit" className="th-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-save me-2"></i>
                                        {tour ? "Cập Nhật" : "Tạo Tour"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="tour-preview">
                        {/* Preview Header */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <h2 className="mb-3">
                                            {formData.title || "Chưa có tên tour"}
                                        </h2>
                                        <div className="d-flex gap-3 mb-3">
                                            <span
                                            >
                                                {formData.status}
                                            </span>
                                            <span className="">
                                                {getCategoryName(formData.categoryId)}
                                            </span>
                                        </div>
                                        <div className="mb-2">
                                            <i className="fa-solid fa-location-dot text-primary me-2"></i>
                                            <strong>Địa điểm:</strong>{" "}
                                            {formData.location || "Chưa nhập"}
                                        </div>
                                        <div className="mb-2">
                                            <i className="fa-solid fa-clock text-primary me-2"></i>
                                            <strong>Thời gian:</strong> {formData.durationDays} ngày
                                        </div>
                                        <div className="mb-2">
                                            <i className="fa-solid fa-dollar-sign text-primary me-2"></i>
                                            <strong>Giá:</strong> {formatCurrency(formData.price)}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        {formData.coverImage ? (
                                            <img
                                                src={formData.coverImage}
                                                alt="Cover"
                                                className="img-fluid rounded"
                                                style={{
                                                    maxHeight: "200px",
                                                    objectFit: "cover",
                                                    width: "100%",
                                                }}
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://via.placeholder.com/400x300?text=Invalid+Image";
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="bg-light rounded d-flex align-items-center justify-content-center"
                                                style={{ height: "200px" }}
                                            >
                                                <span className="text-muted">Chưa có ảnh bìa</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {formData.description && (
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">Mô tả</h5>
                                    <p className="text-muted" style={{ whiteSpace: "pre-wrap" }}>
                                        {formData.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Images Gallery */}
                        {formData.images.length > 0 && (
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">
                                        Thư viện ảnh ({formData.images.length} ảnh)
                                    </h5>
                                    <div className="row g-3">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="col-md-4 col-sm-6">
                                                <img
                                                    src={img.imageUrl}
                                                    alt={`Tour ${index + 1}`}
                                                    className="img-fluid rounded"
                                                    style={{
                                                        height: "200px",
                                                        objectFit: "cover",
                                                        width: "100%",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/400x300?text=Invalid+Image";
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Schedules */}
                        {formData.schedules.length > 0 && (
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">
                                        Lịch trình tour ({formData.schedules.length} ngày)
                                    </h5>
                                    {formData.schedules
                                        .sort((a, b) => a.dayNumber - b.dayNumber)
                                        .map((schedule, index) => (
                                            <div key={index} className="mb-4">
                                                <div className="d-flex align-items-start">
                                                    <div
                                                        className="badge bg-primary me-3"
                                                        style={{
                                                            fontSize: "1rem",
                                                            padding: "0.5rem 1rem",
                                                        }}
                                                    >
                                                        Ngày {schedule.dayNumber}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-2">{schedule.title}</h6>
                                                        <p
                                                            className="text-muted mb-2"
                                                            style={{ whiteSpace: "pre-wrap" }}
                                                        >
                                                            {schedule.description}
                                                        </p>
                                                        {schedule.image && (
                                                            <img
                                                                src={schedule.image}
                                                                alt={`Day ${schedule.dayNumber}`}
                                                                className="img-fluid rounded mt-2"
                                                                style={{
                                                                    maxHeight: "250px",
                                                                    objectFit: "cover",
                                                                }}
                                                                onError={(e) => {
                                                                    e.target.src =
                                                                        "https://via.placeholder.com/600x300?text=Invalid+Image";
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                {index < formData.schedules.length - 1 && (
                                                    <hr className="my-3" />
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Preview Actions */}
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPreview(false)}
                            >
                                <i className="fa-solid fa-edit me-2"></i>
                                Quay lại chỉnh sửa
                            </button>
                            <button
                                type="button"
                                className="th-btn"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-save me-2"></i>
                                        {tour ? "Cập Nhật Tour" : "Tạo Tour"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TourForm;

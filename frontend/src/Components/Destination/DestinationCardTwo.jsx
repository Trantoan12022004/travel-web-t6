import React from "react";
import { Link } from "react-router-dom";

function DestinationCardTwo(props) {
    const {
        destinationID,
        destinationImage,
        destinationTitle,
        destinationPrice,
        rating = 0,
        ratingCount = 0,
    } = props;

    const maxRating = 5;
    const safeRating = Math.min(maxRating, Math.max(0, rating));
    const ratingPercent = (safeRating / maxRating) * 100;
    const formatVND = (value) => {
        if (value === null || value === undefined || isNaN(value)) return "0 ₫";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };
    return (
        <div className="tour-box style-flex th-ani">
            <div className="tour-box_img global-img">
                <img src={destinationImage} alt="" />
            </div>
            <div className="tour-content">
                <h3 className="box-title">
                    <Link to={`/destination/${destinationID}`}>
                        {destinationTitle ? destinationTitle : "Dubai"}
                    </Link>
                </h3>
                <div className="tour-rating">
                    <div
                        className="star-rating"
                        role="img"
                        aria-label={`Rated ${safeRating} out of ${maxRating}`}
                    >
                        <span style={{ width: `${ratingPercent}%` }}>
                            Rated
                            <strong className="rating">{safeRating.toFixed(1)}</strong>
                            out of {maxRating}
                        </span>
                    </div>
                    <Link to={`/destination/${destinationID}`} className="woocommerce-review-link">
                        (<span className="count">4.8</span>
                        Đánh giá)
                    </Link>
                </div>
                <h4 className="tour-box_price">
                    <span className="currency">{formatVND(destinationPrice)}</span>
                    /Người
                </h4>
                <div className="tour-action">
                    <span>
                        <i className="fa-light fa-clock" />7 Ngày
                    </span>
                    <Link to={`/booking/${destinationID}`} className="th-btn style4 th-icon">
                        Đặt Ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DestinationCardTwo;

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const destinations = [
    {
        id: 1,
        title: "Tour Vịnh Hạ Long - Di Sản Thế Giới",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
        rating: 4.9,
        price: 3200000,
        duration: "2 Ngày 1 Đêm",
        link: "/tour-details",
    },
    {
        id: 2,
        title: "Tour Sapa - Chinh Phục Fansipan",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
        rating: 4.8,
        price: 4500000,
        duration: "3 Ngày 2 Đêm",
        link: "/tour-details",
    },
    {
        id: 3,
        title: "Tour Phú Quốc - Đảo Ngọc Thiên Đường",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
        rating: 4.9,
        price: 5800000,
        duration: "4 Ngày 3 Đêm",
        link: "/tour-details",
    },
    {
        id: 4,
        title: "Tour Đà Nẵng - Hội An - Huế",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
        rating: 4.7,
        price: 4200000,
        duration: "4 Ngày 3 Đêm",
        link: "/tour-details",
    },
    {
        id: 5,
        title: "Tour Nha Trang - Vinpearl Land",
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
        rating: 4.8,
        price: 3800000,
        duration: "3 Ngày 2 Đêm",
        link: "/tour-details",
    },
    {
        id: 6,
        title: "Tour Đà Lạt - Thành Phố Ngàn Hoa",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        rating: 4.7,
        price: 3500000,
        duration: "3 Ngày 2 Đêm",
        link: "/tour-details",
    },
    {
        id: 7,
        title: "Tour Ninh Bình - Tràng An - Tam Cốc",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
        rating: 4.6,
        price: 2800000,
        duration: "2 Ngày 1 Đêm",
        link: "/tour-details",
    },
    {
        id: 8,
        title: "Tour Miền Tây - Chợ Nổi Cái Răng",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
        rating: 4.7,
        price: 2500000,
        duration: "2 Ngày 1 Đêm",
        link: "/tour-details",
    },
];
const sectionStyle = {
    position: "relative",
    overflow: "hidden",
    backgroundImage: "url('/assets/img/bg/tour_bg_2.jpg')",
    backgroundPosition: "top center",
    zIndex: 3,
    backgroundRepeat: "no-repeat",
    marginBottom: -348,
};

function PopularDestination() {
    return (
        <section
            className="tour-sec2 position-relative overflow-hidden bg-top-center z-index-3 space-top"
            id="tour-sec"
            style={sectionStyle}
        >
            <div className="container">
                <div className="title-area mb-15 text-center">
                    <h2 className="sec-title">Điểm Đến Phổ Biến Dành Cho Mọi Người</h2>
                    <p className="tour-text">
                        Khám phá những điểm đến hấp dẫn nhất tại Việt Nam với các gói tour được
                        thiết kế đặc biệt, mang đến trải nghiệm du lịch tuyệt vời với giá cả hợp lý
                        và dịch vụ chuyên nghiệp.
                    </p>
                </div>

                <div className="slider-area tour-slider">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={20}
                        grabCursor={true}
                        speed={1000}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            480: { slidesPerView: 2 },
                            576: { slidesPerView: 2 },
                            1199: { slidesPerView: 3 },
                            1400: { slidesPerView: 4 },
                        }}
                        className="th-slider tourSlider2 has-shadow"
                    >
                        {destinations.map((destination) => (
                            <SwiperSlide key={destination.id}>
                                <div className="tour-card th-ani gsap-cursor">
                                    <div className="tour-card_img global-img">
                                        <img src={destination.image} alt={destination.title} />
                                    </div>
                                    <div className="tour-content">
                                        <h3 className="box-title">
                                            <Link to={destination.link}>{destination.title}</Link>
                                        </h3>
                                        <div className="tour-rating">
                                            <div
                                                className="star-rating"
                                                role="img"
                                                aria-label={`Rated ${destination.rating} out of 5`}
                                            >
                                                <span style={{ width: "100%" }}>
                                                    Rated <strong className="rating">5.00</strong>{" "}
                                                    out of 5 based on{" "}
                                                    <span className="rating">
                                                        {destination.rating}
                                                    </span>{" "}
                                                    ({destination.rating} Rating)
                                                </span>
                                            </div>
                                            <Link
                                                to={destination.link}
                                                className="woocommerce-review-link"
                                            >
                                                (<span className="count">{destination.rating}</span>{" "}
                                                Rating)
                                            </Link>
                                        </div>
                                        <h4 className="tour-card_price">
                                            <span className="currency">
                                                {destination.price.toLocaleString("vi-VN")}đ
                                            </span>
                                            /Người
                                        </h4>
                                        <div className="tour-action">
                                            <span>
                                                <i className="fa-light fa-clock" />{" "}
                                                {destination.duration}
                                            </span>
                                            <Link to="/contact" className="th-btn style4">
                                                Đặt Ngay
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default PopularDestination;

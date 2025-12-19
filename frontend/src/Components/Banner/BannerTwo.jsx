import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Core Swiper styles
import { Pagination, A11y, EffectFade, Autoplay, Navigation, Thumbs } from "swiper/modules"; // Correctly import necessary modules
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { Link } from "react-router-dom";
function BannerTwo() {
    const swiperRef = useRef(null);
    const thumbsSwiperRef = useRef(null); // Reference for the thumbs swiper
    useEffect(() => {
        // Function to add animation classes
        const animationProperties = () => {
            document.querySelectorAll("[data-ani]").forEach((element) => {
                const animationName = element.getAttribute("data-ani");
                element.classList.add(animationName);
            });
            document.querySelectorAll("[data-ani-delay]").forEach((element) => {
                const delayTime = element.getAttribute("data-ani-delay");
                element.style.animationDelay = delayTime;
            });
        };
        animationProperties();
    }, []);
    // Event handler for custom navigation arrows
    const handleSliderNavigation = (direction) => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const swiper = swiperRef.current.swiper;
            if (direction === "prev") {
                swiper.slidePrev();
            } else {
                swiper.slideNext();
            }
        }
    };
    const destinationRef = useRef(null);
    const handleScroll = (e) => {
        e.preventDefault();
        document.getElementById("destination-sec")?.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <div className="hero-2" id="hero">
            <div
                className="hero2-overlay"
                style={{ backgroundImage: "url(/assets/img/bg/line-pattern.png)" }}
            />
            {/* Main Swiper */}
            <Swiper
                modules={[Pagination, Navigation, Thumbs, EffectFade, Autoplay]} // Added necessary modules
                className="swiper hero-slider-2"
                id="heroSlide2"
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiperRef.current }} // Using thumbsSwiperRef to link thumbs swiper
                effect="fade"
                pagination={{
                    el: ".slider-pagination",
                    type: "progressbar",
                    clickable: true,
                }}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                loop={true}
                watchSlidesProgress={true}
                ref={swiperRef} // Attach ref to the main swiper
            >
                <SwiperSlide>
                    <div className="hero-inner">
                        <div
                            className="th-hero-bg"
                            style={{
                                backgroundImage:
                                    "url(https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80)",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                            }}
                        />
                        <div className="container">
                            <div className="hero-style2">
                                <h1
                                    className="hero-title"
                                    data-ani="slideinup"
                                    data-ani-delay="0.4s"
                                >
                                    Khám Phá <span className="hero-text">Vẻ Đẹp Việt Nam</span>
                                </h1>
                                <p className="hero-desc" data-ani="slideinup" data-ani-delay="0.5s">
                                    Trải nghiệm những điểm đến tuyệt vời nhất Việt Nam - từ vịnh Hạ
                                    Long hùng vĩ đến phố cổ Hội An thơ mộng, từ Sapa mây trắng đến
                                    Phú Quốc ngập tràn nắng vàng.
                                </p>
                                <div
                                    className="btn-group"
                                    data-ani="slideinup"
                                    data-ani-delay="0.6s"
                                >
                                    <Link to="/destination" className="th-btn white-btn th-icon">
                                        Khám Phá Tours
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="hero-inner">
                        <video autoPlay loop muted>
                            <source src="/assets/img/hero/hero-video.mp4" type="video/mp4" />
                        </video>
                        <div className="container">
                            <div className="hero-style2">
                                <h1
                                    className="hero-title"
                                    data-ani="slideinup"
                                    data-ani-delay="0.4s"
                                >
                                    Khám Phá <span className="hero-text">Đất Nước Hình Chữ S</span>
                                </h1>
                                <p className="hero-desc" data-ani="slideinup" data-ani-delay="0.5s">
                                    Hành trình khám phá văn hóa đa dạng, ẩm thực phong phú và con
                                    người thân thiện. Từ miền Bắc lịch sử, miền Trung cổ kính đến
                                    miền Nam năng động.
                                </p>
                                <div
                                    className="btn-group"
                                    data-ani="slideinup"
                                    data-ani-delay="0.6s"
                                >
                                    <Link to="/destination" className="th-btn white-btn th-icon">
                                        Khám Phá Tours
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="hero-inner">
                        <div
                            className="th-hero-bg"
                            style={{
                                backgroundImage:
                                    "url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80)",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                            }}
                        />
                        <div className="container">
                            <div className="hero-style2">
                                <h1
                                    className="hero-title"
                                    data-ani="slideinup"
                                    data-ani-delay="0.4s"
                                >
                                    Tận Hưởng <span className="hero-text">Kỳ Nghỉ Tuyệt Vời</span>
                                </h1>
                                <p className="hero-desc" data-ani="slideinup" data-ani-delay="0.5s">
                                    Chúng tôi mang đến những trải nghiệm du lịch đáng nhớ với hành
                                    trình được thiết kế kỹ lưỡng, dịch vụ chuyên nghiệp và giá cả
                                    hợp lý nhất.
                                </p>
                                <div
                                    className="btn-group"
                                    data-ani="slideinup"
                                    data-ani-delay="0.6s"
                                >
                                    <Link to="/destination" className="th-btn white-btn th-icon">
                                        Khám Phá Tours
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
            {/* Custom Navigation */}
            <div className="th-swiper-custom">
                <div className="slider-pagination" />
                <div className="hero-icon">
                    <button
                        data-slider-prev="#heroSlide2"
                        className="hero-arrow slider-prev"
                        onClick={() => handleSliderNavigation("prev")}
                    >
                        <img src="/assets/img/icon/hero-arrow-left.svg" alt="" />
                    </button>
                    <button
                        data-slider-next="#heroSlide2"
                        className="hero-arrow slider-next"
                        onClick={() => handleSliderNavigation("next")}
                    >
                        <img src="/assets/img/icon/hero-arrow-right.svg" alt="" />
                    </button>
                </div>
            </div>
            {/* Thumbs Swiper */}
            <Swiper
                modules={[Pagination, Navigation, A11y]}
                className="heroThumbs style2"
                id="heroSlide3"
                spaceBetween={10}
                slidesPerView={2}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                navigation={{
                    nextEl: ".slider-next",
                    prevEl: ".slider-prev",
                }}
                loop={true}
                watchSlidesProgress={true}
                slideToClickedSlide={true}
                centeredSlidesBounds={true}
                ref={thumbsSwiperRef} // Attach ref to the thumbs swiper
            >
                <SwiperSlide>
                    <div className="hero-inner">
                        <div className="hero-card">
                            <div className="hero-img">
                                <img
                                    src="https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80"
                                    alt="Vịnh Hạ Long"
                                />
                            </div>
                            <div className="hero-card_content">
                                <h3 className="box-title">Vịnh Hạ Long</h3>
                                <h4 className="hero-card_price">
                                    <span className="currency">3.200.000đ</span>/Người
                                </h4>
                                <span className="d-block">
                                    <i className="fa-light fa-clock" />2 Ngày 1 Đêm
                                </span>
                                <Link to="/destination" className="th-btn style2">
                                    Đặt Ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="hero-inner">
                        <div className="hero-card">
                            <div className="hero-img">
                                <img
                                    src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80"
                                    alt="Sapa"
                                />
                            </div>
                            <div className="hero-card_content">
                                <h3 className="box-title">Sapa - Fansipan</h3>
                                <h4 className="hero-card_price">
                                    <span className="currency">4.500.000đ</span>/Người
                                </h4>
                                <span className="d-block">
                                    <i className="fa-light fa-clock" />3 Ngày 2 Đêm
                                </span>
                                <Link to="/destination" className="th-btn style2">
                                    Đặt Ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="hero-inner">
                        <div className="hero-card">
                            <div className="hero-img">
                                <img
                                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80"
                                    alt="Phú Quốc"
                                />
                            </div>
                            <div className="hero-card_content">
                                <h3 className="box-title">Phú Quốc</h3>
                                <h4 className="hero-card_price">
                                    <span className="currency">5.800.000đ</span>/Người
                                </h4>
                                <span className="d-block">
                                    <i className="fa-light fa-clock" />4 Ngày 3 Đêm
                                </span>
                                <Link to="/destination" className="th-btn style2">
                                    Đặt Ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                {/* Add more SwiperSlides here as needed */}
            </Swiper>
            <div className="scroll-down">
                <Link to="/#destination-sec" onClick={handleScroll} className="scroll-wrap">
                    <span>
                        <img src="/assets/img/icon/down-arrow.svg" alt="" />
                    </span>
                    Cuộn Xuống
                </Link>
            </div>
        </div>
    );
}
export default BannerTwo;

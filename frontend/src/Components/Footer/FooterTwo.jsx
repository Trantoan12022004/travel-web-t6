import React from "react";
import { Link } from "react-router-dom";

function FooterTwo() {
    return (
        <footer className="footer-wrapper bg-title footer-layout2">
            <div className="widget-area">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-md-6 col-xl-3">
                            <div className="widget footer-widget">
                                <div className="th-widget-about">
                                    <div className="about-logo">
                                        <Link to="/">
                                            <img src="/assets/img/logo-white.svg" alt="Tourm" />
                                        </Link>
                                    </div>
                                    <p className="about-text">
                                        Chúng tôi mang đến những trải nghiệm du lịch tuyệt vời nhất
                                        tại Việt Nam với dịch vụ chuyên nghiệp, giá cả hợp lý và cam
                                        kết chất lượng hàng đầu.
                                    </p>
                                    <div className="th-social">
                                        <Link to="https://www.facebook.com/">
                                            <i className="fab fa-facebook-f" />
                                        </Link>
                                        <Link to="https://www.twitter.com/">
                                            <i className="fab fa-twitter" />
                                        </Link>
                                        <Link to="https://www.linkedin.com/">
                                            <i className="fab fa-linkedin-in" />
                                        </Link>
                                        <Link to="https://www.whatsapp.com/">
                                            <i className="fab fa-whatsapp" />
                                        </Link>
                                        <Link to="https://instagram.com/">
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto"></div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget footer-widget">
                                <h3 className="widget_title">Liên Hệ</h3>
                                <div className="th-widget-contact">
                                    <div className="info-box_text">
                                        <div className="icon">
                                            <img src="/assets/img/icon/phone.svg" alt="img" />
                                        </div>
                                        <div className="details">
                                            <p>
                                                <Link
                                                    to="/tel:+84287654321"
                                                    className="info-box_link"
                                                >
                                                    +84 28 7654 321
                                                </Link>
                                            </p>
                                            <p>
                                                <Link
                                                    to="/tel:+84901234567"
                                                    className="info-box_link"
                                                >
                                                    +84 90 123 4567
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon">
                                            <img src="/assets/img/icon/envelope.svg" alt="img" />
                                        </div>
                                        <div className="details">
                                            <p>
                                                <Link
                                                    to="/mailto:info@dulichvietnam.vn"
                                                    className="info-box_link"
                                                >
                                                    info@dulichvietnam.vn
                                                </Link>
                                            </p>
                                            <p>
                                                <Link
                                                    to="/mailto:hotro@dulichvietnam.vn"
                                                    className="info-box_link"
                                                >
                                                    hotro@dulichvietnam.vn
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon">
                                            <img
                                                src="/assets/img/icon/location-dot.svg"
                                                alt="img"
                                            />
                                        </div>
                                        <div className="details">
                                            <p>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget footer-widget">
                                <h3 className="widget_title">Bài Viết Instagram</h3>
                                <div className="sidebar-gallery">
                                    <div className="gallery-thumb">
                                        <img
                                            src="https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80"
                                            alt="Hạ Long Bay"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80"
                                            alt="Sapa"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80"
                                            alt="Phú Quốc"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80"
                                            alt="Hội An"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"
                                            alt="Đà Lạt"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&q=80"
                                            alt="Nha Trang"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-wrap">
                <div className="container">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-6">
                            <p className="copyright-text">
                                Bản quyền 2025 <Link to="/">Du Lịch Việt Nam</Link>. Đã đăng ký bản
                                quyền.
                            </p>
                        </div>
                        <div className="col-md-6 text-end d-none d-md-block">
                            <div className="footer-card">
                                <span className="title">Chúng Tôi Chấp Nhận</span>
                                <img src="/assets/img/shape/cards.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="shape-mockup movingX d-none d-xxl-block"
                style={{
                    top: "24%",
                    left: "5%",
                }}
            >
                <img src="/assets/img/shape/shape_8.png" alt="shape" />
            </div>
        </footer>
    );
}

export default FooterTwo;

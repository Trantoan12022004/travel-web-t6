import React from "react";
import { Link } from "react-router-dom";

function GetInTouch() {
    return (
        <div className="space">
            <div className="container">
                <div className="title-area text-center">
                    <span className="sub-title">Liên Hệ Với Chúng Tôi</span>
                    <h2 className="sec-title">Thông Tin Liên Hệ</h2>
                </div>
                <div className="row gy-4 justify-content-center">
                    <div className="col-xl-4 col-lg-6">
                        <div className="about-contact-grid style2">
                            <div className="about-contact-icon">
                                <img src="/assets/img/icon/location-dot2.svg" alt="" />
                            </div>
                            <div className="about-contact-details">
                                <h6 className="box-title">Địa Chỉ</h6>
                                <p className="about-contact-details-text">
                                    123 Đường Nguyễn Huệ, Quận 1
                                </p>
                                <p className="about-contact-details-text">
                                    Thành phố Hồ Chí Minh, Việt Nam
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                        <div className="about-contact-grid">
                            <div className="about-contact-icon">
                                <img src="/assets/img/icon/call.svg" alt="" />
                            </div>
                            <div className="about-contact-details">
                                <h6 className="box-title">Số Điện Thoại</h6>
                                <p className="about-contact-details-text">
                                    <Link to="tel:+842838234567">+84 28 3823 4567</Link>
                                </p>
                                <p className="about-contact-details-text">
                                    <Link to="tel:+84909123456">+84 909 123 456</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                        <div className="about-contact-grid">
                            <div className="about-contact-icon">
                                <img src="/assets/img/icon/mail.svg" alt="" />
                            </div>
                            <div className="about-contact-details">
                                <h6 className="box-title">Địa Chỉ Email</h6>
                                <p className="about-contact-details-text">
                                    <Link to="mailto:info@dulichvietnam.vn">
                                        info@dulichvietnam.vn
                                    </Link>
                                </p>
                                <p className="about-contact-details-text">
                                    <Link to="mailto:hotro@dulichvietnam.vn">
                                        hotro@dulichvietnam.vn
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetInTouch;

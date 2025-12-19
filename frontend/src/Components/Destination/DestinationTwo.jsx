import React, { useState } from "react";
import { Link } from "react-router-dom";

function DestinationTwo() {
    const destinations = [
        {
            name: "Hạ Long",
            image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
            listings: 45,
        },
        {
            name: "Phú Quốc",
            image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
            listings: 38,
        },
        {
            name: "Đà Nẵng",
            image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
            listings: 52,
        },
        {
            name: "Sapa",
            image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
            listings: 34,
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0); // Default active index (Hạ Long)

    return (
        <div
            className="bg-top-center position-relative space"
            id="destination-sec"
            style={{
                backgroundImage: "url('/assets/img/bg/line-pattern2.png')",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="container shape-mockup-wrap">
                <div className="title-area text-center">
                    {/* <span className="sub-title">Điểm Đến Hàng Đầu</span> */}
                    <h2 className="sec-title">Điểm Đến Nổi Bật Của Chúng Tôi</h2>
                </div>
                <div className="row">
                    <div className="destination-list-area">
                        {destinations.map((item, index) => (
                            <div
                                key={index}
                                className={`destination-list-wrap ${
                                    index === activeIndex ? "active" : ""
                                }`}
                                onClick={() => setActiveIndex(index)}
                            >
                                <div
                                    className="destination-list"
                                    style={{
                                        backgroundImage: `url('${item.image}')`,
                                    }}
                                >
                                    <div className="destination-content">
                                        <h4 className="box-title">
                                            <Link to="/destination/1">{item.name}</Link>
                                        </h4>
                                        <span className="destination-subtitle">
                                            {item.listings} Tours
                                        </span>
                                    </div>
                                    <Link to="/contact" className="th-btn style2">
                                        Đặt Ngay
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="destination-btn text-center mt-60">
                    <Link to="/destination" className="th-btn style3 th-icon">
                        Xem Tất Cả
                    </Link>
                </div>
                {/* Shape Mockups with Inline Styles */}
                <div
                    className="shape-mockup movingX d-none d-xl-block"
                    style={{ top: "8%", left: "-15%" }}
                >
                    <img src="/assets/img/shape/shape_2_1.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup jump d-none d-xl-block"
                    style={{ top: "23%", right: "-14%" }}
                >
                    <img src="/assets/img/shape/shape_2_2.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup spin d-none d-xl-block"
                    style={{ bottom: "21%", left: "-14%" }}
                >
                    <img src="/assets/img/shape/shape_2_3.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup movingX d-none d-xl-block"
                    style={{ bottom: "12%", right: "-14%" }}
                >
                    <img src="/assets/img/shape/shape_2_4.png" alt="shape" />
                </div>
            </div>
        </div>
    );
}

export default DestinationTwo;

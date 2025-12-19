import { Link } from "react-router-dom";

function AboutFour() {
    return (
        <div
            className="about-area position-relative overflow-hidden overflow-hidden space"
            id="about-sec"
        >
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xl-7">
                        <div className="img-box3">
                            <div className="img1">
                                <img
                                    src="https://images.unsplash.com/photo-1541417904950-b855846fe074"
                                    alt="About"
                                />
                            </div>
                            {/* <div className="img2">
                        <img src="/assets/img/normal/about_3_2.jpg" alt="About" />
                     </div>
                     <div className="img3 movingX">
                        <img src="/assets/img/normal/about_3_3.jpg" alt="About" />
                     </div> */}
                        </div>
                    </div>
                    <div className="col-xl-5">
                        <div className="ps-xl-4">
                            <div className="title-area mb-20">
                                
                                <h2 className="sec-title mb-20 pe-xl-5 me-xl-5 heading">
                                    Chúng tôi là công ty du lịch uy tín hàng đầu Việt Nam
                                </h2>
                            </div>
                            <p className="pe-xl-5">
                                Với hơn 10 năm kinh nghiệm trong ngành du lịch, chúng tôi cam kết
                                mang đến những trải nghiệm du lịch tuyệt vời nhất cho khách hàng với
                                dịch vụ chuyên nghiệp và tận tâm.
                            </p>
                            <p className="mb-30 pe-xl-5">
                                {" "}
                                Từ Vịnh Hạ Long kỳ vĩ đến phố cổ Hội An thơ mộng, từ Sapa mây trời
                                đến Phú Quốc biển xanh. Chúng tôi tự hào là cầu nối đưa bạn khám phá
                                mọi vẻ đẹp của Việt Nam với chi phí hợp lý và dịch vụ chất lượng
                                cao. Đội ngũ hướng dẫn viên giàu kinh nghiệm sẽ đồng hành cùng bạn
                                trên mỗi hành trình.
                            </p>
                            <div className="about-item-wrap">
                                <div className="about-item style2">
                                    <div className="about-item_img">
                                        <img src="/assets/img/icon/about_1_1.svg" alt="" />
                                    </div>
                                    <div className="about-item_centent">
                                        <h5 className="box-title">Tour Độc Quyền</h5>
                                        <p className="about-item_text">
                                            Các tour du lịch được thiết kế riêng biệt với trải
                                            nghiệm đặc sắc và độc đáo.
                                        </p>
                                    </div>
                                </div>
                                <div className="about-item style2">
                                    <div className="about-item_img">
                                        <img src="/assets/img/icon/about_1_2.svg" alt="" />
                                    </div>
                                    <div className="about-item_centent">
                                        <h5 className="box-title">An Toàn Là Ưu Tiên</h5>
                                        <p className="about-item_text">
                                            Chúng tôi luôn đặt sự an toàn của khách hàng lên hàng
                                            đầu trong mọi chuyến đi.
                                        </p>
                                    </div>
                                </div>
                                <div className="about-item style2">
                                    <div className="about-item_img">
                                        <img src="/assets/img/icon/about_1_3.svg" alt="" />
                                    </div>
                                    <div className="about-item_centent">
                                        <h5 className="box-title">Hướng Dẫn Viên Chuyên Nghiệp</h5>
                                        <p className="about-item_text">
                                            Đội ngũ hướng dẫn viên giàu kinh nghiệm, nhiệt tình và
                                            am hiểu văn hóa địa phương.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-35">
                                <Link to="/contact" className="th-btn style3 th-icon">
                                    Liên Hệ Với Chúng Tôi
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="shape-mockup movingX d-none d-xxl-block"
                    style={{ top: "0%", left: "-18%" }}
                >
                    <img src="/assets/img/shape/shape_2_1.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup jump d-none d-xxl-block"
                    style={{ top: "28%", right: "-15%" }}
                >
                    <img src="/assets/img/shape/shape_2_2.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup spin d-none d-xxl-block"
                    style={{ top: "18%", left: "-112%" }}
                >
                    <img src="/assets/img/shape/shape_2_3.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup movixgX d-none d-xxl-block"
                    style={{ bottom: "18%", right: "-12%" }}
                >
                    <img src="/assets/img/shape/shape_2_4.png" alt="shape" />
                </div>
            </div>
        </div>
    );
}

export default AboutFour;

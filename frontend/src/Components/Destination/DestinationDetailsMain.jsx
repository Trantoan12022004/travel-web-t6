import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from "../Gallery/Modal";
import useTourStore from "../../Stores/tour";

function DestinationDetailsMain() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");
    const { id } = useParams();
    const formatVND = (value) => {
        if (value === null || value === undefined || isNaN(value)) return "0 ₫";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };
    const {
        currentTour,
        relatedTours,
        isLoading,
        error,
        getTourById,
        getRelatedTours,
        clearCurrentTour,
    } = useTourStore();

    useEffect(() => {
        if (id) {
            getTourById(id);
            getRelatedTours(id, 4);
        }

        return () => {
            clearCurrentTour();
        };
    }, [id]);

    const openModal = (imageSrc, event) => {
        event.preventDefault();
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);
    if (isLoading) {
        return (
            <section className="space">
                <div className="container">
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !currentTour) {
        return (
            <section className="space">
                <div className="container">
                    <div className="alert alert-danger">{error || "Tour not found!"}</div>
                </div>
            </section>
        );
    }

    return (
        <section className="space">
            <div className="container">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="page-single">
                            <div className="service-img">
                                <img
                                    src={currentTour.coverImage || "/assets/img/tour/tour_1_1.jpg"}
                                    alt={currentTour.title}
                                />
                            </div>
                            <div className="page-content d-block">
                                <div className="page-meta mt-50 mb-45">
                                    <Link className="page-tag mr-5" to="/destination">
                                        {currentTour.category?.name || "Featured"}
                                    </Link>
                                    <span className="ratting">
                                        <i className="fa-sharp fa-solid fa-star" />
                                        <span>{currentTour.ratingAvg}</span>
                                    </span>
                                </div>
                                <h2 className="box-title">{currentTour.title}</h2>
                                <p className="blog-text mb-30">{currentTour.description}</p>

                                <h2 className="box-title">Basic Information</h2>
                                <div className="destination-checklist">
                                    <div className="checklist style2">
                                        <ul>
                                            <li>Destination</li>
                                            <li>Duration</li>
                                            <li>Category</li>
                                            <li>Rating</li>
                                            <li>Reviews</li>
                                            <li>Price per Person</li>
                                        </ul>
                                    </div>
                                    <div className="checklist style2">
                                        <ul>
                                            <li>{currentTour.location}</li>
                                            <li>{currentTour.durationDays} Days</li>
                                            <li>{currentTour.category?.name || "N/A"}</li>
                                            <li>{currentTour.ratingAvg} / 5.0</li>
                                            <li>{currentTour.ratingCount} Reviews</li>
                                            <li>{formatVND(currentTour.price)}</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Basic Info JSON */}
                                {currentTour.basicInfo && (
                                    <div className="mt-40">
                                        <h3 className="box-title">Tour Details</h3>
                                        <div className="checklist">
                                            <ul>
                                                {Object.entries(currentTour.basicInfo).map(
                                                    ([key, value]) => (
                                                        <li key={key}>
                                                            <strong>{key}:</strong> {value}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Highlights */}
                                {currentTour.highlightInfo && (
                                    <div className="mt-40">
                                        <div className="checklist">
                                            {currentTour.highlightInfo?.highlights?.length > 0 && (
                                                <div className="mt-40">
                                                    <h2 className="box-title">Highlights</h2>

                                                    <div className="checklist">
                                                        <ul>
                                                            {currentTour.highlightInfo.highlights.map(
                                                                (item, index) => (
                                                                    <li key={index}>{item}</li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Schedules */}
                                {currentTour.schedules && currentTour.schedules.length > 0 && (
                                    <div className="mt-40">
                                        <h2 className="box-title">Tour Schedule</h2>

                                        <div className="checklist">
                                            <ul>
                                                {currentTour.schedules.map((schedule) => (
                                                    <li key={schedule.scheduleId}>
                                                        <strong>
                                                            Day {schedule.dayNumber}:{" "}
                                                            {schedule.title}
                                                        </strong>
                                                        {/* 
                                                        {schedule.image && (
                                                            <div className="mt-10">
                                                                <img
                                                                    src={schedule.image}
                                                                    alt={schedule.title}
                                                                    className="img-fluid"
                                                                />
                                                            </div>
                                                        )} */}

                                                        {schedule.description && (
                                                            <p className="mt-10 mb-0">
                                                                {schedule.description}
                                                            </p>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Gallery */}
                                {currentTour.images && currentTour.images.length > 0 && (
                                    <div className="destination-gallery-wrapper">
                                        <h3 className="page-title mt-30 mb-30">Tour Gallery</h3>
                                        <div className="row gy-4 gallery-row filter-active">
                                            {currentTour.images.slice(0, 4).map((image) => (
                                                <div
                                                    key={image.imageId}
                                                    className="col-xxl-auto filter-item"
                                                >
                                                    <div className="gallery-box style3">
                                                        <div className="gallery-img global-img">
                                                            <img
                                                                src={image.imageUrl}
                                                                alt="gallery"
                                                                onClick={(e) =>
                                                                    openModal(image.imageUrl, e)
                                                                }
                                                            />
                                                            <Link
                                                                to="#"
                                                                className="icon-btn popup-image"
                                                                onClick={(e) =>
                                                                    openModal(image.imageUrl, e)
                                                                }
                                                            >
                                                                <i className="fal fa-magnifying-glass-plus" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Reviews */}
                                {currentTour.reviews && currentTour.reviews.length > 0 && (
                                    <div className="th-comments-wrap style2">
                                        <h2 className="blog-inner-title h4">
                                            Reviews ({currentTour.reviews.length})
                                        </h2>
                                        <ul className="comment-list">
                                            {currentTour.reviews.map((review) => (
                                                <li
                                                    key={review.reviewId}
                                                    className="th-comment-item"
                                                >
                                                    <div className="th-post-comment">
                                                        <div className="comment-avater">
                                                            <img
                                                                src="/assets/img/blog/comment-author-1.jpg"
                                                                alt="Comment Author"
                                                            />
                                                        </div>
                                                        <div className="comment-content">
                                                            <h3 className="name">
                                                                {review.user?.firstName}{" "}
                                                                {review.user?.lastName}
                                                            </h3>
                                                            <div className="commented-wrapp">
                                                                <span className="commented-on">
                                                                    {new Date(
                                                                        review.createdAt
                                                                    ).toLocaleDateString()}
                                                                </span>
                                                                <span className="comment-review">
                                                                    {Array.from({
                                                                        length: review.rating,
                                                                    }).map((_, i) => (
                                                                        <i
                                                                            key={i}
                                                                            className="fa-solid fa-star"
                                                                        />
                                                                    ))}
                                                                </span>
                                                            </div>
                                                            <p className="text">{review.comment}</p>
                                                            <div className="reply_and_edit">
                                                                <i className="fa-solid fa-thumbs-up" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Comment Form */}
                                <div className="th-comment-form">
                                    <div className="row">
                                        <h3 className="blog-inner-title h4 mb-2">Leave a Review</h3>
                                        <p className="mb-25">
                                            Your email address will not be published.
                                        </p>
                                        <div className="col-md-6 form-group">
                                            <input
                                                type="text"
                                                placeholder="Full Name*"
                                                className="form-control"
                                            />
                                            <i className="far fa-user" />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <input
                                                type="email"
                                                placeholder="Your Email*"
                                                className="form-control"
                                            />
                                            <i className="far fa-envelope" />
                                        </div>
                                        <div className="col-12 form-group">
                                            <select className="form-control">
                                                <option value="">Select Rating</option>
                                                <option value="5">5 Stars</option>
                                                <option value="4">4 Stars</option>
                                                <option value="3">3 Stars</option>
                                                <option value="2">2 Stars</option>
                                                <option value="1">1 Star</option>
                                            </select>
                                        </div>
                                        <div className="col-12 form-group">
                                            <textarea
                                                placeholder="Your Review*"
                                                className="form-control"
                                            />
                                            <i className="far fa-pencil" />
                                        </div>
                                        <div className="col-12 form-group mb-0">
                                            <button className="th-btn">
                                                Submit Review
                                                <img src="/assets/img/icon/plane2.svg" alt="" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area style3">
                            {/* Related Tours */}
                            {relatedTours.length > 0 && (
                                <div className="widget">
                                    <h3 className="widget_title">Related Tours</h3>
                                    <div className="recent-post-wrap">
                                        {relatedTours.map((tour) => (
                                            <div key={tour.tourId} className="recent-post">
                                                <div className="media-img">
                                                    <Link to={`/destination/${tour.tourId}`}>
                                                        <img
                                                            src={
                                                                tour.coverImage ||
                                                                "/assets/img/tour/tour_1_1.jpg"
                                                            }
                                                            alt={tour.title}
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="media-body">
                                                    <h4 className="post-title">
                                                        <Link
                                                            className="text-inherit"
                                                            to={`/destination/${tour.tourId}`}
                                                        >
                                                            {tour.title}
                                                        </Link>
                                                    </h4>
                                                    <div className="recent-post-meta">
                                                        <span>
                                                            <i className="fa-solid fa-star" />{" "}
                                                            {tour.ratingAvg}
                                                        </span>
                                                        <span className="ms-2">${tour.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div
                                className="widget widget_offer"
                                style={{
                                    background: "url(/assets/img/bg/widget_bg_1.jpg)",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                }}
                            >
                                <div className="offer-banner">
                                    <div className="offer">
                                        <h6 className="box-title">
                                            Need Help? We Are Here To Help You
                                        </h6>
                                        <div className="banner-logo">
                                            <img src="/assets/img/logo2.svg" alt="Tourm" />
                                        </div>
                                        <div className="offer">
                                            <h6 className="offer-title">You Get Online support</h6>
                                            <Link className="offter-num" to="tel:+256214203215">
                                                +256 214 203 215
                                            </Link>
                                        </div>
                                        <Link to="/contact" className="th-btn style2 th-icon">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </section>
    );
}

export default DestinationDetailsMain;

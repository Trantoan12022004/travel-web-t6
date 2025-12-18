import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DestinationCard from './DestinationCard';
import DestinationCardTwo from './DestinationCardTwo';
import useTourStore from '../../Stores/tour';

function DestinationInner() {
    const [activeTab, setActiveTab] = useState('tab-grid');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const {
        tours,
        pagination,
        isLoading,
        error,
        getTours,
        updateFilters,
        filters,
        latestTours,
        getLatestTours
    } = useTourStore();

    // Load tours khi component mount
    useEffect(() => {
        getTours();
        getLatestTours(3);
    }, []);

    // Xử lý search
    const handleSearch = (e) => {
        e.preventDefault();
        updateFilters({ search: searchKeyword, page: 1 });
        getTours();
    };

    // Xử lý thay đổi sort
    const handleSortChange = (e) => {
        const value = e.target.value;
        let sortBy = 'createdAt';
        let sortOrder = 'desc';

        switch (value) {
            case 'popularity':
                sortBy = 'ratingCount';
                sortOrder = 'desc';
                break;
            case 'rating':
                sortBy = 'ratingAvg';
                sortOrder = 'desc';
                break;
            case 'date':
                sortBy = 'createdAt';
                sortOrder = 'desc';
                break;
            case 'price':
                sortBy = 'price';
                sortOrder = 'asc';
                break;
            case 'price-desc':
                sortBy = 'price';
                sortOrder = 'desc';
                break;
            default:
                break;
        }

        updateFilters({ sortBy, sortOrder, page: 1 });
        getTours();
    };

    // Xử lý phân trang
    const handlePageChange = (page) => {
        updateFilters({ page });
        getTours();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Xử lý filter theo category
    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        updateFilters({ categoryId, page: 1 });
        getTours();
    };

    if (error) {
        return (
            <section className="space">
                <div className="container">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className="space">
            <div className="container">
                <div className="th-sort-bar">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-4">
                            <div className="search-form-area">
                                <form className="search-form" onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        placeholder="Search tours..."
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                    <button type="submit">
                                        <i className="fa-light fa-magnifying-glass" />
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <div className="sorting-filter-wrap">
                                <div className="nav" role="tablist">
                                    <Link
                                        to="#"
                                        className={`${activeTab === 'tab-grid' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('tab-grid')}
                                    >
                                        <i className="fa-light fa-grid-2" />
                                    </Link>
                                    <Link
                                        to="#"
                                        className={`${activeTab === 'tab-list' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('tab-list')}
                                    >
                                        <i className="fa-solid fa-list" />
                                    </Link>
                                </div>
                                <form className="woocommerce-ordering" method="get">
                                    <select
                                        name="orderby"
                                        className="orderby"
                                        aria-label="destination order"
                                        onChange={handleSortChange}
                                    >
                                        <option value="menu_order">Default Sorting</option>
                                        <option value="popularity">Sort by popularity</option>
                                        <option value="rating">Sort by average rating</option>
                                        <option value="date">Sort by latest</option>
                                        <option value="price">Sort by price: low to high</option>
                                        <option value="price-desc">Sort by price: high to low</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xxl-9 col-lg-8">
                        {isLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="tab-content" id="nav-tabContent">
                                    <div
                                        className={`tab-pane fade ${activeTab === 'tab-grid' ? 'show active' : ''}`}
                                        id="tab-grid"
                                    >
                                        <div className="row gy-30">
                                            {tours.length > 0 ? (
                                                tours.map((tour) => (
                                                    <div key={tour.tourId} className="col-xxl-4 col-xl-6">
                                                        <DestinationCard
                                                            destinationID={tour.tourId}
                                                            destinationImage={tour.coverImage || '/assets/img/tour/tour_1_1.jpg'}
                                                            destinationTitle={tour.title}
                                                            destinationPrice={tour.price}
                                                            location={tour.location}
                                                            duration={tour.durationDays}
                                                            rating={tour.ratingAvg}
                                                            ratingCount={tour.ratingCount}
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-12">
                                                    <p className="text-center">No tours found</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className={`tab-pane fade ${activeTab === 'tab-list' ? 'show active' : ''}`}
                                        id="tab-list"
                                    >
                                        <div className="row gy-30">
                                            {tours.length > 0 ? (
                                                tours.map((tour) => (
                                                    <div key={tour.tourId} className="col-12">
                                                        <DestinationCardTwo
                                                            destinationID={tour.tourId}
                                                            destinationImage={tour.coverImage || '/assets/img/tour/tour_1_1.jpg'}
                                                            destinationTitle={tour.title}
                                                            destinationPrice={tour.price}
                                                            location={tour.location}
                                                            duration={tour.durationDays}
                                                            rating={tour.ratingAvg}
                                                            ratingCount={tour.ratingCount}
                                                            description={tour.description}
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-12">
                                                    <p className="text-center">No tours found</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="th-pagination text-center mt-60 mb-0">
                                        <ul>
                                            {Array.from({ length: pagination.totalPages }, (_, i) => (
                                                <li key={i}>
                                                    <Link
                                                        className={pagination.page === i + 1 ? 'active' : ''}
                                                        to="#"
                                                        onClick={() => handlePageChange(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </Link>
                                                </li>
                                            ))}
                                            {pagination.page < pagination.totalPages && (
                                                <li>
                                                    <Link
                                                        className="next-page"
                                                        to="#"
                                                        onClick={() => handlePageChange(pagination.page + 1)}
                                                    >
                                                        Next <img src="/assets/img/icon/arrow-right4.svg" alt="" />
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="col-xxl-3 col-lg-4">
                        <aside className="sidebar-area style2">
                            <div className="widget widget_categories">
                                <h3 className="widget_title">Categories</h3>
                                <ul>
                                    <li>
                                        <Link
                                            to="#"
                                            onClick={() => handleCategoryFilter(null)}
                                            className={selectedCategory === null ? 'active' : ''}
                                        >
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            All Tours
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="#"
                                            onClick={() => handleCategoryFilter(1)}
                                            className={selectedCategory === 1 ? 'active' : ''}
                                        >
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            City Tour
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="#"
                                            onClick={() => handleCategoryFilter(2)}
                                            className={selectedCategory === 2 ? 'active' : ''}
                                        >
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Beach Tours
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="#"
                                            onClick={() => handleCategoryFilter(3)}
                                            className={selectedCategory === 3 ? 'active' : ''}
                                        >
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Wildlife Tours
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="#"
                                            onClick={() => handleCategoryFilter(4)}
                                            className={selectedCategory === 4 ? 'active' : ''}
                                        >
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Adventure Tours
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="#"
                                            onClick={() => handleCategoryFilter(5)}
                                            className={selectedCategory === 5 ? 'active' : ''}
                                        >
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Mountain Tours
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="widget">
                                <h3 className="widget_title">Latest Tours</h3>
                                <div className="recent-post-wrap">
                                    {latestTours.map((tour) => (
                                        <div key={tour.tourId} className="recent-post">
                                            <div className="media-img">
                                                <Link to={`/destination/${tour.tourId}`}>
                                                    <img
                                                        src={tour.coverImage || '/assets/img/tour/tour_1_1.jpg'}
                                                        alt={tour.title}
                                                    />
                                                </Link>
                                            </div>
                                            <div className="media-body">
                                                <h4 className="post-title">
                                                    <Link className="text-inherit" to={`/destination/${tour.tourId}`}>
                                                        {tour.title}
                                                    </Link>
                                                </h4>
                                                <div className="recent-post-meta">
                                                    <span>
                                                        <i className="fa-solid fa-star" /> {tour.ratingAvg}
                                                    </span>
                                                    <span className="ms-2">${tour.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="widget widget_tag_cloud">
                                <h3 className="widget_title">Popular Tags</h3>
                                <div className="tagcloud">
                                    <Link to="/destination">Tour</Link>
                                    <Link to="/destination">Adventure</Link>
                                    <Link to="/destination">Beach</Link>
                                    <Link to="/destination">Mountain</Link>
                                    <Link to="/destination">Wildlife</Link>
                                    <Link to="/destination">Luxury</Link>
                                    <Link to="/destination">Travel</Link>
                                </div>
                            </div>

                            <div
                                className="widget widget_offer"
                                style={{ backgroundImage: 'url(/assets/img/bg/widget_bg_1.jpg)' }}
                            >
                                <div className="offer-banner">
                                    <div className="offer">
                                        <h6 className="box-title">Need Help? We Are Here To Help You</h6>
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
        </section>
    );
}

export default DestinationInner;
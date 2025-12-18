import React from "react";
import HeaderTwo from "../Components/Header/HeaderTwo";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import BookingDetail from "../Components/Booking/BookingDetail";
import FooterFour from "../Components/Footer/FooterFour";
import ScrollToTop from "../Components/ScrollToTop";

function BookingDetailPage() {
    return (
        <>
            <HeaderTwo />
            <Breadcrumb title="Chi Tiết Booking" />
            <BookingDetail />
            <FooterFour />
            <ScrollToTop />
        </>
    );
}

export default BookingDetailPage;
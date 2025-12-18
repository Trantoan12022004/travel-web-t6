import React from "react";
import HeaderTwo from "../Components/Header/HeaderTwo";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import BookingInner from "../Components/Booking/BookingInner";
import FooterFour from "../Components/Footer/FooterFour";
import ScrollToTop from "../Components/ScrollToTop";

function Booking() {
    return (
        <>
            <HeaderTwo />
            <Breadcrumb title="Đặt Tour" subtitle="Book Tour" />
            <BookingInner />
            <FooterFour />
            <ScrollToTop />
        </>
    );
}

export default Booking;

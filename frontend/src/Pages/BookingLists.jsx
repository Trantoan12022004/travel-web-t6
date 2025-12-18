import React from 'react';
import HeaderTwo from '../Components/Header/HeaderTwo';
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb';
import BookingsInner from '../Components/Booking/BookingsInner ';
import FooterFour from '../Components/Footer/FooterFour';
import ScrollToTop from '../Components/ScrollToTop';

function BookingLists() {
    return (
        <>
            <HeaderTwo />
            <Breadcrumb
                title="My BookingLists"
            />
            <BookingsInner />
            <FooterFour />
            <ScrollToTop />
        </>
    );
}

export default BookingLists;
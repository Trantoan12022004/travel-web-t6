import React from 'react'
import HeaderTwo from '../Components/Header/HeaderTwo'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import GetInTouch from '../Components/Contact/GetInTouch'
import BookATour from '../Components/Contact/BookATour'
import ContactMap from '../Components/Contact/ContactMap'
import FooterTwo from '../Components/Footer/FooterTwo'
import ScrollToTop from '../Components/ScrollToTop'

function Contact() {
    return (
        <>
            <HeaderTwo />
            <Breadcrumb
                title='Liên hệ'
            />
            <GetInTouch />
            {/* <BookATour /> */}
            {/* <ContactMap /> */}
            <FooterTwo />
            <ScrollToTop />
        </>
    )
}

export default Contact

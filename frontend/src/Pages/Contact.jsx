import React from 'react'
import HeaderTwo from '../Components/Header/HeaderTwo'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import GetInTouch from '../Components/Contact/GetInTouch'
import BookATour from '../Components/Contact/BookATour'
import ContactMap from '../Components/Contact/ContactMap'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Contact() {
    return (
        <>
            <HeaderTwo />
            <Breadcrumb
                title='Contact Us'
            />
            <GetInTouch />
            <BookATour />
            {/* <ContactMap /> */}
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Contact

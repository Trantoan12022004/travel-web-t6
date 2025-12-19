import React from 'react'
import HeaderTwo from '../Components/Header/HeaderTwo'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import AboutFour from '../Components/About/AboutFour'
import OfferTwo from '../Components/Offer/OfferTwo'
import ElementSection from '../Components/Elements/ElementSection'
import TourGuideTwo from '../Components/Guide/TourGuideTwo'
import TestimonialOne from '../Components/Testimonials/TestimonialOne'
import BrandOne from '../Components/Brand/BrandOne'
import GalleryFive from '../Components/Gallery/GalleryFive'
import FooterTwo from '../Components/Footer/FooterTwo'
import ScrollToTop from '../Components/ScrollToTop'

function About() {
    return (
        <>
            <HeaderTwo />
            <Breadcrumb
                title="Về Chúng Tôi"
            />
            <AboutFour />
            {/* <OfferTwo /> */}
            <ElementSection />
            {/* <TourGuideTwo /> */}
            {/* <TestimonialOne /> */}
            {/* <BrandOne/> */}
            {/* <GalleryFive /> */}
            <FooterTwo />
            <ScrollToTop />
        </>
    )
}

export default About

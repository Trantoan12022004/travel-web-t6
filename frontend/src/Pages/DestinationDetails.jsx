import React from 'react'
import HeaderTwo from '../Components/Header/HeaderTwo'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import DestinationDetailsMain from '../Components/Destination/DestinationDetailsMain'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function DestinationDetails() {
    return (
        <>
            <HeaderTwo />
            <Breadcrumb
                title="Destination Details"
            />
            <DestinationDetailsMain />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default DestinationDetails

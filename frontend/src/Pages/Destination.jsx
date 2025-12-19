import React from 'react'
import HeaderTwo from '../Components/Header/HeaderTwo'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import DestinationInner from '../Components/Destination/DestinationInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Destination() {
    return (
        <>
            <HeaderTwo />
            <Breadcrumb
                title="Điểm đến"
            />
            <DestinationInner />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Destination

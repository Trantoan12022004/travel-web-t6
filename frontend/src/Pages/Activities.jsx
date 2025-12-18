import React from 'react'
import HeaderTwo from '../Components/Header/HeaderTwo'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ActivitiesInner from '../Components/Activities/ActivitiesInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Activities() {
    return (
        <>
            <HeaderTwo />
            <Breadcrumb
                title="Activities"
            />
            <ActivitiesInner />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Activities

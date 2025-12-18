import React from "react";
import HeaderTwo from "../Components/Header/HeaderTwo";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import PaymentInner from "../Components/Payment/PaymentInner";
import FooterFour from "../Components/Footer/FooterFour";
import ScrollToTop from "../Components/ScrollToTop";

function Payment() {
    return (
        <>
            <HeaderTwo />
            <Breadcrumb title="Thanh Toán" subtitle="Payment" />
            <PaymentInner />
            <FooterFour />
            <ScrollToTop />
        </>
    );
}

export default Payment;

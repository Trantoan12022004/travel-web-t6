import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeaderTwo from "../Components/Header/HeaderTwo";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import AdminDashboard from "../Components/Admin/AdminDashboard";
import FooterFour from "../Components/Footer/FooterFour";
import ScrollToTop from "../Components/ScrollToTop";
import useAuthStore from "../Stores/auth";

function Admin() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Kiểm tra quyền truy cập ngay khi vào trang
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để truy cập trang này");
            navigate("/");
            return;
        }

        if (user?.role !== "ADMIN") {
            toast.error("Bạn không có quyền truy cập trang này");
            navigate("/");
            return;
        }
    }, [isAuthenticated, user, navigate]);

    // Nếu chưa xác thực hoặc không phải admin, không render gì
    if (!isAuthenticated || user?.role !== "ADMIN") {
        return null;
    }

    return (
        <>
            <HeaderTwo />
            <Breadcrumb title="Quản Trị Viên" subtitle="Admin Dashboard" />
            <AdminDashboard />
            <FooterFour />
            <ScrollToTop />
        </>
    );
}

export default Admin;

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../Stores/auth";

function MobileMenu({ isOpen, onClose }) {
    const { isAuthenticated, user } = useAuthStore();
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeShopMenu, setActiveShopMenu] = useState(false); // Shop submenu state
    const menuRefs = useRef({});

    // Toggle dropdown menu
    const toggleMenu = (index) => {
        if (index !== 6) {
            setActiveMenu(activeMenu === index ? null : index);
        }
    };

    // Handle Shop menu separately
    const toggleShopMenu = (e) => {
        e.stopPropagation(); // Prevent menu from closing
        setActiveShopMenu(!activeShopMenu);
    };

    // Apply height animation when activeMenu changes
    useEffect(() => {
        Object.keys(menuRefs.current).forEach((key) => {
            const submenu = menuRefs.current[key];
            if (submenu) {
                submenu.style.height = activeMenu == key ? `${submenu.scrollHeight}px` : "0px";
            }
        });
    }, [activeMenu]);

    return (
        <div
            className={`th-menu-wrapper onepage-nav ${isOpen ? "th-body-visible" : ""}`}
            style={{ visibility: isOpen ? "visible" : "hidden" }}
        >
            <div className="th-menu-area text-center">
                <button className="th-menu-toggle" onClick={onClose} aria-label="Close">
                    <i className="fal fa-times" />
                </button>

                <div className="mobile-logo">
                    <Link to="/">
                        <img src="/assets/img/logo2.svg" alt="Tourm" />
                    </Link>
                </div>

                <div className="th-mobile-menu">
                    <ul>
                        {/* Home */}
                        <li>
                            <Link to="/" onClick={onClose}>
                                Trang chủ
                            </Link>
                        </li>

                        {/* About Us */}
                        <li>
                            <Link to="/about" onClick={onClose}>
                                Về chúng tôi
                            </Link>
                        </li>

                        {/* Destination */}
                        <li>
                            <Link to="/destination" onClick={onClose}>
                                Điểm đến
                            </Link>
                        </li>

                        {/* Booking */}
                        <li>
                            <Link to="/bookings" onClick={onClose}>
                                Đặt chỗ
                            </Link>
                        </li>

                        {/* Admin - Only show if authenticated and role is ADMIN */}
                        {isAuthenticated && user?.role === "ADMIN" && (
                            <li>
                                <Link to="/admin" onClick={onClose}>
                                    Admin
                                </Link>
                            </li>
                        )}

                        {/* Contact */}
                        <li>
                            <Link to="/contact" onClick={onClose}>
                                Liên hệ
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default MobileMenu;

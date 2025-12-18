import React, { useState } from "react";
import { toast } from "react-toastify";
import useAuthStore from "../../Stores/auth";

function LoginForm({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("register");

    // Auth store
    const { login, register, isLoading, error, clearError } = useAuthStore();

    // Form data states
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [registerData, setRegisterData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        new_email: "",
        new_password: "",
        new_password_confirm: "",
    });

    // Handle login input change
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle register input change
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle login submit
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        clearError();

        try {
            await login(loginData.email, loginData.password);
            toast.success("Đăng nhập thành công!");

            // Reset form và đóng popup
            setLoginData({ email: "", password: "" });
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Đăng nhập thất bại!");
        }
    };

    // Handle register submit
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        clearError();

        // Validate confirm password
        if (registerData.new_password !== registerData.new_password_confirm) {
            toast.warning("Mật khẩu xác nhận không khỜp!");
            return;
        }

        try {
            await register({
                userName: registerData.username,
                firstName: registerData.firstname,
                lastName: registerData.lastname,
                email: registerData.new_email,
                password: registerData.new_password,
            });

            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");

            // Reset form và chuyển sang tab login
            setRegisterData({
                username: "",
                firstname: "",
                lastname: "",
                new_email: "",
                new_password: "",
                new_password_confirm: "",
            });
            setActiveTab("login");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Đăng ký thất bại!");
        }
    };

    return (
        <div
            id="login-form"
            className={`popup-login-register ${isOpen ? "show" : ""}`}
            style={{ visibility: isOpen ? "visible" : "hidden" }}
        >
            <div className="form-inner">
                <button className="closeButton sideMenuCls" onClick={onClose} aria-label="Close">
                    <i className="far fa-times" />
                </button>

                {/* Tab Navigation */}
                <ul className="nav" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-menu ${activeTab === "login" ? "active" : ""}`}
                            onClick={() => setActiveTab("login")}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "login"}
                        >
                            Login
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-menu ${activeTab === "register" ? "active" : ""}`}
                            onClick={() => setActiveTab("register")}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "register"}
                        >
                            Register
                        </button>
                    </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content">
                    {/* Login Tab */}
                    {activeTab === "login" && (
                        <div className="tab-pane fade active show">
                            <h3 className="box-title mb-30">Sign in to your account</h3>
                            <div className="th-login-form">
                                <form
                                    className="login-form ajax-contact"
                                    onSubmit={handleLoginSubmit}
                                >
                                    <div className="row">
                                        <div className="form-group col-12">
                                            <label>Username or email</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="email"
                                                value={loginData.email}
                                                onChange={handleLoginChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group col-12">
                                            <label>Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                value={loginData.password}
                                                onChange={handleLoginChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-btn mb-20 col-12">
                                            <button
                                                type="submit"
                                                className="th-btn btn-fw th-radius2"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Đang xử lý..." : "Send Message"}
                                            </button>
                                        </div>
                                    </div>
                                    <div id="forgot_url">
                                        <a href="#">Forgot password?</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Register Tab */}
                    {activeTab === "register" && (
                        <div className="tab-pane fade active show">
                            <h3 className="th-form-title mb-30">Create a new account</h3>
                            <form
                                className="login-form ajax-contact"
                                onSubmit={handleRegisterSubmit}
                            >
                                <div className="row">
                                    <div className="form-group col-12">
                                        <label>Username*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={registerData.username}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group col-12">
                                        <label>First name*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="firstname"
                                            value={registerData.firstname}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group col-12">
                                        <label>Last name*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="lastname"
                                            value={registerData.lastname}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group col-12">
                                        <label>Your email*</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="new_email"
                                            value={registerData.new_email}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group col-12">
                                        <label>Password*</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="new_password"
                                            value={registerData.new_password}
                                            onChange={handleRegisterChange}
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                    <div className="form-group col-12">
                                        <label>Confirm Password*</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="new_password_confirm"
                                            value={registerData.new_password_confirm}
                                            onChange={handleRegisterChange}
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                    {/* <div className="statement">
                                        <span className="register-notes">A password will be emailed to you.</span>
                                    </div> */}
                                    <div className="form-btn mt-20 col-12">
                                        <button
                                            type="submit"
                                            className="th-btn btn-fw th-radius2"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Đang xử lý..." : "Sign up"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginForm;

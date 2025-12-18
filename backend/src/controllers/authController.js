const AuthService = require("../services/authService");

class AuthController {
    /**
     * POST /api/auth/register - Đăng ký user mới
     */
    static async register(req, res) {
        try {
            const { userName, firstName, lastName, email, password } = req.body;

            // Validation
            if (!userName || !firstName || !lastName || !email || !password) {
                return res.status(400).json({
                    status: 400,
                    message: "Thiếu thông tin bắt buộc: userName, firstName, lastName, email, password",
                    data: null,
                });
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: 400,
                    message: "Email không hợp lệ",
                    data: null,
                });
            }

            // Password validation (tối thiểu 6 ký tự)
            if (password.length < 6) {
                return res.status(400).json({
                    status: 400,
                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                    data: null,
                });
            }

            const user = await AuthService.register({
                userName,
                firstName,
                lastName,
                email,
                password,
            });

            res.status(201).json({
                status: 201,
                message: "Đăng ký thành công",
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * POST /api/auth/login - Đăng nhập
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                return res.status(400).json({
                    status: 400,
                    message: "Thiếu email hoặc password",
                    data: null,
                });
            }

            const result = await AuthService.login(email, password);

            res.status(200).json({
                status: 200,
                message: "Đăng nhập thành công",
                data: result,
            });
        } catch (error) {
            res.status(401).json({
                status: 401,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * POST /api/auth/logout - Đăng xuất
     */
    static async logout(req, res) {
        try {
            const { refreshToken } = req.body;

            await AuthService.logout(refreshToken);

            res.status(200).json({
                status: 200,
                message: "Đăng xuất thành công",
                data: null,
            });
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * POST /api/auth/refresh - Làm mới access token
     */
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    status: 400,
                    message: "Thiếu refresh token",
                    data: null,
                });
            }

            const result = await AuthService.refreshAccessToken(refreshToken);

            res.status(200).json({
                status: 200,
                message: "Làm mới token thành công",
                data: result,
            });
        } catch (error) {
            res.status(401).json({
                status: 401,
                message: error.message,
                data: null,
            });
        }
    }

    /**
     * GET /api/auth/me - Lấy thông tin user hiện tại
     */
    static async getCurrentUser(req, res) {
        try {
            // req.user được set từ authMiddleware
            const user = req.user;

            res.status(200).json({
                status: 200,
                message: "OK",
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: error.message,
                data: null,
            });
        }
    }
}

module.exports = AuthController;
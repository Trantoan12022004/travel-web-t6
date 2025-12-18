const AuthService = require("../services/authService");
const prisma = require("../config/prisma");

/**
 * Middleware xác thực JWT token
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: 401,
                message: "Không tìm thấy token xác thực",
                data: null,
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = AuthService.verifyToken(token);

        // Lấy thông tin user từ database
        const user = await prisma.user.findUnique({
            where: { userId: decoded.userId },
            select: {
                userId: true,
                userName: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                status: 401,
                message: "User không tồn tại",
                data: null,
            });
        }

        // Gắn user vào request để sử dụng trong controller
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: "Token không hợp lệ hoặc đã hết hạn",
            data: null,
        });
    }
};

/**
 * Middleware kiểm tra role ADMIN
 */
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            status: 403,
            message: "Bạn không có quyền truy cập",
            data: null,
        });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
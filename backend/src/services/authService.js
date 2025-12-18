const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

class AuthService {
    /**
     * Đăng ký user mới
     */
    static async register(data) {
        const { userName, firstName, lastName, email, password } = data;

        // Kiểm tra email đã tồn tại
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("Email đã được sử dụng");
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Tạo user mới
        const user = await prisma.user.create({
            data: {
                userName,
                firstName,
                lastName,
                email,
                passwordHash,
            },
            select: {
                userId: true,
                userName: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return user;
    }

    /**
     * Đăng nhập
     */
    static async login(email, password) {
        // Tìm user theo email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("Email hoặc mật khẩu không đúng");
        }

        // Kiểm tra password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new Error("Email hoặc mật khẩu không đúng");
        }

        // Tạo JWT tokens
        const { accessToken, refreshToken } = await this.generateTokens(user);

        // Lưu refresh token vào database
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày

        await prisma.refreshToken.create({
            data: {
                userId: user.userId,
                token: refreshToken,
                expiresAt,
            },
        });

        // Trả về thông tin user (không bao gồm password)
        const userResponse = {
            userId: user.userId,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };

        return {
            user: userResponse,
            accessToken,
            refreshToken,
        };
    }

    /**
     * Đăng xuất
     */
    static async logout(refreshToken) {
        if (!refreshToken) {
            throw new Error("Refresh token không hợp lệ");
        }

        // Xóa refresh token khỏi database
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken },
        });

        return true;
    }

    /**
     * Refresh access token
     */
    static async refreshAccessToken(refreshToken) {
        if (!refreshToken) {
            throw new Error("Refresh token không hợp lệ");
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error("Refresh token không hợp lệ hoặc đã hết hạn");
        }

        // Kiểm tra refresh token có tồn tại trong DB không
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken) {
            throw new Error("Refresh token không tồn tại");
        }

        // Kiểm tra hết hạn
        if (new Date() > storedToken.expiresAt) {
            await prisma.refreshToken.delete({
                where: { id: storedToken.id },
            });
            throw new Error("Refresh token đã hết hạn");
        }

        // Tạo access token mới
        const accessToken = this.generateAccessToken(storedToken.user);

        return { accessToken };
    }

    /**
     * Tạo cặp access token + refresh token
     */
    static async generateTokens(user) {
        const payload = {
            userId: user.userId,
            email: user.email,
            role: user.role,
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        });

        return { accessToken, refreshToken };
    }

    /**
     * Tạo access token
     */
    static generateAccessToken(user) {
        const payload = {
            userId: user.userId,
            email: user.email,
            role: user.role,
        };

        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        });
    }

    /**
     * Verify access token
     */
    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error("Token không hợp lệ hoặc đã hết hạn");
        }
    }
}

module.exports = AuthService;
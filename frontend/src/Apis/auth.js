import axios from "axios";

const API_URL = "https://travel-web-t6.onrender.com/api";

// Tạo axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - thêm token vào header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - xử lý refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data.data;
                localStorage.setItem("accessToken", accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh token thất bại, logout user
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                window.location.href = "/";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

class AuthAPI {
    /**
     * Đăng ký user mới
     */
    static async register(userData) {
        try {
            const response = await apiClient.post("/auth/register", userData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Đăng nhập
     */
    static async login(email, password) {
        try {
            const response = await apiClient.post("/auth/login", { email, password });
            const { user, accessToken, refreshToken } = response.data.data;

            // Lưu vào localStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Đăng xuất
     */
    static async logout() {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            await apiClient.post("/auth/logout", { refreshToken });

            // Xóa localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            return true;
        } catch (error) {
            // Vẫn xóa localStorage dù API lỗi
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            throw this.handleError(error);
        }
    }

    /**
     * Lấy thông tin user hiện tại
     */
    static async getCurrentUser() {
        try {
            const response = await apiClient.get("/auth/me");
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Refresh access token
     */
    static async refreshToken(refreshToken) {
        try {
            const response = await apiClient.post("/auth/refresh", { refreshToken });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Xử lý lỗi
     */
    static handleError(error) {
        if (error.response) {
            return new Error(error.response.data.message || "Có lỗi xảy ra");
        } else if (error.request) {
            return new Error("Không thể kết nối đến server");
        } else {
            return new Error(error.message || "Có lỗi xảy ra");
        }
    }
}

export default AuthAPI;

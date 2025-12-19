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

class TourAPI {
    /**
     * Lấy danh sách tours với filters
     * @param {Object} filters - { page, limit, categoryId, minPrice, maxPrice, search, sortBy, sortOrder }
     */
    static async getTours(filters = {}) {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach((key) => {
                if (filters[key] !== null && filters[key] !== undefined) {
                    params.append(key, filters[key]);
                }
            });

            const response = await apiClient.get(`/tours?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy chi tiết 1 tour
     * @param {number} tourId
     */
    static async getTourById(tourId) {
        try {
            const response = await apiClient.get(`/tours/${tourId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy tours liên quan
     * @param {number} tourId
     * @param {number} limit
     */
    static async getRelatedTours(tourId, limit = 4) {
        try {
            const response = await apiClient.get(`/tours/${tourId}/related?limit=${limit}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy tours phổ biến
     * @param {number} limit
     */
    static async getPopularTours(limit = 6) {
        try {
            const response = await apiClient.get(`/tours/popular?limit=${limit}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy tours mới nhất
     * @param {number} limit
     */
    static async getLatestTours(limit = 6) {
        try {
            const response = await apiClient.get(`/tours/latest?limit=${limit}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Tìm kiếm tours
     * @param {string} keyword
     * @param {number} limit
     */
    static async searchTours(keyword, limit = 10) {
        try {
            const response = await apiClient.get(
                `/tours/search?q=${encodeURIComponent(keyword)}&limit=${limit}`
            );
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

export default TourAPI;

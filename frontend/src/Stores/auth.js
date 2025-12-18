import { create } from "zustand";
import AuthAPI from "../Apis/auth";

const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),
    isLoading: false,
    error: null,

    /**
     * Đăng nhập
     */
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await AuthAPI.login(email, password);
            const { user, accessToken, refreshToken } = response.data;

            set({
                user,
                accessToken,
                refreshToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    /**
     * Đăng ký
     */
    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await AuthAPI.register(userData);
            set({ isLoading: false, error: null });
            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    /**
     * Đăng xuất
     */
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await AuthAPI.logout();
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            // Vẫn logout ở client dù API lỗi
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    },

    /**
     * Cập nhật thông tin user
     */
    updateUser: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await AuthAPI.getCurrentUser();
            const user = response.data;

            localStorage.setItem("user", JSON.stringify(user));
            set({ user, isLoading: false, error: null });

            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    /**
     * Clear error
     */
    clearError: () => set({ error: null }),
}));

export default useAuthStore;

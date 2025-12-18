import { create } from "zustand";
import TourAPI from "../Apis/tour";
import { Tour } from "../Types/tour";

const useTourStore = create((set, get) => ({
    // State
    tours: [],
    currentTour: null,
    relatedTours: [],
    popularTours: [],
    latestTours: [],
    searchResults: [],
    pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    },
    filters: {
        page: 1,
        limit: 12,
        categoryId: null,
        minPrice: null,
        maxPrice: null,
        minDuration: null,
        maxDuration: null,
        search: null,
        sortBy: "createdAt",
        sortOrder: "desc",
        status: "ACTIVE",
    },
    isLoading: false,
    error: null,

    /**
     * Lấy danh sách tours
     */
    getTours: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const mergedFilters = { ...get().filters, ...filters };
            const response = await TourAPI.getTours(mergedFilters);

            set({
                tours: response.data.map((tour) => new Tour(tour)),
                pagination: response.pagination,
                filters: mergedFilters,
                isLoading: false,
            });

            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    /**
     * Lấy chi tiết tour
     */
    getTourById: async (tourId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await TourAPI.getTourById(tourId);
            const tour = new Tour(response.data);

            set({
                currentTour: tour,
                isLoading: false,
            });

            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    /**
     * Lấy tours liên quan
     */
    getRelatedTours: async (tourId, limit = 4) => {
        try {
            const response = await TourAPI.getRelatedTours(tourId, limit);
            set({
                relatedTours: response.data.map((tour) => new Tour(tour)),
            });
            return response;
        } catch (error) {
            console.error("Error fetching related tours:", error);
            throw error;
        }
    },

    /**
     * Lấy tours phổ biến
     */
    getPopularTours: async (limit = 6) => {
        try {
            const response = await TourAPI.getPopularTours(limit);
            set({
                popularTours: response.data.map((tour) => new Tour(tour)),
            });
            return response;
        } catch (error) {
            console.error("Error fetching popular tours:", error);
            throw error;
        }
    },

    /**
     * Lấy tours mới nhất
     */
    getLatestTours: async (limit = 6) => {
        try {
            const response = await TourAPI.getLatestTours(limit);
            set({
                latestTours: response.data.map((tour) => new Tour(tour)),
            });
            return response;
        } catch (error) {
            console.error("Error fetching latest tours:", error);
            throw error;
        }
    },

    /**
     * Tìm kiếm tours
     */
    searchTours: async (keyword, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await TourAPI.searchTours(keyword, limit);
            set({
                searchResults: response.data.map((tour) => new Tour(tour)),
                isLoading: false,
            });
            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    /**
     * Cập nhật filters
     */
    updateFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        }));
    },

    /**
     * Reset filters
     */
    resetFilters: () => {
        set({
            filters: {
                page: 1,
                limit: 12,
                categoryId: null,
                minPrice: null,
                maxPrice: null,
                minDuration: null,
                maxDuration: null,
                search: null,
                sortBy: "createdAt",
                sortOrder: "desc",
                status: "ACTIVE",
            },
        });
    },

    /**
     * Clear current tour
     */
    clearCurrentTour: () => {
        set({ currentTour: null });
    },

    /**
     * Clear error
     */
    clearError: () => {
        set({ error: null });
    },
}));

export default useTourStore;

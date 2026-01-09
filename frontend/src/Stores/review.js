import { create } from "zustand";
import * as reviewApi from "../Apis/review";

const useReviewStore = create((set, get) => ({
    // State
    reviews: [],
    myReviews: [],
    currentReview: null,
    ratingStats: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },

    // Actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // ========== PUBLIC Actions ==========

    // Lấy reviews của tour
    fetchReviewsByTour: async (tourId, params) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewApi.getReviewsByTour(tourId, params);

            console.log("Full API Response:", response);

            let reviewsData = [];
            let paginationData = {};

            if (response.data && response.data.reviews) {
                reviewsData = Array.isArray(response.data.reviews) ? response.data.reviews : [];
                paginationData = response.data.pagination || {};
            } else if (response.reviews) {
                reviewsData = Array.isArray(response.reviews) ? response.reviews : [];
                paginationData = response.pagination || {};
            } else if (response.data && Array.isArray(response.data)) {
                reviewsData = response.data;
            } else if (Array.isArray(response)) {
                reviewsData = response;
            }

            console.log("Processed reviews:", reviewsData);
            console.log("Pagination:", paginationData);

            set({
                reviews: reviewsData,
                pagination: paginationData,
                loading: false,
            });

            return response;
        } catch (error) {
            console.error("Fetch reviews error:", error);
            set({
                error: error.message || "Failed to fetch reviews",
                loading: false,
                reviews: [],
            });
            throw error;
        }
    },

    // Lấy thống kê rating
    fetchTourRatingStats: async (tourId) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewApi.getTourRatingStats(tourId);
            const stats = response.data?.stats || response.stats || response.data;

            set({
                ratingStats: stats,
                loading: false,
            });
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to fetch rating stats", loading: false });
            throw error;
        }
    },

    // ========== USER Actions ==========

    // Tạo review mới
    createReview: async (tourId, reviewData) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewApi.createReview(tourId, reviewData);
            const review = response.data?.review || response.review || response.data;

            set((state) => ({
                reviews: [review, ...state.reviews],
                myReviews: [review, ...state.myReviews],
                currentReview: review,
                loading: false,
            }));
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to create review", loading: false });
            throw error;
        }
    },

    // Lấy review của user cho một tour
    fetchUserReviewForTour: async (tourId) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewApi.getUserReviewForTour(tourId);
            const review = response.data?.review || response.review || response.data;

            set({
                currentReview: review,
                loading: false,
            });
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to fetch user review", loading: false });
            throw error;
        }
    },

    // Lấy tất cả reviews của user
    fetchMyReviews: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewApi.getMyReviews(params);

            console.log("Full API Response:", response);

            let reviewsData = [];
            let paginationData = {};

            if (response.data && response.data.reviews) {
                reviewsData = Array.isArray(response.data.reviews) ? response.data.reviews : [];
                paginationData = response.data.pagination || {};
            } else if (response.reviews) {
                reviewsData = Array.isArray(response.reviews) ? response.reviews : [];
                paginationData = response.pagination || {};
            } else if (response.data && Array.isArray(response.data)) {
                reviewsData = response.data;
            } else if (Array.isArray(response)) {
                reviewsData = response;
            }

            console.log("Processed my reviews:", reviewsData);

            set({
                myReviews: reviewsData,
                pagination: paginationData,
                loading: false,
            });

            return response;
        } catch (error) {
            console.error("Fetch my reviews error:", error);
            set({
                error: error.message || "Failed to fetch my reviews",
                loading: false,
                myReviews: [],
            });
            throw error;
        }
    },

    // Cập nhật review
    updateReview: async (reviewId, reviewData) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewApi.updateReview(reviewId, reviewData);
            const updatedReview = response.data?.review || response.review || response.data;

            set((state) => ({
                reviews: state.reviews.map((review) =>
                    review.reviewId === reviewId || review._id === reviewId ? updatedReview : review
                ),
                myReviews: state.myReviews.map((review) =>
                    review.reviewId === reviewId || review._id === reviewId ? updatedReview : review
                ),
                currentReview:
                    state.currentReview?.reviewId === reviewId ||
                    state.currentReview?._id === reviewId
                        ? updatedReview
                        : state.currentReview,
                loading: false,
            }));
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to update review", loading: false });
            throw error;
        }
    },

    // Xóa review
    deleteReview: async (reviewId) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewApi.deleteReview(reviewId);

            set((state) => ({
                reviews: state.reviews.filter(
                    (review) => review.reviewId !== reviewId && review._id !== reviewId
                ),
                myReviews: state.myReviews.filter(
                    (review) => review.reviewId !== reviewId && review._id !== reviewId
                ),
                currentReview:
                    state.currentReview?.reviewId === reviewId ||
                    state.currentReview?._id === reviewId
                        ? null
                        : state.currentReview,
                loading: false,
            }));
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to delete review", loading: false });
            throw error;
        }
    },

    // ========== ADMIN Actions ==========

    // Ẩn/hiện review (Admin only)
    toggleReviewStatus: async (reviewId, status) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewApi.toggleReviewStatus(reviewId, status);
            const updatedReview = response.data?.review || response.review || response.data;

            set((state) => ({
                reviews: state.reviews.map((review) =>
                    review.reviewId === reviewId || review._id === reviewId
                        ? { ...review, status }
                        : review
                ),
                loading: false,
            }));
            return response;
        } catch (error) {
            set({ error: error.message || "Failed to toggle review status", loading: false });
            throw error;
        }
    },

    // Reset store
    resetStore: () =>
        set({
            reviews: [],
            myReviews: [],
            currentReview: null,
            ratingStats: null,
            loading: false,
            error: null,
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
            },
        }),
}));

export default useReviewStore;

const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Public routes
// GET /api/review/tours/:tourId
router.get("/tours/:tourId", reviewController.getReviewsByTour);
// GET /api/review/tours/:tourId/stats
router.get("/tours/:tourId/stats", reviewController.getTourRatingStats);

// Protected routes - User phải đăng nhập
// POST /api/review/tours/:tourId
router.post("/tours/:tourId", authMiddleware, reviewController.createReview);
// GET /api/review/tours/:tourId/me
router.get("/tours/:tourId/me", authMiddleware, reviewController.getUserReviewForTour);
// GET /api/review/me
router.get("/me", authMiddleware, reviewController.getMyReviews);
// PUT /api/review/:reviewId
router.put("/:reviewId", authMiddleware, reviewController.updateReview);
// DELETE /api/review/:reviewId
router.delete("/:reviewId", authMiddleware, reviewController.deleteReview);

module.exports = router;

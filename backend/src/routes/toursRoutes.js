const express = require("express");
const router = express.Router();
const tourController = require("../controllers/toursController");

// Public routes
router.get("/popular", tourController.getPopularTours);
router.get("/latest", tourController.getLatestTours);
router.get("/search", tourController.searchTours);
router.get("/:id/related", tourController.getRelatedTours);
router.get("/:id", tourController.getTourById);
router.get("/", tourController.getTours);

module.exports = router;

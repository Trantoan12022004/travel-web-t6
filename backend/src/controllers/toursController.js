const tourService = require("../services/toursService");

class TourController {
    // GET /api/tours - Danh sách tours
    async getTours(req, res) {
        try {
            const result = await tourService.getTours(req.query);
            res.json({
                success: true,
                data: result.tours,
                pagination: result.pagination,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // GET /api/tours/:id - Chi tiết tour
    async getTourById(req, res) {
        try {
            const tour = await tourService.getTourById(req.params.id);
            res.json({
                success: true,
                data: tour,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }

    // GET /api/tours/:id/related - Tours liên quan
    async getRelatedTours(req, res) {
        try {
            const tours = await tourService.getRelatedTours(req.params.id, req.query.limit);
            res.json({
                success: true,
                data: tours,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // GET /api/tours/popular - Tours phổ biến
    async getPopularTours(req, res) {
        try {
            const tours = await tourService.getPopularTours(req.query.limit);
            res.json({
                success: true,
                data: tours,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // GET /api/tours/latest - Tours mới nhất
    async getLatestTours(req, res) {
        try {
            const tours = await tourService.getLatestTours(req.query.limit);
            res.json({
                success: true,
                data: tours,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // GET /api/tours/search - Tìm kiếm
    async searchTours(req, res) {
        try {
            const tours = await tourService.searchTours(req.query.q, req.query.limit);
            res.json({
                success: true,
                data: tours,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new TourController();

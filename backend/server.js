const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "https://travel-web-t6-5zyh.vercel.app"], // Frontend URLs
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Auto-load all routes
const loadRoutes = require("./src/routes");
const routes = loadRoutes(app);

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Travel Tour API is running",
        timestamp: new Date().toISOString(),
    });
});

// API documentation endpoint
app.get("/api", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Travel Tour API",
        version: "1.0.0",
        routes: routes.map((r) => ({
            name: r.name,
            path: r.path,
        })),
    });
});

// Test page
app.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "test-api.html"));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "Route not found",
        data: null,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📖 API info: http://localhost:${PORT}/api`);
    console.log(`🧪 Test API: http://localhost:${PORT}/test\n`);
});

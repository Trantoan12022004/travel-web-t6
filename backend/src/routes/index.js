const fs = require("fs");
const path = require("path");

/**
 * Tự động load tất cả routes từ thư mục routes
 */
function loadRoutes(app) {
    const routesPath = __dirname;
    const routes = [];

    fs.readdirSync(routesPath).forEach((file) => {
        // Skip index.js
        if (file === "index.js") return;

        // Chỉ load file .js
        if (file.endsWith(".js")) {
            // Lấy tên route từ tên file (vd: authRoutes.js -> auth)
            const routeName = file.replace(".js", "").replace("Routes", "").toLowerCase();

            // Load route module
            const route = require(path.join(routesPath, file));

            // Mount route
            const routePath = `/api/${routeName}`;
            app.use(routePath, route);

            routes.push({
                name: routeName,
                path: routePath,
                file: file,
            });

            console.log(`✅ Loaded route: ${routePath} (${file})`);
        }
    });

    return routes;
}

module.exports = loadRoutes;

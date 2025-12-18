const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Bỏ SSL hoặc set ssl: false cho local development
    ssl: false,
    max: 20, // Số kết nối tối đa
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

console.log("DATABASE_URL:", process.env.DATABASE_URL, typeof process.env.DATABASE_URL);

// Test kết nối
pool.on("connect", () => {
    console.log("✅ Đã kết nối thành công đến PostgreSQL");
});

pool.on("error", (err) => {
    console.error("❌ Lỗi kết nối PostgreSQL:", err);
    process.exit(-1);
});

module.exports = pool;
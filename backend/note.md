# Tạo migration mới
npx prisma migrate dev --name ten_migration

# Reset database (xóa tất cả data)
npx prisma migrate reset

# Đồng bộ schema không tạo migration (dev only)
npx prisma db push

# Format schema file
npx prisma format

# Xem trạng thái migrations
npx prisma migrate status

# Seed database (tạo data mẫu)
npx prisma db seed

npx prisma generate

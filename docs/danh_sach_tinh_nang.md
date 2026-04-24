# Danh sách tính năng — Ecommerce Shop Cosmetics

Tài liệu liệt kê các tính năng chính dựa trên cấu trúc dự án hiện có (backend, frontend, scripts, docker, payments, v.v.).

**1. Tổng quan hệ thống**

- API REST cho backend (Express + TypeScript).
- Frontend Next.js (SSR/CSR) với trang sản phẩm, giỏ hàng, thanh toán.
- DB: Prisma (schema.prisma) + seed data trong `data_seed_product`.
- Sử dụng Cloudinary và Supabase (cấu hình trong `src/config`).
- Container: Docker + `docker-compose.yml`.

**2. Xác thực & phân quyền**

- Đăng ký / đăng nhập (OAuth/Local) — route `auth`.
- Quản lý người dùng: profile, vai trò (RBAC) — route `users`, `admin/rbac`.
- Middleware bảo vệ route cho admin và user.

**3. Sản phẩm & Danh mục**

- Quản lý sản phẩm: CRUD sản phẩm, variant, hình ảnh — route `products`.
- Danh mục & nhóm danh mục: `categories`, `category-groups`.
- Tìm kiếm/lọc sản phẩm theo category/brand/variant/giá.
- Quản lý hình ảnh upload (Cloudinary) — route `upload`.

**4. Thương hiệu (Brand)**

- CRUD thương hiệu — route `brands`.
- Seed/nhập dữ liệu thương hiệu từ `data_seed_product`.

**5. Giỏ hàng & Thanh toán**

- Giỏ hàng trên server: tạo, cập nhật, xóa — route `carts`.
- Hệ thống đặt hàng / đơn hàng: `orders`, `purchases`.
- Tích hợp cổng thanh toán (thư mục có nhiều class-payment):
  - VNPAY
  - MOMO
  - ZaloPay
- Route `payment` xử lý callback & tạo order.

**6. Quản lý kho & Inventory**

- Tồn kho, nhập kho, trừ kho — route `inventory`.
- Purchase / receiving records — route `purchases`.

**7. Khuyến mãi & Voucher**

- Tạo / áp dụng voucher giảm giá — route `vouchers`.
- Logic điều kiện áp dụng, thời hạn, giới hạn sử dụng.

**8. Người dùng & Tương tác**

- Wishlist / favorites — route `wishlist`.
- Review & rating sản phẩm — route `reviews`.
- Hệ thống câu hỏi/trả lời sản phẩm — route `questions`.

**9. Notification & Real-time**

- Notification API — route `notifications`.
- Socket.io để realtime (notification, order status) — `services/socket.service`.

**10. Dashboard & Báo cáo admin**

- Dashboard admin (doanh số, tồn kho, đơn hàng) — route `admin/dashboard`.
- Các endpoint thống kê (revenue, top products, inventory alerts).

**11. Hệ thống upload / media**

- Upload file / ảnh (Cloudinary config) — `src/config/cloudinary.ts`.
- Lưu metadata hình ảnh trong DB.

**12. Cấu hình & scripts**

- Prisma migrations trong `prisma/migrations`.
- Seed data trong `data_seed_product`.
- Utility scripts trong `src/scripts`.

**13. DevOps / Triển khai**

- `docker/docker-compose.yml` để chạy DB & services cơ bản.
- Cấu hình môi trường `.env` (dotenv usage).
- Frontend deploy target: Vercel (dấu hiệu trong `index.ts` CORS origin).

**14. Các tính năng mở rộng / đề xuất**

- Tích hợp tìm kiếm toàn văn (Elasticsearch / Meilisearch).
- Hệ thống email/queue (celery/worker hoặc Bull queue).
- Multi-warehouse & advanced inventory rules.
- Analytics & event tracking.

---

File tạo tự động từ cấu trúc dự án hiện có. Nếu muốn, tôi có thể:

- Thêm chi tiết endpoint (danh sách route + phương thức) từ mã nguồn.
- Phân rã thành backlog user stories hoặc mô tả acceptance criteria.

Reelz DApp: Decentralized Short-Video Roadmap
Dự án Reelz tận dụng hạ tầng Shelby (Hot Storage) và Aptos Blockchain để tạo ra trải nghiệm video ngắn mượt mà, bảo mật và thuộc quyền sở hữu của người dùng.

---

📂 1. Cấu trúc Folder trên Shelby Explorer
Dữ liệu được tổ chức theo đường dẫn (Path-based) để đảm bảo tính khoa học khi người dùng truy cập trực tiếp qua Shelby Explorer.

Root Namespace: apps/reelz/

apps/reelz/{user_address}/
├── profile/
│ ├── metadata.json.enc # Thông tin cá nhân (Đã mã hóa)
│ └── settings.json.enc # Cấu hình riêng tư (Đã mã hóa)
├── uploads/
│ ├── avatar.png # Ảnh đại diện gốc (Public)
│ ├── videos/
│ │ ├── vid_17109400.mp4 # File video thô (Public for streaming)
│ │ └── vid_17109400.json # Metadata của video (Title, Tags)
│ └── thumbnails/
│ └── thumb_17109400.jpg # Ảnh cover trích xuất từ video
└── activity/
└── likes.json # Lịch sử tương tác (Read-only)

---

🛠 2. Các Backend Functions Cốt lõi

A. \_handleUploadVideo

Hàm xử lý tải lên video chính yếu, tối ưu hóa cho việc phát sóng (streaming).
Input: File, UserWallet, VideoTitle.

Quy trình:
Kiểm tra định dạng .mp4 và dung lượng (Max 50MB cho video ngắn).
Gọi Shelby SDK sử dụng multipartUpload để chia nhỏ file (Chunking).
Lưu file vào đường dẫn: apps/reelz/{address}/uploads/videos/vid\_{ts}.mp4.
Trả về blobId và PublicURL.

---

B. \_handleUploadImage (Thumbnail + Avatar)
Hàm dùng chung để tải lên các tài nguyên hình ảnh.

Input: ImageFile, Category (avatar | thumbnail).
Quy trình:
Nén ảnh (Compress) phía client/backend để giảm dung lượng blobs.
Định vị đường dẫn dựa trên Category:
Avatar: apps/reelz/{address}/uploads/avatar.png
Thumbnail: apps/reelz/{address}/uploads/thumbnails/thumb\_{ts}.jpg
Tải lên Shelby dưới dạng Public Read.

---

C. \_handleUploadProfile (Security Focus)
Hàm cập nhật thông tin người dùng với cơ chế bảo mật cao.

Input: ProfileData (Object), UserPublicKey.
Quy trình:
Encryption: Sử dụng Aptos SDK hoặc Ecies để mã hóa ProfileData bằng Public Key của người dùng.
Blob Storage: Lưu file đã mã hóa (.enc) lên Shelby tại profile/metadata.json.enc.
On-chain Pointer: Ký một giao dịch Aptos lưu Hash của file này để Indexer xác thực tính toàn vẹn.
Chỉ chủ sở hữu ví mới có Private Key để giải mã dữ liệu này khi đăng nhập.

---

🗺 3. Lộ trình phát triển (Development Roadmap)

Giai đoạn 1: Infrastructure (Tuần 1-2)
[ ] Thiết lập môi trường Shelby Devnet và API Keys.

[ ] Triển khai Smart Contract cơ bản trên Aptos Testnet (Lưu trữ Metadata Pointer).

[ ] Xây dựng Helper Service cho Shelby (Upload/Download/Delete).

Giai đoạn 2: Profile & Identity (Tuần 3)
[ ] Hoàn thiện \_handleUploadImage cho Avatar.

[ ] Triển khai \_handleUploadProfile với cơ chế mã hóa (Encryption).

[ ] Xây dựng trang Profile cá nhân đồng bộ dữ liệu từ Shelby.

Giai đoạn 3: Core Video Features (Tuần 4-5)
[ ] Tích hợp Shelby Media Kit vào Frontend (React/Vue).

[ ] Hoàn thiện \_handleUploadVideo với cơ chế tạo Thumbnail tự động.

[ ] Xây dựng Indexer (Subsquid) để quét các bài đăng video từ Aptos Events.

Giai đoạn 4: Social & Discovery (Tuần 6-7)
[ ] Phát triển thuật toán gợi ý cơ bản (Trending/Newest) từ Indexer.

[ ] Thêm tính năng Like/Comment (Lưu event on-chain).

[ ] Tích hợp cơ chế Pay-per-read để Creator bắt đầu nhận thưởng từ lượt xem.

🔒 4. Nguyên tắc Bảo mật Dữ liệu
Public by Default: Video và Thumbnail luôn công khai để tối ưu tốc độ phân phối (CDN).

Private by Encryption: Mọi dữ liệu định danh cá nhân (PII) phải được mã hóa trước khi chạm vào Shelby.

Owner-Controlled: Chỉ User mới có quyền Write/Delete thông qua việc ký chữ ký số (Digital Signature).

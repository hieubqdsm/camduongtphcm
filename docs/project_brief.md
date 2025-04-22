Dưới đây là bản dịch tiếng Việt của nội dung bạn cung cấp:

---

**Tên dự án:** Ứng dụng Tìm kiếm Tuyến đường Hạn chế tại TP. Hồ Chí Minh

**Mô tả:** Một ứng dụng bản đồ chuyên dụng hiển thị thông tin đóng đường tại TP. Hồ Chí Minh trong các sự kiện đặc biệt, giúp người dùng tìm kiếm và xác định các khu vực bị hạn chế giao thông theo thời gian thực.

**Mục tiêu chính:**  
- Cung cấp bản đồ đóng đường chính xác và cập nhật theo thời gian thực.  
- Cho phép người dùng dễ dàng tìm kiếm và xem các khu vực bị hạn chế trong các sự kiện.  
- Cải thiện việc lập kế hoạch di chuyển và quản lý giao thông trong thành phố.

---

## Công nghệ & Môi trường phát triển

- **Frontend:** React/Next.js  
- **Lưu trữ:** localStorage  
- **Nền tảng mục tiêu:** Ứng dụng trang đơn (Single-Page Application)  
- **Phiên bản Framework & Cấu hình:** Phiên bản ổn định mới nhất

---

## Yêu cầu & Tính năng

**Tính năng cốt lõi:**  
1. Bản đồ thời gian thực với các khu vực hạn chế: Hiển thị các vùng đóng đường động trên bản đồ nền.  
2. Tính năng tìm kiếm: Cho phép người dùng nhập tên đường hoặc khu vực để hiển thị các vùng bị hạn chế.

**Luồng người dùng:** Người dùng mở ứng dụng, sử dụng thanh tìm kiếm để nhập địa chỉ hoặc khu vực, xem các vùng đường bị hạn chế trên bản đồ, và nhấp vào các khu vực được đánh dấu để xem thông tin chi tiết về việc đóng đường.

**Quy tắc nghiệp vụ:** Dữ liệu phải được lấy từ các nguồn dữ liệu mở chính thức của thành phố và cập nhật gần như thời gian thực; chỉ quản trị viên đã xác thực mới có quyền chỉnh sửa dữ liệu đóng đường.

---

## Thiết kế UI/UX

- **Bố cục:** Bản đồ toàn màn hình với thanh tìm kiếm cố định ở trên cùng và thanh bên có thể thu gọn để hiển thị thông tin chi tiết về việc đóng đường và cập nhật sự kiện.  
- **Giao diện & Trải nghiệm:** Hiện đại, sạch sẽ, đáp ứng tốt; tập trung vào tính dễ sử dụng với các chỉ báo trực quan rõ ràng cho các khu vực bị hạn chế.  
- **Các trang:** Trang chủ (bản đồ và tìm kiếm), Trang chi tiết (thông tin đóng đường cụ thể), Trang giới thiệu/FAQ hướng dẫn người dùng.  
- **Các thành phần:** Thành phần bản đồ, ô nhập tìm kiếm, thẻ/modal thông tin chi tiết, thanh điều hướng, chân trang.

---

## Mô hình dữ liệu & Cấu hình Supabase

- **Sơ đồ cơ sở dữ liệu:** Không yêu cầu backend và database.  
- **Bảo mật cấp dòng:** Không yêu cầu.  
- **Yêu cầu xác thực:** Không yêu cầu.

---

## Kế hoạch triển khai chi tiết

1. **Khởi tạo dự án**  
   - Tạo kho mã nguồn với React/Next.js.  
   - Cấu hình biến môi trường và máy chủ phát triển; chuẩn bị kịch bản cấu hình cho triển khai SPA trên Netlify.  
   - Cài đặt các thư viện cần thiết: react, react-dom, react-router-dom, tailwindcss, axios.  
   - Chuẩn bị cấu hình Netlify bao gồm chuyển hướng cho SPA, metadata SEO và favicon.

2. **Cấu trúc trang và định tuyến**  
   - Tạo các trang chính: Trang chủ (bản đồ và tìm kiếm), Trang chi tiết, Trang giới thiệu.  
   - Thiết lập các thành phần giữ chỗ đảm bảo luồng định tuyến đúng với React Router.  
   - Kiểm tra điều hướng giữa các trang theo luồng người dùng đã định.

3. **Triển khai UI/UX**  
   - Xây dựng bố cục cơ bản với header cố định chứa ô tìm kiếm, footer đáp ứng, và menu điều hướng.  
   - Triển khai các thành phần UI cần thiết như bản đồ, thanh tìm kiếm, modal và thẻ thông tin.  
   - Đảm bảo đồng bộ với hướng dẫn thương hiệu: kiểu chữ, khoảng cách, và bảng màu nhấn mạnh các vùng hạn chế bằng màu đỏ và cảnh báo bằng màu bổ sung.

4. **Định nghĩa mô hình dữ liệu**  
   - Xác định các thực thể dữ liệu: ClosureEvent (với các trường như id, đường, khu vực, thời gian bắt đầu, thời gian kết thúc, mô tả).  
   - Tạo kiểu TypeScript nhẹ cho các thực thể này và phác thảo sơ đồ ERD đơn giản trong thư mục tài liệu bằng biểu đồ mermaid.

5. **Tích hợp dữ liệu giả lập (chưa có xác thực)**  
   - Chèn dữ liệu giả lập cho các sự kiện đóng đường để mô phỏng nội dung động trên bản đồ.  
   - Kiểm tra việc hiển thị dữ liệu giả lập trên form tìm kiếm, lớp phủ bản đồ và modal chi tiết.  
   - Điều chỉnh luồng người dùng cuối cùng trước khi tích hợp với dữ liệu thực.

6. **Logic tính năng cốt lõi (Frontend với dữ liệu giả lập)**  
   - Triển khai các tính năng CRUD trên frontend dùng đối tượng cục bộ để mô phỏng quản lý dữ liệu đóng đường (lọc, sắp xếp).  
   - Đảm bảo tính năng tìm kiếm và lọc hoạt động trơn tru.  
   - Điều chỉnh giao diện dựa trên phản hồi tương tác với dữ liệu giả lập.

7. **Tích hợp dữ liệu thực và logic hoàn chỉnh**  
    - Thay thế dữ liệu giả lập bằng các dữ liệu thực và cập nhật trực tiếp từ nguồn dữ liệu xác thực.  
    - Kiểm tra hoạt động lớp phủ bản đồ và kết quả tìm kiếm với dữ liệu trực tiếp, bao gồm xử lý lỗi cho các trường hợp đặc biệt.  
    - Tối ưu hóa cho các trạng thái không có dữ liệu, lỗi mạng và kịch bản làm mới dữ liệu.

8. **Cập nhật tài liệu**  
    - Chỉnh sửa README để phản ánh cấu trúc dự án cuối cùng, các bước cài đặt, triển khai và hướng dẫn sử dụng.  
    - Cập nhật các sơ đồ (ERD, luồng dữ liệu) trong thư mục tài liệu đồng bộ với triển khai cuối cùng.  
    - Bao gồm chi tiết các bước xử lý sự cố trong tài liệu dự án.

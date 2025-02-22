# Printing Service

## Giới thiệu

Đây là một dự án dịch vụ in ấn được xây dựng bằng Node.js và Express.js theo mô hình MVC (Model-View-Controller). Dự án này bao gồm các chức năng quản lý người dùng, quản lý máy in, quản lý lịch sử in ấn, mua trang in, và các báo cáo thống kê.

## Các công nghệ sử dụng

-   Node.js
-   Express.js
-   Sequelize (ORM cho MySQL)
-   JWT (JSON Web Token) cho xác thực
-   bcrypt.js cho mã hóa mật khẩu
-   Multer cho xử lý file upload
-   Nodemailer cho gửi email


## Hướng dẫn cài đặt

1. Clone repository về máy:
    ```sh
    git clone https://github.com/huyhoang8704/A-Smart-Printing-Service.git
    ```
2. Cài đặt các dependencies:
    ```sh
    npm install
    ```
3. Tạo file `.env` và cấu hình các thông tin kết nối database:
    ```env
    MYSQL_PORT=3306
    MYSQL_USERNAME=<your-username>
    MYSQL_PASSWORD=<your-password>
    MYSQL_DATABASE=<your-database>
    MYSQL_HOST=<your-host>
    PORT=3000
    JWT_SECRET=<your-jwt-secret>
    ```
4. Khởi động server:
    ```sh
    npm start
    ```

## Relevant resources
Backend: https://cnpm-40sj.onrender.com/

FrontEnd: https://project-software-smart-print.vercel.app/

Report: https://drive.google.com/file/d/15pqGQMr1vGxihEDvJGRg_ViVYReZKrL0/view?usp=drive_link

# Tài khoản Admin (SPSO) để sử dụng
+ Tên đăng nhập: SPSO 1
+ Mật khẩu: 123456
# Tài khoản user để sử dụng
+ Tên đăng nhập: thai.nguyen0710@hcmut.edu.vn
+ Mật khẩu: 123456
+ (hoặc dùng tài khoản @hcmut.edu.vn để tạo tài khoản)


## Liên hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: [huyhoang8704@gmail.com](mailto:huyhoang8704@gmail.com).

---
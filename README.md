# expressjs-mvc

## Cách chạy chương trình

-   Phải cài đặt trước và kết nối được mysql, nodejs, npm
-   tạo 1 database trong mysql, bỏ các username, password,.. trong file .env
-   `npm i`
-   `node ./bin/www`

## Cấu trúc folder

Tuân theo cấu trúc Model - View - Controller, trong đó View thuộc về phía frontend, backend chỉ quan tâm model và controller

### ./bin/www và app.js

app.js là điểm bắt đầu của chương trình, dùng để config các middlewares và định nghĩa routes. ./bin/www được dùng để setup một HTTP server. File này được tạo ra bởi `express-generator`

### Routes

Định nghĩa các endpoints cho chương trình và map các endpoints với các controllers.

### Controllers

Xử lý Request được gửi tới, bao gồm nhưng không giới hạn việc validate Request và gọi các service liên quan. Đây là một chương trình monolith nên gọi service nào cũng được.

### Services

Xử lý các bussiness logic, lớp này là không bắt buộc trong mô hình MVC, tuy nhiên khi chương trình ngày càng mở rộng thì việc tách lớp là cần thiết để kiểm soát code.

### Models

Định nghĩa kiểu dữ liệu, và được dùng để tương tác với databases.

### Middlewares

Là các hàm được thực thi trong 1 vòng lặp request - response, sử dụng phổ biến ở lớp application (app.js), lớp routes(authenticate and authorize,...), lớp controllers (validate,.. tuy nhiên trong trường hợp này ta dùng models để validate).

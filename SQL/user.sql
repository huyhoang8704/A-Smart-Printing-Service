CREATE TABLE users (
    id VARCHAR(16) Primary Key,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    numberPage INT,
    role ENUM('student', 'lecturer') NOT NULL DEFAULT 'student',
    token VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO users (fullname, email, password, numberPage, role)
VALUES 
    ('Nguyen Van A', 'nguyenvana@gmail.com', 'password123', 10, 'student'),
    ('Le Thi B', 'lethib@gmail.com', 'password456', 20, 'lecturer'),
    ('Tran Van C', 'tranvanc@gmail.com', 'password789', 15, 'student'),
    ('Pham Thi D', 'phamthid@gmail.com', 'password101', NULL, 'lecturer'),
    ('Do Van E', 'dovane@gmail.com', 'password202', 25, 'student');

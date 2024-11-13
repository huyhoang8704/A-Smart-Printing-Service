const authenticateRoleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role; // Giả sử thông tin user được lưu trong req.user

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ status: "failed", message: "Access Denied" });
        }

        next(); // Người dùng có quyền, tiếp tục xử lý
    };
};

module.exports = {authenticateRoleMiddleware}
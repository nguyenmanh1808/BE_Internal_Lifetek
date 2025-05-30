const ProjectRole = require('../projectRole/projectRole.model.js');

// Middleware này kiểm tra xem người dùng có *tất cả* các quyền cần thiết
// (được định nghĩa trong PROJECT_ROLE_PERMISSIONS) trong vai trò của họ
// trong dự án cụ thể hay không.
// Nó giả định rằng projectId có sẵn trong req.params.projectId hoặc req.body.projectId.
// Đối với các route chỉ có resourceId (ví dụ: /tasks/:taskId), bạn có thể cần điều chỉnh
// cách lấy projectId (ví dụ: fetch task để lấy projectId).
const checkProjectPermissions = (requiredPermissions = []) => {
    return async (req, res, next) => {
        try {
            // Đảm bảo middleware xác thực (authMiddleware) đã chạy trước đó
            // và điền thông tin người dùng vào req.user.
            const userId = req.user._id; // req.user từ verifyToken middleware
            // Lấy projectId từ params hoặc body. Điều chỉnh nếu cần.
            // Hoặc từ req.task.projectId nếu một middleware trước đó (như task.controller.load) đã fetch task.
            let projectId = req.params.projectId || req.body.projectId;
            console.log(req.body)
            if (!projectId && req.task && req.task.projectId) {
                projectId = req.task.projectId.toString();
            }

            if (!projectId) {
                 return res.status(400).json({ message: 'Thiếu thông tin Project ID để kiểm tra quyền dự án.' });
            }

            // Tìm vai trò của người dùng (document ProjectRole) trong dự án này
            // bằng cách kiểm tra xem userId có nằm trong mảng userIds của một ProjectRole cho projectId đó không.
            const projectRole = await ProjectRole.findOne({ projectId: projectId, userIds: userId });

            if (!projectRole) {
                // Người dùng đã xác thực nhưng không có vai trò trong dự án này
                return res.status(403).json({ message: 'Bạn không thuộc dự án này hoặc chưa được gán vai trò.' });
            }

            // Kiểm tra xem vai trò của người dùng có TẤT CẢ các quyền cần thiết không
            const userPermissions = projectRole.permissions || []; // Đảm bảo là mảng
            const hasAllRequiredPermissions = requiredPermissions.every(perm => userPermissions.includes(perm));

            if (hasAllRequiredPermissions) {
                next(); // Người dùng có đủ quyền, cho phép tiếp tục
            } else {
                // Người dùng có vai trò trong dự án nhưng thiếu quyền cho hành động này
                return res.status(403).json({ message: 'Bạn không đủ quyền thực hiện chức năng này trong dự án này.' });
            }

        } catch (err) {
            console.error("Error in checkProjectPermissions middleware:", err); // Log lỗi server
            res.status(500).json({ message: 'Lỗi server khi kiểm tra quyền dự án.' });
        }
    };
};

module.exports = checkProjectPermissions;

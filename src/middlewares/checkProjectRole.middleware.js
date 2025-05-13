const ProjectRole = require('../projectRole/projectRole.model.js');

const checkProjectRole = (requiredRoles = []) => {
    return async (req, res, next) => {
        try {
            const userId = req.user._id; // req.user từ verifyToken middleware
            const projectId = req.params.projectId || req.body.projectId;

            if (!projectId) return res.status(400).json({ message: 'Missing projectId' });

            const projectRole = await ProjectRole.findOne({ userId, projectId });

            if (!projectRole) {
                return res.status(403).json({ message: 'Bạn không thuộc project này' });
            }

            if (!requiredRoles.includes(projectRole.role)) {
                return res.status(403).json({ message: 'Bạn không đủ quyền thực hiện chức năng này' });
            }

            next();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
};

module.exports = checkProjectRole;

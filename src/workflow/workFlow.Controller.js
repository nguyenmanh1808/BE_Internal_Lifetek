exports.getDetailWorkFlow = async (req, res, next) => {
    try {
        const managerId = req.user._id;
        const projectId = req.params.projectid;
        const dataWorkFlow = await getDetailWorkFlowService(managerId, projectId);

        if (!dataWorkFlow) {
            return next(new Error("Quy trình làm việc không tồn tại"));
        }
        return new SuccessResponse(dataWorkFlow).send(res);
    }
    catch (e) {
        console.error('Lỗi lấy workflow:', err);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}
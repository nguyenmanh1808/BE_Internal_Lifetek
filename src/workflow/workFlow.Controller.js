const workFlowService = require('./workFlow.service.js')
const SuccessResponse = require("../utils/SuccessResponse.js");
exports.getDetailWorkFlow = async (req, res, next) => {
    try {
        const managerId = req.user._id;
        const projectId = req.params.projectid;
        const dataWorkFlow = await workFlowService.getDetailWorkFlowService(managerId,projectId);

        if (!dataWorkFlow) {
            return next(new Error("Quy trình làm việc không tồn tại"));
        }
        return new SuccessResponse(dataWorkFlow).send(res);
    }
    catch (err) {
        console.error('Lỗi lấy workflow:', err);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}


exports.createWorkflow = async (req, res) => {
  try {
    const workflow = await workFlowService.createWorkflow(req.body);
    res.status(201).json(workflow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateWorkflowStep = async (req, res) => {
  try {
    const workflow = await workFlowService.updateWorkflowStep(req.params.workflowId, req.body);
    res.json(workflow);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.deleteWorkflow = async (req, res) => {
  try {
    const result = await workFlowService.deleteWorkflow(req.params.workflowId);
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

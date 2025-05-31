const workFlowService = require("./workFlow.service.js");
const SuccessResponse = require("../utils/SuccessResponse.js");
const projectService = require("../projects/project.service.js")
exports.getDetailWorkFlow = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const dataWorkFlow = await workFlowService.getDetailWorkFlowService(
      projectId
    );
    if (!dataWorkFlow) {
      return next(new Error("Quy trình làm việc không tồn tại"));
    }
    return new SuccessResponse(dataWorkFlow).send(res);
  } catch (err) {
    console.error("Lỗi lấy workflow:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

exports.createWorkflow = async (req, res) => {
  try {
    const workflow = await workFlowService.createWorkflow(req.body);
    res.status(201).json(workflow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// work flow step
exports.getAllWorkflowStep = async (req, res, next) => {
  try {
    const workflowId = req.params.workflowId;
    const dataWorkFlowStep = await workFlowService.getAllWorkFlowStep(
      workflowId
    );
    if (!dataWorkFlowStep) {
      return next(new Error("Quy trình làm việc không tồn tại"));
    }
    return new SuccessResponse(dataWorkFlowStep).send(res);
  } catch (err) {
    console.error("Lỗi lấy workflow:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
exports.createWorkFlowStep = async (req, res) => {

  try {
    const workflowStep = await workFlowService.createWorkFlowStep(req.body);
    res.status(200).json(workflowStep);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateWorkflowStep = async (req, res) => {
  try {
    const workflow = await workFlowService.updateWorkflowStep(
      req.params.workflowStepId,
      req.body
    );
    res.json(workflow);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
exports.deleteWorkflowStep = async (req, res) => {
  try {
    const result = await workFlowService.deleteWorkflowStep(
      req.params.workflowStepId
    );
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
exports.deleteAllWorkflowStep = async (req, res) => {
  try {
    const result = await workFlowService.deleteAllWorkflowStep(
      req.params.workflowId
    );
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
// work flow transition
exports.getAllWorkflowTransiton = async (req, res, next) => {
  try {
    const workflowId = req.params.workflowId;
    const dataWorkFlowTransiton =
      await workFlowService.getAllWorkFlowTransition(workflowId);
    if (!dataWorkFlowTransiton) {
      return next(new Error("Quy trình làm việc không tồn tại"));
    }
    return new SuccessResponse(dataWorkFlowTransiton).send(res);
  } catch (err) {
    console.error("Lỗi lấy workflow:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
exports.createWorkFlowTransition = async (req, res) => {
  try {
    const WorkFlowTransition = await workFlowService.createWorkFlowTransition(
      req.body
    );
    res.status(200).json(WorkFlowTransition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateWorkflowTransition = async (req, res) => {
  try {
    const WorkflowTransition = await workFlowService.updateWorkflowTransition(
      req.params.WorkflowTransitionId,
      req.body
    );
    res.json(WorkflowTransition);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.deleteWorkflowTransition = async (req, res) => {
  try {
    const result = await workFlowService.deleteWorkflowTransition(
      req.params.WorkflowTransitionId
    );
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
exports.deleteAllWorkflowTransition = async (req, res) => {
  try {
    const result = await workFlowService.deleteAllWorkflowTransition(
      req.params.WorkflowId
    );
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.getAllTransition = async(req,res)=>{
  try{
    const dataWorkFlowTransiton = await workFlowService.getAllTransition('683a68f41f680c95a1699d7b');
    if (!dataWorkFlowTransiton) {
      return next(new Error("Quy trình làm việc không tồn tại"));
    }
    return new SuccessResponse(dataWorkFlowTransiton).send(res);
  }catch(err){
    res.status(404).json({ message: err.message });
  }
}
exports.addTransition = async(req,res)=>{
  try {
    const workflow = await workFlowService.addTransition(req.body);
    res.status(201).json(workflow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const workFlow = require('./workflow.model.js')
const WorkflowStep = require('./workflowStep.model.js')
const WorkflowTransition = require('./workflowTransition.js')
const mongoose = require('mongoose');

exports.getDetailWorkFlowService = async (projectId) => {
  const workFlowData = await workFlow.findOne({ projectId });
  if (!workFlowData) throw new Error('Không tìm thấy workflow');

  const Id = workFlowData._id;

  const steps = await WorkflowStep.find({ workflowId: Id }).sort('stepOrder');
  const transitions = await WorkflowTransition.find({ workflowId: Id })
    .populate('fromStep toStep allowedRoles');

  return {
    workFlowData,
    steps,
    transitions
  }
}

exports.createWorkflow = async (data) => {
  const code = {
    projectmanager: data.managerId,
    projectId: data.projectId,
    code: `${data.projectId}`,
  };

  const existing = await workFlow.find({ projectId: data.projectId });

  if (existing.length != 0) throw new Error("Code workflow đã tồn tại");

  const workflow = await workFlow.create(code);
  return workflow;
};

exports.deleteAllWorkflowTransition = async (workflowId) => {
  const id = new mongoose.Types.ObjectId(workflowId);
  await WorkflowTransition.deleteMany({ workflowId: id });
  return { message: 'Đã xoá workflow và dữ liệu liên quan' };
}

// Workflow Step
exports.getAllWorkFlowStep = async (workflowId) => {
  const id = new mongoose.Types.ObjectId(workflowId);
  const workFlowStepData = await WorkflowStep.find({ workflowId: id });
  if (!workFlowStepData) throw new Error('Không tìm thấy workflow');
  return workFlowStepData;
}

exports.createWorkFlowStep = async (data) => {
  console.log("createWorkFlowStep nhận data:", data);
  const dataStep = {
    workflowId: new mongoose.Types.ObjectId(data.workflowId),
    nameStep: data.nameStep,
    stepOrder: data.stepOrder,
    isFinal: data.isFinal,
    color: data.color || '#cccccc' // Mặc định màu trắng nếu không có
  }

  const workFlowStep = await WorkflowStep.create(dataStep);
  return workFlowStep;
}

exports.updateWorkflowStep = async (workflowStepId, data) => {
  const updateWorkflowStep = await WorkflowStep.findByIdAndUpdate(workflowStepId, data, { new: true });
  if (!updateWorkflowStep) throw new Error('Không tìm thấy workflow');
  return updateWorkflowStep;
}

exports.deleteWorkflowStep = async (workflowStepId) => {
  await WorkflowStep.findByIdAndDelete(workflowStepId);
  return { message: 'Đã xoá workflow và dữ liệu liên quan' };
}

exports.deleteAllWorkflowStep = async (workflowId) => {
  const id = new mongoose.Types.ObjectId(workflowId);
  await WorkflowStep.deleteMany({ workflowId: id });
  return { message: 'Đã xoá workflow và dữ liệu liên quan' };
}

// Workflow Transition
exports.getAllWorkFlowTransition = async (workflowId) => {
  const id = new mongoose.Types.ObjectId(workflowId);
  const workFlowTransitionData = await WorkflowTransition.find({ workflowId: id });
  if (!workFlowTransitionData) throw new Error('Không tìm thấy workflow');
  return workFlowTransitionData;
}
exports.createWorkFlowTransition = async (data) => {
  const dataTransition = {
    workflowId: new mongoose.Types.ObjectId(data.workflowId),
    fromStep: data.fromStep,
    toStep: data.toStep,
    allowedRoles: data.allowedRoles
  };

  const result = await WorkflowTransition.find(dataTransition);
  if (result?.length !== 0) {
    throw new Error('Luồng đã tồn tại');
  }

  const workFlowContransiton = await WorkflowTransition.create(dataTransition);
  return workFlowContransiton;
}

exports.updateWorkflowTransition = async (id, data) => {
  const checkData = {
    workflowId: new mongoose.Types.ObjectId(data.workflowId),
    fromStep: data.fromStep,
    toStep: data.toStep,
    allowedRoles: data.allowedRoles
  };

  const result = await WorkflowTransition.find(checkData);
  if (result?.length !== 0) {
    throw new Error('Luồng đã tồn tại');
  }

  const updateWorkflowTransition = await WorkflowTransition.findByIdAndUpdate(id, data, { new: true });
  if (!updateWorkflowTransition) throw new Error('Không tìm thấy workflow');
  return updateWorkflowTransition;
};

exports.deleteWorkflowTransition = async (id) => {
  await WorkflowTransition.findByIdAndDelete(id);
  return { message: 'Đã xoá workflow và dữ liệu liên quan' };
}

// Kiểm tra quyền thay đổi status
exports.canUserTransitionStep = async (userRole, workflowId, fromStep, toStep) => {
  const transition = await WorkflowTransition.findOne({
    workflowId: new mongoose.Types.ObjectId(workflowId),
    fromStep,
    toStep,
    allowedRoles: userRole,
  });

  return !!transition;
}

const workFlow = require('./workflow.model.js')
const WorkflowStep = require('./workflowStep.model.js')
const WorkflowTransition = require('./workflowTransition.js')
exports.getDetailWorkFlowService = async (managerId, projectId) => {
    const workFlowData =  await workFlow.find({
        projectmanager: managerId,
        projectId: projectId
    })
    const steps = await WorkflowStep.find({ workflowId: workFlowData._id }).sort('stepOrder');
    const transitions = await WorkflowTransition.find({ workflowId:  workFlowData._id })
        .populate('fromStep toStep allowedRoles');
    
    const data = {
        workFlowData,
        steps,
        transitions 
    }
    return data
}


exports.createWorkflow = async (data) => {
  const  code  = {
    name : data.name,
    projectmanager: data.projectmanager,
    projectId: data.projectId
  };

  const existing = await workFlow.findOne({ code });
  if (existing) throw new Error('Code workflow đã tồn tại');
  const workflow = await workFlow.create(code);

  
  // tạo workflow contrain
  const dataContrain = {
    workflowId: workFlow._id,
    fromStep : data
  }
  return workflow;
}

exports.deleteWorkflow = async (workflowId) => {
  const workflow = await workFlow.findByIdAndDelete(workflowId);
  return { message: 'Đã xoá workflow và dữ liệu liên quan' };
}

//  workflow step
exports.getAllWorkFlowStep= async (workflowId) => {
  const workFlowStepData =  await WorkflowStep.find({
    workflowId
  })
  if (!workFlowStepData) throw new Error('Không tìm thấy workflow');
  return workFlowStepData;
 
}
exports.createWorkFlowStep = async (data) => {
  const dataStep = {
    workflowId: workFlow._id,
    nameStep: data.nameStep,
    stepOrder: data.stepOrder,
    requiredRole: data.requiredRole,
    isFinal: data.isFinal
  }
  const workFlowStep = await WorkflowStep.create(dataStep);

  return workFlowStep
}
exports.updateWorkflowStep = async (workflowStepId,data) => {
  const updateWorkflowStep = await WorkflowStep.findByIdAndUpdate(workflowStepId, data, { new: true });
  if (!updateWorkflowStep) throw new Error('Không tìm thấy workflow');
  return updateWorkflowStep;
}
exports.deleteWorkflowStep = async (workflowStepId) => {
  await WorkflowStep.findByIdAndDelete( workflowStepId );
  return { message: 'Đã xoá workflow và dữ liệu liên quan' };
}

//workflow contrans
exports.getAllWorkFlowTransition = async (workflowId) => {
  const workFlowTransitionData =  await WorkflowTransition.find(workflowId)
  if (!workFlowTransitionData) throw new Error('Không tìm thấy workflow');
  return workFlowTransitionData;
}
exports.createWorkFlowTransition = async (data) => {
  const dataTransition = {
    workflowId: data.workflowId,
    fromStep: data.fromStep,
    toStep: data.toStep,
    allowedRoles: data.requiredRole
  }

  const workFlowContransiton = await WorkflowTransition.create(dataTransition);
  return workFlowContransiton
}

exports.updateWorkflowTransition = async (id,data) => {
  const updateWorkflowTransition = await WorkflowTransition.findByIdAndUpdate(id, data, { new: true });
  if (!updateWorkflowTransition) throw new Error('Không tìm thấy workflow');
  return updateWorkflowTransition;
}

exports.deleteWorkflowTransition = async (id) => {
  console.log(id);
  await WorkflowTransition.findByIdAndDelete(id);
  return { message: 'Đã xoá workflow và dữ liệu liên quan' };
}


/// checkeck quyền thay đổi status
exports.canUserTransitionStep = async (userRole, workflowId, fromStep, toStep) =>{
  const transition = await WorkflowTransition.findOne({
    workflowId,
    fromStep,
    toStep,
    allowedRoles: userRole
  });

  return !!transition; // true nếu tồn tại transition hợp lệ
}
  



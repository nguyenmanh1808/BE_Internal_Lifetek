const workFlow = require('./workflow.model.js')
const WorkflowStep = require('./workflowStep.model.js')
const WorkflowTransition = require('./workflowTransition.js')
exports.getDetailWorkFlowService = async (projectId) => {
  const workFlowData = await workFlow.find({ projectId });
    return workFlowData
}


exports.createWorkflow = async (data) => {
  const   code = {
    projectmanager: data.managerId, // sửa lại đúng tên field từ FE gửi lên
    projectId: data.projectId,
    code: `${data.projectId}`,
  };

 
  const existing = await workFlow.find({ projectId: data.projectId });
  if (existing.length != 0) throw new Error('Code workflow đã tồn tại');
  const workflow = await workFlow.create(code);
  return workflow;
}

exports.deleteAllWorkflowTransition = async (workflowId) => {
  await WorkflowTransition.deleteMany({workflowId});
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
exports.deleteAllWorkflowStep = async (workflowId)=>{
   await WorkflowStep.deleteMany({workflowId});
  return { message: 'Đã xoá workflow và dữ liệu liên quan' };
}

//workflow contrans
exports.getAllWorkFlowTransition = async (workflowId) => {
  const workFlowTransitionData =  await WorkflowTransition.find({workflowId:workflowId})
  if (!workFlowTransitionData) throw new Error('Không tìm thấy workflow');
  return workFlowTransitionData;
}
exports.createWorkFlowTransition = async (data) => {
  const dataTransition = {
    workflowId: data.workflowId,
    fromStep: data.fromStep,
    toStep: data.toStep,
    allowedRoles: data.allowedRoles
  }
  const result = await WorkflowTransition.find(dataTransition)
  console.log(result)
  if(result?.length != 0){
      throw new Error(' Luồng  đã tồn tại');
  }
  const workFlowContransiton = await WorkflowTransition.create(dataTransition);
  return workFlowContransiton
}

exports.updateWorkflowTransition = async (id,data) => {
  const result = await WorkflowTransition.find(data);
  console.log('data',data)
  if(result?.length != 0){
      throw new Error(' Luồng  đã tồn tại');
  }
  const updateWorkflowTransition = await WorkflowTransition.findByIdAndUpdate(id, data, { new: true });
  if (!updateWorkflowTransition) throw new Error('Không tìm thấy workflow');
  return updateWorkflowTransition;
}

exports.deleteWorkflowTransition = async (id) => {
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
   console.log("transition",transition)
  return !!transition; // true nếu tồn tại transition hợp lệ
}
  



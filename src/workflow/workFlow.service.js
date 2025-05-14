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
  if (!workflow) throw new Error('Không tìm thấy workflow');
  await WorkflowStep.deleteMany({ workflowId });
  await WorkflowTransition.deleteMany({ workflowId });
  return { message: 'Đã xoá workflow và dữ liệu liên quan' };
}

  //  workflow step
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
  const workflowStep = await workflowStep.find(workflowStepId);
  if (!workflowStep) throw new Error('Không tìm thấy workflow');
  await WorkflowStep.findByIdAndDelete({ workflowStepId });
  return { message: 'Đã xoá workflow và dữ liệu liên quan' };
}

//workflow contrans
exports.createWorkFlowTransition = async (data) => {
  const result = await Promise.all (data.map( async (item, index) => {
    const dataTransition = {
      workflowId: item.workflowId,
      fromStep: item.fromStep,
      toStep: item.toStep,
      requiredRole: item.requiredRole
    }

    const workFlowContransiton = await WorkflowTransition.create(dataTransition);
    return workFlowContransiton
    })
    
  )

  return result;
}

exports.updateWorkflowTransition = async (id,data) => {
  const updateWorkflowTransition = await WorkflowTransition.findByIdAndUpdate(id, data, { new: true });
  if (!updateWorkflowTransition) throw new Error('Không tìm thấy workflow');
  return updateWorkflowTransition;
}

exports.deleteWorkflowTransition = async (workflowTransitionId) => {
  const workflowTransition = await WorkflowTransition.find(workflowTransitionId);
  if (!workflowTransition) throw new Error('Không tìm thấy workflow');
  await WorkflowTransition.findByIdAndDelete({ workflowTransitionId });
  return { message: 'Đã xoá workflow và dữ liệu liên quan' };
}

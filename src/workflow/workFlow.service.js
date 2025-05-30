const workFlow = require("./workflow.model.js");
const WorkflowStep = require("./workflowStep.model.js");
const WorkflowTransition = require("./workflowTransition.js");
const ProjectRole = require("../projectRole/projectRole.model.js")
exports.getDetailWorkFlowService = async (projectId) => {
  const workFlowData = await workFlow.findOne({ projectId });
  const Id = workFlowData._id;
  const steps = await WorkflowStep.find({ workflowId: Id }).sort("stepOrder");
  const transitions = await WorkflowTransition.find({
    workflowId: Id,
  }).populate("fromStep toStep allowedRoles");
  return {
    workFlowData,
    steps,
    transitions,
  };
};
exports.createWorkflow = async (data) => {
  const code = {
    projectmanager: data.managerId, // sửa lại đúng tên field từ FE gửi lên
    projectId: data.projectId,
    code: `${data.projectId}`,
  };

  const existing = await workFlow.find({ projectId: data.projectId });
  if (existing.length != 0) throw new Error("Code workflow đã tồn tại");
  const workflow = await workFlow.create(code);
  return workflow;
};


exports.deleteAllWorkflowTransition = async (workflowId) => {
  await WorkflowTransition.deleteMany({ workflowId });
  return { message: "Đã xoá workflow và dữ liệu liên quan" };
};

//  workflow step
exports.getAllWorkFlowStep = async (workflowId) => {
  const workFlowStepData = await WorkflowStep.find({
    workflowId,
  });
  if (!workFlowStepData) throw new Error("Không tìm thấy workflow");
  return workFlowStepData;
};
exports.createWorkFlowStep = async (data) => {
  console.log("createWorkFlowStep nhận data:", data);
  console.log("createWorkFlowStep nhận data:", data);
  const dataStep = {
    workflowId: data.workflowId,
    nameStep: data.nameStep,
    stepOrder: data.stepOrder,
    requiredRole: data.requiredRole,
    isFinal: data.isFinal,
    color: data.color || '#cccccc' 
  }

  const workFlowStep = await WorkflowStep.create(dataStep);

  return workFlowStep;
};
exports.updateWorkflowStep = async (workflowStepId, data) => {
  const updateWorkflowStep = await WorkflowStep.findByIdAndUpdate(
    workflowStepId,
    data,
    { new: true }
  );
  if (!updateWorkflowStep) throw new Error("Không tìm thấy workflow");
  return updateWorkflowStep;
};
exports.deleteWorkflowStep = async (workflowStepId) => {
  await WorkflowStep.findByIdAndDelete(workflowStepId);
  return { message: "Đã xoá workflow và dữ liệu liên quan" };
};
exports.deleteAllWorkflowStep = async (workflowId) => {
  await WorkflowStep.deleteMany({ workflowId });
  return { message: "Đã xoá workflow và dữ liệu liên quan" };
};

// Workflow Transition
exports.getAllWorkFlowTransition = async (workflowId) => {
  const workFlowTransitionData = await WorkflowTransition.find({
    workflowId: workflowId,
  });
  if (!workFlowTransitionData) throw new Error("Không tìm thấy workflow");
  return workFlowTransitionData;
};
exports.createWorkFlowTransition = async (data) => {
  const dataTransition = {
    workflowId: new mongoose.Types.ObjectId(data.workflowId),
    fromStep: data.fromStep,
    toStep: data.toStep,
    allowedRoles: data.allowedRoles,
  };
  const result = await WorkflowTransition.find(dataTransition);
  console.log(result);
  if (result?.length != 0) {
    throw new Error(" Luồng  đã tồn tại");
  }
  const workFlowContransiton = await WorkflowTransition.create(dataTransition);
  return workFlowContransiton;
}

exports.updateWorkflowTransition = async (id,data) => {
  const result = await WorkflowTransition.find(data);
  console.log("data", data);
  if (result?.length != 0) {
    throw new Error(" Luồng  đã tồn tại");
  }
  const updateWorkflowTransition = await WorkflowTransition.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
  if (!updateWorkflowTransition) throw new Error("Không tìm thấy workflow");
  return updateWorkflowTransition;
};

exports.deleteWorkflowTransition = async (id) => {
  await WorkflowTransition.findByIdAndDelete(id);
  return { message: "Đã xoá workflow và dữ liệu liên quan" };
};

/// checkeck quyền thay đổi status
exports.canUserTransitionStep = async (
  userRole,
  workflowId,
  fromStep,
  toStep
) => {
  const transition = await WorkflowTransition.findOne({
    workflowId: new mongoose.Types.ObjectId(workflowId),
    fromStep,
    toStep,
    allowedRoles: userRole,
    allowedRoles: userRole,
  });
  console.log("transition", transition);
  return !!transition; // true nếu tồn tại transition hợp lệ
};


exports.getAllTransition = async ()=>{
   const workFlowTransitionData = await WorkflowTransition.find()
    .populate({
      path: "fromStep",
      select: "nameStep stepOrder",
    })
   .populate({
      path: "toStep",
      select: "nameStep stepOrder",
    })
    .populate({
      path: "allowedRoles",
      select: "roleName permissions description",
    })
  if (!workFlowTransitionData) throw new Error("Không tìm thấy workflow");
  return workFlowTransitionData;
}

exports.addTransition = async(data)=>{
  const dataFromStep = {
      workflowId: data.workflowId,
      nameStep: data.fromStep.nameStep,
      stepOrder: data.fromStep.stepOrder
  }
  const dataToStep = {
      workflowId: data.workflowId,
      nameStep: data.toStep.nameStep,
      stepOrder: data.toStep.stepOrder
  }
  const fromStep = await WorkflowStep.create(dataFromStep);
  const toStep = await WorkflowStep.create(dataToStep);

/// project role
     const dataProjectRoles =   await Promise.all(data.allowedRoles.map(async (item,index)=>{
            let dataProjectRole = {
                projectId: data.projectId,
                roleName: item.roleName,
                description: item.description,
                permissions: item.permissions,
                userIds : []
           }
         

         return  await ProjectRole.create(dataProjectRole);

        }))
          
  const roles = dataProjectRoles.map((item,index)=>{
      return item._id
  })
  console.log(roles)
/////trasition
  let transiton = {
          workflowId: data.workflowId,
          fromStep: fromStep._id,
          toStep:toStep._id,
          allowedRoles:roles
        }
  await WorkflowTransition.create(transiton);
  
      
  return {
    toStep,
    fromStep,
    transiton,
    dataProjectRoles
  }
        
}
const workFlow = require("./workflow.model.js");
const WorkflowStep = require("./workflowStep.model.js");
const WorkflowTransition = require("./workflowTransition.js");
const ProjectRole = require("../projectRole/projectRole.model.js")
const mongoose = require("mongoose");
const util = require('util');

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
  });
  console.log("transition", transition);
  return !!transition; // true nếu tồn tại transition hợp lệ
};


exports.getAllTransition = async (data)=>{
   const workFlowTransitionData = await workFlow.find({projectId:data})
     .populate('steps')
     .populate({
          path: 'transitions',               // bước 1: populate steps
          populate: {
            path: 'fromStep toStep allowedRoles',      // bước 2: trong mỗi step, populate tiếp assignedUser
            select: 'nameStep stepOrder roleName description permissions'       // optional: chỉ lấy một số field
          }
      });
  if (!workFlowTransitionData) throw new Error("Không tìm thấy workflow");
  return workFlowTransitionData;
}

exports.addTransition = async(data)=>{
  const dataWorkFlow = {
    code: data.projectId,
    projectId: data.projectId
  }
  const workFlowdata = await workFlow.create(dataWorkFlow);
  const step = await Promise.all(data.steps.map(async (item,index)=>{
    let stepData ={
        workflowId: workFlowdata._id,
        nameStep: item.nameStep,
        stepOrder: item.stepOrder,
        color: item.color
    } 
    await WorkflowStep.create(stepData);
  }))

  // transition
  
  // tạo role
  const totalTransition = data.transitions

     const projectRoleData = await Promise.all(
        totalTransition.map(async (item) => {
            const dataProject = await Promise.all(
                item.allowedRoles.map(async (roles) => {
                let dataProjectRole = {
                  projectId: data.projectId,
                  roleName: roles.roleName,
                  description: roles.description,
                  permissions: roles.permissions,
                  userIds: []
                };
                console.log(dataProjectRole)
        return dataProjectRole
      })
      );
    return dataProject;
  })
);
const uniqueRoles = Array.from(
  new Map(
    projectRoleData.map(obj => [`${obj.projectId}-${obj.roleName}`, obj])
  ).values()
);
    const result  = uniqueRoles.map(async(item,index) =>{
        return await ProjectRole.create(item)
    }) 
    
    const roles = result.map((item,index)=>{
      return item._id
    })
    // tạo transition

    const transiton =  await Promise.all(data.transitions.map(async (item, index) =>{
     
          const FromStep = await WorkflowStep.find({workflowId: workFlowdata._id,
                                                      nameStep : item.fromStep.nameStep,
                                                      stepOrder : item.fromStep.stepOrder })
          const ToStep = await WorkflowStep.find({workflowId: workFlowdata._id,
                                                      nameStep : item.toStep.nameStep,
                                                      stepOrder : item.toStep.stepOrder })
        let dataTranSition = {
          workflowId: workFlowdata._id,
          fromStep: FromStep._id,
          ToStep: ToStep._id,
          allowedRoles: roles
        }
       return  await WorkflowTransition.create(dataTranSition);
     }))

  return {
   workFlowdata,
    step,
    transiton
  }
        
}
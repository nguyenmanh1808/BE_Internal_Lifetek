const express = require("express");
const workFlowController = require("./workFlow.Controller.js");
const routeWorkflow = express.Router();

routeWorkflow.get("/:projectId", workFlowController.getDetailWorkFlow);
routeWorkflow.post("/", workFlowController.createWorkflow);

// workflow step
routeWorkflow.get(
  "/workflow-step/:workflowId",
  workFlowController.getAllWorkflowStep
);
routeWorkflow.post("/workflow-step", workFlowController.createWorkFlowStep);
routeWorkflow.put(
  "/workflow-step/:workflowStepId",
  workFlowController.updateWorkflowStep
);
routeWorkflow.delete(
  "/workflow-step/:workflowStepId",
  workFlowController.deleteWorkflowStep
);

// work flow transition
routeWorkflow.get(
  "/workflow-transition/:workflowId",
  workFlowController.getAllWorkflowTransiton
);
routeWorkflow.post(
  "/workflow-transition",
  workFlowController.createWorkFlowTransition
);
routeWorkflow.put(
  "/workflow-transition/:WorkflowTransitionId",
  workFlowController.updateWorkflowTransition
);
routeWorkflow.delete(
  "/workflow-transition/:WorkflowTransitionId",
  workFlowController.deleteWorkflowTransition
);

module.exports = routeWorkflow;

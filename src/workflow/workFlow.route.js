const express = require("express");
const  workFlowController = require("./workFlow.Controller.js");
const routeWorkflow = express.Router();

routeWorkflow.get("/:projectId", workFlowController.getDetailWorkFlow);
routeWorkflow.post('/', workFlowController.createWorkflow);
routeWorkflow.put('/workflow-step/:workflowId', workFlowController.updateWorkflowStep);
routeWorkflow.delete('/:workflowId', workFlowController.deleteWorkflow);

module.exports = routeWorkflow;
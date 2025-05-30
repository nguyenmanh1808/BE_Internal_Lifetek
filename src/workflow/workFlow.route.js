const express = require("express");
const workFlowController = require("./workFlow.Controller.js");
const router = express.Router();

// ─── Workflow ───────────────────────────────
router.post("/", workFlowController.createWorkflow);


// ─── Workflow Step ──────────────────────────
router.get("/workflow-step/:workflowId", workFlowController.getAllWorkflowStep);
router.post("/workflow-step", workFlowController.createWorkFlowStep);
router.put("/workflow-step/:workflowStepId", workFlowController.updateWorkflowStep);
router.delete("/workflow-step/:workflowStepId", workFlowController.deleteWorkflowStep);
router.delete("/delete-all/workflow-step/:workflowId", workFlowController.deleteAllWorkflowStep);

// ─── Workflow Transition ────────────────────
router.get("/workflow-transition/:workflowId", workFlowController.getAllWorkflowTransiton);
router.post("/workflow-transition", workFlowController.createWorkFlowTransition);
router.put("/workflow-transition/:workflowTransitionId", workFlowController.updateWorkflowTransition);
router.delete("/workflow-transition/:workflowTransitionId", workFlowController.deleteWorkflowTransition);
router.delete("/delete-all/workflow-transition/:workflowId", workFlowController.deleteAllWorkflowTransition);

// ─── Other Transition APIs ──────────────────
router.get("/workflow-transition", workFlowController.getAllTransition);
router.post("/workflow-transition/add", workFlowController.addTransition);
router.get("/:projectId", workFlowController.getDetailWorkFlow);
module.exports = router;

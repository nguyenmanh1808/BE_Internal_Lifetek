const mongoose = require("mongoose");
const { STATUS } = require("../constants/statusConstants.js");
const { CHANGE_SOURCE } = require("../constants/index.js");

const JobStatusChangeSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    oldStatus: {  type: mongoose.Schema.Types.ObjectId,
          ref: "WorkflowStep", },
    newStatus: {  type: mongoose.Schema.Types.ObjectId,
          ref: "WorkflowStep",},
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String },
    notes: { type: String }
}, { timestamps: true });


// Tạo Model từ Schema
const JobStatusChange = mongoose.model("JobStatusChange", JobStatusChangeSchema);

module.exports = JobStatusChange;

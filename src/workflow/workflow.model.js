const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workflowSchema = new Schema({
  // Tên hiển thị của workflow
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo
  code: {
    type: String,
    required: true,
    unique: true,
  },
  projectmanager: { type: Schema.Types.ObjectId, ref: "User" }, // Ai tạo (nếu cần phân quyền cao hơn)
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
workflowSchema.virtual('steps', {
  ref: 'WorkflowStep',
  localField: '_id',
  foreignField: 'workflowId'
});
workflowSchema.virtual('transitions', {
  ref: 'WorkflowTransition',
  localField: '_id',
  foreignField: 'workflowId'
});
module.exports = mongoose.model("Workflow", workflowSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

<<<<<<< HEAD
const workflowSchema = new Schema({
  name: { type: String, required: false }, // Tên hiển thị của workflow
  createdAt: { type: Date, default: Date.now },
  code: {
    type: String,
    required: true,
    unique: true,
  }, // Thời gian tạo
  projectmanager: { type: Schema.Types.ObjectId, ref: "User" }, // Ai tạo (nếu cần phân quyền cao hơn)
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },
=======
const workflowSchema = new Schema({          // Tên hiển thị của workflow
  createdAt: { type: Date, default: Date.now },        // Thời gian tạo
  projectmanager: { type: Schema.Types.ObjectId, ref: 'User' }, // Ai tạo (nếu cần phân quyền cao hơn)
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' }
>>>>>>> 66026a1bc2e49bcfa58ed58f93df6a786e9d5c6e
});

module.exports = mongoose.model("Workflow", workflowSchema);

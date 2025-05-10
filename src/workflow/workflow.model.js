const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workflowSchema = new Schema({
  name: { type: String, required: true },              // Tên hiển thị của workflow
  code: { type: String, unique: true, required: true },// Mã định danh duy nhất (VD: 'doc_approval')
  description: { type: String },                       // Mô tả quy trình
  createdAt: { type: Date, default: Date.now },        // Thời gian tạo
  projectmanager: { type: Schema.Types.ObjectId, ref: 'User' }, // Ai tạo (nếu cần phân quyền cao hơn)
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' }
});

module.exports = mongoose.model('Workflow', workflowSchema);

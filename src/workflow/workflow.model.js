const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workflowSchema = new Schema({          
  createdAt: { type: Date, default: Date.now },        // Thời gian tạo
  projectmanager: { type: Schema.Types.ObjectId, ref: 'User' }, // Ai tạo (nếu cần phân quyền cao hơn)
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' }
});

module.exports = mongoose.model('Workflow', workflowSchema);

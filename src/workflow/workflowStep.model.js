const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ROLES } = require("../constants/index.js");
const workflowStepSchema = new Schema({
  workflowId: { type: Schema.Types.ObjectId, ref: 'Workflow', required: true }, // Gắn với 1 workflow cụ thể
  name: { type: String, required: true },               // Tên bước (VD: 'Soạn thảo', 'Duyệt', ...)
  stepOrder: { type: Number, required: true },          // Thứ tự bước trong workflow
  requiredRole: {
        type: Number,
        enum: Object.values(ROLES),
        default: ROLES.USER,
      }, // Vai trò được phép thực hiện bước
  description: { type: String },                        // Mô tả chi tiết bước này làm gì
  isFinal: { type: Boolean, default: false }            // Bước kết thúc (true nếu là bước cuối)
});

module.exports = mongoose.model('WorkflowStep', workflowStepSchema);

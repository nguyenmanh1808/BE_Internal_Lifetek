const { ROLES } = require("../constants/index.js");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workflowTransitionSchema = new Schema({
  workflowId: { type: Schema.Types.ObjectId, ref: 'Workflow', required: true }, // Workflow mà transition này thuộc về
  fromStep: { type: Schema.Types.ObjectId, ref: 'WorkflowStep', required: true }, // Bước hiện tại
  toStep: { type: Schema.Types.ObjectId, ref: 'WorkflowStep', required: true },   // Bước có thể chuyển tới
  allowRole: {
        type: Number,
        enum: Object.values(ROLES),
        default: ROLES.USER,
      }, // Vai trò được phép thực hiện chuyển bước
  condition: { type: String }, // (Tùy chọn) điều kiện logic (nếu có), có thể là mã JSON, biểu thức...
  isDefault: { type: Boolean, default: false } // Có phải là chuyển bước mặc định không (nếu tự động hóa)
});

module.exports = mongoose.model('WorkflowTransition', workflowTransitionSchema);

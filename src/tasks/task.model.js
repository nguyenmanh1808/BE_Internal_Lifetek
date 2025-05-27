const mongoose = require("mongoose");
const { STATUS } = require("../constants/statusConstants.js");
const { PRIORITY, STATUS_TASK, TYPETASK } = require("../constants/index.js");
const removeAccents = require("remove-accents");
const getNextTaskCode = require("../utils/generateTaskCode.js");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slugName: { type: String },
    description: { type: String },
    
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assigneeId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    link: {
      type: String,
    },
    startDate: { type: Date, default: Date.now },

    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkflowStep",
    },
    priority: {
      type: Number,
      enum: Object.values(PRIORITY),
      default: PRIORITY.MEDIUM,
    },
    image: {
      type: String,
    },
    code: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(TYPETASK),
      default: TYPETASK.new_request,
    },
    endDate: { type: Date }, // deadline
  },
  { timestamps: true }
);
TaskSchema.pre("save",async function (next) {
  
  if (!this.code && this.projectId) {
    this.code = await getNextTaskCode(this.projectId);
  }

  this.slugName =removeAccents
  .remove(this.title.toLowerCase())
  .replace(/[^a-z0-9\s]/g, "")   // Giữ lại chữ, số, khoảng trắng, gạch nối      
  .trim();
 // Xóa dấu
    next();
});
module.exports = mongoose.model("Task", TaskSchema);
  
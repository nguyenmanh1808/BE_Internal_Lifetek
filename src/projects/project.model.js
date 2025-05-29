const mongoose = require("mongoose");
const { PRIORITY, STATUS_PROJECT,TYPEPROJECT } = require("../constants/index.js");
const removeAccents = require("remove-accents");

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slugName: { type: String, unique: true },
    code: { type: String, unique: true },
    description: { type: String },
    status: {
      type: Number,
      enum: Object.values(STATUS_PROJECT), 
      default: STATUS_PROJECT.PROGRESSING,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    priority: {
      type: Number,
      enum: Object.values(PRIORITY),
      default: PRIORITY.LOW,
    },
    category :{
      type: String,
      enum: Object.values(TYPEPROJECT), 
      default: TYPEPROJECT.QLDA,
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now  }, // deadline
  },
  { timestamps: true }
);

// Middleware: Chuyển đổi `name` thành `slugName` và tạo `code` tự động trước khi lưu
ProjectSchema.pre("save", async function (next) {
  // Chuyển đổi tên thành slugName
  this.slugName = removeAccents.remove(this.name.toLowerCase().replace(/\s+/g, '-'));

  // Kiểm tra slugName và code có trùng không
  const [existingProject, existingCode] = await Promise.all([
    mongoose.model("Project").findOne({ slugName: this.slugName }),
    mongoose.model("Project").findOne({ code: this.code })
  ]);

  if (existingProject) {
    // Nếu slugName đã tồn tại, thêm hậu tố số vào để tạo slug duy nhất
    this.slugName = `${this.slugName}-${Date.now()}`;
  }

  // Tạo mã tự động cho dự án nếu chưa có
  if (!this.code && !existingCode) {
    try {
      const latestProject = await mongoose.model("Project").findOne().sort({ code: -1 }); // Lấy dự án có code cao nhất
      const latestCode = latestProject ? parseInt(latestProject.code.replace("PROJ-", "")) : 0;
      const newCode = `PROJ-${(latestCode + 1).toString().padStart(4, '0')}-${Date.now()}`;
      this.code = newCode;
    } catch (error) {
      return next(error); // Gửi lỗi nếu có
    }
  }

  // Kiểm tra xem `code` có được gán không (trường hợp ngoại lệ)
  if (!this.code) {
    return next(new Error("Code is required"));
  }

  next();
});

module.exports = mongoose.model("Project", ProjectSchema);

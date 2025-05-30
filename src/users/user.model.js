const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../constants/index.js");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: function () {
        return !this.ssoProviderId;
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: Number,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    ssoProvider: { 
      type: String,
      trim: true,
      index: true,
    },
    ssoProviderId: { 
      type: String,
      trim: true,
      index: true, 
    },
  },
  { timestamps: true }
);

// hash password trước khi lưu vào db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// so sánh password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token rồi lưu vào DB
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken; // Trả về bản chưa hash để gửi vào URL
};

// tìm user theo email hoặc phone
userSchema.statics.findByEmailOrPhone = async function (identifier) {
  return await this.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  });
}

// Đảm bảo tính duy nhất cho cặp ssoProvider và ssoProviderId nếu chúng tồn tại
userSchema.index({ ssoProvider: 1, ssoProviderId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("User", userSchema);
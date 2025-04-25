const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = (mailOptions) => {
  return transporter.sendMail({
    from: `"Berry Shoes 👟" <${process.env.EMAIL_USER}>`, // có thể đặt tên người gửi ở đây
    ...mailOptions,
  });
};

module.exports = { sendMail }; // ✅ Đúng với cách bạn gọi

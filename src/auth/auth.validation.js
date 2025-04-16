const Joi = require("joi")

exports.signUpValidator = Joi.object({
     userName: Joi.string().required().trim().min(6).max(30).messages({
        "string.empty": "userName không được để trống",
        "any.required": "userName là bắt buộc",
        "string.min": "userName phải có ít nhất {#limit} ký tự",
        "string.max": "userName phải có ít hơn {#limit + 1} ký tự",
     }),
     email: Joi.string().trim().required().email().messages({
        "string.empty": "email không được để trống",
        "any.required": "email là bắt buộc",
        "string.email": "email không đúng định dạng",
     }),
     password: Joi.string().trim().required().min(6).max(30).messages({
        "string.empty": "Password không được để trống",
        "any.required": "Password là bắt buộc",
        "string.min": "Password phải có ít nhất {#limit} ký tự",
        "string.max": "Password phải có ít hơn {#limit + 1} ký tự",
     }),
     confirmPassword: Joi.string().trim().required().min(6).max(30).valid(Joi.ref("password")).messages({
        "string.empty": "confirmPassword không được để trống",
        "any.required": "confirmPassword là bắt buộc",
        "string.min": "confirmPassword phải có ít nhất {#limit} ký tự",
        "string.max": "confirmPassword phải có ít hơn {#limit} ký tự",
        "any.only": "confirmPassword không khớp với password"
     }),
     role: Joi.string()
})


exports.signInValidator = Joi.object({
   email: Joi.string().trim().required().email().messages({
      "string.empty": "email không được để trống",
      "any.required": "email là bắt buộc",
      "string.email": "email không đúng định dạng",
   }),
   password: Joi.string().trim().required().min(6).max(30).messages({
      "string.empty": "Password không được để trống",
      "any.required": "Password là bắt buộc",
      "string.min": "Password phải có ít nhất {#limit} ký tự",
      "string.max": "Password phải có ít hơn {#limit + 1} ký tự",
   })
})
exports.changePasswordValidator = Joi.object({
   oldPassword: Joi.string().trim().required().min(6).max(30).messages({
     "string.empty": "Mật khẩu cũ không được để trống",
     "any.required": "Mật khẩu cũ là bắt buộc",
     "string.min": "Mật khẩu cũ phải có ít nhất {#limit} ký tự",
     "string.max": "Mật khẩu cũ phải có ít hơn {#limit + 1} ký tự",
   }),
   newPassword: Joi.string().trim().required().min(6).max(30).messages({
     "string.empty": "Mật khẩu mới không được để trống",
     "any.required": "Mật khẩu mới là bắt buộc",
     "string.min": "Mật khẩu mới phải có ít nhất {#limit} ký tự",
     "string.max": "Mật khẩu mới phải có ít hơn {#limit + 1} ký tự",
   }),
   confirmNewPassword: Joi.string().trim().required().valid(Joi.ref("newPassword")).messages({
     "string.empty": "Xác nhận mật khẩu không được để trống",
     "any.required": "Xác nhận mật khẩu là bắt buộc",
     "any.only": "Xác nhận mật khẩu không khớp với mật khẩu mới"
   }),
 });
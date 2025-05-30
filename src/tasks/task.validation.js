const joiObjectId = require("joi-objectid");
const Joi = require("joi");

const { STATUS } = require("../constants/statusConstants.js");
const { PRIORITY } = require("../constants/index.js");
const {TYPETASK} = require("../constants/index.js")
Joi.objectId = joiObjectId(Joi);

exports.createTaskValidator = Joi.object({
  title: Joi.string().messages({
    "string.empty": "Tiêu đề không được để trống",
    "any.required": "Tiêu đề là bắt buộc",
  }),
  description: Joi.string().messages({
    "string.empty": "Mô tả không được để trống",
  }),
  projectId: Joi.string().messages({
    "string.empty": "projectId không được để trống",
    "any.required": "projectId là bắt buộc",
  }),
  assigneeId: Joi.array().items(Joi.objectId()).messages({
    "string.empty": "assignerId không được để trống",
    "any.required": "assignerId là bắt buộc",
  }),
  assignerId: Joi.string().messages({
    "string.empty": "assigneeId không được để trống",
  }),
  status: Joi.string().messages({
    "string.empty": "Trạng thái không được để trống",
    "any.only": "Trạng thái không hợp lệ ",
  }),
  priority: Joi.number()
    .valid(...Object.values(PRIORITY))
    .messages({
      "string.empty": "Mức độ ưu tiên không được để trống",
      "any.only": "Mức độ ưu tiên không hợp lệ",
    }),
  type: Joi.string().messages({
    "string.empty": "Loại công việc không được để trống",
    "any.required": "Loại công việc là bắt buộc",
  }),
  image: Joi.string().optional().allow(null, "").messages({
    "string.base": "Hình ảnh không hợp lệ",
  }),

  link: Joi.string().optional().allow(null, "").messages({
    "string.base": "Link không hợp lệ",
  }),
  // image: Joi.string().uri().messages({
  //   "string.empty": "Hình ảnh không được để trống",
  //   "string.uri": "Hình ảnh không hợp lệ",
  // }),
  type: Joi.string().messages({
    "string.empty": "Type task không được để trống",
    "string.uri": "Type không hợp lệ",
  }),
  // link: Joi.string().messages({
  //   "string.empty": "Link không được để trống",
  // }),
  startDate: Joi.date().messages({
    "date.base": "Ngày bắt đầu không hợp lệ",
  }),
  endDate: Joi.date().messages({
    "date.base": "Ngày hết hạn không hợp lệ",
  }),
});

exports.updateTaskValidator = Joi.object({
  title: Joi.string().messages({
    "string.empty": "Tiêu đề không được để trống",
    "any.required": "Tiêu đề là bắt buộc",
  }),
  description: Joi.string().optional().messages({
    "string.empty": "Mô tả không được để trống",
  }),
  projectId: Joi.objectId().messages({
    "string.empty": "projectId không được để trống",
    "any.required": "projectId là bắt buộc",
  }),
  assigneeId: Joi.array().items(Joi.objectId()).optional().messages({
    "string.empty": "assigneeId không được để trống",
  }),
  assignerId: Joi.objectId().messages({
    "string.empty": "assignerId không được để trống",
    "any.required": "assignerId là bắt buộc",
  }),

  priority: Joi.number()
    .valid(...Object.values(PRIORITY))
    .messages({
      "string.empty": "Mức độ ưu tiên không được để trống",
      "any.only": "Mức độ ưu tiên không hợp lệ",
    }),
  image: Joi.string().optional().allow(null, "").messages({
    "string.base": "Hình ảnh không hợp lệ",
  }),
  type: Joi.string().messages({
      "string.empty": "Mức độ ưu tiên không được để trống",
      "any.only": "Mức độ ưu tiên không hợp lệ",
    }),
  link: Joi.string().optional().allow(null, "").messages({
    "string.base": "Link không hợp lệ",
  }),
  // images: Joi.string().uri().optional().messages({
  //   "string.empty": "Hình ảnh không được để trống",
  //   "string.uri": "Hình ảnh không hợp lệ",
  // }),
  // link: Joi.string().messages({
  //   "string.empty": "Link không được để trống",
  // }),
  startDate: Joi.date().messages({
    "date.base": "Ngày bắt đầu không hợp lệ",
  }),
  endDate: Joi.date().messages({
    "date.base": "Ngày hết hạn không hợp lệ",
  }),
});

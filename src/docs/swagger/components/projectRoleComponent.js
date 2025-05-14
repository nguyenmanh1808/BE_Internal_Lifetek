const projectRoleSchema = {
  ProjectRole: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        example: "662cd76510bc4d11e4e33abc",
      },
      name: {
        type: "string",
        example: "Project Manager",
      },
      description: {
        type: "string",
        example: "Quản lý tổng thể dự án",
      },
      permissions: {
        type: "array",
        items: {
          type: "string",
        },
        example: ["create_task", "update_task", "assign_user"],
      },
    },
  },
  ProjectRoleInput: {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        example: "Developer",
      },
      description: {
        type: "string",
        example: "Thành viên phát triển phần mềm",
      },
      permissions: {
        type: "array",
        items: {
          type: "string",
        },
        example: ["view_task", "edit_task"],
      },
    },
  },
};

module.exports = { projectRoleSchema };

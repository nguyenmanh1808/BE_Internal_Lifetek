const projectRoleSchema = {
  ProjectRole: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        example: "662cd76510bc4d11e4e33abc",
      },
      projectId: {
        type: "string",
        description: "ID của dự án mà vai trò này thuộc về",
        example: "68231469daf586f00db77f5d",
      },
      roleName: {
        type: "string",
        example: "Project Manager",
      },
      description: {
        type: "string",
        example: "Quản lý tổng thể dự án",
      },
      userIds: {
        type: "array",
        items: {
          type: "string",
          example: "67d7e3a525c545eee5f3380c",
        },
        description: "Danh sách ID của người dùng thuộc vai trò này",
      },
      permissions: {
        type: "array",
        items: { type: "string", enum: ["View", "Add", "Edit", "Delete", "Comment"] },
        example: ["View", "Add"],
        description: "Các quyền của vai trò trong dự án. Các giá trị hợp lệ: View, Add, Edit, Delete, Comment.",
      },
    },
  },
  ProjectRoleInput: {
    type: "object",
    required: ["name"],
    properties: {
      projectId: {
        type: "string",
        description: "ID của dự án mà vai trò này sẽ được tạo cho (bắt buộc khi tạo mới)",
        example: "68231469daf586f00db77f5d",
      },
      roleName: {
        type: "string",
        example: "Developer",
      },
      description: {
        type: "string",
        example: "Thành viên phát triển phần mềm",
      },
      permissions: {
        type: "array",
        items: { type: "string", enum: ["View", "Add", "Edit", "Delete", "Comment"] },
        example: ["View", "Comment"],
        description: "Các quyền của vai trò trong dự án. Các giá trị hợp lệ: View, Add, Edit, Delete, Comment.",
      },
    },
  },
};

module.exports = { projectRoleSchema };

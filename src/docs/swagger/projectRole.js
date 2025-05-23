const projectRoleSwagger = {
    "/project-roles": { // Đổi base path cho rõ ràng hơn, ví dụ /api/project-roles
        post: {
            summary: "Tạo vai trò dự án mới",
            description: "API tạo mới một vai trò trong hệ thống dự án",
            tags: ["Project Role"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ProjectRoleInput" },
                    },
                },
            },
            responses: {
                201: {
                    description: "Tạo vai trò thành công",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProjectRole" },
                        },
                    },
                },
                400: { description: "Dữ liệu không hợp lệ hoặc thiếu projectId/roleName" },
                500: { description: "Lỗi server" },
            },
        },
        delete: {
            summary: "Xoá nhiều vai trò theo danh sách ID",
            tags: ["Project Role"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                roleIds: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Danh sách ID của các vai trò cần xoá",
                                    example: ["662cd76510bc4d11e4e33abc", "662cd76510bc4d11e4e33abd"]
                                }
                            },
                            required: ["roleIds"]
                        }
                    },
                },
            },
            responses: {
                200: { description: "Xoá thành công nhiều vai trò" },
                400: { description: "roleIds phải là mảng và không được rỗng" },
                500: { description: "Lỗi server" },
            },
        }
    },

    "/project-roles/{roleId}": {
        put: {
            summary: "Cập nhật vai trò theo ID",
            tags: ["Project Role"],
            parameters: [{
                in: "path",
                name: "roleId",
                required: true,
                schema: { type: "string" },
                description: "ID vai trò",
            }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ProjectRoleInput" }, // Có thể chỉ cho phép cập nhật một số trường
                    },
                },
            },
            responses: {
                200: {
                    description: "Cập nhật thành công",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProjectRole" },
                        },
                    },
                },
                400: { description: "Dữ liệu không hợp lệ" },
                404: { description: "Không tìm thấy vai trò" },
                500: { description: "Lỗi server" },
            },
        },
    },

    "/project-roles/project/{projectId}": {
        get: {
            summary: "Lấy danh sách vai trò theo Project ID",
            tags: ["Project Role"],
            parameters: [{
                in: "path",
                name: "projectId",
                required: true,
                schema: { type: "string" },
                description: "ID dự án",
            }],
            responses: {
                200: {
                    description: "Lấy danh sách thành công",
                    content: {
                        "application/json": {
                            schema: { type: "array", items: { $ref: "#/components/schemas/ProjectRole" } },
                        },
                    },
                },
                404: { description: "Dự án không tồn tại" },
                500: { description: "Lỗi server" },
            },
        },
    },

    "/project-roles/{roleId}/add-users": {
        post: {
            summary: "Thêm người dùng vào một vai trò cụ thể",
            tags: ["Project Role"],
            parameters: [{
                in: "path",
                name: "roleId",
                required: true,
                schema: { type: "string" },
                description: "ID của vai trò cần thêm người dùng vào",
            }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                userIds: {
                                    type: "array",
                                    items: { type: "string", example: "67d7e3a525c545eee5f3380c" },
                                    description: "Danh sách ID của người dùng cần thêm",
                                },
                            },
                            required: ["userIds"],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Thêm người dùng vào vai trò thành công",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProjectRole" },
                        },
                    },
                },
                400: { description: "Dữ liệu không hợp lệ hoặc Role ID không hợp lệ" },
                404: { description: "Không tìm thấy vai trò" },
                500: { description: "Lỗi server" },
            },
        },
    },
    "/project-roles/{roleId}/remove-users": {
        delete: { // HTTP method nên là DELETE hoặc POST nếu body phức tạp
            summary: "Xoá người dùng khỏi một vai trò cụ thể",
            tags: ["Project Role"],
            parameters: [{
                in: "path",
                name: "roleId",
                required: true,
                schema: { type: "string" },
                description: "ID của vai trò cần xoá người dùng",
            }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                userIds: {
                                    type: "array",
                                    items: { type: "string", example: "67d7e3a525c545eee5f3380c" },
                                    description: "Danh sách ID của người dùng cần xoá",
                                },
                            },
                            required: ["userIds"],
                        },
                    },
                },
            },
            responses: {
                200: { description: "Xoá người dùng khỏi vai trò thành công" },
                400: { description: "Dữ liệu không hợp lệ hoặc Role ID không hợp lệ" },
                404: { description: "Không tìm thấy vai trò" },
                500: { description: "Lỗi server" },
            },
        },
    },
};

module.exports = projectRoleSwagger;

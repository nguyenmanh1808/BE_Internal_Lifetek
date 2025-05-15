const projectRoleSwagger = {
    "/project-role": {
        get: {
            summary: "Lấy danh sách vai trò dự án",
            description: "Trả về danh sách các vai trò trong hệ thống dự án",
            tags: ["Project Role"],
            responses: {
                200: {
                    description: "Lấy danh sách vai trò thành công",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: { $ref: "#/components/schemas/ProjectRole" },
                            },
                        },
                    },
                },
                500: { description: "Lỗi server" },
            },
        },

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
                500: { description: "Lỗi server" },
            },
        },
    },

    "/project-role/{id}": {
        get: {
            summary: "Lấy chi tiết vai trò theo ID",
            tags: ["Project Role"],
            parameters: [{
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string" },
                description: "ID vai trò",
            }],
            responses: {
                200: {
                    description: "Lấy chi tiết thành công",
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/ProjectRole" } },
                    },
                },
                404: { description: "Không tìm thấy vai trò" },
                500: { description: "Lỗi server" },
            },
        },

        put: {
            summary: "Cập nhật vai trò theo ID",
            tags: ["Project Role"],
            parameters: [{
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string" },
                description: "ID vai trò",
            }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ProjectRoleInput" },
                    },
                },
            },
            responses: {
                200: { description: "Cập nhật thành công" },
                404: { description: "Không tìm thấy vai trò" },
                500: { description: "Lỗi server" },
            },
        },

        delete: {
            summary: "Xoá vai trò theo ID",
            tags: ["Project Role"],
            parameters: [{
                in: "path",
                name: "id",
                required: true,
                schema: { type: "string" },
                description: "ID vai trò",
            }],
            responses: {
                200: { description: "Xoá thành công" },
                404: { description: "Không tìm thấy vai trò" },
                500: { description: "Lỗi server" },
            },
        },
    },

    "/project-role/project/{projectId}": {
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

    "/project-role/batch-add-users": {
        post: {
            summary: "Thêm nhiều user vào project với role",
            tags: ["Project Role"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                userIds: { type: "array", items: { type: "string" } },
                                projectId: { type: "string" },
                                role: { type: "string" },
                            },
                            required: ["userIds", "projectId", "role"],
                        },
                    },
                },
            },
            responses: {
                201: { description: "Thêm user thành công" },
                400: { description: "Thiếu dữ liệu" },
                500: { description: "Lỗi server" },
            },
        },
    },

    "/project-role/{projectId}/{userId}": {
        delete: {
            summary: "Xoá vai trò user trong project",
            tags: ["Project Role"],
            parameters: [
                {
                    in: "path",
                    name: "projectId",
                    required: true,
                    schema: { type: "string" },
                    description: "ID dự án",
                },
                {
                    in: "path",
                    name: "userId",
                    required: true,
                    schema: { type: "string" },
                    description: "ID user",
                },
            ],
            responses: {
                200: { description: "Xoá thành công" },
                404: { description: "Không tìm thấy user role" },
                500: { description: "Lỗi server" },
            },
        },
    },
};

module.exports = projectRoleSwagger;

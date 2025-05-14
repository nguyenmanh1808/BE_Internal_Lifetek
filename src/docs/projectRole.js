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
                401: {
                    description: "Không có quyền truy cập",
                },
                500: {
                    description: "Lỗi server",
                },
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
                        schema: {
                            $ref: "#/components/schemas/ProjectRoleInput",
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "Tạo vai trò thành công",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Tạo mới thành công" },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: "Dữ liệu không hợp lệ",
                },
                401: {
                    description: "Không có quyền truy cập",
                },
                500: {
                    description: "Lỗi server",
                },
            },
        },
    },

    "/project-role/{id}": {
        get: {
            summary: "Lấy chi tiết vai trò theo ID",
            description: "Trả về thông tin chi tiết một vai trò dự án",
            tags: ["Project Role"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    description: "ID vai trò",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Lấy chi tiết thành công",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ProjectRole",
                            },
                        },
                    },
                },
                404: {
                    description: "Không tìm thấy vai trò",
                },
                401: {
                    description: "Không có quyền truy cập",
                },
                500: {
                    description: "Lỗi server",
                },
            },
        },

        put: {
            summary: "Cập nhật vai trò theo ID",
            description: "API cập nhật thông tin vai trò dựa vào ID",
            tags: ["Project Role"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    description: "ID vai trò",
                    schema: {
                        type: "string",
                    },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ProjectRoleInput",
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Cập nhật thành công",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Cập nhật thành công" },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: "Không tìm thấy vai trò",
                },
                401: {
                    description: "Không có quyền truy cập",
                },
                500: {
                    description: "Lỗi server",
                },
            },
        },

        delete: {
            summary: "Xoá vai trò theo ID",
            description: "API xoá một vai trò trong dự án",
            tags: ["Project Role"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    description: "ID vai trò",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Xoá thành công",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Xoá thành công" },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: "Không tìm thấy vai trò",
                },
                401: {
                    description: "Không có quyền truy cập",
                },
                500: {
                    description: "Lỗi server",
                },
            },
        },
    },
};

module.exports = projectRoleSwagger;
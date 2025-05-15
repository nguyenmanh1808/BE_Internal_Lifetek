const authSwagger = require("./auth.js");
const { authSchema } = require("./components/authComponent.js");
const { taskSchema } = require("./components/taskComponent.js");
const { projectSchema } = require("./components/projectComponent.js");
const { notifiSchema } = require("./components/notifiComponent.js")
const taskSwagger = require("./task.js");
const projectSwagger = require("./project.js");
const notifiSwagger = require("./notifi.js")
const dotenv = require("dotenv");
const { userSwagger } = require("./user.js");
const CmtSwagger = require("./comment.js");
const commentSchema = require("./components/commentComponent.js");
const projectRoleSwagger = require("./projectRole.js");
const { projectRoleSchema } = require("./components/projectRoleComponent.js");
dotenv.config();

const domainUrl = process.env.DOMAIN_SWAGGER
  ? process.env.DOMAIN_SWAGGER + ":" + process.env.PORT + "/api/v1"
  : `http://localhost:${process.env.PORT}/api/v1`;

const swaggerDocs = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "Tài liệu API cho hệ thống",
  },
  servers: [
    {
      url: domainUrl,

      description: "Môi trường development",
    },
  ],
  paths: {
    ...authSwagger,
    ...taskSwagger,
    ...projectSwagger,
    ...userSwagger,
    ...CmtSwagger,
    ...notifiSwagger,
    ...projectRoleSwagger,
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ...authSchema,
      ...taskSchema,
      ...projectSchema,
      ...commentSchema,
      ...notifiSchema,
      ...projectRoleSchema,
    },
  },
  security: [
    {
      BearerAuth: [], // Kích hoạt xác thực toàn bộ API
    },
  ],
};

module.exports = swaggerDocs;

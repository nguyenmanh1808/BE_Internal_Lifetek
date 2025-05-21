const mongoose = require("mongoose");
const projectService = require("./project.service.js");
const SuccessResponse = require("../utils/SuccessResponse.js");
const PAGINATE = require("../constants/paginate.js");
const jwt = require("jsonwebtoken");
exports.addProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body);
    return new SuccessResponse(project).send(res);
  } catch (error) {
    return next(error);
  }
};

exports.getAllProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || PAGINATE.PAGE;
    const limit = parseInt(req.query.limit) || PAGINATE.LIMIT;
    const skip = (page - 1) * limit;
    const idUser = req.user._id;
    const projects = await projectService.getAllProjects(idUser, skip, limit);
    const total = await projectService.countProjects();

    return new SuccessResponse(
      projects,
      200,
      "success",
      total,
      page,
      limit
    ).sends(res);
  } catch (error) {
    return next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.project._id);
    if (!project) return next(new Error("Project không tồn tại"));
    
    return new SuccessResponse(project).send(res);
  } catch (error) {
    return next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.project._id))
      return next(new Error("ID không hợp lệ"));
    const userId = req.user._id;
    const projectId = req.project._id;
    const project = await projectService.getProjectById(projectId);
    if (userId.toString() ==  project.managerId.toString()) {
          const projectUpdate = await projectService.updateProject(
              req.project._id,
              req.body
        );
        if (!projectUpdate) return next(new Error("Project không tồn tại"));

        return new SuccessResponse(projectUpdate).send(res);
    }
    else {
       res.status(403).json(new SuccessResponse("Bạn không có quyền sửa project này"));
    }
   
  } catch (error) {
    return next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.idProject)) {
      return next(new Error("ID không hợp lệ"));
    }
    const userId = req.user._id;
    const projectId = req.params.idProject;
    const project = await projectService.getProjectById(projectId);
    if (userId.toString() ==  project.managerId.toString()) {
         const projectDelete = await projectService.deleteProject(projectId);
        if (!projectDelete) return next(new Error("Project không tồn tại"));

        return new SuccessResponse("Xóa dự án thành công").send(res);
    }
    else {
      res.status(403).json(new SuccessResponse("Bạn không có quyền xóa dự án này"));
    }
   
  } catch (error) {
    return next(error);
  }
};

exports.getProjectManager = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(new Error("ID không hợp lệ"));

    const project = await projectService.fetchProjectManager(id);
    if (!project) return next(new Error("Project không tồn tại"));

    return new SuccessResponse(project.managerId).send(res);
  } catch (error) {
    return next(error);
  }
};
exports.getProjectMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(new Error("ID không hợp lệ"));

    const project = await projectService.fetchProjectMembers(id);

    if (!project) return next(new Error("Project không tồn tại"));

    return new SuccessResponse(project.members).send(res);
  } catch (error) {
    return next(error);
  }
};
exports.load = async (req, res, next, id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new Error("ID không hợp lệ"));
    }
    const project = await projectService.getProjectById(id);
    if (!project) {
      return next(new Error("Project không tồn tại"));
    }
    req.project = project;
    next();
  } catch (error) {
    return next(error);
  }
};

exports.getNameProject = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // Lấy từ khóa tìm kiếm từ query string
    const { name } = req.query;

    if (!name)
      // return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });
      return next(new Error("Thiếu từ khóa tìm kiếm"));
     const [ projects, total] = await Promise.all (projectService.findNameProject(userId, name),projectService.countNameProjects(userId, name) );

    // return res.status(200).json({ success: true, projects });
    const page = parseInt(req.query.page) || PAGINATE.PAGE;
    const limit = parseInt(req.query.limit) || PAGINATE.LIMIT;

  
    return new SuccessResponse(
      projects,
      200,
      "success",
      total,
      page,
      limit
    ).sends(res);
  } catch (error) {
    console.error("Lỗi tìm kiếm project:", error);
    // return res.status(500).json({ message: "Lỗi server" });
    return next(new Error("Lỗi server"));
  }
};

exports.getCountTaskInProject = async (req, res, next) => {
  try {
    const userId = req.user._id; // Lấy userId từ token xác thực
    const { idProject } = req.params; // Lấy projectId từ URL
    console.log("userId",userId)
    // Kiểm tra nếu không có projectId
    if (!idProject) {
      return next(new Error("ProjectId không được để trống!!!"));
    }

    // Lấy số lượng task trong dự án
    const totalTasks = await projectService.fetchCountTaskInProject(userId, idProject);

    // Trả kết quả thành công
    return new SuccessResponse(totalTasks).send(res);
  } catch (error) {
    console.error("Lỗi khi lấy số lượng task:", error);
    // Xử lý lỗi nếu có
    return next(new Error("Lỗi server"));
  }
};


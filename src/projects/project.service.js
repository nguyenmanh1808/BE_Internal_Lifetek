const Project = require("./project.model.js");
const User = require("../users/user.model.js");
const mongoose = require("mongoose");
const removeAccents = require("remove-accents");
const taskModel = require("../tasks/task.model.js");


exports.createProject = async (data) => {
  const existingProject = await Project.findOne({ code: data.code });
  const managerExists = await isUserExist(data.managerId);
  if (!managerExists) {
    throw new Error(`Manager với id ${data.managerId} không tồn tại!`);
  }
  // if (data.members && data.members.length > 0) {
  //   for (let memberId of data.members) {
  //     const isMemberValid = await isUserExist(memberId);
  //     if (!isMemberValid) {
  //       throw new Error(`Thành viên với id ${memberId} không tồn tại!`);
  //     }
  //   }
  // }
  // Kiểm tra danh sách thành viên
  let memberIds = [];
  if (Array.isArray(data.members)) {
    for (let member of data.members) {
      if (!member._id) continue;
      const isMemberValid = await isUserExist(member._id);
      if (!isMemberValid) {
        throw new Error(`Thành viên với id ${member._id} không tồn tại!`);
      }
      memberIds.push(member._id);
    }
  }

  if (existingProject) {
    throw new Error(`Mã code ${data.code} đã tồn tại!`);
  }
  return await Project.create({
    name: data.name,
    code: data.code,
    description: data.description,
    status: data.status,
    managerId: data.managerId._id,
    members: memberIds,
    startDate: data.startDate,
    endDate: data.endDate,
    priority: data.priority,
  });
};

exports.getAllProjects = async (userId, skip, limit) => {
  return await Project.aggregate([
  {
    $match: {
      $or: [
        { managerId: userId },
        { members: { $in: [userId] } }
      ]
    }
  },
    {
      $lookup: {
        from: "users",  // Join với bảng users để lấy thông tin người quản lý của project
        localField: "managerId",
        foreignField: "_id",
        as: "managerId"
      }
    },
     {
    $unwind: "$managerId" // Chuyển mảng thành object
  },
  {
    // Populate members nhưng chỉ lấy name và email
    $lookup: {
      from: "users",
      localField: "members",
      foreignField: "_id",
      as: "members"
    }
  },
  {
    $lookup: {
      from: "tasks",
      localField: "_id",
      foreignField: "projectId",
      as: "tasks"
    }
  },
  {
    $addFields: {
      bugCount: {
        $size: {
          $filter: {
            input: "$tasks",
            as: "task",
            cond: { $eq: ["$$task.type", "bug"] }
          }
        }
      }
    }
  },
  {
    $sort: { priority: -1, bugCount: -1 } // Sắp xếp theo priority trước, bugCount sau
  },
  {
    $skip: skip 
  },
  {
    $limit: limit 
  },
  {
    $project: {
      _id: 1,
      name: 1,
      code: 1,
      description: 1,
      status: 1,
      "managerId._id":1,
      "managerId.userName": 1,
      "managerId.avatar": 1,
      "managerId.email": 1,
      "managerId.phone": 1,
      "members._id": 1,
      "members.userName": 1,
      "members.avatar": 1,
      "members.email": 1,
      "members.avatar": 1,
      createdAt: 1,
      updatedAt: 1,
      startDate: 1,
      endDate: 1,
      priority:1,
      bugCount: 1
    }
  }
])

};
exports.getProjectById = async (id) => {
  return await Project.findById(id);
};

exports.updateProject = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("ID không hợp lệ!");
  }
  console.log(data)
  const updateData = {}; // Chứa các trường hợp lệ để cập nhật

  // Kiểm tra và cập nhật `managerId`
  if (data.managerId) {
    const managerExists = await isUserExist(data.managerId);
    if (!managerExists) {
      throw new Error(`Manager với id ${data.managerId} không tồn tại!`);
    }
    updateData.managerId = data.managerId;
  }

  // Lấy danh sách `members` hiện tại
  const project = await Project.findById(id);
  if (!project) {
    throw new Error("Dự án không tồn tại!")
  }

  updateData.members = data.members .map((id) => new mongoose.Types.ObjectId(id));


  // Cập nhật các trường khác (nếu có)
  ["name", "code", "description", "status", "priority","startDate","endDate"].forEach((field) => {
    if (data[field] !== undefined) {
      
      updateData[field] = data[field];
    }
  });
  console.log(id)
  // Cập nhật vào MongoDB với `$set`
  return await Project.findByIdAndUpdate( id,
  { $set: updateData },
  {
    new: true,
    runValidators: true,
    context: 'query',
  });
};

exports.deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};
exports.fetchProjectManager = async (id) => {
  return await Project.findById(id).populate({
    path: "managerId",
    select: "-password -refreshToken",
  });
};
exports.fetchProjectMembers = async (projectId) => {
  return await Project.findById(projectId).populate({
    path: "members",
    select: "-password -refreshToken -role",
  });
};
const isUserExist = async (id) => {
  const user = await User.findById(id);
  return !!user; // true nếu tồn tại, false nếu không
};

exports.findNameProject = async (userId, name) => {
  try {
    const cleanName = name.trim();
    const slugNames = removeAccents.remove(cleanName.toLowerCase());
    const projects = await Project.find({
      $or: [
        { members: { $in: [userId] } }, // Kiểm tra userId có trong mảng members
        { managerId: userId }, // Kiểm tra userId có phải là manager
      ],
      slugName: { $regex: slugNames, $options: "i" }, // Tìm kiếm không phân biệt hoa thường
    })
    .populate("managerId", "userName avatar")
    .populate("managerId", "userName avatar")
    ;
    return projects;
  } catch (error) {
    console.error("Lỗi tìm kiếm project:", error);
    throw new Error("Không thể tìm kiếm project");
  }
};
exports.fetchCountTaskInProject = async (userId, projectId) => {
  try {
    const count = await taskModel.countDocuments({
      projectId, // Lọc theo projectId
      assigneeId: userId, // Kiểm tra userId có trong mảng assigneeId
      status: { $nin: [5, 6] } // Loại trừ status 5 và 6
    });
    return count;
  } catch (error) {
    console.error("Lỗi tìm kiếm task:", error);
    throw new Error("Không thể tìm kiếm task");
  }
};

exports.countNameProjects = async (userId, name) => {
  const cleanName = name.trim();
  const slugNames = removeAccents.remove(cleanName.toLowerCase());
  return await Project.countDocuments({
    $or: [{ managerId: userId }, { members: { $in: [userId] } }],
    slugName: { $regex: slugNames, $options: "i" },
  });
};

exports.countProjects = async () => {
  return await Project.countDocuments();
};


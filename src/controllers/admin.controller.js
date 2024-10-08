import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Class } from "../models/class.model.js";
import { Student } from "../models/students.model.js";
import { Course } from "../models/course.model.js";
import { Teacher } from "../models/teachers.model.js";
import { Notice } from "../models/notice.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });
    console.log("Access token generated: " , accessToken)  //! Debugging step (successfully generated)
    console.log("Refresh token generated: ", refreshToken)  //! Debugging step (successfully generated)
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { adminId, name, email, password } = req.body;

  console.log(req.body);

  if (adminId === "" || name === "" || email === "" || password === "") {
    throw new ApiError(400, "All fields are mandatory");
  }

  const existedUser = await Admin.findOne({
    $or: [{ adminId }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const admin = await Admin.create({
    adminId,
    name,
    email,
    password,
  });
  const createdAdmin = await Admin.findOne(admin._id).select(
    "-password -refreshToken"
  );
  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdAdmin, "User Registerd Sucessfully."));
});

const adminLogin = asyncHandler(async (req, res) => {
  const { adminId, password } = req.body;

  if (!adminId) {
    throw new ApiError(400, "Admin ID is required");
  }

  const admin = await Admin.findOne({adminId});
  if (!admin) {
    throw new ApiError(401, "Invalid ID");
  }

  const isValidPassword = await admin.isValidPassword(password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    admin._id
  );
  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log("Access token under login: ", accessToken); //! Debugging step (successfully generated)
  console.log("Refresh token under login: ", refreshToken); //! Debugging step (successfully generated)

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          admin: loggedInAdmin,
          accessToken,
          refreshToken,
        },
        "Admin Logged In Successfully"
      )
    );
});

const adminLogout = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Admin Logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorised request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const admin = await Admin.findById(decodedToken?._id);
    if (!admin) {
      throw new ApiError(404, "Invalid Refresh token");
    }

    if (incomingRefreshToken !== admin?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(admin._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin?._id);
  const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword); // Make sure to call the correct method

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  admin.password = newPassword;
  await admin.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Now CRUD operation only by admin(like adding/removing/modifying student details, teacher details, class, course details)

// STUDENT
const addStudent = asyncHandler(async (req, res) => {
  const {
    studentId,
    name,
    gender,
    DOB,
    rollNo,
    address,
    contactNumber,
    email,
    password,
    classId,
    father,
    fatherContactNumber,
    mother,
    motherContactNumber,
    enrollmentDate,
    className,
  } = req.body;

  if (
    !studentId ||
    !name ||
    !gender ||
    !DOB ||
    !rollNo ||
    !address ||
    !contactNumber ||
    !email ||
    !password ||
    !classId ||
    !father ||
    !fatherContactNumber ||
    !mother ||
    !motherContactNumber ||
    !enrollmentDate ||
    !className
  ) {
    throw new ApiError(400, "All fields are mandatory");
  }

  const existingStudent = await Student.findOne({ studentId });
  if (existingStudent) {
    throw new ApiError(409, "Student already exists");
  }
  const student = await Student.create({
    SID: this.studentId,
    name,
    gender,
    DOB,
    rollNo,
    address,
    contactNumber,
    email,
    password,
    classId,
    father,
    fatherContactNumber,
    mother,
    motherContactNumber,
    enrollmentDate,
    className,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, student, "Student added successfully"));
});

const removeStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findByIdAndDelete(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Student removed successfully"));
});

// TODO: const modifyStudent = asyncHandler(async (req, res) => {});

// COURSE
const addCourse = asyncHandler(async (req, res) => {
    const { courseId, courseName, teachersAssigned, studentsEnrolled } = req.body;
  
    if (!courseId || !courseName || !Array.isArray(teachersAssigned)) {
      throw new ApiError(400, "courseId, courseName, and teachersAssigned are mandatory");
    }
  
    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse) {
      throw new ApiError(409, "Course already exists");
    }
  
    const course = await Course.create({
      courseId,
      courseName,
      teachersAssigned: teachersAssigned.length ? teachersAssigned : [], 
      studentsEnrolled: Array.isArray(studentsEnrolled) ? studentsEnrolled : [], 
    });
  
    return res
      .status(201)
      .json(new ApiResponse(201, course, "Course added successfully"));
  });
  

const removeCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

  const course = await Course.findByIdAndDelete(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Course removed successfully"));
});

// TODO: const modifyCourse = asyncHandler(async (req, res) => {});

// TEACHER
const addTeacher = asyncHandler(async (req, res) => {
    const { teacherName, teacherId, subjects, contact, department, password } = req.body;

    if (!teacherName || !teacherId || !subjects || !contact || !password) {
        throw new ApiError(400, "teacherName, teacherId, subjects, contact, and password are mandatory");
    }

    const existingTeacher = await Teacher.findOne({ teacherId });
    if (existingTeacher) {
        throw new ApiError(409, "Teacher with this ID already exists");
    }

    const teacher = await Teacher.create({
        teacherName,
        teacherId,
        subjects,
        contact,
        department,
        password,
    });

    return res.status(201).json(new ApiResponse(201, teacher, "Teacher added successfully"));
});

const removeTeacher = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;

  const teacher = await Teacher.findByIdAndDelete(teacherId);
  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Teacher removed successfully"));
});

// TODO: const modifyTeacher = asyncHandler(async (req, res) => {});

// CLASS

const addClass = asyncHandler(async (req, res) => {
    const { classId, className, section, students, teachers } = req.body;

    if (!classId || !className || !section || !Array.isArray(students) || !Array.isArray(teachers)) {
        throw new ApiError(400, "classId, className, section, students (must be an array), and teachers (must be an array) are mandatory");
    }

    const existingClass = await Class.findOne({ classId });
    if (existingClass) {
        throw new ApiError(409, "Class already exists");
    }

    const classItem = await Class.create({
        classId,
        className,
        section,
        students: students.length ? students : [],
        teachers: teachers.length ? teachers : [],
    });

    return res.status(201).json(new ApiResponse(201, classItem, "Class added successfully"));
});


const removeClass = asyncHandler(async (req, res) => {
    const { classId } = req.params;

  const classItem = await Class.findByIdAndDelete(classId);
  if (!classItem) {
    throw new ApiError(404, "Class not found");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Class removed successfully"));
});

// TODO: const modifyClass = asyncHandler(async (req, res) => {});

// NOTICE

const addNotice = asyncHandler(async (req, res) => {
    const {title, content} = req.body;
    if (!title || !content) {
      throw new ApiError(400, "title and content are mandatory");
    }

    const notice = await Notice.create({
      title,
      content,
      author: req.admin._id
    });

    return res
     .status(201)
     .json(new ApiResponse(201, notice, "Notice added successfully"));
  
});

const removeNotice = asyncHandler(async (req, res) => {
    const { noticeId } = req.params;
    const notice = await Notice.findByIdAndDelete(noticeId);
    if (!notice) {
      throw new ApiError(404, "Notice not found");
    }
    return res.status(200).json(new ApiResponse(200, {}, "Notice removed successfully"));
});

// TODO: const modifyNotice = asyncHandler(async (req, res) => {});

export {
  registerAdmin,
  adminLogin,
  adminLogout,
  refreshAccessToken,
  changeCurrentPassword,
  addStudent,
  removeStudent,
  //modifyStudent,
  addCourse,
  removeCourse,
  //modifyCourse,
  addTeacher,
  removeTeacher,
  //modifyTeacher,
  addClass,
  removeClass,
  //modifyClass,
  addNotice,
  removeNotice,
  //modifyNotice,
};

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/students.model.js";
import { Teacher } from "../models/teachers.model.js";
import { Notice } from "../models/notice.model.js";
import { Grades } from "../models/grades.model.js";
import { Class } from "../models/class.model.js";
import { Course } from "../models/course.model.js";
import { Attendance } from "../models/attendance.model.js";
import jwt from "jsonwebtoken";

// BASIC
const generateAccessAndRefreshToken = async (teacherId) => {
  try {
    const teacher = await Teacher.findById(teacherId);
    const accessToken = teacher.generateAccessToken();
    const refreshToken = teacher.generateRefreshToken();

    teacher.refreshToken = refreshToken;
    await teacher.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

const teacherLogin = asyncHandler(async (req, res) => {
  const { teacherId, password } = req.body;

  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required");
  }

  const teacher = await Teacher.findOne({ teacherId });
  if (!teacher) {
    throw new ApiError(401, "Invalid ID");
  }

  const isValidPassword = await teacher.isValidPassword(password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    teacher._id
  );
  const loggedInTeacher = await Teacher.findById(teacher._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {}, "Teacher Logged In Successfully"));
});

const teacherLogout = asyncHandler(async (req, res) => {
  await Teacher.findByIdAndUpdate(
    req.teacher._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Teacher Logged Out Successfully"));
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
    const teacher = await Teacher.findById(decodedToken?._id);
    if (!teacher) {
      throw new ApiError(404, "Invalid Refresh token");
    }
    if (incomingRefreshToken !== teacher?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(teacher._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const teacher = await Teacher.findById(req.teacher?._id);
  const isValidPassword = await teacher.isValidPassword(oldPassword);
  if (!isValidPassword) {
    throw new ApiError(400, "Invalid old password");
  }
  teacher.password = newPassword;
  await teacher.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// STUDENTS 
const assignGrades = asyncHandler(async (req, res) => {
  const { SID, courseId, grade } = req.body;

  if (!SID || !courseId || !grade) {
    throw new ApiError(400, "SID, courseId, and grade are required");
  }

  const student = await Student.findOne({ SID });
  if (!student) {
    throw new ApiError(404, "Student not found");
  }
  const course = await Course.findOne({ courseId });
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  const gradeRecord = await Grades.findOneAndUpdate(
    { SID, courseId },
    { grade },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, gradeRecord, "Grade assigned successfully"));
});

const markAttendance = asyncHandler(async (req, res) => {
  const { SID, date, present } = req.body;

  const student = await Student.findOne({ SID });
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const attendanceDate = new Date(date);
  if (isNaN(attendanceDate.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  const attendanceRecord = await Attendance.findOneAndUpdate(
    { SID, date: attendanceDate },
    { present },
    { upsert: true, new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, attendanceRecord, "Attendance recorded successfully")
    );
});

const checkNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find()
    .populate("author", "name email")
    .sort({ createdAt: -1 });

  if (!notices.length) {
    return res.status(404).json(new ApiResponse(404, [], "No notices found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notices, "Notices fetched successfully"));
});

const checkStudentByClass = asyncHandler(async (req, res) => {});

export {
  teacherLogin,
  teacherLogout,
  refreshAccessToken,
  changeCurrentPassword,
  assignGrades,
  markAttendance,
  checkNotices,
  checkStudentByClass,
};

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Student } from "../models/students.model.js";
import { Attendance } from "../models/attendance.model.js";
import { Notice } from "../models/notice.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Grades} from "../models/grades.model.js"
import jwt from "jsonwebtoken";
// TODO: Add a functionality so that Student can download their academic report in pdf format. (will add later on)

const generateAccessAndRefreshToken = async (SID) => {
  try {
    const student = await Student.findById(SID);
    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

const studentLogin = asyncHandler(async (req, res) => {
  const { SID, password } = req.body;

  if (!SID) {
    throw new ApiError(400, "SID is required");
  }

  const student = await Student.findOne({SID});
  if (!student) {
    throw new ApiError(401, "Invalid ID");
  }

  const isValidPassword = await student.isValidPassword(password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    student._id
  );
  const loggedInStudent = await Student.findById(student._id).select(
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
    .json(
      new ApiResponse(
        200,
        {
          student: loggedInStudent,
          accessToken,
          refreshToken,
        },
        "Student Logged In Successfully"
      )
    );
});

const studentLogout = asyncHandler(async (req, res) => {
  await Student.findByIdAndUpdate(
    req.student._id,
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
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
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

    const student = await Student.findById(decodedToken?._id);
    if (!student) {
      throw new ApiError(404, "Invalid Refresh token");
    }

    if (incomingRefreshToken !== student?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(student._id);

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
  const student = await Student.findById(req.student?._id);
  const isValidPassword = await student.isValidPassword(oldPassword);
  if (!isValidPassword) {
    throw new ApiError(400, "Invalid old password");
  }

  student.password = newPassword;
  await student.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const checkAttendance = asyncHandler(async (req, res) => {
  const { SID } = req.params; // Extract SID from req.params
  if (!SID) {
    throw new ApiError(400, "Student Id is required");
  }
  const attendanceRecords = await Attendance.find({ SID }, 'date present')
    .sort({ date: -1 });  

  if (!attendanceRecords.length) {
    throw new ApiError(404, "No attendance records found for this student");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        attendanceRecords,  
        "Attendance details fetched successfully"
      )
    );
});

const checkGrades = asyncHandler(async (req, res) => {
  const { SID } = req.params;

  if (!SID) {
    throw new ApiError(400, "Student ID is required");
  }

  const student = await Student.findOne({ SID }).populate(
    "coursesEnrolled",
    "courseName"
  );
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const grades = await Grades.find({ SID })
    .populate("courseId", "courseName")
    .lean();

  if (!grades.length) {
    throw new ApiError(404, "No grades found for this student");
  }

  const formattedGrades = grades.map((grade) => ({
    courseName: grade.courseId.courseName,
    grade: grade.grade,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, formattedGrades, "Grades fetched successfully"));
});


const checkCourses = asyncHandler(async (req, res) => {
  const { SID } = req.params;

  if (!SID) {
    throw new ApiError(400, "Student ID is required");
  }

  const student = await Student.findOne({SID}).populate(
    "coursesEnrolled",
    "courseName"
  );

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const enrolledCourses = student.coursesEnrolled;

  if (!enrolledCourses.length) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { enrolledCourses: [] }, "No courses enrolled")
      );
  }

  const coursesList = enrolledCourses.map((course) => ({
    courseName: course.courseName,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { enrolledCourses: coursesList },
        "Courses fetched successfully"
      )
    );
});

const pendingFees = asyncHandler(async (req, res) => {
  const { SID } = req.params;

  if (!SID) {
    throw new ApiError(400, "Student ID is required");
  }

  const student = await Student.findOne({SID});

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const pendingFees = student.pendingFees;

  return res
    .status(200)
    .json(
      new ApiResponse(200, { pendingFees }, "Pending fees fetched successfully")
    );
});

const viewNotice = asyncHandler(async (req, res) => {
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

export {
  studentLogin,
  studentLogout,
  refreshAccessToken,
  changeCurrentPassword,
  checkAttendance,
  checkGrades,
  checkCourses,
  pendingFees,
  viewNotice,
};

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Student } from "../models/students.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (sId) => {
    try {
      const student = await Student.findById(sId);
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

const studentLogin = asyncHandler(async (req, res)=>{
    const {studentId, password}= req.body

    if (!(studentId)) {
        throw new ApiError(400, "studentId is required");
    }

    const student = await Student.findById(studentId);
    if (!student) {
        throw new ApiError(401, "Invalid ID");
    }

    const isValidPassword = await student.isPasswordCorrect(password); 

    if (!isValidPassword) {
        throw new ApiError(401, "Invalid password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(student._id)
    const loggedInStudent = await Student.findById(student._id).select(
        "-password -refreshToken"
    );

    
    const options = {
        httpOnly: true,
        secure: true, 
    };
    console.log("Accesstoken: ", accessToken);
    console.log("RefreshToken: ", refreshToken);

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

})

const studentLogout = asyncHandler(async (req, res) => {
    await Student.findByIdAndUpdate(
        req.user._id,
        {
          $unset: {
            refreshToken: 1
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
})

export { studentLogin, studentLogout }
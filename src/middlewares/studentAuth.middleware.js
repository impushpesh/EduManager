import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js"; 
import jwt from "jsonwebtoken";
import { Student } from "../models/students.model.js";

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try { 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") 
        if(!token){
            throw new ApiError(401, "Unauthorised request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const student = await Student.findById(decodedToken?._id).select("-password -refreshToken")
        if(!student){
            throw new ApiError(404, "student not found")
        }
        req.student = student
        next()
    } catch (error) {
        console.log("This is part 2")
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})
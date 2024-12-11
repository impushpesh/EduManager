import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js"; 
import jwt from "jsonwebtoken";
import { Teacher } from "../models/teachers.model.js";

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try { 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") 
        if(!token){
            throw new ApiError(401, "Unauthorised request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const teacher = await Teacher.findById(decodedToken?._id).select("-password -refreshToken")
        if(!teacher){
            throw new ApiError(404, "teacher not found")
        }
        req.teacher = teacher
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})
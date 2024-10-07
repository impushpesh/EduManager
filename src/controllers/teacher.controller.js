import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

/*
Functionalities- 
1. Teachers can login logout
2. Teachers can check student details such as grades, attendance
3. Teachers can check their detials
4. Teachers can assign grades to students
5. Teachers can mark attendance of students
6. Teachers can view all students in their class
7. Teacher can download academic report of a student, list of students of their class where they are teaching in pdf format.
*/

// Teacher can add attendance
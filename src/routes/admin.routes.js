import { Router } from "express";
import {
  registerAdmin,
  adminLogin,
  adminLogout,
  refreshAccessToken,
  changeCurrentPassword,
  addStudent,
  removeStudent,
  addCourse,
  removeCourse,
  addTeacher,
  removeTeacher,
  addClass,
  removeClass,
  addNotice,
  removeNotice,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// BASIC routes
router.route('/register').post(registerAdmin) 
router.route('/login').post(adminLogin) 
router.route('/logout').post(verifyJWT, adminLogout) 
router.route('/refreshToken').post(refreshAccessToken) 
router.route('/changePassword').post(verifyJWT, changeCurrentPassword) 

// STUDENTS routes
router.route('/addStudent').post(verifyJWT, addStudent) 
router.route('/removeStudent/:SID').delete(verifyJWT, removeStudent) 

// COURSE routes
router.route('/addCourse').post(verifyJWT, addCourse) // TODO: Set relation between teacher and course and student enrolled in that course
router.route('/removeCourse/:courseId').delete(verifyJWT, removeCourse) 

// TEACHERS routes
router.route('/addTeacher').post(verifyJWT, addTeacher) 
router.route('/removeTeacher/:teacherId').delete(verifyJWT, removeTeacher) 

// CLASS routes
router.route('/addClass').post(verifyJWT, addClass) 
router.route('/removeClass/:classId').delete(verifyJWT, removeClass) 

// NOTICE routes
router.route('/addNotice').post(verifyJWT, addNotice) 
router.route('/removeNotice/:noticeId').delete(verifyJWT, removeNotice) 

export default router;

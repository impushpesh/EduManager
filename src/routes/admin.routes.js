import { Router } from "express";
import {
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
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerAdmin) // ? Working

router.route('/login').post(adminLogin) // ? Working

router.route('/logout').post(verifyJWT, adminLogout) // ! Not working

router.route('/refresh-token').post(refreshAccessToken) 

router.route('/change-password').post(verifyJWT, changeCurrentPassword) 

router.route('/add-student').post(verifyJWT, addStudent)

router.route('/remove-student/:studentId').delete(verifyJWT, removeStudent)

// router.route('/modify-student/:studentId').patch(verifyJWT, modifyStudent)

router.route('/add-course').post(verifyJWT, addCourse)

router.route('/remove-course/:courseId').delete(verifyJWT, removeCourse)

// router.route('/modify-course/:courseId').patch(verifyJWT, modifyCourse)

router.route('/add-teacher').post(verifyJWT, addTeacher)

router.route('/remove-teacher/:teacherId').delete(verifyJWT, removeTeacher)

// router.route('/modify-teacher/:teacherId').patch(verifyJWT, modifyTeacher)

router.route('/add-class').post(verifyJWT, addClass)

router.route('/remove-class/:classId').delete(verifyJWT, removeClass)

// router.route('/modify-class/:classId').patch(verifyJWT, modifyClass)

router.route('/add-notice').post(verifyJWT, addNotice)

router.route('/remove-notice/:noticeId').delete(verifyJWT, removeNotice)

// router.route('/modify-notice/:noticeId').patch(verifyJWT, modifyNotice)

export default router;

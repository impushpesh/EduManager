import { Router } from "express";
import {
    studentLogin,
  studentLogout,
  refreshAccessToken,
  changeCurrentPassword,
  checkAttendance,
  checkGrades,
  checkCourses,
  pendingFees,
  viewNotice,
} from "../controllers/student.controller.js"
import { verifyJWT } from "../middlewares/studentAuth.middleware.js";

const router = Router();

router.route('/login').post(studentLogin)
router.route('/logout').post(verifyJWT, studentLogout)
router.route('/refreshToken').post(verifyJWT, refreshAccessToken)
router.route('/changePassword').post(verifyJWT, changeCurrentPassword)
router.route('/checkAttendance/:SID').get(verifyJWT, checkAttendance)
router.route('/checkGrades/:SID').get(verifyJWT, checkGrades)
router.route('/checkCourses/:SID').get(verifyJWT, checkCourses)
router.route('/checkFees/:SID').get(verifyJWT, pendingFees)
router.route('/viewNotice/:noticeId').get(verifyJWT, viewNotice)

export default router;
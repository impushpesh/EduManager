import { Router } from "express";
import {
  studentLogin,
  studentLogout,
  refreshAccessToken,
  changeCurrentPassword,
  checkAttendance,
  checkGrades,
  pendingFees,
  viewNotice,
  getFullDetails
} from "../controllers/student.controller.js"
import { verifyJWT } from "../middlewares/studentAuth.middleware.js";

const router = Router();
// BASIC
router.route('/login').post(studentLogin)
router.route('/logout').post(verifyJWT, studentLogout)
router.route('/refreshToken').post(verifyJWT, refreshAccessToken)
router.route('/changePassword').post(verifyJWT, changeCurrentPassword)

// FETCHING
router.route('/checkAttendance/:SID').get(verifyJWT, checkAttendance)
router.route('/checkGrades/:SID').get(verifyJWT, checkGrades)
router.route('/checkFees/:SID').get(verifyJWT, pendingFees)
router.route('/viewNotice/:SID').get(verifyJWT, viewNotice)
router.route('/viewDetails/:SID').get(verifyJWT, getFullDetails)

export default router;
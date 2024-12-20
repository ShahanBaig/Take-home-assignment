import express from "express";
import {
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/users.js";

const router = express.Router();

router.route('/signup').post(signupUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)

export default router;
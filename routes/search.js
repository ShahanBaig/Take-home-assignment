import express from "express";
import { queriedNotes } from "../controllers/notes.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(isAuthenticatedUser, queriedNotes);

export default router;

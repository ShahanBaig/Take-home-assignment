import express from "express";
import {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
  getNote,
  shareNote,
} from "../controllers/notes.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(isAuthenticatedUser, getAllNotes)
  .post(isAuthenticatedUser, createNote);
router
  .route("/:id")
  .put(isAuthenticatedUser, updateNote)
  .delete(isAuthenticatedUser, deleteNote)
  .get(isAuthenticatedUser, getNote);
router
  .route("/:id/share")
  .post(isAuthenticatedUser, shareNote);

export default router;

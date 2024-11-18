import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name for the note."],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Please enter content for the note."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

/* Text index 
(I am aware automatic index creation might be slow for large 
datasets and can be handled via a script seperately, however 
to reduce complexity for the demo purposes I have placed it here.) */
NoteSchema.index({ name: "text", content: "text" });

const Note = mongoose.model("Note", NoteSchema);
export default Note;

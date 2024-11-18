import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Note from "../models/Note.js";
import User from "../models/User.js";
import ApiFeatures from "../utils/apifeatures.js";
import ErrorHandler from "../utils/errorhandler.js";

export const createNote = catchAsyncErrors(async (req, res, next) => {
  const note = await Note.create({ ...req.body, ...{user: req.user._id} });

  await User.findByIdAndUpdate(req.user._id, {
    $push: { internalNotes: note._id },
  });

  res.status(201).json({
    success: true,
    note,
  });
});

export const getAllNotes = catchAsyncErrors(async (req, res, next) => {
  const notes = await Note.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    notes,
  });
});

export const queriedNotes = catchAsyncErrors(async (req, res, next) => {
  const apifeature = new ApiFeatures(Note.find({ user: req.user._id }), req.query)
    .search()
  const notes = await apifeature.query;

  res.status(200).json({
    success: true,
    notes,
  });
});

export const updateNote = catchAsyncErrors(async (req, res, next) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorHandler("Note not found.", 404));
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Logged in user is not allowed to make changes to the resource.", 403));
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    note,
  });
});

export const deleteNote = catchAsyncErrors(async (req, res, next) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorHandler("Note not found.", 404));
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Logged in user is not allowed to make changes to the resource.", 403));
  }

  await User.updateMany(
    { _id: { $in: note.sharedTo } },
    { $pull: { externalNotes: note._id } }
  );

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { internalNotes: note._id },
  });

  await Note.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Note deleted.",
  });
});

export const getNote = catchAsyncErrors(async (req, res, next) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorHandler("Note not found.", 404));
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Logged in user is not allowed to access the resource.", 403));
  }

  res.status(200).json({
    success: true,
    note,
  });
});

export const shareNote = catchAsyncErrors(async (req, res, next) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorHandler("Note not found.", 404));
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Logged in user is not allowed to access the resource.", 403));
  }

  const userToShare = await User.findById(req.body.userToShare);

  if (!userToShare) {
    return next(new ErrorHandler("User not found.", 404));
  }

  note = await Note.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { sharedTo: userToShare._id } },
    { new: true }
  );

  await User.findByIdAndUpdate(
    userToShare._id,
    { $addToSet: { externalNotes: note._id } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    note,
    message: "Note has been shared with " + userToShare.name + "."
  });
});

import User from '../models/User';
import Note from '../models/Note';

export const createUser = async (userPayload) => {
  const user = await User.create(userPayload);
  return user;
};

export const createNote = async (notePayload, userId) => {
  const note = await Note.create({ ...notePayload, user: userId });
  return note;
};

export const clearDatabase = async () => {
  await User.deleteMany({});
  await Note.deleteMany({});
};

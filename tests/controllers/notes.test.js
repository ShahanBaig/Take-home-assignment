import request from "supertest";
import { createUser, createNote, clearDatabase } from "../testHelper";
import app from "../../testindex.js";

let userToken;
let noteId;

beforeAll(async () => {
  console.log("Starting tests...");
  await clearDatabase();
  console.log("Database cleared, preparing user...");

  // Create a user and get the token
  const user = await createUser({
    name: "Bobby",
    email: "bob@email.com",
    password: "password",
  });

  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: user.email, password: "password" });

  userToken = response.body.token;

  // Create a note for testing
  const note = await createNote(
    { name: "Test Note", content: "This is a test note." },
    user._id
  );
  noteId = note._id;
});

afterAll(async () => {
  //   await clearDatabase();
});

describe("Notes CRUD Operations", () => {
  it("should create a new note", async () => {
    const res = await request(app)
      .post("/api/notes")
      .set("Cookie", `token=${userToken}`)
      .send({ name: "New Note", content: "New content" })
      .expect(201);

    expect(res.body.note).toHaveProperty("_id");
    expect(res.body.note.name).toBe("New Note");
  });

  it("should get all notes for the logged-in user", async () => {
    const res = await request(app)
      .get("/api/notes")
      .set("Cookie", `token=${userToken}`)
      .expect(200);

    expect(res.body.notes).toHaveLength(2);
  });

  it("should get a single note", async () => {
    const res = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("Cookie", `token=${userToken}`)
      .expect(200);

    expect(res.body.note._id).toBe(noteId.toString());
  });

  it("should update an existing note", async () => {
    const updatedNote = { name: "Updated Title", content: "Updated content" };
    const res = await request(app)
      .put(`/api/notes/${noteId}`)
      .set("Cookie", `token=${userToken}`)
      .send(updatedNote)
      .expect(200);

    expect(res.body.note.name).toBe(updatedNote.name);
    expect(res.body.note.content).toBe(updatedNote.content);
  });

  it("should delete a note", async () => {
    const res = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set("Cookie", `token=${userToken}`)
      .expect(200);

    expect(res.body.message).toBe("Note deleted.");
  });
});

import request from "supertest";
import { createUser, clearDatabase } from "../testHelper";
import app from "../../testindex.js";

let userToken;

beforeAll(async () => {
  console.log("Starting tests...");
  await clearDatabase();
  console.log("Database cleared, preparing user...");

  // Create a user
  const user = await createUser({
    name: "Bobby",
    email: "bob@email.com",
    password: "password",
  });

  // Log in the user and get the token
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: user.email, password: "password" });

  userToken = response.body.token;
});

afterAll(async () => {
//   await clearDatabase();
});

describe("User Authentication", () => {
  it("should sign up a new user and send a token", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "tommy",
        email: "tom@email.com",
        password: "password",
      })
      .expect(201);

    expect(res.body).toHaveProperty("token");
  });

  it("should login an existing user and send a token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "bob@email.com", password: "password" })
      .expect(200);

    expect(res.body).toHaveProperty("token");
  });

  it("should fail if incorrect email or password is provided", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "matt@email.com", password: "notpassword" })
      .expect(401);

    expect(res.body.message).toBe("Invalid email or password.");
  });

  it("should log out a user", async () => {
    const res = await request(app).post("/api/auth/logout").expect(200);

    expect(res.body.message).toBe("Logged out.");
  });
});

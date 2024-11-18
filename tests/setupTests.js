import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  // Create a new instance of MongoMemoryServer
  console.log("Setting up in memory server")
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri).then((data) => {
    console.log("Mongo memory connected with server: " + data.connection.host);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

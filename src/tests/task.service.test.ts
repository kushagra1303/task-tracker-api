import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Task from "../models/task.model";
import {
  createUserTask,
  getUserTasks,
  updateUserTask,
  deleteUserTask
} from "../services/task.service";

jest.setTimeout(30000);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {

  mongoServer = await MongoMemoryServer.create();

  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

});

beforeEach(async () => {
  await Task.deleteMany({});
});

afterAll(async () => {

  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }

});

describe("Task Service", () => {

  it("should create a task", async () => {

    const userId = new mongoose.Types.ObjectId().toString();

    const task = await createUserTask(
      {
        title: "Test Task",
        description: "Testing task creation"
      },
      userId
    );

    expect(task.title).toBe("Test Task");
    expect(task.owner.toString()).toBe(userId);

  });

});

it("should fetch tasks for a user", async () => {

  const userId = new mongoose.Types.ObjectId().toString();

  await Task.create({
    title: "Task 1",
    owner: userId
  });

  const tasks = await getUserTasks(userId);

  expect(tasks.length).toBe(1);

});

it("should update a task", async () => {

  const userId = new mongoose.Types.ObjectId().toString();

  const task = await Task.create({
    title: "Old Task",
    owner: userId
  });

  const updated = await updateUserTask(task._id.toString(), {
    title: "Updated Task"
  });

  expect(updated?.title).toBe("Updated Task");

});

it("should delete a task", async () => {

  const userId = new mongoose.Types.ObjectId().toString();

  const task = await Task.create({
    title: "Task to delete",
    owner: userId
  });

  await deleteUserTask(task._id.toString());

  const found = await Task.findById(task._id);

  expect(found).toBeNull();

});

it("should assign default status as pending", async () => {

  const userId = new mongoose.Types.ObjectId().toString();

  const task = await createUserTask(
    { title: "Test Default Status" },
    userId
  );

  expect(task.status).toBe("pending");

});

it("should return tasks only for the requested user", async () => {

  const user1 = new mongoose.Types.ObjectId().toString();
  const user2 = new mongoose.Types.ObjectId().toString();

  await Task.create({ title: "User1 Task", owner: user1 });
  await Task.create({ title: "User2 Task", owner: user2 });

  const tasks = await getUserTasks(user1);

  expect(tasks.length).toBe(1);
  expect(tasks[0].owner.toString()).toBe(user1);

});

it("should return null if task does not exist when updating", async () => {

  const fakeId = new mongoose.Types.ObjectId().toString();

  const updated = await updateUserTask(fakeId, {
    title: "New Title"
  });

  expect(updated).toBeNull();

});

it("should handle deleting a non-existing task", async () => {

  const fakeId = new mongoose.Types.ObjectId().toString();

  const result = await deleteUserTask(fakeId);

  expect(result).toBeNull();

});

it("should remove task from database after deletion", async () => {

  const userId = new mongoose.Types.ObjectId().toString();

  const task = await Task.create({
    title: "Delete Test",
    owner: userId
  });

  await deleteUserTask(task._id.toString());

  const tasks = await Task.find();

  expect(tasks.length).toBe(0);

});


import { Request, Response } from "express";
import {
  getUserTasks,
  createUserTask,
  updateUserTask,
  deleteUserTask
} from "../services/task.service";
import { redisClient } from "../config/redis";

export const getTasks = async (req: any, res: Response) => {

  try {
    const filters = {
      status: req.query.status,
      dueDate: req.query.dueDate
    };

    const cacheKey = `tasks:${req.user.id}:${JSON.stringify(filters)}`;
    const cachedTasks = await redisClient.get(cacheKey);

    if (cachedTasks) {
      return res.json(JSON.parse(cachedTasks));
    }

    const tasks = await getUserTasks(req.user.id, filters);
    await redisClient.set(cacheKey, JSON.stringify(tasks), {
      EX: 60
    });
    res.json(tasks);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const createTask = async (req: any, res: Response) => {

  try {
    const task = await createUserTask(req.body, req.user.id);

    await redisClient.del(`tasks:${req.user.id}`);

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }

};

export const updateTask = async (req: any, res: Response) => {

  try {
    const task = await updateUserTask(req.params.id as string, req.body);

    await redisClient.del(`tasks:${req.user.id}`);

    res.json(task);

  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }

};

export const deleteTask = async (req: any, res: Response) => {

  try {
    await deleteUserTask(req.params.id as string);

    await redisClient.del(`tasks:${req.user.id}`);

    res.json({ message: "Task deleted" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }

};
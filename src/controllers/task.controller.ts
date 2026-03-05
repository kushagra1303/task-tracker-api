import { Request, Response } from "express";
import {
  getUserTasks,
  createUserTask,
  updateUserTask,
  deleteUserTask
} from "../services/task.service";

export const getTasks = async (req: any, res: Response) => {

  try {

    const tasks = await getUserTasks(req.user.id);

    res.json(tasks);

  } catch (error) {

    res.status(500).json({ message: "Failed to fetch tasks" });

  }

};

export const createTask = async (req: any, res: Response) => {

  try {

    const task = await createUserTask(req.body, req.user.id);

    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({ message: "Failed to create task" });

  }

};

export const updateTask = async (req: Request, res: Response) => {

  try {

    const task = await updateUserTask(req.params.id as string, req.body);

    res.json(task);

  } catch (error) {

    res.status(500).json({ message: "Failed to update task" });

  }

};

export const deleteTask = async (req: Request, res: Response) => {

  try {

    await deleteUserTask(req.params.id as string);

    res.json({ message: "Task deleted" });

  } catch (error) {

    res.status(500).json({ message: "Failed to delete task" });

  }

};
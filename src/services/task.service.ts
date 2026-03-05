import Task from "../models/task.model";

export const getUserTasks = async (userId: string) => {
  return await Task.find({ owner: userId });
};

export const createUserTask = async (data: any, userId: string) => {
  return await Task.create({
    ...data,
    owner: userId
  });
};

export const updateUserTask = async (taskId: string, data: any) => {
  return await Task.findByIdAndUpdate(taskId, data, { new: true });
};

export const deleteUserTask = async (taskId: string) => {
  return await Task.findByIdAndDelete(taskId);
};
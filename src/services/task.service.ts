import Task from "../models/task.model";

export const getUserTasks = async (
  userId: string,
  filters: any
) => {
  const query: any = { owner: userId };
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.dueDate) {
    query.dueDate = filters.dueDate;
  }
  return await Task.find(query);
};

export const createUserTask = async (data: any, userId: string) => {
  return await Task.create({
    ...data,
    owner: userId
  });
};

export const updateUserTask = async (taskId: string, data: any) => {
  return await Task.findByIdAndUpdate(taskId, data, { returnDocument: "after" });
};

export const deleteUserTask = async (taskId: string) => {
  return await Task.findByIdAndDelete(taskId);
};
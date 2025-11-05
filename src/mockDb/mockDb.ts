import { User } from '../types/user';

let users: User[] = [];

export const getAllUsers = () => users;

export const getUserById = (id: string) => users.find((u) => u.id === id);

export const createUser = (user: User) => {
  users.push(user);
  return user;
};

export const updateUser = (id: string, update: Partial<User>) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...update };
  return users[index];
};

export const deleteUser = (id: string) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
};

export const syncDB = (newData: User[]) => {
  users = newData;
};

export const getRawDB = () => users;

import { User } from '../types/user';

export interface MemoryDB {
  users: Map<string, User>;
}

export const memoryDB: MemoryDB = {
  users: new Map(),
};

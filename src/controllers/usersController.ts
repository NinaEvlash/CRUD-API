import { IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../mockDb/mockDb';
import { isValidUUID } from '../utils/validateID';
import { User } from '../types/user';
import { randomUUID } from 'crypto';

export async function handleUsers(req: IncomingMessage, res: ServerResponse) {
  const urlParts = req.url?.split('/').filter(Boolean) || [];
  const userId = urlParts[2];

  try {
    if (req.method === 'GET' && req.url === '/api/users') {
      const users = getAllUsers();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
      return;
    }

    if (req.method === 'GET' && userId) {
      if (!isValidUUID(userId)) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'Invalid user ID!' }));
        return;
      }
      const user = getUserById(userId);
      if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'User not found!' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/users') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        const data = JSON.parse(body);
        const { username, age, hobbies } = data;
        if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
          res.writeHead(400);
          res.end(JSON.stringify({ message: 'Missing required fields!' }));
          return;
        }
        const newUser: User = { id: randomUUID(), username, age, hobbies };
        createUser(newUser);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      });
      return;
    }

    if (req.method === 'PUT' && userId) {
      if (!isValidUUID(userId)) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'Invalid user ID!' }));
        return;
      }
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        const data = JSON.parse(body);
        const updated = updateUser(userId, data);
        if (!updated) {
          res.writeHead(404);
          res.end(JSON.stringify({ message: 'User not found!' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updated));
      });
      return;
    }

    if (req.method === 'DELETE' && userId) {
      if (!isValidUUID(userId)) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'Invalid user ID!' }));
        return;
      }
      const deleted = deleteUser(userId);
      if (!deleted) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'User not found!' }));
        return;
      }
      res.writeHead(204);
      res.end();
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Route not found' }));
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ message: 'Internal server error' }));
    console.log(err);
  }
}

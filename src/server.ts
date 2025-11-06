import http from 'http';
import dotenv from 'dotenv';
import { handleUsers } from './controllers/usersController';

dotenv.config();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/api/users')) {
    handleUsers(req, res);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Endpoint not found!' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import http from 'http';
import { PORT as defaultPort } from './utils/config';
import { handleUsers } from './controllers/usersController';

const PORT = Number(process.env.PORT) || defaultPort;

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/api/users')) {
    handleUsers(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint not found!' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, PID: ${process.pid}`);
});

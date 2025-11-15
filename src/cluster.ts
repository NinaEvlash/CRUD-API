import cluster, { Worker } from 'cluster';
import http from 'http';
import os from 'os';
import { PORT } from './utils/config';
import { memoryDB } from './db/memoryDb';
import { User } from './types/user';

const cpuCount = os.cpus().length;
let workers: { id: number; port: number }[] = [];
let current = 0;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} running with ${cpuCount - 1} workers`);

  const users = new Map<string, User>();

  cluster.on('message', (_worker: Worker, message: any) => {
    if (message?.type === 'addUser') {
      users.set(message.payload.id, message.payload);
    }

    if (message?.type === 'updateUser') {
      users.set(message.payload.id, message.payload);
    }

    if (message?.type === 'deleteUser') {
      users.delete(message.payload);
    }

    const allUsers = Array.from(users.values());

    for (const id in cluster.workers) {
      cluster.workers[id]?.send({
        type: 'sync',
        payload: { users: allUsers },
      });
    }
  });

  for (let i = 1; i < cpuCount; i++) {
    const port = PORT + i;
    cluster.fork({ PORT: port });
    workers.push({ id: i, port });
  }

  const balancer = http.createServer((req, res) => {
    const target = workers[current];
    current = (current + 1) % workers.length;

    const options = {
      hostname: 'localhost',
      port: target.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxy.on('error', (err) => {
      console.error(`Proxy error: ${err.message}`);
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Proxy request failed' }));
    });

    req.pipe(proxy, { end: true });
  });

  balancer.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`);
  });
} else {
  process.on('message', (message: unknown) => {
    if (typeof message === 'object' && message !== null && (message as any).type === 'sync') {
      const users = (message as any).payload.users as User[];

      memoryDB.users.clear();
      users.forEach((u) => memoryDB.users.set(u.id, u));
    }
  });

  import('./server');
}

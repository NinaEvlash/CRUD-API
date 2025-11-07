import cluster from 'cluster';
import os from 'os';
import { PORT, NODE_ENV } from './utils/config';

const countCPUs = os.cpus().length;

if (NODE_ENV === 'production') {
  if (cluster.isPrimary) {
    console.log(`Master ${process.pid} running with ${countCPUs} workers`);
    for (let i = 1; i < countCPUs; i += 1) {
      cluster.fork({ PORT: PORT + i });
    }
  } else {
    import('./server');
  }
} else {
  console.log(`Running in development mode on port ${PORT}`);
  import('./server');
}

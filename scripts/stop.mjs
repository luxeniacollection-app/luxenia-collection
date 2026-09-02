import { execSync } from 'child_process';

console.log('Stopping Luxe Nia development servers...');

const ports = [5173, 5174, 5175];

for (const port of ports) {
  try {
    if (process.platform === 'win32') {
      // Find PID on Windows
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
      const lines = output.trim().split('\n');
      const pids = new Set();
      
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5 && parts[1].endsWith(`:${port}`)) {
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && pid !== String(process.pid)) {
            pids.add(pid);
          }
        }
      }

      for (const pid of pids) {
        console.log(`Terminating process on port ${port} (PID: ${pid})...`);
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          console.log(`✓ Successfully stopped PID ${pid}`);
        } catch (e) {
          // Process may have already stopped
        }
      }
    } else {
      // Unix / macOS
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
      console.log(`✓ Stopped server on port ${port}`);
    }
  } catch (e) {
    // No process listening on this port
  }
}

console.log('✓ All Luxe Nia servers stopped.');

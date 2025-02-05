import express from 'express';
import cors from 'cors';
import Docker from 'dockerode';
import { Server } from 'socket.io';


const app = express();
const docker = new Docker();
app.use(cors());
app.use(express.json());

const io = new Server(5001, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.on('code-change', (newCode) => {
    socket.broadcast.emit('code-update', newCode);
  });
});

// Execute code in a Docker container
app.post('/execute', async (req, res) => {
  const { language, code } = req.body;

  try {
    const container = await docker.createContainer({
      Image: 'python:3.9-slim',
      Cmd: ['python', '-c', code],
      Tty: false,
    });

    await container.start();

    // Wait for the container to exit naturally (e.g., after code execution)
    // const timeoutMs = 5000; // Set a timeout (5 seconds)
    await container.wait({ condition: 'not-running' });

    // Get logs
    const logs = await container.logs({ stdout: true, stderr: true });

    // Stop and remove the container
    // await container.stop();
    await container.remove();

    res.json({ output: logs.toString() });
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});
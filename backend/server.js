import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 5001;

const server = app.listen(PORT);

server.on('listening', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    console.error('Run: Get-NetTCPConnection -LocalPort 5001 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }');
  } else {
    console.error('Server failed to start:', err.message);
  }
  process.exit(1);
});

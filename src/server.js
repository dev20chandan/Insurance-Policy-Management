require('dotenv').config();
require('./models'); 
const mongoose = require('mongoose');
const app = require('./app');
const { exec } = require('child_process');
const startMessageCron = require('./services/messageCron');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const CPU_THRESHOLD = process.env.CPU_THRESHOLD || 70;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    startMessageCron()
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let previousCpuUsage = process.cpuUsage();
let previousTime = Date.now();
let lastRestartTime = 0;

setInterval(() => {
  const currentCpuUsage = process.cpuUsage();
  const currentTime = Date.now();

  const userDiff = currentCpuUsage.user - previousCpuUsage.user;
  const systemDiff = currentCpuUsage.system - previousCpuUsage.system;
  const timeDiff = (currentTime - previousTime) * 1000;

  const cpuUsagePercentage =
    ((userDiff + systemDiff) / timeDiff) * 100;

  console.log(`CPU usage approx: ${cpuUsagePercentage.toFixed(2)}%`);

  if (
    cpuUsagePercentage > CPU_THRESHOLD &&
    Date.now() - lastRestartTime > 60000
  ) {
    lastRestartTime = Date.now();
    console.log('CPU usage exceeded threshold. Restarting server...');
    exec('pm2 restart all');
  }

  previousCpuUsage = currentCpuUsage;
  previousTime = currentTime;
}, 5000);


process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  try {
    await server.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});
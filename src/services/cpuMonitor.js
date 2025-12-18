const os = require('os');
const { exec } = require('child_process');

setInterval(() => {
  const cpuUsage = (1 - os.freemem() / os.totalmem()) * 100;

  if (cpuUsage > 70) {
    console.log('CPU exceeded 70%. Restarting...');
    exec('pm2 restart all');
  }
}, 5000);
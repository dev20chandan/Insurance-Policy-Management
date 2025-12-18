const cron = require('node-cron');
const Message = require('../models/Message');

const startMessageCron = () => {
  console.log('Message cron initialized'); // ✅ SHOULD PRINT ON SERVER START

  cron.schedule('* * * * *', async () => {
    console.log('====>>> CRON RUNNING');
    try {
      const now = new Date();

      const pendingMessages = await Message.find({
        scheduledAt: { $lte: now },
        executed: false
      });

      for (const msg of pendingMessages) {
        console.log('Scheduled Message Executed:', msg.message);

        await Message.findByIdAndUpdate(msg._id, {
          executed: true
        });
      }
    } catch (error) {
      console.error('Cron job error:', error.message);
    }
  });
};

module.exports = startMessageCron;

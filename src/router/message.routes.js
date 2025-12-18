const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

/**
 * POST /api/message/schedule
 * Body: { message, day, time }
 * Example:
 * {
 *   "message": "Policy renewal reminder",
 *   "day": "2025-12-20",
 *   "time": "14:30"
 * }
 */
router.post('/schedule', async (req, res) => {
  try {
    const { message, day, time } = req.body;

    if (!message || !day || !time) {
      return res.status(400).json({
        success: false,
        error: 'message, day, and time are required'
      });
    }


    const scheduledAt = new Date(`${day}T${time}:00`);

    if (isNaN(scheduledAt.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date or time format'
      });
    }

    const savedMessage = await Message.create({
      message,
      scheduledAt
    });


    const delay = scheduledAt.getTime() - Date.now();
console.log(delay,'===<delay')
    if (delay > 0) {
      setTimeout(async () => {
        await Message.findByIdAndUpdate(savedMessage._id, {
          executed: true
        });
        console.log('Scheduled Message Executed:', message);
      }, delay);
    }

    res.status(201).json({
      success: true,
      message: 'Message scheduled successfully',
      data: savedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

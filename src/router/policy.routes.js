const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Policy = require('../models/Policy');

router.get('/search', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }

    // Case-insensitive username search
    const user = await User.findOne({
      firstName: { $regex: `^${username}$`, $options: 'i' }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const policies = await Policy.find({ userId: user._id })
      .populate('lobId', 'category_name')
      .populate('companyId', 'company_name')
      .populate('accountId', 'accountName accountType');

    res.status(200).json({
      success: true,
      user: {
        name: user.firstName,
        email: user.email
      },
      totalPolicies: policies.length,
      policies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


router.get('/aggregate', async (req, res) => {
  try {
    const result = await Policy.aggregate([
      {
        $group: {
          _id: '$userId',
          policyCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users', // must match MongoDB collection name
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userName: '$user.firstName',
          email: '$user.email',
          policyCount: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      totalUsers: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


module.exports = router;

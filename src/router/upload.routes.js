const express = require('express');
const { Worker } = require('worker_threads');
const path = require('path');
const fs = require('fs')

const router = express.Router();


router.post('/file', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    const uploadedFile = req.files.file;
    const fileExt = path.extname(uploadedFile.name).toLowerCase();

    if (!['.csv', '.xlsx'].includes(fileExt)) {
      return res.status(400).json({
        error: 'Only CSV or XLSX files are allowed'
      });
    }


    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(
      uploadDir,
      `${Date.now()}_${uploadedFile.name}`
    );

    await uploadedFile.mv(filePath);

    const worker = new Worker(
      path.join(__dirname, '../workers/uploadWorker.js'),
      {
        workerData: { filePath }
      }
    );

    let responded = false;

    worker.on('message', msg => {
      if (!responded) {
        responded = true;
        res.status(200).json({
          message: 'File processed successfully',
          result: msg
        });
      }
    });

    worker.on('error', err => {
      if (!responded) {
        responded = true;
        res.status(500).json({ error: err.message });
      }
    });

    worker.on('exit', code => {
      if (code !== 0 && !responded) {
        responded = true;
        res.status(500).json({
          error: `Worker stopped with exit code ${code}`
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;

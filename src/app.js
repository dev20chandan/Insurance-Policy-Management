// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


const uploadRoutes = require('./router/message.routes');
const policyRoutes = require('./router/policy.routes');
const messageRoutes = require('./router/upload.routes');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// we can use the multer to stream the data for the receiving the chunks and make 
// more efficient and more fast and async proicess cpu use reduce 
app.use(
  fileUpload({
    createParentPath: true
  })
);


app.use('/api/upload', messageRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/message',uploadRoutes );


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

module.exports = app;

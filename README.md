
# 🛡️ Insurance Policy Management System (Node.js + MongoDB)

This project is a Node.js backend application that processes insurance policy data from CSV/XLSX files, stores it in a normalized MongoDB schema, provides search and aggregation APIs, monitors real-time CPU usage, and supports scheduled message execution using cron jobs.

The implementation fulfills all requirements of the technical assessment.


## How to run project
npm install

npm start

npm run dev    // for developnet 

pm2 start src/server.js
## Tech Stack


**Server:** Node.js ,Express.js , MongoDB & Mongoose , Worker Threads , node-cron ,express-fileupload ,PM2 ,dotenv


## 🗄️ Database Design & Collections
The application follows a fully normalized MongoDB schema, where each business entity is stored in a separate collection.

Collections Used

Agent

User

Account (User’s Account)

LOB (Line of Business / Policy Category)

Carrier

Policy

Message
## ⚙️ Environment Variables
Create a .env file:

PORT=3000
MONGO_URI=mongodb://localhost:27017/insurance_db
CPU_THRESHOLD=70

## ✅ Key Highlights
Worker thread–based file processing

 Fully normalized MongoDB schema

 Case-insensitive search API

 Aggregation with pagination & filters

 Cron-based scheduled jobs (restart-safe)

 Real CPU monitoring (not memory-based)

 Graceful shutdown handling
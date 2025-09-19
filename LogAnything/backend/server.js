const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const logsRouter = require('./routes/logs.js');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const aiRouter = require('./routes/ai'); // <- added: AI proxy route

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Serve uploaded files statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at', uploadsDir);
  } catch (e) {
    console.error('Failed to create uploads directory:', e);
  }
}
app.use('/uploads', express.static(uploadsDir));

// Validate required environment variables early
const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
const missing = requiredEnv.filter((k) => !process.env[k] || String(process.env[k]).trim() === '');
if (missing.length) {
  console.error('Missing required env vars:', missing.join(', '));
  process.exit(1);
}

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log('MongoDB database connection established successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Welcome to the LogAnything API!');
});

app.use('/api/logs', logsRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/ai', aiRouter); // <- added: mount AI route

// Debug log to confirm mounting
console.log('Mounted routes: /api/logs, /api/auth, /api/user, /api/ai');

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
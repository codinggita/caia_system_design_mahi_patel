const express = require('express');
const cors = require('cors');
const userRoutes = require('./routers/routes');
const authRoutes = require('./routers/authRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', userRoutes);
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found.' });
});

module.exports = app;
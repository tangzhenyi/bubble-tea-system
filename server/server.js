import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bubble-tea';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes
app.use('/api', apiRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${MONGODB_URI}\n`);
  console.log('📚 API Routes:');
  console.log('  ├─ POST   /api/auth/wechat-login');
  console.log('  ├─ POST   /api/auth/qq-login');
  console.log('  ├─ GET    /api/auth/user');
  console.log('  ├─ PUT    /api/auth/user');
  console.log('  ├─ GET    /api/products/categories');
  console.log('  ├─ GET    /api/products');
  console.log('  ├─ GET    /api/products/:id');
  console.log('  ├─ GET    /api/products/hot');
  console.log('  ├─ GET    /api/cart');
  console.log('  ├─ POST   /api/cart/add');
  console.log('  ├─ PUT    /api/cart/update');
  console.log('  ├─ DELETE /api/cart/remove');
  console.log('  ├─ DELETE /api/cart/clear');
  console.log('  ├─ POST   /api/orders/create');
  console.log('  ├─ GET    /api/orders');
  console.log('  ├─ GET    /api/orders/:id');
  console.log('  ├─ POST   /api/orders/:id/pay');
  console.log('  ├─ POST   /api/orders/:id/cancel');
  console.log('  ├─ GET    /api/orders/stats');
  console.log('  ├─ GET    /api/stores');
  console.log('  ├─ GET    /api/stores/:id');
  console.log('  ├─ GET    /api/stores/hot');
  console.log('  └─ GET    /api/stores/nearby');
  console.log('');
});

export default app;

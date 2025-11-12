import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'cookie-session';
import passport from 'passport';
import cors from 'cors';

import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import googleAuthRoutes from './routes/googleAuthRoutes.js';
import './config/passport.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5000;

// 🟢 Connect MongoDB
connectDB();

const app = express();

// 🟡 CORS setup (important for frontend auth + cookies)
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Local frontend
      'https://lark-tech.onrender.com', // Render frontend
    ],
    credentials: true, // Send cookies with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// 🟣 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🟠 Session middleware (used by Google OAuth)
app.use(
  session({
    name: 'session',
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// 🔵 Passport init (Google OAuth)
app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', googleAuthRoutes);

// 💳 PayPal Config Route
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// 🧱 Static Files (for deployment)
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  // Render's persistent upload directory
  app.use('/uploads', express.static('/var/data/uploads'));
  // React build
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // Serve React app for any route not handled by API
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => res.send('🌐 API is running...'));
}

// 🔴 Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// 🚀 Start Server
app.listen(port, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);

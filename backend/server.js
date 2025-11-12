import dotenv from 'dotenv';
dotenv.config();

console.log("MONGO_URI =", process.env.MONGO_URI);

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


connectDB();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(
  cors({
    origin: [
      'https://lark-tech.onrender.com', 
      'http://localhost:3000',          
    ],
    credentials: true,
  })
);


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', googleAuthRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);


const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => res.send('API is running....'));
}


app.use(notFound);
app.use(errorHandler);


app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);

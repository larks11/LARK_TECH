import express from 'express';
import { googleAuth } from '../controllers/userController.js';

const router = express.Router();

// ✅ This handles Google Login POST request from frontend
router.post('/google', googleAuth);

export default router;

import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Redirect user to Google for login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback after Google authentication
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const user = req.user;

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // 🔥 Set the cookie for frontend
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // required on Render
      sameSite: 'none', // allow cross-origin cookies
    });

    // Redirect back to your deployed frontend
    res.redirect('https://lark-tech.onrender.com');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.clearCookie('jwt');
    res.redirect('/');
  });
});

export default router;

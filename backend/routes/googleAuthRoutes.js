import express from 'express';
import passport from 'passport';

const router = express.Router();

// Redirect user to Google for login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Callback after Google authentication
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
  }),
  (req, res) => {
    // Successful authentication — redirect to frontend home
    res.redirect('http://localhost:3000');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;

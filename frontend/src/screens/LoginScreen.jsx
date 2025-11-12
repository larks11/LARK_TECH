import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useGoogleLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct import
import { motion } from 'framer-motion'; // ✨ Animation

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Google Login handler
  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    try {
      const res = await googleLogin({
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        image: decoded.picture,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center position-relative"
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
        color: '#FFD700',
      }}
    >
      {/* 🎬 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="position-absolute w-100 h-100"
        style={{
          objectFit: 'cover',
          top: 0,
          left: 0,
          zIndex: 0,
          filter: 'brightness(35%)', // Darken for contrast
        }}
      >
        <source src="/videos/login-bg.mp4" type="video/mp4" />
      </video>

      {/* ✨ Fade-in Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: '2.5rem',
          borderRadius: '20px',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
          width: '100%',
          maxWidth: '420px',
          backdropFilter: 'blur(6px)',
        }}
      >
        <FormContainer>
          <h1 className="text-center mb-4">Sign In</h1>

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  backgroundColor: '#111',
                  color: '#FFD700',
                  border: '1px solid #FFD700',
                }}
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  backgroundColor: '#111',
                  color: '#FFD700',
                  border: '1px solid #FFD700',
                }}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="warning"
              className="w-100 fw-bold"
              disabled={isLoading}
            >
              Sign In
            </Button>

            {isLoading && <Loader />}
          </Form>

          <div className="my-4 text-center">
            <hr style={{ borderColor: '#FFD700' }} />
            <p>or</p>
          </div>

          {/* ✅ Google Sign In Button */}
          <GoogleOAuthProvider clientId="28291555489-kcf71fkcffhe0oqink37frfl0a0hdqtq.apps.googleusercontent.com">
            <div className="d-flex justify-content-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
                shape="pill"
                theme="filled_black"
                size="large"
              />
            </div>
          </GoogleOAuthProvider>

          <Row className="py-3">
            <Col className="text-center">
              New Customer?{' '}
              <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                Register
              </Link>
            </Col>
          </Row>
        </FormContainer>
      </motion.div>
    </Container>
  );
};

export default LoginScreen;

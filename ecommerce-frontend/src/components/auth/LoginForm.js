import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Container,
  Alert
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { login, reset } from '../../store/slices/authSlice';
import Loading from '../layout/Loading';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  
  const { username, password, remember } = formData;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isLoading, isAuthenticated, error } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
    return () => {
      dispatch(reset());
    };
  }, [isAuthenticated, navigate, dispatch]);
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'remember' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };
  
  if (isLoading) {
    return <Loading message="Logging in..." />;
  }
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {typeof error === 'object' ? 'Invalid credentials' : error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox 
                color="primary" 
                name="remember" 
                checked={remember}
                onChange={handleChange}
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
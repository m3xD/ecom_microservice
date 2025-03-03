import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Alert
} from '@mui/material';
import { PersonAddOutlined } from '@mui/icons-material';
import { register, reset } from '../../store/slices/authSlice';
import Loading from '../layout/Loading';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const { 
    username, 
    email, 
    password, 
    password2, 
    first_name, 
    last_name, 
    phone, 
    address 
  } = formData;
  
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
  
  const validateForm = () => {
    const errors = {};
    
    if (!username) errors.username = 'Username is required';
    if (!email) errors.email = 'Email is required';
    if (!email.match(/^\S+@\S+\.\S+$/)) errors.email = 'Email is invalid';
    if (!password) errors.password = 'Password is required';
    if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== password2) errors.password2 = 'Passwords do not match';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const userData = {
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      address,
    };
    
    dispatch(register(userData));
  };
  
  if (isLoading) {
    return <Loading message="Creating your account..." />;
  }
  
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {typeof error === 'object' 
              ? 'Registration failed. Please check your information.' 
              : error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="first_name"
                required
                fullWidth
                id="first_name"
                label="First Name"
                value={first_name}
                onChange={handleChange}
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                autoComplete="family-name"
                value={last_name}
                onChange={handleChange}
                error={!!formErrors.last_name}
                helperText={formErrors.last_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={handleChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password"
                id="password2"
                value={password2}
                onChange={handleChange}
                error={!!formErrors.password2}
                helperText={formErrors.password2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                id="phone"
                autoComplete="tel"
                value={phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                id="address"
                autoComplete="street-address"
                multiline
                rows={3}
                value={address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterForm;
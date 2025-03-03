import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Box, Container } from '@mui/material';

const LoginPage = () => {
  return (
    <Container>
      <Box py={4}>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;
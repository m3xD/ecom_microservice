import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { Box, Container } from '@mui/material';

const RegisterPage = () => {
  return (
    <Container>
      <Box py={4}>
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default RegisterPage;
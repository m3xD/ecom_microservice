import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200]
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Our ecommerce platform offers a wide variety of products at competitive prices.
              Shop with confidence and enjoy our excellent customer service.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Customer Service
            </Typography>
            <Link href="#" color="inherit" display="block">Contact Us</Link>
            <Link href="#" color="inherit" display="block">FAQ</Link>
            <Link href="#" color="inherit" display="block">Returns & Refunds</Link>
            <Link href="#" color="inherit" display="block">Shipping Policy</Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Follow Us
            </Typography>
            <Link href="#" color="inherit" display="block">Facebook</Link>
            <Link href="#" color="inherit" display="block">Twitter</Link>
            <Link href="#" color="inherit" display="block">Instagram</Link>
            <Link href="#" color="inherit" display="block">YouTube</Link>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Ecommerce Microservices. All Rights Reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
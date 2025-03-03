import React from 'react';
import ProductList from '../components/products/ProductList';
import { Container, Typography, Box } from '@mui/material';

const ProductsPage = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Products
        </Typography>
        <ProductList />
      </Box>
    </Container>
  );
};

export default ProductsPage;
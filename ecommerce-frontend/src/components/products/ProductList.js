import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Rating,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { getProducts } from '../../store/slices/productSlice';
import { getUserCart, addToCart } from '../../store/slices/cartSlice';
import Loading from '../layout/Loading';

const ProductList = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('name');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { products, isLoading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  
  const itemsPerPage = 9;
  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);

  useEffect(() => {
    dispatch(getProducts({ sort }));
    
    if (user) {
      dispatch(getUserCart(user.id));
    }
  }, [dispatch, sort, user]);
  
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleAddToCart = (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(addToCart({
      cartId: cart?.id,
      productId,
      quantity: 1
    }));
    
    // Refresh cart after adding
    setTimeout(() => dispatch(getUserCart(user.id)), 300);
  };
  
  if (isLoading) {
    return <Loading message="Loading products..." />;
  }
  
  if (error) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button onClick={() => dispatch(getProducts())} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h6">No products found</Typography>
      </Box>
    );
  }
  
  // Get current page products
  const currentProducts = products.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sort}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="name">Name (A-Z)</MenuItem>
            <MenuItem value="-name">Name (Z-A)</MenuItem>
            <MenuItem value="price">Price (Low to High)</MenuItem>
            <MenuItem value="-price">Price (High to Low)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Grid container spacing={4}>
        {currentProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 3
              }
            }}>
              <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.name}
                />
              </Link>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {product.name}
                  </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  height: 60, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical' 
                }}>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Rating value={product.rating || 4} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.review_count || 0})
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${parseFloat(product.price).toFixed(2)}
                </Typography>
                {product.stock > 0 ? (
                  <Typography variant="body2" color="success.main">
                    In Stock ({product.stock})
                  </Typography>
                ) : (
                  <Typography variant="body2" color="error">
                    Out of Stock
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained" 
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock <= 0}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            color="primary" 
            onChange={handlePageChange} 
          />
        </Box>
      )}
    </>
  );
};

export default ProductList;
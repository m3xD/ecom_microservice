import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Add, Remove, Delete, ShoppingBag } from '@mui/icons-material';
import { 
  getUserCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../../store/slices/cartSlice';
import Loading from '../layout/Loading';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { cart, isLoading, error } = useSelector((state) => state.cart);
  
  useEffect(() => {
    if (user) {
      dispatch(getUserCart(user.id));
    } else {
      navigate('/login');
    }
  }, [dispatch, user, navigate]);
  
  const handleUpdateQuantity = (itemId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
      // Refresh cart data after update
      setTimeout(() => dispatch(getUserCart(user.id)), 300);
    }
  };
  
  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
    // Refresh cart data after removal
    setTimeout(() => dispatch(getUserCart(user.id)), 300);
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart(cart.id));
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  if (isLoading) {
    return <Loading message="Loading your cart..." />;
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography color="error" variant="h6" sx={{ textAlign: 'center' }}>
          Error loading cart: {error}
        </Typography>
      </Container>
    );
  }
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any products to your cart yet.
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/products"
            sx={{ mt: 2 }}
          >
            Start Shopping
          </Button>
        </Paper>
      </Container>
    );
  }
  
  // Calculate cart totals
  const cartTotal = cart.items.reduce((total, item) => {
    return total + (parseFloat(item.product_price) * item.quantity);
  }, 0);
  
  const totalItems = cart.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          component="img"
                          src={item.product_image || 'https://via.placeholder.com/50'}
                          alt={item.product_name}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 1,
                            mr: 2
                          }}
                        />
                        <Link to={`/products/${item.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <Typography variant="subtitle1">
                            {item.product_name}
                          </Typography>
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      ${parseFloat(item.product_price).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.quantity}
                          inputProps={{ 
                            readOnly: true,
                            style: { 
                              textAlign: 'center',
                              width: '30px'
                            } 
                          }}
                          variant="standard"
                        />
                        <IconButton 
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      ${(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/products"
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ my: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <Typography variant="body1">
                    Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" align="right">
                    ${cartTotal.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="h6">
                    Total
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="right">
                    ${cartTotal.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              fullWidth
              onClick={handleCheckout}
              sx={{ mt: 2 }}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
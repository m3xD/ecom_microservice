import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { ShoppingBag, AccessTime, CalendarToday } from '@mui/icons-material';
import { getUserOrders } from '../../store/slices/orderSlice';
import Loading from '../layout/Loading';

const OrdersList = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  
  useEffect(() => {
    if (user) {
      dispatch(getUserOrders(user.id));
    }
  }, [dispatch, user]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return <Loading message="Loading your orders..." />;
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography color="error" variant="h6" sx={{ textAlign: 'center' }}>
          Error loading orders: {error}
        </Typography>
      </Container>
    );
  }
  
  if (!orders || orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't placed any orders yet.
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

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {orders.length} {orders.length === 1 ? 'order' : 'orders'}
      </Typography>
      
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" component={Link} to={`/orders/${order.id}`} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                      Order #{order.id.substring(0, 8)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <CalendarToday fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Placed on {formatDate(order.created_at)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <AccessTime fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Last updated: {formatDate(order.updated_at)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                    <Chip 
                      label={order.order_status.toUpperCase()} 
                      color={getStatusColor(order.order_status)}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" color="primary">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.items ? order.items.length : '?'} items
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    component={Link} 
                    to={`/orders/${order.id}`}
                    sx={{ mr: 1 }}
                  >
                    View Details
                  </Button>
                  {order.order_status === 'pending' && (
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                    >
                      Cancel Order
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrdersList;
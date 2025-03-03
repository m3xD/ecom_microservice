import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  Stepper,
  Step,
  StepLabel,
  Typography
} from '@mui/material';
import {
  ArrowBack,
  LocalShipping,
  Payment,
  Receipt
} from '@mui/icons-material';
import { getOrderById, cancelOrder } from '../../store/slices/orderSlice';
import Loading from '../layout/Loading';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { order, isLoading, error } = useSelector((state) => state.orders);
  
  useEffect(() => {
    if (id) {
      dispatch(getOrderById(id));
    }
  }, [dispatch, id]);
  
  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder(id));
    }
  };
  
  const getOrderStep = () => {
    switch (order?.order_status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };
  
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
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return <Loading message="Loading order details..." />;
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography color="error" variant="h6" sx={{ textAlign: 'center' }}>
          Error loading order: {error}
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Order not found
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/orders')}
            sx={{ mt: 2 }}
          >
            Back to Orders
          </Button>
        </Paper>
      </Container>
    );
  }
  
  const orderStep = getOrderStep();

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/orders')}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Order Details
        </Typography>
        <Chip 
          label={order.order_status.toUpperCase()} 
          color={getStatusColor(order.order_status)}
          sx={{ ml: 2 }}
        />
      </Box>
      
      {/* Order ID and Date */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              Order #{order.id.substring(0, 8)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.created_at)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="h6" color="primary">
              Total: ${parseFloat(order.total_amount).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Payment Method: {order.payment_method === 'credit_card' ? 'Credit Card' : 
                order.payment_method === 'paypal' ? 'PayPal' : 'Bank Transfer'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Order Status Tracker */}
      {order.order_status !== 'cancelled' && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Order Status
          </Typography>
          <Stepper activeStep={orderStep} sx={{ mt: 2 }}>
            <Step>
              <StepLabel>Order Placed</StepLabel>
            </Step>
            <Step>
              <StepLabel>Processing</StepLabel>
            </Step>
            <Step>
              <StepLabel>Shipped</StepLabel>
            </Step>
            <Step>
              <StepLabel>Delivered</StepLabel>
            </Step>
          </Stepper>
          {order.order_status === 'pending' && (
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleCancelOrder}
              >
                Cancel Order
              </Button>
            </Box>
          )}
        </Paper>
      )}
      
      {/* Order Items */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {order.items && order.items.map((item, index) => (
          <Box key={index}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={2} sm={1}>
                <Box
                  component="img"
                  src={item.product_image || 'https://via.placeholder.com/50'}
                  alt={item.product_name}
                  sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={6} sm={7}>
                <Typography variant="subtitle1">
                  {item.product_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Qty: {item.quantity}
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4} sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1">
                  ${parseFloat(item.price).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            {index < order.items.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
        
        <Divider sx={{ my: 2 }} />
        
        {/* Order Summary */}
        <Grid container>
          <Grid item xs={12} sm={6}></Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ pl: { sm: 2 } }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body1">Subtotal:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body1">
                    ${(parseFloat(order.total_amount) * 0.9).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Shipping:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body1">
                    $10.00
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Tax:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body1">
                    ${(parseFloat(order.total_amount) * 0.1 - 10).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Total:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="primary">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Shipping and Payment Info */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShipping sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Shipping Information</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph>
                {order.shipping_address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Method: {order.shipping_method || 'Standard Shipping'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Payment sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Payment Information</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                Method: {order.payment_method === 'credit_card' ? 'Credit Card' : 
                  order.payment_method === 'paypal' ? 'PayPal' : 'Bank Transfer'}
              </Typography>
              <Typography variant="body1">
                Status: {order.payment_status || 'Paid'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail;
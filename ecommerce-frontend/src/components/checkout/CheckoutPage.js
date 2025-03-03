import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Alert
} from '@mui/material';
import { getUserCart } from '../../store/slices/cartSlice';
import { createOrder } from '../../store/slices/orderSlice';
import Loading from '../layout/Loading';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { cart, isLoading: isCartLoading } = useSelector((state) => state.cart);
  const { isLoading: isOrderLoading, order, success, error } = useSelector((state) => state.orders);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(getUserCart(user.id));
    
    if (user.first_name && user.last_name) {
      setShippingDetails(prev => ({
        ...prev,
        fullName: `${user.first_name} ${user.last_name}`,
        address: user.address || '',
        phone: user.phone || ''
      }));
    }
  }, [dispatch, user, navigate]);
  
  useEffect(() => {
    if (success && order) {
      navigate(`/orders/${order.id}`);
    }
  }, [success, order, navigate]);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({
      ...shippingDetails,
      [name]: value
    });
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: value
    });
  };
  
  const handlePlaceOrder = () => {
    const orderData = {
      user_id: user.id,
      shipping_address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.zipCode}, ${shippingDetails.country}`,
      shipping_method: 'standard',
      payment_method: paymentMethod
    };
    
    dispatch(createOrder(orderData));
  };
  
  if (isCartLoading || isOrderLoading) {
    return <Loading message="Processing your order..." />;
  }
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="info">
          Your cart is empty. Please add some products before checkout.
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Browse Products
        </Button>
      </Container>
    );
  }
  
  // Calculate cart totals
  const cartTotal = cart.items.reduce((total, item) => {
    return total + (parseFloat(item.product_price) * item.quantity);
  }, 0);
  
  const shippingCost = 10.00; // Example shipping cost
  const taxRate = 0.07; // Example tax rate (7%)
  const taxAmount = cartTotal * taxRate;
  const orderTotal = cartTotal + shippingCost + taxAmount;
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="fullName"
                name="fullName"
                label="Full name"
                fullWidth
                autoComplete="name"
                value={shippingDetails.fullName}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="address"
                name="address"
                label="Address"
                fullWidth
                autoComplete="shipping address-line1"
                value={shippingDetails.address}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="city"
                name="city"
                label="City"
                fullWidth
                autoComplete="shipping address-level2"
                value={shippingDetails.city}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="state"
                name="state"
                label="State/Province/Region"
                fullWidth
                value={shippingDetails.state}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="zipCode"
                name="zipCode"
                label="Zip / Postal code"
                fullWidth
                autoComplete="shipping postal-code"
                value={shippingDetails.zipCode}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="country"
                name="country"
                label="Country"
                fullWidth
                autoComplete="shipping country"
                value={shippingDetails.country}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="phone"
                name="phone"
                label="Phone Number"
                fullWidth
                autoComplete="tel"
                value={shippingDetails.phone}
                onChange={handleShippingChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <>
            <FormControl component="fieldset">
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel value="credit_card" control={<Radio />} label="Credit Card" />
                <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                <FormControlLabel value="bank_transfer" control={<Radio />} label="Bank Transfer" />
              </RadioGroup>
            </FormControl>
            
            {paymentMethod === 'credit_card' && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="cardNumber"
                      name="cardNumber"
                      label="Card number"
                      fullWidth
                      autoComplete="cc-number"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentDetailsChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="nameOnCard"
                      name="nameOnCard"
                      label="Name on card"
                      fullWidth
                      autoComplete="cc-name"
                      value={paymentDetails.nameOnCard}
                      onChange={handlePaymentDetailsChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="expiryDate"
                      name="expiryDate"
                      label="Expiry date (MM/YY)"
                      fullWidth
                      autoComplete="cc-exp"
                      value={paymentDetails.expiryDate}
                      onChange={handlePaymentDetailsChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="cvv"
                      name="cvv"
                      label="CVV"
                      helperText="Last three digits on signature strip"
                      fullWidth
                      autoComplete="cc-csc"
                      value={paymentDetails.cvv}
                      onChange={handlePaymentDetailsChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Order summary
            </Typography>
            <Grid container spacing={2}>
              {cart.items.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        component="img"
                        sx={{ width: 50, height: 50, mr: 2, objectFit: 'cover' }}
                        src={item.product_image || 'https://via.placeholder.com/50'}
                        alt={item.product_name}
                      />
                      <Box>
                        <Typography variant="body1">
                          {item.product_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1">
                      ${(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body1">Subtotal</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="right">
                  ${cartTotal.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Shipping</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="right">
                  ${shippingCost.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Tax</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="right">
                  ${taxAmount.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Total</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" align="right">
                  ${orderTotal.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Shipping
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {shippingDetails.fullName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}, {shippingDetails.country}
                </Typography>
                <Typography variant="body1">
                  {shippingDetails.phone}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Payment details
                </Typography>
                <Typography variant="body1">
                  {paymentMethod === 'credit_card' ? 'Credit Card' : 
                   paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'}
                </Typography>
                {paymentMethod === 'credit_card' && (
                  <Typography variant="body1">
                    Card ending in {paymentDetails.cardNumber.slice(-4)}
                  </Typography>
                )}
              </Grid>
            </Grid>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 8 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handlePlaceOrder}
              >
                Place order
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </React.Fragment>
      </Paper>
    </Container>
  );
};

export default CheckoutPage;
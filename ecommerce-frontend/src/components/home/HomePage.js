import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Typography,
  Slide,
  styled
} from '@mui/material';
import { ShoppingCart, TrendingUp, Star, LocalShipping } from '@mui/icons-material';
import { getProducts, getCategories } from '../../store/slices/productSlice';

const VisuallyHiddenText = styled('span')({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
});

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.common.white,
  marginBottom: theme.spacing(6),
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  height: '400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, categories } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(getProducts({ limit: 6 }));
    dispatch(getCategories());
  }, [dispatch]);
  
  // Featured products - get first 4 products
  const featuredProducts = products?.slice(0, 4) || [];
  
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <HeroSection
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random/1200x400/?shopping)'
        }}
      >
        <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={1000}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 4,
              textAlign: 'center'
            }}
          >
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Shop the Latest Products
            </Typography>
            <Typography variant="h5" color="inherit" paragraph sx={{ maxWidth: 600 }}>
              Discover amazing deals on our most popular items and get free shipping on all orders over $50
            </Typography>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
            >
              Shop Now
            </Button>
          </Box>
        </Slide>
      </HeroSection>
      
      {/* Features Section */}
      <Box sx={{ my: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <LocalShipping sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Free Shipping
              </Typography>
              <Typography variant="body2" color="text.secondary">
                On all orders over $50
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <ShoppingCart sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Easy Returns
              </Typography>
              <Typography variant="body2" color="text.secondary">
                30-day return policy
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Secure Checkout
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Safe & protected payment
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Star sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Quality Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Handpicked items for you
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Featured Products Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h2">
            Featured Products
          </Typography>
          <Button component={Link} to="/products" variant="outlined">
            View All
          </Button>
        </Box>
        
        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea component={Link} to={`/products/${product.id}`}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image || 'https://via.placeholder.com/300x180?text=No+Image'}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: 40, overflow: 'hidden' }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${parseFloat(product.price).toFixed(2)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Categories Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
          Shop By Category
        </Typography>
        
        <Grid container spacing={2}>
          {categories?.slice(0, 6).map((category) => (
            <Grid item key={category.id} xs={6} sm={4} md={2}>
              <Card 
                component={Link} 
                to={`/categories/${category.id}`} 
                sx={{ 
                  textDecoration: 'none',
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" component="div">
                    {category.name}
                  </Typography>
                  <VisuallyHiddenText>Shop {category.name}</VisuallyHiddenText>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Call to Action */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          backgroundImage: 'linear-gradient(135deg, #5c6bc0 0%, #3949ab 100%)',
          color: 'white',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Join Our Newsletter
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          Subscribe to stay updated with our latest offers, newest products and exclusive deals.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link}
          to="#"
        >          variant="contained"
        color="secondary"
        size="large"
        component={Link}
        to="#"
      
        Subscribe Now
      </Button>
    </Paper>
  </Container>
);
};

export default HomePage;
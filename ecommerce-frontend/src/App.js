import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { 
  HomePage, 
  ProductsPage, 
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  OrdersList,
  OrderDetail,
  ProfilePage,
  LoginPage,
  RegisterPage, 
  NotFound 
} from './pages';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { getUserCart } from './store/slices/cartSlice';
import RequireAuth from './components/auth/RequireAuth';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 1,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getUserCart(user.id));
    }
  }, [dispatch, user]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header />
          <main style={{ minHeight: 'calc(100vh - 64px - 200px)', marginTop: '20px', marginBottom: '40px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/categories/:id" element={<ProductsPage />} />
              <Route path="/search" element={<ProductsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route 
                path="/cart" 
                element={
                  <RequireAuth>
                    <CartPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <RequireAuth>
                    <CheckoutPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <RequireAuth>
                    <OrdersList />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/orders/:id" 
                element={
                  <RequireAuth>
                    <OrderDetail />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
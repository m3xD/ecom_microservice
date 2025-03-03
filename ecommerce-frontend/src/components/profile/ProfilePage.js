import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  Tabs,
  Tab,
  Avatar
} from '@mui/material';
import { Person, Edit, Save } from '@mui/icons-material';
import authService from '../../services/authService';
import Loading from '../layout/Loading';

const ProfilePage = () => {
  const [value, setValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getProfile();
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user profile');
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await authService.updateProfile(userData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      setError('Failed to update profile');
      setLoading(false);
    }
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form when canceling edit
      authService.getProfile().then(response => {
        setUserData(response.data);
      });
    }
  };
  
  if (loading) {
    return <Loading message="Loading profile..." />;
  }
  
  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Account
      </Typography>
      
      <Paper sx={{ p: 0 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Profile" />
          <Tab label="Address" />
          <Tab label="Preferences" />
        </Tabs>
        <Divider />
        
        {/* Profile Tab */}
        {value === 0 && (
          <Box sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: 60
                  }}
                >
                  {userData.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Typography variant="h6">{userData.username}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since: {new Date(userData.date_joined).toLocaleDateString()}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button
                    startIcon={isEditing ? <Save /> : <Edit />}
                    variant={isEditing ? 'contained' : 'outlined'}
                    onClick={isEditing ? handleUpdateProfile : handleEditToggle}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      onClick={handleEditToggle}
                      sx={{ ml: 1 }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={userData.first_name || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={userData.last_name || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={userData.email || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={userData.phone || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Address Tab */}
        {value === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={userData.address || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={userData.city || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={userData.state || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postal_code"
                  value={userData.postal_code || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={userData.country || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              {isEditing && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleUpdateProfile}
                    sx={{ mr: 1 }}
                  >
                    Save Changes
                  </Button>
                  <Button variant="outlined" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                </>
              )}
              {!isEditing && (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEditToggle}
                >
                  Edit Address
                </Button>
              )}
            </Box>
          </Box>
        )}
        
        {/* Preferences Tab */}
        {value === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Coming soon - notification preferences will be available in a future update.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Privacy Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Coming soon - privacy settings will be available in a future update.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
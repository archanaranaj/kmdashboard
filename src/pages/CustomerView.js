import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PeopleAlt as CustomerIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  Update as UpdateIcon,
  Person as PersonIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function CustomerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${BASE_URL}/api/customers/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Customer not found');
        }
        throw new Error(`Failed to fetch customer: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Customer API Response:', result);
      
      if (result.status_code === 200 && result.data) {
        setCustomer(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch customer details');
      }
      
    } catch (error) {
      console.error('❌ Error fetching customer:', error);
      setError(error.message);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleEdit = () => {
    navigate(`/customers/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${customer?.customer_name}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`${BASE_URL}/api/customers/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          navigate('/customers');
        } else {
          const result = await response.json();
          alert(result.message || 'Failed to delete customer');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer');
      }
    }
  };

  const handleBack = () => {
    navigate('/customers');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading customer details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
        >
          Back to Customers
        </Button>
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Customer not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
        >
          Back to Customers
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 3 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            component="button"
            variant="body2"
            onClick={handleBack}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <CustomerIcon sx={{ mr: 0.5 }} fontSize="small" />
            Customers
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 0.5 }} fontSize="small" />
            {customer.customer_name}
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
              👤 Customer Details
            </Typography>
            <Typography variant="body1" color="textSecondary">
              View complete information for {customer.customer_name}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ backgroundColor: '#1976d2' }}
            >
              Edit Customer
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ backgroundColor: '#d32f2f' }}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Customer Information Card */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Customer Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Customer Name"
                          secondary={
                            <Typography variant="body1" fontWeight="medium" color="text.primary">
                              {customer.customer_name}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PhoneIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Phone Number"
                          secondary={
                            <Typography variant="body1" fontWeight="medium" color="text.primary">
                              {customer.customer_phone || 'Not provided'}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email Address"
                          secondary={
                            <Typography variant="body1" fontWeight="medium" color="text.primary">
                              {customer.customer_email || 'Not provided'}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <HomeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Customer ID"
                          secondary={
                            <Chip
                              label={`CUST-${customer.customer_id?.toString().padStart(4, '0')}`}
                              color="primary"
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Address Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 1 }} />
                  Address Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {customer.customer_address ? (
                  <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#fafafa' }}>
                    <Typography variant="body1">
                      {customer.customer_address}
                    </Typography>
                  </Paper>
                ) : (
                  <Typography variant="body1" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                    No address provided
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Timeline & Metadata Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <DateIcon sx={{ mr: 1 }} />
                  Timeline
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <DateIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Created On"
                      secondary={
                        <Typography variant="body2" color="text.primary">
                          {formatDate(customer.created_at)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <UpdateIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Updated"
                      secondary={
                        <Typography variant="body2" color="text.primary">
                          {formatDate(customer.updated_at)}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    fullWidth
                  >
                    Edit Customer
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CustomerIcon />}
                    onClick={() => navigate(`/job-cards?customer=${customer.customer_id}`)}
                    fullWidth
                  >
                    View Job Cards
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    fullWidth
                  >
                    Delete Customer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Customer ID Display */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Customer ID: <strong>CUST-{customer.customer_id?.toString().padStart(4, '0')}</strong>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default CustomerView;
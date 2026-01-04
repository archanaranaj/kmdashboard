import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link,
  InputAdornment
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PeopleAlt as CustomerIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    customer_name: Yup.string()
      .required('Customer name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    customer_email: Yup.string()
      .email('Invalid email address')
      .nullable()
      .transform((value) => value === '' ? null : value),
    customer_phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[\+]?[0-9\s\-\(\)]+$/, 'Invalid phone number')
      .min(8, 'Phone number must be at least 8 digits')
      .max(20, 'Phone number must be less than 20 digits'),
    customer_address: Yup.string()
      .max(500, 'Address must be less than 500 characters')
      .nullable()
      .transform((value) => value === '' ? null : value),
  });

  // Formik form
  const formik = useFormik({
    initialValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      customer_address: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');

        const url = id 
          ? `${BASE_URL}/api/customers/${id}`
          : `${BASE_URL}/api/customers`;
        
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();
        
        if (response.ok) {
          setSuccess(id ? 'Customer updated successfully!' : 'Customer created successfully!');
          setSnackbarOpen(true);
          
          // Redirect after success
          setTimeout(() => {
            if (id) {
              navigate(`/customers/view/${id}`);
            } else {
              navigate('/customers');
            }
          }, 1500);
        } else {
          throw new Error(result.message || `Failed to ${id ? 'update' : 'create'} customer`);
        }
      } catch (error) {
        console.error('❌ Error saving customer:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch customer data if editing
  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        setFetching(true);
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
        
        if (result.status_code === 200 && result.data) {
          // Set form values with fetched data
          formik.setValues({
            customer_name: result.data.customer_name || '',
            customer_email: result.data.customer_email || '',
            customer_phone: result.data.customer_phone || '',
            customer_address: result.data.customer_address || ''
          });
        } else {
          throw new Error(result.message || 'Failed to fetch customer details');
        }
        
      } catch (error) {
        console.error('❌ Error fetching customer:', error);
        setError(error.message);
      } finally {
        setFetching(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleBack = () => {
    if (id) {
      navigate(`/customers/view/${id}`);
    } else {
      navigate('/customers');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading customer data...
        </Typography>
      </Box>
    );
  }

  const isEditMode = !!id;
  const pageTitle = isEditMode ? 'Edit Customer' : 'Add New Customer';
  const submitButtonText = isEditMode ? 'Update Customer' : 'Create Customer';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 3 }}>
      <Container maxWidth="md">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/customers')}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <CustomerIcon sx={{ mr: 0.5 }} fontSize="small" />
            Customers
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 0.5 }} fontSize="small" />
            {pageTitle}
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
              {isEditMode ? '✏️ Edit Customer' : '👤 Add New Customer'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {isEditMode 
                ? 'Update customer information' 
                : 'Fill in the details to create a new customer'}
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleBack}
          >
            Back
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                {/* Customer Name */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="customer_name"
                    name="customer_name"
                    label="Customer Name *"
                    value={formik.values.customer_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.customer_name && Boolean(formik.errors.customer_name)}
                    helperText={formik.touched.customer_name && formik.errors.customer_name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                    variant="outlined"
                  />
                </Grid>

                {/* Email and Phone */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="customer_email"
                    name="customer_email"
                    label="Email Address"
                    type="email"
                    value={formik.values.customer_email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.customer_email && Boolean(formik.errors.customer_email)}
                    helperText={formik.touched.customer_email && formik.errors.customer_email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                    variant="outlined"
                    placeholder="john@example.com"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="customer_phone"
                    name="customer_phone"
                    label="Phone Number *"
                    value={formik.values.customer_phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.customer_phone && Boolean(formik.errors.customer_phone)}
                    helperText={formik.touched.customer_phone && formik.errors.customer_phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                    variant="outlined"
                    placeholder="+971500000000"
                  />
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="customer_address"
                    name="customer_address"
                    label="Address"
                    multiline
                    rows={3}
                    value={formik.values.customer_address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.customer_address && Boolean(formik.errors.customer_address)}
                    helperText={formik.touched.customer_address && formik.errors.customer_address}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                    variant="outlined"
                    placeholder="Enter complete address..."
                  />
                </Grid>

                {/* Form Actions */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleBack}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading || !formik.isValid || !formik.dirty}
                      sx={{
                        backgroundColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#1565c0',
                        },
                        minWidth: 180,
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                          {isEditMode ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        submitButtonText
                      )}
                    </Button>
                  </Box>
                </Grid>

                {/* Required Fields Note */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                    * Required fields
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {/* Preview Card (only in create mode) */}
        {!isEditMode && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Name:</Typography>
                  <Typography variant="body1">{formik.values.customer_name || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Email:</Typography>
                  <Typography variant="body1">{formik.values.customer_email || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Phone:</Typography>
                  <Typography variant="body1">{formik.values.customer_phone || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Address:</Typography>
                  <Typography variant="body1" sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontStyle: formik.values.customer_address ? 'normal' : 'italic'
                  }}>
                    {formik.values.customer_address || 'Not provided'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CustomerForm;
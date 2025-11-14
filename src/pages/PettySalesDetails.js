import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Divider,
  Chip,
  Container,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  AttachFile as AttachFileIcon,
  CalendarToday as CalendarIcon,
  AccountBalanceWallet as WalletIcon,
  Description as DescriptionIcon,
  LocalAtm as LocalAtmIcon,
  CarRepair as CarRepairIcon,
  PointOfSale as SalesIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PettySalesDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [pettySales, setPettySales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Check if current user is from accounts department
  const isAccountsDept = user?.role === 'accounts';

  // Fetch petty sales details from API
  useEffect(() => {
    const fetchPettySales = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('🔍 Fetching petty sales details...');
        
        const response = await fetch(`${BASE_URL}/api/cash/sales/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If single entry endpoint doesn't work, try fetching from list
          console.log('❌ Single entry endpoint failed, trying list endpoint...');
          await fetchFromList();
          return;
        }

        const result = await response.json();
        console.log('✅ Petty sales entry fetched:', result);
        
        if (result.status && result.data) {
          setPettySales(result.data);
        } else {
          throw new Error('Sales entry not found');
        }
        
      } catch (error) {
        console.error('❌ Error fetching petty sales:', error);
        setError(error.message || 'Failed to fetch sales details');
      } finally {
        setLoading(false);
      }
    };

    const fetchFromList = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/cash/sales`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch sales list: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Sales list fetched:', result);
        
        if (result.status && Array.isArray(result.data)) {
          // Find the specific sales entry by ID
          const foundEntry = result.data.find(entry => entry.id == id);
          
          if (foundEntry) {
            console.log('✅ Sales entry found:', foundEntry);
            setPettySales(foundEntry);
          } else {
            throw new Error(`Sales entry with ID ${id} not found in the list`);
          }
        } else {
          throw new Error('Invalid response format from sales API');
        }
      } catch (error) {
        console.error('❌ Error fetching from list:', error);
        setError(error.message || 'Failed to fetch sales details');
      }
    };

    if (id) {
      fetchPettySales();
    } else {
      setError('No sales ID provided');
      setLoading(false);
    }
  }, [id, token, BASE_URL]);

  // Handle delete sales entry
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      const response = await fetch(`${BASE_URL}/api/cash/sales/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Sales entry deleted:', result);
        
        // Navigate back to job cards
        navigate('/job-cards');
      } else {
        throw new Error('Delete endpoint not available. Please contact administrator.');
      }
      
    } catch (error) {
      console.error('❌ Error deleting sales entry:', error);
      alert(error.message || 'Failed to delete sales entry');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
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
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusDisplay = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleDownloadFile = () => {
    if (pettySales?.file_url) {
      window.open(pettySales.file_url, '_blank');
    } else if (pettySales?.file) {
      window.open(pettySales.file, '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading sales details...
        </Typography>
      </Box>
    );
  }

  if (error || !pettySales) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/job-cards')}>
          Back to Job Cards
        </Button>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Sales entry not found'}
        </Alert>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Sales ID: {id}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header with Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate(-1)}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
              Sales Entry Details
            </Typography>
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isAccountsDept && (
              <>
                <Button 
                  startIcon={<EditIcon />}
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/petty-sales/edit/${pettySales.id}`)}
                >
                  Edit
                </Button>
                <Button 
                  startIcon={<DeleteIcon />}
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Side - Main Sales Information */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                {/* Sales Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                      {formatCurrency(pettySales.amount)}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      Sales Entry #S-{pettySales.id?.toString().padStart(4, '0') || 'N/A'}
                    </Typography>
                    <Chip 
                      label={getStatusDisplay(pettySales.status)} 
                      color={getStatusColor(pettySales.status)}
                      size="medium"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <SalesIcon sx={{ fontSize: 60, color: 'secondary.main', opacity: 0.7 }} />
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Primary Information Grid */}
                <Grid container spacing={4}>
                  {/* Transaction Details */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: '#49a3f1', color: 'white' }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        💰 Sales Details
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <WalletIcon sx={{ mr: 1, fontSize: 20 }} />
                          <strong>Amount:</strong> {formatCurrency(pettySales.amount)}
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocalAtmIcon sx={{ mr: 1, fontSize: 20 }} />
                          <strong>Payment Mode:</strong> {pettySales.mode_of_payment || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <ReceiptIcon sx={{ mr: 1, fontSize: 20 }} />
                          <strong>Transaction #:</strong> {pettySales.transaction_number || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ mr: 1, fontSize: 20 }} />
                          <strong>Date:</strong> {formatDate(pettySales.created_at)}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Job Card Information */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: '#ee358bff', color: 'white' }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        🚗 Related Job Card
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <CarRepairIcon sx={{ mr: 1, fontSize: 20 }} />
                          <strong>Vehicle Number:</strong> {pettySales.vehicle_number || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocalAtmIcon sx={{ mr: 1, fontSize: 20 }} />
                          <strong>Job Card Number:</strong> {pettySales.job_card_number || 'N/A'}
                        </Typography>
                        {pettySales.job_card_id && (
                          <Button 
                            variant="outlined" 
                            size="small" 
                            sx={{ 
                              mt: 1, 
                              color: 'white', 
                              borderColor: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)'
                              }
                            }}
                            onClick={() => navigate(`/job-cards/${pettySales.job_card_id}`)}
                          >
                            View Job Card
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Additional Details */}
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, backgroundColor: 'grey.100' }}>
                      <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                        📋 Additional Information
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <LocalAtmIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Payment Details" 
                              secondary={
                                <Box>
                                  <Typography variant="body2">
                                    <strong>Mode:</strong> {pettySales.mode_of_payment}
                                  </Typography>
                                  {pettySales.transaction_number && (
                                    <Typography variant="body2">
                                      <strong>Transaction #:</strong> {pettySales.transaction_number}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                          
                          {(pettySales.file_url || pettySales.file) && (
                            <ListItem>
                              <ListItemIcon>
                                <AttachFileIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Attached File" 
                                secondary={
                                  <Button 
                                    startIcon={<AttachFileIcon />}
                                    onClick={handleDownloadFile}
                                    variant="outlined"
                                    size="small"
                                  >
                                    Download File
                                  </Button>
                                }
                              />
                            </ListItem>
                          )}
                        </List>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Timeline */}
                <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f1d32bff' }}>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                    📅 Transaction Timeline
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Entry Created" 
                          secondary={formatDate(pettySales.created_at)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Last Updated" 
                          secondary={formatDate(pettySales.updated_at)}
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side - Actions and Additional Info */}
          <Grid item xs={12} lg={4}>
            {/* Status Card */}
            <Card sx={{ mb: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  📊 Status Information
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Chip 
                    label={getStatusDisplay(pettySales.status)} 
                    color={getStatusColor(pettySales.status)}
                    size="large"
                    sx={{ fontSize: '1.2rem', px: 3, py: 2 }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Current status of this sales entry
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card sx={{ mb: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  ⚡ Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/petty-sales/edit/${pettySales.id}`)}
                    disabled={!isAccountsDept}
                    fullWidth
                  >
                    Edit Entry
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    startIcon={<ReceiptIcon />}
                    onClick={() => window.print()}
                    fullWidth
                  >
                    Print Receipt
                  </Button>
                  
                  {pettySales.vehicle_number && (
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => {
                        // Navigate to job cards and filter by vehicle number
                        navigate('/job-cards', { state: { filterVehicle: pettySales.vehicle_number } });
                      }}
                      fullWidth
                    >
                      View Related Job Cards
                    </Button>
                  )}
                  
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/job-cards')}
                    fullWidth
                  >
                    Back to Job Cards
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card sx={{ boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  🔧 System Information
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Sales ID:</strong> {pettySales.id || 'N/A'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Vehicle Number:</strong> {pettySales.vehicle_number || 'N/A'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Job Card Number:</strong> {pettySales.job_card_number || 'N/A'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Payment Mode:</strong> {pettySales.mode_of_payment || 'N/A'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Created:</strong> {formatDate(pettySales.created_at)}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Last Updated:</strong> {formatDate(pettySales.updated_at)}
                  </Typography>
                  {pettySales.created_by && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Created By:</strong> User #{pettySales.created_by}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* File Attachment Card */}
            {(pettySales.file_url || pettySales.file) && (
              <Card sx={{ mt: 3, boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                    📎 Attached File
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <AttachFileIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" gutterBottom>
                      Document attached to this entry
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<AttachFileIcon />}
                      onClick={handleDownloadFile}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Download File
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
              Confirm Deletion
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete this sales entry?
            </Typography>
            <Alert severity="warning" sx={{ mt: 2 }}>
              <strong>Warning:</strong> This action cannot be undone. The sales entry for{' '}
              <strong>{formatCurrency(pettySales.amount)}</strong> will be permanently deleted.
            </Alert>
            <Alert severity="info" sx={{ mt: 1 }}>
              <strong>Note:</strong> If delete fails, the DELETE endpoint might not be implemented yet.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="contained" 
              color="error"
              disabled={deleteLoading}
              startIcon={deleteLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Entry'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default PettySalesDetails;
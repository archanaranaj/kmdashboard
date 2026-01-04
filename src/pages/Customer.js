import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PeopleAlt as CustomerIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Customer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Parse URL search parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlPage = searchParams.get('page');
    const urlLimit = searchParams.get('limit');
    const urlSearch = searchParams.get('search');

    if (urlPage) setPage(parseInt(urlPage) - 1);
    if (urlLimit) setRowsPerPage(parseInt(urlLimit));
    if (urlSearch) setSearchTerm(urlSearch);
  }, [location.search]);

  // Fetch customers data from API
  const fetchCustomers = async (searchQuery = '') => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString()
      });

      const finalSearchQuery = searchQuery || searchTerm;
      if (finalSearchQuery.trim()) {
        params.append('search', finalSearchQuery.trim());
      }

      updateURL(finalSearchQuery);

      console.log('🔍 Fetching customers with params:', params.toString());

      const response = await fetch(`${BASE_URL}/api/customers?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Customers API Response:', result);
      
      if (result.status_code === 200 && result.data) {
        setCustomers(result.data || []);
        setTotalCount(result.data.length || 0);
      } else {
        throw new Error(result.message || 'Failed to fetch customers');
      }
      
    } catch (error) {
      console.error('❌ Error fetching customers:', error);
      setError(error.message || 'Failed to fetch customers data');
      setCustomers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Update URL with current search parameters
  const updateURL = (currentSearchTerm = '') => {
    const params = new URLSearchParams();
    params.append('page', (page + 1).toString());
    params.append('limit', rowsPerPage.toString());
    
    const searchValue = currentSearchTerm || searchTerm;
    if (searchValue.trim()) {
      params.append('search', searchValue.trim());
    }

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Effect to fetch customers when page or rowsPerPage changes
  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage]);

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      setPage(0);
      fetchCustomers(value);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  // Handle manual search button click
  const handleSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setPage(0);
    fetchCustomers();
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    navigate(location.pathname, { replace: true });
    fetchCustomers('');
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleViewCustomer = (id) => {
    navigate(`/customers/view/${id}`);
  };

  const handleEditCustomer = (id) => {
    navigate(`/customers/edit/${id}`);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/api/customers/${customerToDelete.customer_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh the list
        fetchCustomers();
        setDeleteDialogOpen(false);
        setCustomerToDelete(null);
      } else {
        const result = await response.json();
        alert(result.message || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
    }
  };

  const handleCreateNew = () => {
    navigate('/customers/add');
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  if (loading && customers.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading customers data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
              👥 Customer Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage all customer information and details
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => fetchCustomers()}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
            >
              Add New Customer
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#e3f2fd', color: 'blue' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Customers
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalCount}
                </Typography>
                <Typography variant="body2">
                  {searchTerm && 'Filtered results'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#e8f5e8', color: 'green' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  With Email
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {customers.filter(c => c.customer_email).length}
                </Typography>
                <Typography variant="body2">
                  Registered customers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#fff3e0', color: 'orange' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {customers.length}
                </Typography>
                <Typography variant="body2">
                  Current page
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#f3e5f5', color: 'purple' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {customers.filter(c => {
                    const createdDate = new Date(c.created_at);
                    const today = new Date();
                    const diffTime = Math.abs(today - createdDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 7;
                  }).length}
                </Typography>
                <Typography variant="body2">
                  Last 7 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by name, email, or phone number..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              sx={{ minWidth: 400 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      ×
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {searchTerm && (
              <Typography variant="body2" color="textSecondary">
                Showing results for: "{searchTerm}"
              </Typography>
            )}
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Customers Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Customer ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Contact</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Address</strong></TableCell>
                  <TableCell><strong>Created Date</strong></TableCell>
                  <TableCell><strong>Updated Date</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CustomerIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="h6" color="textSecondary">
                        {searchTerm ? `No customers found for "${searchTerm}"` : 'No customers found'}
                      </Typography>
                      {searchTerm && (
                        <Button
                          variant="outlined"
                          onClick={handleClearSearch}
                          sx={{ mt: 1 }}
                        >
                          Clear Search
                        </Button>
                      )}
                      {!searchTerm && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleCreateNew}
                          sx={{ mt: 2 }}
                        >
                          Add First Customer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow 
                      key={customer.customer_id}
                      hover
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleViewCustomer(customer.customer_id)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          CUST-{customer.customer_id?.toString().padStart(4, '0')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {customer.customer_name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {customer.customer_phone || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {customer.customer_email || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={customer.customer_address || 'No address'}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="body2" sx={{
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {customer.customer_address || 'N/A'}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(customer.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(customer.updated_at)}
                        </Typography>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleViewCustomer(customer.customer_id)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              color="secondary"
                              onClick={() => handleEditCustomer(customer.customer_id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteClick(customer)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {customers.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows per page:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
              }
            />
          )}
        </Paper>

        {/* Quick Stats */}
        {customers.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Showing {customers.length} of {totalCount} total customers
              {searchTerm && ' (filtered)'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Page {page + 1} of {Math.ceil(totalCount / rowsPerPage)}
            </Typography>
          </Box>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete customer <strong>{customerToDelete?.customer_name}</strong>? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Customer;
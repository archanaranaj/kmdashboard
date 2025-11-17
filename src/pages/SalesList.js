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
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PointOfSale as SalesIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function SalesList() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Check if current user is from accounts department
  const isAccountsDept = user?.role === 'accounts';

  // Fetch sales data from API
  const fetchSales = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${BASE_URL}/api/cash/sales`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sales: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Sales list fetched:', result);
      
      if (result.status && Array.isArray(result.data)) {
        setSales(result.data);
      } else {
        throw new Error('Invalid response format from sales API');
      }
      
    } catch (error) {
      console.error('❌ Error fetching sales:', error);
      setError(error.message || 'Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Filter sales based on search term
  const filteredSales = sales.filter(entry => 
    entry.vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.job_card_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.mode_of_payment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.transaction_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.amount?.toString().includes(searchTerm) ||
    entry.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedSales = filteredSales.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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
        day: 'numeric'
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

  const handleViewDetails = (id) => {
    navigate(`/sales/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/sales/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sales entry?')) {
      try {
        const response = await fetch(`${BASE_URL}/api/cash/sales/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Refresh the list
          fetchSales();
        } else {
          alert('Failed to delete sales entry');
        }
      } catch (error) {
        console.error('Error deleting sales entry:', error);
        alert('Error deleting sales entry');
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/sales/create');
  };

  const calculateTotalAmount = () => {
    return filteredSales.reduce((total, entry) => total + parseFloat(entry.amount || 0), 0);
  };

  const calculatePendingAmount = () => {
    return filteredSales
      .filter(entry => entry.status?.toLowerCase() === 'pending')
      .reduce((total, entry) => total + parseFloat(entry.amount || 0), 0);
  };

  // Calculate sales by payment mode
  const calculatePaymentModeTotals = () => {
    const totals = {};
    filteredSales.forEach(entry => {
      const mode = entry.mode_of_payment || 'Unknown';
      totals[mode] = (totals[mode] || 0) + parseFloat(entry.amount || 0);
    });
    return totals;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading sales data...
        </Typography>
      </Box>
    );
  }

  const paymentModeTotals = calculatePaymentModeTotals();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
              💵 Sales Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage and track all sales transactions
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchSales}
            >
              Refresh
            </Button>
            {isAccountsDept && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
              >
                New Sales Entry
              </Button>
            )}
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#49a3f1', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Entries
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {filteredSales.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#4caf50', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Sales
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(calculateTotalAmount())}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#ff9800', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pending Amount
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(calculatePendingAmount())}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#9c27b0', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Modes
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {Object.keys(paymentModeTotals).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Payment Mode Breakdown */}
        {Object.keys(paymentModeTotals).length > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {Object.entries(paymentModeTotals).map(([mode, total]) => (
              <Grid item xs={12} sm={6} md={3} key={mode}>
                <Card variant="outlined">
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {mode}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatCurrency(total)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by vehicle, job card, payment mode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              disabled={filteredSales.length === 0}
            >
              Export
            </Button>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Sales Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Vehicle Number</strong></TableCell>
                  <TableCell><strong>Job Card</strong></TableCell>
                  <TableCell><strong>Payment Mode</strong></TableCell>
                  <TableCell><strong>Transaction #</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <SalesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="h6" color="textSecondary">
                        No sales entries found
                      </Typography>
                      {isAccountsDept && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleCreateNew}
                          sx={{ mt: 2 }}
                        >
                          Create First Entry
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSales.map((entry) => (
                    <TableRow 
                      key={entry.id}
                      hover
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleViewDetails(entry.id)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          S-{entry.id?.toString().padStart(4, '0')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {entry.vehicle_number || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {entry.job_card_number || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={entry.mode_of_payment || 'N/A'} 
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {entry.transaction_number || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {formatCurrency(entry.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusDisplay(entry.status)} 
                          color={getStatusColor(entry.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(entry.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleViewDetails(entry.id)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          {isAccountsDept && (
                            <>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
                                  color="secondary"
                                  onClick={() => handleEdit(entry.id)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDelete(entry.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {filteredSales.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredSales.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>

        {/* Quick Stats */}
        {filteredSales.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Showing {paginatedSales.length} of {filteredSales.length} entries
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Sales: {formatCurrency(calculateTotalAmount())} | 
              Pending: {formatCurrency(calculatePendingAmount())}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default SalesList;
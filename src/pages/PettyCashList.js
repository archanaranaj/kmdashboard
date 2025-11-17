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
  Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PettyCashList() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [pettyCash, setPettyCash] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Check if current user is from accounts department
  const isAccountsDept = user?.role === 'accounts';

  // Fetch petty cash data from API
  const fetchPettyCash = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${BASE_URL}/api/cash/petty`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch petty cash: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Petty cash list fetched:', result);
      
      if (result.status && Array.isArray(result.data)) {
        setPettyCash(result.data);
      } else {
        throw new Error('Invalid response format from petty cash API');
      }
      
    } catch (error) {
      console.error('❌ Error fetching petty cash:', error);
      setError(error.message || 'Failed to fetch petty cash data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPettyCash();
  }, []);

  // Filter petty cash based on search term
  const filteredPettyCash = pettyCash.filter(entry => 
    entry.vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.job_card_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.amount?.toString().includes(searchTerm) ||
    entry.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedPettyCash = filteredPettyCash.slice(
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
    navigate(`/petty-cash/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/petty-cash/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this petty cash entry?')) {
      try {
        const response = await fetch(`${BASE_URL}/api/cash/petty/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Refresh the list
          fetchPettyCash();
        } else {
          alert('Failed to delete petty cash entry');
        }
      } catch (error) {
        console.error('Error deleting petty cash:', error);
        alert('Error deleting petty cash entry');
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/petty-cash/create');
  };

  const calculateTotalAmount = () => {
    return filteredPettyCash.reduce((total, entry) => total + parseFloat(entry.amount || 0), 0);
  };

  const calculatePendingAmount = () => {
    return filteredPettyCash
      .filter(entry => entry.status?.toLowerCase() === 'pending')
      .reduce((total, entry) => total + parseFloat(entry.amount || 0), 0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading petty cash data...
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
              💰 Petty Cash Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage and track all petty cash transactions
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchPettyCash}
            >
              Refresh
            </Button>
            {isAccountsDept && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
              >
                New Petty Cash
              </Button>
            )}
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#49a3f1', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Entries
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {filteredPettyCash.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#4caf50', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Amount
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(calculateTotalAmount())}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
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
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by vehicle, job card, description..."
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
              disabled={filteredPettyCash.length === 0}
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

        {/* Petty Cash Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Vehicle Number</strong></TableCell>
                  <TableCell><strong>Job Card</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPettyCash.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="h6" color="textSecondary">
                        No petty cash entries found
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
                  paginatedPettyCash.map((entry) => (
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
                          PC-{entry.id?.toString().padStart(4, '0')}
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
                        <Tooltip title={entry.description || 'No description'}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {entry.description || 'No description'}
                          </Typography>
                        </Tooltip>
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
          {filteredPettyCash.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredPettyCash.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>

        {/* Quick Stats */}
        {filteredPettyCash.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Showing {paginatedPettyCash.length} of {filteredPettyCash.length} entries
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total: {formatCurrency(calculateTotalAmount())} | 
              Pending: {formatCurrency(calculatePendingAmount())}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default PettyCashList;
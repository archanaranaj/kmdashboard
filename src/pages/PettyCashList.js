

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
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PettyCashList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [allPettyCash, setAllPettyCash] = useState([]); // All data from API
  const [filteredPettyCash, setFilteredPettyCash] = useState([]); // Filtered data for display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAmount, setTotalAmount] = useState(0);

  // Check if current user is from accounts department
  const isAccountsDept = user?.role === 'accounts';

  // Parse URL search parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlPage = searchParams.get('page');
    const urlLimit = searchParams.get('limit');
    const urlSearchTerm = searchParams.get('search');

    if (urlPage) setPage(parseInt(urlPage) - 1);
    if (urlLimit) setRowsPerPage(parseInt(urlLimit));
    if (urlSearchTerm) setSearchTerm(urlSearchTerm);
  }, [location.search]);

  // Fetch ALL petty cash data from API (no filtering)
  const fetchAllPettyCash = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔍 Fetching ALL petty cash data...');
      
      // Get all data without any filters
      const apiUrl = `${BASE_URL}/api/cash/petty?limit=1000`;
      console.log('📡 API URL:', apiUrl);

      const response = await fetch(apiUrl, {
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
      console.log('✅ Petty cash API response:', result);
      
      if (result.status && result.data) {
        const pettyCashData = result.data.petty_cash || [];
        console.log(`📊 Loaded ${pettyCashData.length} entries from API`);
        
        setAllPettyCash(pettyCashData);
        setTotalAmount(result.data.total_amount || 0);
        
        // Apply initial filtering
        applyFiltering(pettyCashData, searchTerm);
        
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

  // Apply client-side filtering
  const applyFiltering = (data = allPettyCash, term = searchTerm) => {
    if (!term.trim()) {
      // No search term - show all data
      setFilteredPettyCash(data);
      console.log(`🔍 No search term - showing all ${data.length} entries`);
      return;
    }

    const filteredData = data.filter(entry => {
      const vehicleMatch = entry.vehicle_number?.toLowerCase().includes(term.toLowerCase());
      const jobCardMatch = entry.job_card_number?.toString().includes(term);
      const descriptionMatch = entry.description?.toLowerCase().includes(term.toLowerCase());
      
      return vehicleMatch || jobCardMatch || descriptionMatch;
    });

    console.log(`🔍 Search for "${term}": Found ${filteredData.length} of ${data.length} entries`);
    
    // Log some matches for debugging
    if (filteredData.length > 0) {
      console.log('📋 Matching entries:', filteredData.map(entry => ({
        id: entry.id,
        vehicle: entry.vehicle_number,
        job_card: entry.job_card_number,
        description: entry.description
      })));
    } else {
      console.log('❌ No matches found for search term:', term);
    }

    setFilteredPettyCash(filteredData);
    setPage(0); // Reset to first page when filtering
  };

  // Update URL with current search parameters
  const updateURL = () => {
    const params = new URLSearchParams();
    params.append('page', (page + 1).toString());
    params.append('limit', rowsPerPage.toString());
    
    if (searchTerm) {
      params.append('search', searchTerm);
    }

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllPettyCash();
  }, []);

  // Apply filtering when search term changes
  useEffect(() => {
    applyFiltering(allPettyCash, searchTerm);
    updateURL();
  }, [searchTerm, allPettyCash]);

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
    navigate(location.pathname, { replace: true });
  };

  // Handle Enter key press in search field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyFiltering(allPettyCash, searchTerm);
    }
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

  // Get paginated data for current page
  const getPaginatedData = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredPettyCash.slice(startIndex, endIndex);
  };

  const displayData = getPaginatedData();
  const totalCount = filteredPettyCash.length;

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

  // Calculate total amount from filtered data
  const calculateFilteredTotal = () => {
    return filteredPettyCash.reduce((total, entry) => total + parseFloat(entry.amount || 0), 0);
  };

  // Calculate current page total
  const calculateCurrentPageTotal = () => {
    return displayData.reduce((total, entry) => total + parseFloat(entry.amount || 0), 0);
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
          // Refresh the entire list
          fetchAllPettyCash();
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
              Manage and track all petty cash transactions (Client-side Search)
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchAllPettyCash}
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

        {/* Client-side Search Notice */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Client-side Search Active:</strong> Searching through {allPettyCash.length} entries locally for fastest results.
        </Alert>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#e3f2fd', color: 'blue' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Entries
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {allPettyCash.length}
                </Typography>
                <Typography variant="body2">
                  All entries in system
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#e8f5e8', color: 'green' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Filtered Entries
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalCount}
                </Typography>
                <Typography variant="body2">
                  {searchTerm ? 'Search results' : 'All entries'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#fff3e0', color: 'orange' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Filtered Total
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(calculateFilteredTotal())}
                </Typography>
                <Typography variant="body2">
                  {searchTerm ? 'Search results total' : 'All entries total'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#f3e5f5', color: 'purple' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Page Total
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(calculateCurrentPageTotal())}
                </Typography>
                <Typography variant="body2">
                  {displayData.length} entries on page
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by vehicle number, job card number, or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
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
              onClick={() => applyFiltering(allPettyCash, searchTerm)}
              disabled={loading}
            >
              Search
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {searchTerm && (
              <Typography variant="body2" color="textSecondary">
                Found {totalCount} results for "{searchTerm}"
              </Typography>
            )}
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
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="h6" color="textSecondary">
                        {searchTerm ? `No entries found for "${searchTerm}"` : 'No petty cash entries found'}
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
                      {!searchTerm && isAccountsDept && (
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
                  displayData.map((entry) => (
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
                        <Typography variant="body2" fontWeight="bold">
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
          {displayData.length > 0 && (
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
        {displayData.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Showing {displayData.length} of {totalCount} entries
              {searchTerm && ` (filtered from ${allPettyCash.length} total)`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Page Total: {formatCurrency(calculateCurrentPageTotal())} | 
              Filtered Total: {formatCurrency(calculateFilteredTotal())}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default PettyCashList;
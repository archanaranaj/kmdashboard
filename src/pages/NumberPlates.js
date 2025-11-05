// src/pages/NumberPlates.js
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Alert,
  CircularProgress,
  Chip,
  TextField,
  Grid,
  Pagination,
  InputAdornment
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function NumberPlates() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [numberPlates, setNumberPlates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const navigate = useNavigate();
  const { user, token } = useAuth();
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';


  // Fetch number plates when component mounts or when pagination/search changes
  useEffect(() => {
    if (user && token) {
      console.log('🔄 Fetching number plates with valid token');
      fetchNumberPlates();
    } else if (user && !token) {
      console.log('⚠️ User exists but token is missing');
      setError('Authentication issue: Token missing. Please logout and login again.');
    }
  }, [user, token, pagination.page, pagination.limit, searchTerm]);

  const fetchNumberPlates = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('🔑 Making API call with token:', token);

      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${BASE_URL}/api/number-plates?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`Failed to fetch number plates: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Number plates data received:', result);
      
      // Extract plates from the nested structure
      const platesData = result.data?.plates || [];
      const total = result.data?.total || 0;
      const page = result.data?.page || 1;
      const limit = result.data?.limit || 10;
      const totalPages = result.data?.totalPages || 1;

      console.log('📊 Plates data array:', platesData);
      console.log('📄 Pagination info:', { total, page, limit, totalPages });
      
      // Transform API response
      const transformedPlates = platesData.map(plate => ({
        id: plate.id,
        plateNumber: plate.plate_number,
        timestamp: plate.date_detected,
        imageUrl: plate.image_url,
        status: plate.status,
        vehicleColor: plate.vehicle_color,
        vehicleType: plate.vehicle_type,
        vehicleBrand: plate.vehicle_brand,
        cameraLocation: plate.device_no,
        captureTime: plate.capture_time
      }));

      console.log('🔄 Transformed plates:', transformedPlates);
      
      setNumberPlates(transformedPlates);
      setPagination(prev => ({
        ...prev,
        total,
        page,
        limit,
        totalPages
      }));
      
      setSuccess(`Successfully loaded ${transformedPlates.length} number plates (Total: ${total})`);
      
    } catch (error) {
      console.error('❌ Error fetching number plates:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchNumberPlates();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  const handleLimitChange = (event) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: parseInt(event.target.value),
      page: 1 // Reset to first page when changing limit
    }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processed': 
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

  const handleViewDetails = (plate) => {
    navigate(`/number-plates/view/${plate.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Please login to access number plates.
        </Alert>
      </Box>
    );
  }

  if (!token) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Authentication token missing. Please <strong>logout and login again</strong>.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Reload Page
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Number Plate Recognition
        </Typography>
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by plate number..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} size="small">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Items per page"
                value={pagination.limit}
                onChange={handleLimitChange}
                SelectProps={{
                  native: true,
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary" align="center">
                Showing {numberPlates.length} of {pagination.total} plates
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Number Plates Overview
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Welcome, {user.name}! This page displays all number plates with pagination and search.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`Total: ${pagination.total}`} 
              variant="outlined" 
              color="primary"
            />
            <Chip 
              label={`Page: ${pagination.page} of ${pagination.totalPages}`} 
              variant="outlined" 
            />
            <Chip 
              label={`Pending: ${numberPlates.filter(p => p.status === 'pending').length}`} 
              color="warning" 
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Detected Number Plates
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Page {pagination.page} of {pagination.totalPages}
            </Typography>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Plate Number</strong></TableCell>
                  <TableCell><strong>Date Detected</strong></TableCell>
                  <TableCell><strong>Vehicle Info</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {numberPlates.map((plate) => (
                  <TableRow key={plate.id} hover>
                    <TableCell>#{plate.id}</TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {plate.plateNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(plate.timestamp)}
                      </Typography>
                      {plate.captureTime && (
                        <Typography variant="caption" color="textSecondary" display="block">
                          Capture: {plate.captureTime}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {plate.vehicleBrand} • {plate.vehicleColor}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        {plate.vehicleType}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={plate.status} 
                        color={getStatusColor(plate.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleViewDetails(plate)}
                        title="View Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {numberPlates.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        {searchTerm ? 'No number plates found matching your search' : 'No number plates found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Loading number plates...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default NumberPlates;
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
  CircularProgress,
  Alert,
  TextField,
  Grid,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function JobCards() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';

  // Fetch job cards from API
  useEffect(() => {
    fetchJobCards();
  }, [token]);

  const fetchJobCards = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔍 Fetching job cards...');
      
      const response = await fetch(`${BASE_URL}/api/job-cards`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job cards: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Job cards fetched:', result);
      
      // Assuming the API returns an array of job cards
      setJobCards(result.data || result);
      
    } catch (error) {
      console.error('❌ Error fetching job cards:', error);
      setError(error.message || 'Failed to fetch job cards');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    navigate('/job-cards/add');
  };

  const handleOpenEdit = (jobCard) => {
    navigate(`/job-cards/edit/${jobCard.id}`);
  };

  const handleOpenView = (jobCard) => {
    navigate(`/job-cards/view/${jobCard.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job card?')) {
      try {
        setError('');
        
        const response = await fetch(`${BASE_URL}/api/job-cards/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log('✅ Job card deleted successfully');
          // Refresh the list
          fetchJobCards();
        } else {
          throw new Error('Failed to delete job card');
        }
      } catch (error) {
        console.error('Error deleting job card:', error);
        setError(error.message);
      }
    }
  };

  // Filter job cards based on search term and status
  const filteredJobCards = jobCards.filter(jobCard => {
    const matchesSearch = jobCard.vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jobCard.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || jobCard.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Helper function to get service advisor name
  const getServiceAdvisorName = (serviceAdvisor) => {
    if (!serviceAdvisor) return 'N/A';
    
    // If it's a string, return it directly
    if (typeof serviceAdvisor === 'string') return serviceAdvisor;
    
    // If it's an object, try to get the name or username
    if (typeof serviceAdvisor === 'object') {
      return serviceAdvisor.name || serviceAdvisor.username || 'Unknown Advisor';
    }
    
    return 'N/A';
  };

  // Helper function to safely render car details
  const getCarDetails = (jobCard) => {
    const make = jobCard.car_make || '';
    const model = jobCard.car_model || '';
    const year = jobCard.car_year || '';
    
    const details = [];
    if (make) details.push(make);
    if (model) details.push(model);
    if (year) details.push(`(${year})`);
    
    return details.join(' ') || 'N/A';
  };

  // Helper function to safely render status
  const getStatus = (jobCard) => {
    return jobCard.status || 'pending';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading job cards...
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Job Cards Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Add Job Card
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Search and Filter Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by vehicle number or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button 
                variant="outlined" 
                onClick={fetchJobCards}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {filteredJobCards.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No job cards found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {jobCards.length === 0 ? 'No job cards have been created yet.' : 'No job cards match your search criteria.'}
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Vehicle No.</strong></TableCell>
                    <TableCell><strong>Customer Name</strong></TableCell>
                    <TableCell><strong>Car Details</strong></TableCell>
                    <TableCell><strong>Service Advisor</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Promised Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredJobCards.map((jobCard) => (
                    <TableRow key={jobCard.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {jobCard.vehicle_number || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>{jobCard.customer_name || 'N/A'}</TableCell>
                      <TableCell>
                        {getCarDetails(jobCard)}
                      </TableCell>
                      <TableCell>
                        {getServiceAdvisorName(jobCard.service_advisor)}
                      </TableCell>
                      <TableCell>{formatDate(jobCard.date)}</TableCell>
                      <TableCell>{formatDate(jobCard.promised_delivery_date)}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: 
                              getStatus(jobCard) === 'completed' ? 'success.light' :
                              getStatus(jobCard) === 'in_progress' ? 'warning.light' :
                              getStatus(jobCard) === 'delivered' ? 'info.light' : 'grey.100',
                            color: 
                              getStatus(jobCard) === 'completed' ? 'success.dark' :
                              getStatus(jobCard) === 'in_progress' ? 'warning.dark' :
                              getStatus(jobCard) === 'delivered' ? 'info.dark' : 'grey.800',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            textTransform: 'capitalize'
                          }}
                        >
                          {getStatus(jobCard)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpenView(jobCard)} title="View">
                          <ViewIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleOpenEdit(jobCard)} title="Edit">
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(jobCard.id)} title="Delete">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default JobCards;
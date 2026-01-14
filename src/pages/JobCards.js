
// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Box,
//   CircularProgress,
//   Alert,
//   TextField,
//   Grid,
//   MenuItem,
//   TablePagination
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Visibility as ViewIcon,
//   Search as SearchIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// function JobCards() {
//   const navigate = useNavigate();
//   const { token } = useAuth();
//   const [jobCards, setJobCards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalCount, setTotalCount] = useState(0);
//   const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';

//   // Fetch job cards from API
//   useEffect(() => {
//     fetchJobCards();
//   }, [token, page, rowsPerPage]);

//   const fetchJobCards = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       console.log('🔍 Fetching job cards...');
      
//       // Build query parameters
//       const params = new URLSearchParams({
//         page: (page + 1).toString(),
//         limit: rowsPerPage.toString()
//       });

//       // Add optional filters
//       if (searchTerm) {
//         params.append('vehicle_number', searchTerm);
//       }
//       if (statusFilter) {
//         params.append('status', statusFilter);
//       }

//       const response = await fetch(`${BASE_URL}/api/job-cards?${params.toString()}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch job cards: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('✅ Job cards fetched:', result);
      
//       if (result.status && result.data) {
//         setJobCards(result.data.job_cards || []);
//         setTotalCount(result.data.total || 0);
//       } else {
//         // Fallback for different response structure
//         setJobCards(result.data || result || []);
//         setTotalCount(result.data?.length || result.length || 0);
//       }
      
//     } catch (error) {
//       console.error('❌ Error fetching job cards:', error);
//       setError(error.message || 'Failed to fetch job cards');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenAdd = () => {
//     navigate('/job-cards/add');
//   };

//   const handleOpenEdit = (jobCard) => {
//     navigate(`/job-cards/edit/${jobCard.id}`);
//   };

//   const handleOpenView = (jobCard) => {
//     navigate(`/job-cards/view/${jobCard.id}`);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this job card?')) {
//       try {
//         setError('');
        
//         const response = await fetch(`${BASE_URL}/api/job-cards/${id}`, {
//           method: 'DELETE',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           console.log('✅ Job card deleted successfully');
//           // Refresh the list
//           fetchJobCards();
//         } else {
//           throw new Error('Failed to delete job card');
//         }
//       } catch (error) {
//         console.error('Error deleting job card:', error);
//         setError(error.message);
//       }
//     }
//   };

//   // Handle page change
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   // Handle rows per page change
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0); // Reset to first page when changing rows per page
//   };

//   // Filter job cards based on search term and status (client-side filtering as fallback)
//   const filteredJobCards = jobCards.filter(jobCard => {
//     const matchesSearch = jobCard.vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          jobCard.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          jobCard.job_card_number?.toString().includes(searchTerm);
//     const matchesStatus = !statusFilter || jobCard.status === statusFilter;
    
//     return matchesSearch && matchesStatus;
//   });

//   // Use server-side paginated data or client-side filtered data
//   const displayJobCards = searchTerm || statusFilter ? filteredJobCards : jobCards;

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   // Helper function to get service advisor name
//   const getServiceAdvisorName = (serviceAdvisor) => {
//     if (!serviceAdvisor) return 'N/A';
    
//     // If it's a string, return it directly
//     if (typeof serviceAdvisor === 'string') return serviceAdvisor;
    
//     // If it's an object, try to get the name or username
//     if (typeof serviceAdvisor === 'object') {
//       return serviceAdvisor.name || serviceAdvisor.username || 'Unknown Advisor';
//     }
    
//     return 'N/A';
//   };

//   // Helper function to safely render car details
//   const getCarDetails = (jobCard) => {
//     const make = jobCard.car_make || '';
//     const model = jobCard.car_model || '';
//     const year = jobCard.car_year || '';
    
//     const details = [];
//     if (make) details.push(make);
//     if (model) details.push(model);
//     if (year) details.push(`(${year})`);
    
//     return details.join(' ') || 'N/A';
//   };

//   // Helper function to safely render status
//   const getStatus = (jobCard) => {
//     return jobCard.status || 'pending';
//   };

//   // Check if job card is completed
//   const isJobCardCompleted = (jobCard) => {
//     return getStatus(jobCard).toLowerCase() === 'completed';
//   };

//   // Handle search with debounce or manual refresh
//   const handleSearch = () => {
//     setPage(0); // Reset to first page when searching
//     fetchJobCards();
//   };

//   // Handle status filter change
//   const handleStatusFilterChange = (e) => {
//     setStatusFilter(e.target.value);
//     setPage(0); // Reset to first page when filtering
//     // Don't fetch here - wait for useEffect to trigger
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//         <CircularProgress size={60} />
//         <Typography variant="h6" sx={{ ml: 2 }}>
//           Loading job cards...
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <div>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" gutterBottom>
//           Job Cards Management
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={handleOpenAdd}
//         >
//           Add Job Card
//         </Button>
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}

//       {/* Search and Filter Section */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 placeholder="Search by vehicle number, customer name, or job card #..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     handleSearch();
//                   }
//                 }}
//                 InputProps={{
//                   startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Filter by Status"
//                 value={statusFilter}
//                 onChange={handleStatusFilterChange}
//                 variant="outlined"
//               >
//                 <MenuItem value="">All Status</MenuItem>
//                 <MenuItem value="pending">Assigned</MenuItem>
//                 <MenuItem value="active">Active</MenuItem>
//                 <MenuItem value="completed">Completed</MenuItem>
               
//               </TextField>
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <Button 
//                 variant="outlined" 
//                 onClick={handleSearch}
//                 fullWidth
//               >
//                 Search
//               </Button>
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <Button 
//                 variant="outlined" 
//                 onClick={fetchJobCards}
//                 fullWidth
//               >
//                 Refresh All
//               </Button>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent>
//           {displayJobCards.length === 0 ? (
//             <Box sx={{ textAlign: 'center', py: 4 }}>
//               <Typography variant="h6" color="textSecondary">
//                 No job cards found
//               </Typography>
//               <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//                 {jobCards.length === 0 ? 'No job cards have been created yet.' : 'No job cards match your search criteria.'}
//               </Typography>
//             </Box>
//           ) : (
//             <>
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell><strong>Job Card #</strong></TableCell>
//                       <TableCell><strong>Vehicle No.</strong></TableCell>
//                       <TableCell><strong>Customer Name</strong></TableCell>
//                       <TableCell><strong>Car Details</strong></TableCell>
//                       <TableCell><strong>Service Advisor</strong></TableCell>
//                       <TableCell><strong>Date</strong></TableCell>
//                       <TableCell><strong>Promised Date</strong></TableCell>
//                       <TableCell><strong>Status</strong></TableCell>
//                       <TableCell><strong>Actions</strong></TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {displayJobCards.map((jobCard) => {
//                       const isCompleted = isJobCardCompleted(jobCard);
                      
//                       return (
//                         <TableRow key={jobCard.id} hover>
//                           <TableCell>
//                             <Typography variant="subtitle2" fontWeight="bold">
//                               {jobCard.job_card_number || 'N/A'}
//                             </Typography>
//                           </TableCell>
//                           <TableCell>
//                             <Typography variant="subtitle2" fontWeight="bold">
//                               {jobCard.vehicle_number || 'N/A'}
//                             </Typography>
//                           </TableCell>
//                           <TableCell>{jobCard.customer_name || 'N/A'}</TableCell>
//                           <TableCell>
//                             {getCarDetails(jobCard)}
//                           </TableCell>
//                           <TableCell>
//                             {getServiceAdvisorName(jobCard.service_advisor)}
//                           </TableCell>
//                           <TableCell>{formatDate(jobCard.date)}</TableCell>
//                           <TableCell>{formatDate(jobCard.promised_delivery_date)}</TableCell>
//                           <TableCell>
//                             <Box
//                               sx={{
//                                 display: 'inline-block',
//                                 px: 1,
//                                 py: 0.5,
//                                 borderRadius: 1,
//                                 backgroundColor: 
//                                   getStatus(jobCard) === 'completed' ? 'success.light' :
//                                   getStatus(jobCard) === 'active' ? 'primary.light' :
//                                   getStatus(jobCard) === 'in_progress' ? 'warning.light' :
//                                   getStatus(jobCard) === 'delivered' ? 'info.light' : 'grey.100',
//                                 color: 
//                                   getStatus(jobCard) === 'completed' ? 'success.dark' :
//                                   getStatus(jobCard) === 'active' ? 'primary.dark' :
//                                   getStatus(jobCard) === 'in_progress' ? 'warning.dark' :
//                                   getStatus(jobCard) === 'delivered' ? 'info.dark' : 'grey.800',
//                                 fontSize: '0.75rem',
//                                 fontWeight: 'bold',
//                                 textTransform: 'capitalize'
//                               }}
//                             >
//                               {getStatus(jobCard)}
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <IconButton color="primary" onClick={() => handleOpenView(jobCard)} title="View">
//                               <ViewIcon />
//                             </IconButton>
                            
//                             {/* Hide Edit and Delete buttons for completed job cards */}
//                             {!isCompleted && (
//                               <>
//                                 <IconButton color="secondary" onClick={() => handleOpenEdit(jobCard)} title="Edit">
//                                   <EditIcon />
//                                 </IconButton>
//                                 <IconButton color="error" onClick={() => handleDelete(jobCard.id)} title="Delete">
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </>
//                             )}
                            
//                             {/* Show message for completed job cards */}
//                             {isCompleted && (
//                               <Typography 
//                                 variant="caption" 
//                                 color="textSecondary"
//                                 sx={{ fontStyle: 'italic' }}
//                               >
//                                 Read-only
//                               </Typography>
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Pagination */}
//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//                 component="div"
//                 count={searchTerm || statusFilter ? filteredJobCards.length : totalCount}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 labelRowsPerPage="Rows per page:"
//                 labelDisplayedRows={({ from, to, count }) => 
//                   `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
//                 }
//               />
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default JobCards;


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
  MenuItem,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function JobCards() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [customerIdFromUrl, setCustomerIdFromUrl] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';

  // Extract customer_id from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const customerId = queryParams.get('customer_id') || queryParams.get('customer');
    
    if (customerId) {
      setCustomerIdFromUrl(customerId);
      console.log('✅ Customer ID from URL:', customerId);
    }
  }, [location.search]);

  // Fetch job cards from API
  useEffect(() => {
    fetchJobCards();
  }, [token, page, rowsPerPage, customerIdFromUrl]);

  const fetchJobCards = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔍 Fetching job cards...');
      
      // Build query parameters
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString()
      });

      // Add customer_id from URL if available (HIGHEST PRIORITY)
      if (customerIdFromUrl) {
        params.append('customer_id', customerIdFromUrl);
      }
      // Add search term if no customer_id from URL
      else if (searchTerm) {
        params.append('vehicle_number', searchTerm);
      }
      
      // Add status filter
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(`${BASE_URL}/api/job-cards?${params.toString()}`, {
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
      
      if (result.status && result.data) {
        setJobCards(result.data.job_cards || []);
        setTotalCount(result.data.total || 0);
      } else {
        // Fallback for different response structure
        setJobCards(result.data || result || []);
        setTotalCount(result.data?.length || result.length || 0);
      }
      
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

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  // Filter job cards based on search term and status (client-side filtering as fallback)
  const filteredJobCards = jobCards.filter(jobCard => {
    const matchesSearch = jobCard.vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jobCard.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jobCard.job_card_number?.toString().includes(searchTerm) ||
                         (jobCard.customer_id && jobCard.customer_id.toString().includes(searchTerm));
    const matchesStatus = !statusFilter || jobCard.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Use server-side paginated data or client-side filtered data
  const displayJobCards = searchTerm || statusFilter ? filteredJobCards : jobCards;

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

  // Check if job card is completed
  const isJobCardCompleted = (jobCard) => {
    return getStatus(jobCard).toLowerCase() === 'completed';
  };

  // Handle search with debounce or manual refresh
  const handleSearch = () => {
    setPage(0); // Reset to first page when searching
    fetchJobCards();
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0); // Reset to first page when filtering
  };

  // Handle Enter key press in search field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear customer filter from URL
  const handleClearCustomerFilter = () => {
    setCustomerIdFromUrl(null);
    // Remove customer_id from URL without refreshing the page
    navigate('/job-cards');
    setPage(0);
    setSearchTerm('');
    setStatusFilter('');
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
          {customerIdFromUrl && (
            <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
              🔍 Filtered by Customer ID: {customerIdFromUrl}
            </Typography>
          )}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {customerIdFromUrl && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearCustomerFilter}
            >
              Clear Customer Filter
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
          >
            Add Job Card
          </Button>
        </Box>
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
            <Grid item xs={12} md={customerIdFromUrl ? 8 : 4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by vehicle number, customer name, or job card #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!!customerIdFromUrl}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                helperText={customerIdFromUrl ? "Search disabled while customer filter is active" : ""}
              />
            </Grid>
            <Grid item xs={12} md={customerIdFromUrl ? 4 : 3}>
              <TextField
                fullWidth
                select
                label="Filter by Status"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                variant="outlined"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Assigned</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Grid>
            {!customerIdFromUrl && (
              <>
                <Grid item xs={12} md={2}>
                  <Button 
                    variant="outlined" 
                    onClick={handleSearch}
                    fullWidth
                  >
                    Search
                  </Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('');
                      setPage(0);
                      fetchJobCards();
                    }}
                    fullWidth
                  >
                    Refresh All
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {displayJobCards.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No job cards found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {customerIdFromUrl 
                  ? `No job cards found for customer ID: ${customerIdFromUrl}`
                  : jobCards.length === 0 
                    ? 'No job cards have been created yet.' 
                    : 'No job cards match your search criteria.'}
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Job Card #</strong></TableCell>
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
                    {displayJobCards.map((jobCard) => {
                      const isCompleted = isJobCardCompleted(jobCard);
                      
                      return (
                        <TableRow key={jobCard.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {jobCard.job_card_number || 'N/A'}
                            </Typography>
                          </TableCell>
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
                                  getStatus(jobCard) === 'active' ? 'primary.light' :
                                  getStatus(jobCard) === 'in_progress' ? 'warning.light' :
                                  getStatus(jobCard) === 'delivered' ? 'info.light' : 'grey.100',
                                color: 
                                  getStatus(jobCard) === 'completed' ? 'success.dark' :
                                  getStatus(jobCard) === 'active' ? 'primary.dark' :
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
                            
                            {/* Hide Edit and Delete buttons for completed job cards */}
                            {!isCompleted && (
                              <>
                                <IconButton color="secondary" onClick={() => handleOpenEdit(jobCard)} title="Edit">
                                  <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(jobCard.id)} title="Delete">
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                            
                            {/* Show message for completed job cards */}
                            {isCompleted && (
                              <Typography 
                                variant="caption" 
                                color="textSecondary"
                                sx={{ fontStyle: 'italic' }}
                              >
                                Read-only
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={searchTerm || statusFilter ? filteredJobCards.length : totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                }
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default JobCards;
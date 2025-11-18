// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   TextField,
//   Button,
//   IconButton,
//   Tooltip,
//   Alert,
//   CircularProgress,
//   Card,
//   CardContent,
//   Grid,
//   InputAdornment
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Search as SearchIcon,
//   Receipt as ReceiptIcon,
//   Refresh as RefreshIcon,
//   Download as DownloadIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// function PettyCashList() {
//   const navigate = useNavigate();
//   const { token, user } = useAuth();
//   const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
//   const [pettyCash, setPettyCash] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalCount, setTotalCount] = useState(0);
//   const [totalAmount, setTotalAmount] = useState(0);

//   // Check if current user is from accounts department
//   const isAccountsDept = user?.role === 'accounts';

//   // Fetch petty cash data from API
//   const fetchPettyCash = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       // Build query parameters
//       const params = new URLSearchParams({
//         page: (page + 1).toString(),
//         limit: rowsPerPage.toString()
//       });

//       // Add search parameters if provided
//       if (searchTerm) {
//         params.append('vehicle_number', searchTerm);
//         params.append('job_card_number', searchTerm);
//       }

//       const response = await fetch(`${BASE_URL}/api/cash/petty?${params.toString()}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch petty cash: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('✅ Petty cash list fetched:', result);
      
//       if (result.status && result.data) {
//         setPettyCash(result.data.petty_cash || []);
//         setTotalCount(result.data.total || 0);
//         setTotalAmount(result.data.total_amount || 0);
//       } else {
//         throw new Error('Invalid response format from petty cash API');
//       }
      
//     } catch (error) {
//       console.error('❌ Error fetching petty cash:', error);
//       setError(error.message || 'Failed to fetch petty cash data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPettyCash();
//   }, [page, rowsPerPage]); // Refetch when page or rowsPerPage changes

//   // Handle search - reset to first page and fetch
//   const handleSearch = () => {
//     setPage(0);
//     fetchPettyCash();
//   };

//   // Handle clear search
//   const handleClearSearch = () => {
//     setSearchTerm('');
//     setPage(0);
//     // Fetch will be triggered by useEffect due to page change
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

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (!amount && amount !== 0) return 'N/A';
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(parseFloat(amount));
//   };

//   const handleViewDetails = (id) => {
//     navigate(`/petty-cash/${id}`);
//   };

//   const handleEdit = (id) => {
//     navigate(`/petty-cash/edit/${id}`);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this petty cash entry?')) {
//       try {
//         const response = await fetch(`${BASE_URL}/api/cash/petty/${id}`, {
//           method: 'DELETE',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           // Refresh the list
//           fetchPettyCash();
//         } else {
//           alert('Failed to delete petty cash entry');
//         }
//       } catch (error) {
//         console.error('Error deleting petty cash:', error);
//         alert('Error deleting petty cash entry');
//       }
//     }
//   };

//   const handleCreateNew = () => {
//     navigate('/petty-cash/create');
//   };

//   // Calculate total amount from current page data (fallback)
//   const calculateCurrentPageTotal = () => {
//     return pettyCash.reduce((total, entry) => total + parseFloat(entry.amount || 0), 0);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//         <CircularProgress size={60} />
//         <Typography variant="h6" sx={{ ml: 2 }}>
//           Loading petty cash data...
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 3 }}>
//       <Container maxWidth="xl">
//         {/* Header */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Box>
//             <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
//               💰 Petty Cash Management
//             </Typography>
//             <Typography variant="body1" color="textSecondary">
//               Manage and track all petty cash transactions
//             </Typography>
//           </Box>
          
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Button
//               variant="outlined"
//               startIcon={<RefreshIcon />}
//               onClick={fetchPettyCash}
//             >
//               Refresh
//             </Button>
//             {isAccountsDept && (
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleCreateNew}
//               >
//                 New Petty Cash
//               </Button>
//             )}
//           </Box>
//         </Box>

//         {/* Summary Cards */}
//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           <Grid item xs={12} md={4}>
//             <Card sx={{ backgroundColor: '#49a3f1', color: 'white' }}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Total Entries
//                 </Typography>
//                 <Typography variant="h4" fontWeight="bold">
//                   {totalCount}
//                 </Typography>
//                 <Typography variant="body2">
//                   {searchTerm && 'Filtered results'}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Card sx={{ backgroundColor: '#4caf50', color: 'white' }}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Total Amount
//                 </Typography>
//                 <Typography variant="h4" fontWeight="bold">
//                   {formatCurrency(totalAmount)}
//                 </Typography>
//                 <Typography variant="body2">
//                   All entries total
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Card sx={{ backgroundColor: '#ff9800', color: 'white' }}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Current Page Total
//                 </Typography>
//                 <Typography variant="h4" fontWeight="bold">
//                   {formatCurrency(calculateCurrentPageTotal())}
//                 </Typography>
//                 <Typography variant="body2">
//                   {pettyCash.length} entries on this page
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Search and Filters */}
//         <Paper sx={{ p: 2, mb: 3 }}>
//           <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
//             <TextField
//               placeholder="Search by vehicle number or job card number..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') {
//                   handleSearch();
//                 }
//               }}
//               sx={{ minWidth: 400 }}
//               size="small"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon />
//                   </InputAdornment>
//                 ),
//                 endAdornment: searchTerm && (
//                   <InputAdornment position="end">
//                     <IconButton
//                       size="small"
//                       onClick={handleClearSearch}
//                       edge="end"
//                     >
//                       ×
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <Button
//               variant="contained"
//               onClick={handleSearch}
//               disabled={loading}
//             >
//               Search
//             </Button>
//             <Box sx={{ flexGrow: 1 }} />
//             {searchTerm && (
//               <Typography variant="body2" color="textSecondary">
//                 Showing filtered results
//               </Typography>
//             )}
//             {/* <Button
//               variant="outlined"
//               startIcon={<DownloadIcon />}
//               disabled={pettyCash.length === 0}
//             >
//               Export
//             </Button> */}
//           </Box>
//         </Paper>

//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//           </Alert>
//         )}

//         {/* Petty Cash Table */}
//         <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//           <TableContainer sx={{ maxHeight: 600 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell><strong>ID</strong></TableCell>
//                   <TableCell><strong>Vehicle Number</strong></TableCell>
//                   <TableCell><strong>Job Card</strong></TableCell>
//                   <TableCell><strong>Description</strong></TableCell>
//                   <TableCell><strong>Amount</strong></TableCell>
//                   <TableCell><strong>Date</strong></TableCell>
//                   <TableCell><strong>Actions</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {pettyCash.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                       <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
//                       <Typography variant="h6" color="textSecondary">
//                         {searchTerm ? 'No matching petty cash entries found' : 'No petty cash entries found'}
//                       </Typography>
//                       {searchTerm && (
//                         <Button
//                           variant="outlined"
//                           onClick={handleClearSearch}
//                           sx={{ mt: 1 }}
//                         >
//                           Clear Search
//                         </Button>
//                       )}
//                       {!searchTerm && isAccountsDept && (
//                         <Button
//                           variant="contained"
//                           startIcon={<AddIcon />}
//                           onClick={handleCreateNew}
//                           sx={{ mt: 2 }}
//                         >
//                           Create First Entry
//                         </Button>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   pettyCash.map((entry) => (
//                     <TableRow 
//                       key={entry.id}
//                       hover
//                       sx={{ 
//                         '&:last-child td, &:last-child th': { border: 0 },
//                         cursor: 'pointer'
//                       }}
//                       onClick={() => handleViewDetails(entry.id)}
//                     >
//                       <TableCell>
//                         <Typography variant="body2" fontWeight="bold">
//                           PC-{entry.id?.toString().padStart(4, '0')}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {entry.vehicle_number || 'N/A'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {entry.job_card_number || 'N/A'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Tooltip title={entry.description || 'No description'}>
//                           <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
//                             {entry.description || 'No description'}
//                           </Typography>
//                         </Tooltip>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" fontWeight="bold" color="primary">
//                           {formatCurrency(entry.amount)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {formatDate(entry.created_at)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell onClick={(e) => e.stopPropagation()}>
//                         <Box sx={{ display: 'flex', gap: 1 }}>
//                           <Tooltip title="View Details">
//                             <IconButton 
//                               size="small" 
//                               color="primary"
//                               onClick={() => handleViewDetails(entry.id)}
//                             >
//                               <ViewIcon />
//                             </IconButton>
//                           </Tooltip>
//                           {isAccountsDept && (
//                             <>
//                               <Tooltip title="Edit">
//                                 <IconButton 
//                                   size="small" 
//                                   color="secondary"
//                                   onClick={() => handleEdit(entry.id)}
//                                 >
//                                   <EditIcon />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Delete">
//                                 <IconButton 
//                                   size="small" 
//                                   color="error"
//                                   onClick={() => handleDelete(entry.id)}
//                                 >
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </Tooltip>
//                             </>
//                           )}
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
          
//           {/* Pagination */}
//           {pettyCash.length > 0 && (
//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25, 50]}
//               component="div"
//               count={totalCount}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//               labelRowsPerPage="Rows per page:"
//               labelDisplayedRows={({ from, to, count }) => 
//                 `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
//               }
//             />
//           )}
//         </Paper>

//         {/* Quick Stats */}
//         {pettyCash.length > 0 && (
//           <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Typography variant="body2" color="textSecondary">
//               Showing {pettyCash.length} of {totalCount} total entries
//               {searchTerm && ' (filtered)'}
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               Page Total: {formatCurrency(calculateCurrentPageTotal())} | 
//               Grand Total: {formatCurrency(totalAmount)}
//             </Typography>
//           </Box>
//         )}
//       </Container>
//     </Box>
//   );
// }

// export default PettyCashList;

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
  
  const [pettyCash, setPettyCash] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Check if current user is from accounts department
  const isAccountsDept = user?.role === 'accounts';

  // Parse URL search parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlPage = searchParams.get('page');
    const urlLimit = searchParams.get('limit');
    const urlVehicleNumber = searchParams.get('vehicle_number');
    const urlJobCardNumber = searchParams.get('job_card_number');

    // Set state from URL parameters
    if (urlPage) setPage(parseInt(urlPage) - 1); // Convert to 0-based index
    if (urlLimit) setRowsPerPage(parseInt(urlLimit));
    if (urlVehicleNumber) setSearchTerm(urlVehicleNumber);
    if (urlJobCardNumber && !urlVehicleNumber) setSearchTerm(urlJobCardNumber);
  }, [location.search]);

  // Update URL with current search parameters
  const updateURL = () => {
    const params = new URLSearchParams();
    params.append('page', (page + 1).toString());
    params.append('limit', rowsPerPage.toString());
    
    if (searchTerm) {
      params.append('vehicle_number', searchTerm);
      params.append('job_card_number', searchTerm);
    }

    // Update browser URL without page reload
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Fetch petty cash data from API
  const fetchPettyCash = async () => {
    try {
      setLoading(true);
      setError('');

      // Build query parameters for API call
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString()
      });

      // Add search parameters if provided
      if (searchTerm) {
        params.append('vehicle_number', searchTerm);
        params.append('job_card_number', searchTerm);
      }

      // Update browser URL
      updateURL();

      const response = await fetch(`${BASE_URL}/api/cash/petty?${params.toString()}`, {
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
      
      if (result.status && result.data) {
        setPettyCash(result.data.petty_cash || []);
        setTotalCount(result.data.total || 0);
        setTotalAmount(result.data.total_amount || 0);
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
  }, [page, rowsPerPage]); // Refetch when page or rowsPerPage changes

  // Handle search - reset to first page and fetch
  const handleSearch = () => {
    setPage(0);
    fetchPettyCash();
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
    // Clear URL parameters
    navigate(location.pathname, { replace: true });
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

  // Calculate total amount from current page data (fallback)
  const calculateCurrentPageTotal = () => {
    return pettyCash.reduce((total, entry) => total + parseFloat(entry.amount || 0), 0);
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
                  {totalCount}
                </Typography>
                <Typography variant="body2">
                  {searchTerm && 'Filtered results'}
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
                  {formatCurrency(totalAmount)}
                </Typography>
                <Typography variant="body2">
                  All entries total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#ff9800', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Page Total
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(calculateCurrentPageTotal())}
                </Typography>
                <Typography variant="body2">
                  {pettyCash.length} entries on this page
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by vehicle number or job card number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              Search
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {searchTerm && (
              <Typography variant="body2" color="textSecondary">
                Showing filtered results
              </Typography>
            )}
            {/* <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              disabled={pettyCash.length === 0}
            >
              Export
            </Button> */}
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
                {pettyCash.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="h6" color="textSecondary">
                        {searchTerm ? 'No matching petty cash entries found' : 'No petty cash entries found'}
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
                  pettyCash.map((entry) => (
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
          {pettyCash.length > 0 && (
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
        {pettyCash.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Showing {pettyCash.length} of {totalCount} total entries
              {searchTerm && ' (filtered)'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Page Total: {formatCurrency(calculateCurrentPageTotal())} | 
              Grand Total: {formatCurrency(totalAmount)}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default PettyCashList;
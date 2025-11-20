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
//   Chip,
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
//   PointOfSale as SalesIcon,
//   Refresh as RefreshIcon,
//   Download as DownloadIcon
// } from '@mui/icons-material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// function SalesList() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { token, user } = useAuth();
//   const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalCount, setTotalCount] = useState(0);
//   const [totalAmount, setTotalAmount] = useState(0);

//   // Check if current user is from accounts department
//   const isAccountsDept = user?.role === 'accounts';

//   // Parse URL search parameters on component mount
//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     const urlPage = searchParams.get('page');
//     const urlLimit = searchParams.get('limit');
//     const urlVehicleNumber = searchParams.get('vehicle_number');
//     const urlJobCardNumber = searchParams.get('job_card_number');

//     // Set state from URL parameters
//     if (urlPage) setPage(parseInt(urlPage) - 1); // Convert to 0-based index
//     if (urlLimit) setRowsPerPage(parseInt(urlLimit));
//     if (urlVehicleNumber) setSearchTerm(urlVehicleNumber);
//     if (urlJobCardNumber && !urlVehicleNumber) setSearchTerm(urlJobCardNumber);
//   }, [location.search]);

//   // Update URL with current search parameters
//   const updateURL = () => {
//     const params = new URLSearchParams();
//     params.append('page', (page + 1).toString());
//     params.append('limit', rowsPerPage.toString());
    
//     if (searchTerm) {
//       params.append('vehicle_number', searchTerm);
//       params.append('job_card_number', searchTerm);
//     }

//     // Update browser URL without page reload
//     navigate(`${location.pathname}?${params.toString()}`, { replace: true });
//   };

//   // Fetch sales data from API
//   const fetchSales = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       // Build query parameters for API call
//       const params = new URLSearchParams({
//         page: (page + 1).toString(),
//         limit: rowsPerPage.toString()
//       });

//       // Add search parameters if provided
//       if (searchTerm) {
//         params.append('vehicle_number', searchTerm);
//         params.append('job_card_number', searchTerm);
//       }

//       // Update browser URL
//       updateURL();

//       const response = await fetch(`${BASE_URL}/api/cash/sales?${params.toString()}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch sales: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('✅ Sales list fetched:', result);
      
//       if (result.status && result.data) {
//         setSales(result.data.sales_cash || []);
//         setTotalCount(result.data.total || 0);
//         setTotalAmount(result.data.total_amount || 0);
//       } else {
//         throw new Error('Invalid response format from sales API');
//       }
      
//     } catch (error) {
//       console.error('❌ Error fetching sales:', error);
//       setError(error.message || 'Failed to fetch sales data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSales();
//   }, [page, rowsPerPage]); // Refetch when page or rowsPerPage changes

//   // Handle search - reset to first page and fetch
//   const handleSearch = () => {
//     setPage(0);
//     fetchSales();
//   };

//   // Handle clear search
//   const handleClearSearch = () => {
//     setSearchTerm('');
//     setPage(0);
//     // Clear URL parameters
//     navigate(location.pathname, { replace: true });
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
//     navigate(`/sales/${id}`);
//   };

//   const handleEdit = (id) => {
//     navigate(`/sales/edit/${id}`);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this sales entry?')) {
//       try {
//         const response = await fetch(`${BASE_URL}/api/cash/sales/${id}`, {
//           method: 'DELETE',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           // Refresh the list
//           fetchSales();
//         } else {
//           alert('Failed to delete sales entry');
//         }
//       } catch (error) {
//         console.error('Error deleting sales entry:', error);
//         alert('Error deleting sales entry');
//       }
//     }
//   };

//   const handleCreateNew = () => {
//     navigate('/sales/create');
//   };

//   // Calculate current page total amount
//   const calculateCurrentPageTotal = () => {
//     return sales.reduce((total, entry) => total + parseFloat(entry.amount || 0), 0);
//   };

//   // Calculate sales by payment mode for current page
//   const calculatePaymentModeTotals = () => {
//     const totals = {};
//     sales.forEach(entry => {
//       const mode = entry.mode_of_payment || 'Unknown';
//       totals[mode] = (totals[mode] || 0) + parseFloat(entry.amount || 0);
//     });
//     return totals;
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//         <CircularProgress size={60} />
//         <Typography variant="h6" sx={{ ml: 2 }}>
//           Loading sales data...
//         </Typography>
//       </Box>
//     );
//   }

//   const paymentModeTotals = calculatePaymentModeTotals();

//   return (
//     <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 3 }}>
//       <Container maxWidth="xl">
//         {/* Header */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Box>
//             <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
//               💵 Sales Management
//             </Typography>
//             <Typography variant="body1" color="textSecondary">
//               Manage and track all sales transactions
//             </Typography>
//           </Box>
          
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Button
//               variant="outlined"
//               startIcon={<RefreshIcon />}
//               onClick={fetchSales}
//             >
//               Refresh
//             </Button>
//             {isAccountsDept && (
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleCreateNew}
//               >
//                 New Sales Entry
//               </Button>
//             )}
//           </Box>
//         </Box>

//         {/* Summary Cards */}
//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           <Grid item xs={12} md={3}>
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
//           <Grid item xs={12} md={3}>
//             <Card sx={{ backgroundColor: '#4caf50', color: 'white' }}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Total Sales
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
//           <Grid item xs={12} md={3}>
//             <Card sx={{ backgroundColor: '#ff9800', color: 'white' }}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Current Page
//                 </Typography>
//                 <Typography variant="h4" fontWeight="bold">
//                   {formatCurrency(calculateCurrentPageTotal())}
//                 </Typography>
//                 <Typography variant="body2">
//                   {sales.length} entries
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} md={3}>
//             <Card sx={{ backgroundColor: '#9c27b0', color: 'white' }}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Payment Modes
//                 </Typography>
//                 <Typography variant="h4" fontWeight="bold">
//                   {Object.keys(paymentModeTotals).length}
//                 </Typography>
//                 <Typography variant="body2">
//                   On this page
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Payment Mode Breakdown */}
//         {Object.keys(paymentModeTotals).length > 0 && (
//           <Grid container spacing={2} sx={{ mb: 3 }}>
//             {Object.entries(paymentModeTotals).map(([mode, total]) => (
//               <Grid item xs={12} sm={6} md={3} key={mode}>
//                 <Card variant="outlined">
//                   <CardContent sx={{ py: 2 }}>
//                     <Typography variant="body2" color="textSecondary" gutterBottom>
//                       {mode}
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold" color="primary">
//                       {formatCurrency(total)}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         )}

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
//               disabled={sales.length === 0}
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

//         {/* Sales Table */}
//         <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//           <TableContainer sx={{ maxHeight: 600 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell><strong>ID</strong></TableCell>
//                   <TableCell><strong>Vehicle Number</strong></TableCell>
//                   <TableCell><strong>Job Card</strong></TableCell>
//                   <TableCell><strong>Payment Mode</strong></TableCell>
//                   <TableCell><strong>Transaction #</strong></TableCell>
//                   <TableCell><strong>Amount</strong></TableCell>
//                   <TableCell><strong>Date</strong></TableCell>
//                   <TableCell><strong>Actions</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sales.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
//                       <SalesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
//                       <Typography variant="h6" color="textSecondary">
//                         {searchTerm ? 'No matching sales entries found' : 'No sales entries found'}
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
//                   sales.map((entry) => (
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
//                           S-{entry.id?.toString().padStart(4, '0')}
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
//                         <Chip 
//                           label={entry.mode_of_payment || 'N/A'} 
//                           color="primary"
//                           variant="outlined"
//                           size="small"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {entry.transaction_number || 'N/A'}
//                         </Typography>
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
//           {sales.length > 0 && (
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
//         {sales.length > 0 && (
//           <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Typography variant="body2" color="textSecondary">
//               Showing {sales.length} of {totalCount} total entries
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

// export default SalesList;


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
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function SalesList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Check if current user is from accounts department
  const isAccountsDept = user?.role === 'accounts';

  // Parse URL search parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlPage = searchParams.get('page');
    const urlLimit = searchParams.get('limit');
    const urlSearch = searchParams.get('search');

    // Set state from URL parameters
    if (urlPage) setPage(parseInt(urlPage) - 1);
    if (urlLimit) setRowsPerPage(parseInt(urlLimit));
    if (urlSearch) setSearchTerm(urlSearch);
  }, [location.search]);

  // Fetch sales data from API
  const fetchSales = async (searchQuery = '') => {
    try {
      setLoading(true);
      setError('');

      // Build query parameters for API call
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString()
      });

      // Add search parameter if provided
      const finalSearchQuery = searchQuery || searchTerm;
      if (finalSearchQuery.trim()) {
        params.append('search', finalSearchQuery.trim());
      }

      // Update browser URL
      updateURL(finalSearchQuery);

      console.log('🔍 Fetching sales with params:', params.toString());

      const response = await fetch(`${BASE_URL}/api/cash/sales?${params.toString()}`, {
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
      console.log('✅ Sales API Response:', result);
      
      if (result.status && result.data) {
        setSales(result.data.sales_cash || []);
        setTotalCount(result.data.total || 0);
        setTotalAmount(result.data.total_amount || 0);
      } else {
        throw new Error('Invalid response format from sales API');
      }
      
    } catch (error) {
      console.error('❌ Error fetching sales:', error);
      setError(error.message || 'Failed to fetch sales data');
      // Clear data on error
      setSales([]);
      setTotalCount(0);
      setTotalAmount(0);
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

    // Update browser URL without page reload
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Effect to fetch sales when page or rowsPerPage changes
  useEffect(() => {
    fetchSales();
  }, [page, rowsPerPage]);

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      setPage(0); // Reset to first page when searching
      fetchSales(value);
    }, 500); // 500ms debounce delay

    setSearchTimeout(newTimeout);
  };

  // Handle manual search button click
  const handleSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setPage(0);
    fetchSales();
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    // Clear URL parameters and fetch without search
    navigate(location.pathname, { replace: true });
    fetchSales('');
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
    navigate(`/petty-sales/${id}`);
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

  // Calculate current page total amount
  const calculateCurrentPageTotal = () => {
    return sales.reduce((total, entry) => total + parseFloat(entry.amount || 0), 0);
  };

  // Calculate sales by payment mode for current page
  const calculatePaymentModeTotals = () => {
    const totals = {};
    sales.forEach(entry => {
      const mode = entry.mode_of_payment || 'Unknown';
      totals[mode] = (totals[mode] || 0) + parseFloat(entry.amount || 0);
    });
    return totals;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  if (loading && sales.length === 0) {
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
              onClick={() => fetchSales()}
              disabled={loading}
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
            <Card sx={{ backgroundColor: '#e3f2fd', color: 'blue' }}>
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
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#e8f5e8', color: 'green' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Sales
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
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#fff3e0', color: 'orange' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Page
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(calculateCurrentPageTotal())}
                </Typography>
                <Typography variant="body2">
                  {sales.length} entries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#f3e5f5', color: 'purple' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Modes
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {Object.keys(paymentModeTotals).length}
                </Typography>
                <Typography variant="body2">
                  On this page
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
              placeholder="Search by vehicle number, job card number, transaction number..."
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
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <SalesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="h6" color="textSecondary">
                        {searchTerm ? `No sales entries found for "${searchTerm}"` : 'No sales entries found'}
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
                  sales.map((entry) => (
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
          {sales.length > 0 && (
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
        {sales.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Showing {sales.length} of {totalCount} total entries
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

export default SalesList;
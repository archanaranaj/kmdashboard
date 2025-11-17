// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Button,
//   Grid,
//   Paper,
//   Divider,
//   Chip,
//   Container,
//   Alert,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   MenuItem,
//   InputAdornment,
//   Tabs,
//   Tab
// } from '@mui/material';
// import { 
//   ArrowBack as ArrowBackIcon,
//   Assignment as AssignmentIcon,
//   Add as AddIcon,
//   Visibility as ViewIcon,
//   AttachFile as AttachFileIcon,
//   PointOfSale as SalesIcon
// } from '@mui/icons-material';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// function JobCardView() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { token, user } = useAuth();
//   const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
//   const [jobCard, setJobCard] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [assignDialogOpen, setAssignDialogOpen] = useState(false);
//   const [jobCardNumber, setJobCardNumber] = useState('');
//   const [assignLoading, setAssignLoading] = useState(false);
//   const [assignError, setAssignError] = useState('');
  
//   // Petty Cash States
//   const [pettyCashEntries, setPettyCashEntries] = useState([]);
//   const [pettyCashLoading, setPettyCashLoading] = useState(false);
//   const [addPettyDialogOpen, setAddPettyDialogOpen] = useState(false);
//   const [pettyCashForm, setPettyCashForm] = useState({
//     description: '',
//     amount: '',
//     vehicle_number: '',
//     job_card_number: '',
//     file: null
//   });
//   const [submittingPetty, setSubmittingPetty] = useState(false);

//   // Petty Sales States
//   const [pettySalesEntries, setPettySalesEntries] = useState([]);
//   const [pettySalesLoading, setPettySalesLoading] = useState(false);
//   const [addSalesDialogOpen, setAddSalesDialogOpen] = useState(false);
//   const [pettySalesForm, setPettySalesForm] = useState({
//     vehicle_number: '',
//     job_card_number: '',
//     amount: '',
//     mode_of_payment: '',
//     transaction_number: '',
//     file: null
//   });
//   const [submittingSales, setSubmittingSales] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);

//   // Check if current user is from accounts department
//   const isAccountsDept = user?.role === 'accounts';

//   // Payment modes
//   const paymentModes = [
//     'Cash',
//     'Credit Card',
//     'Debit Card',
//     'Bank Transfer',
//     'Mobile Payment',
//     'Check'
//   ];

//   // Fetch job card data from API
//   useEffect(() => {
//     const fetchJobCard = async () => {
//       try {
//         setLoading(true);
//         setError('');

//         console.log('🔍 Fetching job card details...');
        
//         const response = await fetch(`${BASE_URL}/api/job-cards/${id}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch job card: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log('✅ Job card fetched:', result);
        
//         if (result.status && result.data) {
//           setJobCard(result.data);
//           // Set vehicle number in forms
//           setPettyCashForm(prev => ({
//             ...prev,
//             vehicle_number: result.data.vehicle_number,
//             job_card_number: result.data.job_card_number || ''
//           }));
//           setPettySalesForm(prev => ({
//             ...prev,
//             vehicle_number: result.data.vehicle_number,
//             job_card_number: result.data.job_card_number || ''
//           }));
//         } else {
//           throw new Error('Job card not found');
//         }
        
//       } catch (error) {
//         console.error('❌ Error fetching job card:', error);
//         setError(error.message || 'Failed to fetch job card details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobCard();
//   }, [id, token, BASE_URL]);

//   // Fetch petty cash entries
//   const fetchPettyCashEntries = async () => {
//     try {
//       setPettyCashLoading(true);
      
//       let url = `${BASE_URL}/api/cash/petty`;
//       const params = new URLSearchParams();
      
//       if (jobCard?.job_card_number) {
//         params.append('job_card_number', jobCard.job_card_number);
//         console.log(`🔍 Fetching petty cash for job card number: ${jobCard.job_card_number}`);
//       } else {
//         console.log('ℹ️ No job card number assigned, skipping petty cash fetch');
//         setPettyCashEntries([]);
//         return;
//       }
      
//       if (jobCard?.vehicle_number) {
//         params.append('vehicle_number', jobCard.vehicle_number);
//       }
      
//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }

//       console.log(`📡 Fetching petty cash from: ${url}`);

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log('✅ Petty cash entries fetched:', result);
//         if (result.status && result.data) {
//           setPettyCashEntries(result.data);
//         } else {
//           setPettyCashEntries([]);
//         }
//       } else {
//         console.error('❌ Failed to fetch petty cash entries');
//         setPettyCashEntries([]);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching petty cash entries:', error);
//       setPettyCashEntries([]);
//     } finally {
//       setPettyCashLoading(false);
//     }
//   };

//   // Fetch petty sales entries
//   const fetchPettySalesEntries = async () => {
//     try {
//       setPettySalesLoading(true);
      
//       let url = `${BASE_URL}/api/cash/sales`;
//       const params = new URLSearchParams();
      
//       if (jobCard?.job_card_number) {
//         params.append('job_card_number', jobCard.job_card_number);
//         console.log(`🔍 Fetching petty sales for job card number: ${jobCard.job_card_number}`);
//       } else {
//         console.log('ℹ️ No job card number assigned, skipping petty sales fetch');
//         setPettySalesEntries([]);
//         return;
//       }
      
//       if (jobCard?.vehicle_number) {
//         params.append('vehicle_number', jobCard.vehicle_number);
//       }
      
//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }

//       console.log(`📡 Fetching petty sales from: ${url}`);

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log('✅ Petty sales entries fetched:', result);
//         if (result.status && result.data) {
//           setPettySalesEntries(result.data);
//         } else {
//           setPettySalesEntries([]);
//         }
//       } else {
//         console.error('❌ Failed to fetch petty sales entries');
//         setPettySalesEntries([]);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching petty sales entries:', error);
//       setPettySalesEntries([]);
//     } finally {
//       setPettySalesLoading(false);
//     }
//   };

//   // Fetch both petty cash and sales when job card is loaded
//   useEffect(() => {
//     if (jobCard) {
//       fetchPettyCashEntries();
//       fetchPettySalesEntries();
//     }
//   }, [jobCard, token, BASE_URL]);

//   // Open assign number dialog
//   const handleOpenAssignDialog = () => {
//     if (!isAccountsDept) return;
    
//     setAssignDialogOpen(true);
//     setJobCardNumber('');
//     setAssignError('');
//   };

//   // Assign job card number
//   const handleAssignNumber = async () => {
//     try {
//       setAssignLoading(true);
//       setAssignError('');

//       if (!jobCardNumber) {
//         throw new Error('Please enter a job card number');
//       }

//       const response = await fetch(`${BASE_URL}/api/job-cards/${id}/assign-number`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           job_card_number: parseInt(jobCardNumber)
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         if (response.status === 400) {
//           throw new Error(result.message || 'Invalid job card number or already in use');
//         }
//         throw new Error(`Failed to assign job card number: ${response.status}`);
//       }

//       console.log('✅ Job card number assigned:', result);
      
//       // Close dialog and refresh job card data
//       setAssignDialogOpen(false);
//       setJobCardNumber('');
      
//       // Refresh job card to show the assigned number
//       const refreshResponse = await fetch(`${BASE_URL}/api/job-cards/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (refreshResponse.ok) {
//         const refreshResult = await refreshResponse.json();
//         if (refreshResult.status && refreshResult.data) {
//           setJobCard(refreshResult.data);
//           // Update forms with new job card number
//           setPettyCashForm(prev => ({
//             ...prev,
//             job_card_number: refreshResult.data.job_card_number
//           }));
//           setPettySalesForm(prev => ({
//             ...prev,
//             job_card_number: refreshResult.data.job_card_number
//           }));
//           // Refresh both petty cash and sales entries
//           fetchPettyCashEntries();
//           fetchPettySalesEntries();
//         }
//       }
      
//     } catch (error) {
//       console.error('❌ Error assigning job card number:', error);
//       setAssignError(error.message);
//     } finally {
//       setAssignLoading(false);
//     }
//   };

//   // Handle petty cash form changes
//   const handlePettyCashChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'file') {
//       setPettyCashForm(prev => ({
//         ...prev,
//         file: files[0] || null
//       }));
//     } else {
//       setPettyCashForm(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   // Handle petty sales form changes
//   const handlePettySalesChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'file') {
//       setPettySalesForm(prev => ({
//         ...prev,
//         file: files[0] || null
//       }));
//     } else {
//       setPettySalesForm(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   // Submit petty cash form
//   const handleSubmitPettyCash = async () => {
//     try {
//       setSubmittingPetty(true);

//       if (!pettyCashForm.description || !pettyCashForm.amount) {
//         throw new Error('Description and amount are required');
//       }

//       const formData = new FormData();
//       formData.append('description', pettyCashForm.description);
//       formData.append('amount', pettyCashForm.amount);
      
//       if (pettyCashForm.vehicle_number) {
//         formData.append('vehicle_number', pettyCashForm.vehicle_number);
//       }
      
//       if (pettyCashForm.job_card_number) {
//         formData.append('job_card_number', pettyCashForm.job_card_number);
//       }
      
//       if (pettyCashForm.file) {
//         formData.append('file', pettyCashForm.file);
//       }

//       const response = await fetch(`${BASE_URL}/api/cash/petty`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to create petty cash entry');
//       }

//       console.log('✅ Petty cash entry created:', result);
      
//       // Reset form and close dialog
//       setPettyCashForm({
//         description: '',
//         amount: '',
//         vehicle_number: jobCard?.vehicle_number || '',
//         job_card_number: jobCard?.job_card_number || '',
//         file: null
//       });
//       setAddPettyDialogOpen(false);
      
//       // Refresh petty cash entries
//       fetchPettyCashEntries();
      
//     } catch (error) {
//       console.error('❌ Error creating petty cash entry:', error);
//       alert(error.message || 'Failed to create petty cash entry');
//     } finally {
//       setSubmittingPetty(false);
//     }
//   };

//   // Submit petty sales form
//   const handleSubmitPettySales = async () => {
//     try {
//       setSubmittingSales(true);

//       if (!pettySalesForm.amount || !pettySalesForm.mode_of_payment) {
//         throw new Error('Amount and mode of payment are required');
//       }

//       const formData = new FormData();
//       formData.append('amount', pettySalesForm.amount);
//       formData.append('mode_of_payment', pettySalesForm.mode_of_payment);
      
//       if (pettySalesForm.vehicle_number) {
//         formData.append('vehicle_number', pettySalesForm.vehicle_number);
//       }
      
//       if (pettySalesForm.job_card_number) {
//         formData.append('job_card_number', pettySalesForm.job_card_number);
//       }
      
//       if (pettySalesForm.transaction_number) {
//         formData.append('transaction_number', pettySalesForm.transaction_number);
//       }
      
//       if (pettySalesForm.file) {
//         formData.append('file', pettySalesForm.file);
//       }

//       const response = await fetch(`${BASE_URL}/api/cash/sales`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to create sales entry');
//       }

//       console.log('✅ Sales entry created:', result);
      
//       // Reset form and close dialog
//       setPettySalesForm({
//         vehicle_number: jobCard?.vehicle_number || '',
//         job_card_number: jobCard?.job_card_number || '',
//         amount: '',
//         mode_of_payment: '',
//         transaction_number: '',
//         file: null
//       });
//       setAddSalesDialogOpen(false);
      
//       // Refresh petty sales entries
//       fetchPettySalesEntries();
      
//     } catch (error) {
//       console.error('❌ Error creating sales entry:', error);
//       alert(error.message || 'Failed to create sales entry');
//     } finally {
//       setSubmittingSales(false);
//     }
//   };

//   // View petty cash details
//   const handleViewPettyCash = (pettyCashId) => {
//     navigate(`/petty-cash/${pettyCashId}`);
//   };

//   // View petty sales details
//   const handleViewPettySales = (salesId) => {
//     navigate(`/petty-sales/${salesId}`);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   const getServiceAdvisorName = (serviceAdvisor) => {
//     if (!serviceAdvisor) return 'N/A';
//     return serviceAdvisor.username || serviceAdvisor.name || 'Unknown Advisor';
//   };

//   const getBranchName = (serviceAdvisor) => {
//     if (!serviceAdvisor?.branch) return 'N/A';
//     return serviceAdvisor.branch.name || 'Unknown Branch';
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'completed':
//         return 'success';
//       case 'in progress':
//       case 'active':
//         return 'warning';
//       case 'pending':
//         return 'default';
//       case 'delivered':
//         return 'info';
//       default:
//         return 'default';
//     }
//   };

//   const getStatusDisplay = (status) => {
//     if (!status) return 'Pending';
//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//         <CircularProgress size={60} />
//         <Typography variant="h6" sx={{ ml: 2 }}>
//           Loading job card details...
//         </Typography>
//       </Box>
//     );
//   }

//   if (error || !jobCard) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/job-cards')}>
//           Back to Job Cards
//         </Button>
//         <Alert severity="error" sx={{ mt: 2 }}>
//           {error || 'Job card not found'}
//         </Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 3 }}>
//       <Container maxWidth="lg">
//         {/* Header with Back Button */}
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//           <Button 
//             startIcon={<ArrowBackIcon />} 
//             onClick={() => navigate('/job-cards')}
//             variant="outlined"
//             sx={{ mr: 2 }}
//           >
//             Back
//           </Button>
//           <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
//             Job Card Details
//           </Typography>
//         </Box>

//         {/* Main Content Grid */}
//         <Grid container spacing={3}>
//           {/* Left Side - Main Job Card Information */}
//           <Grid item xs={12} lg={8}>
//             <Card sx={{ height: '100%', boxShadow: 3 }}>
//               <CardContent sx={{ p: 4 }}>
//                 {/* Job Card Header */}
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
//                   <Box>
//                     <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
//                       {jobCard.vehicle_number}
//                     </Typography>
//                     <Typography variant="h6" color="textSecondary">
//                       Job Card #JC-{jobCard.id.toString().padStart(4, '0')}
//                       {jobCard.job_card_number && (
//                         <Chip 
//                           label={`Assigned #: ${jobCard.job_card_number}`} 
//                           color="success" 
//                           size="small" 
//                           sx={{ ml: 1 }}
//                         />
//                       )}
//                     </Typography>
//                     {/* Show assigned number prominently for accounts department */}
//                     {isAccountsDept && jobCard.job_card_number && (
//                       <Typography variant="h5" color="success.main" sx={{ mt: 1 }}>
//                         📋 Assigned Number: {jobCard.job_card_number}
//                       </Typography>
//                     )}
//                   </Box>
//                   <Chip 
//                     label={getStatusDisplay(jobCard.status)} 
//                     color={getStatusColor(jobCard.status)}
//                     size="large"
//                     sx={{ fontSize: '1rem', px: 2 }}
//                   />
//                 </Box>

//                 <Divider sx={{ mb: 4 }} />

//                 {/* Primary Information Grid */}
//                 <Grid container spacing={4}>
//                   {/* Vehicle Information */}
//                   <Grid item xs={12} md={6}>
//                     <Paper sx={{ p: 3, backgroundColor: '#49a3f1', color: 'white' }}>
//                       <Typography variant="h6" gutterBottom fontWeight="bold">
//                         🚗 Vehicle Information
//                       </Typography>
//                       <Box sx={{ mt: 2 }}>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Vehicle Number:</strong> {jobCard.vehicle_number || 'N/A'}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Chassis Number:</strong> {jobCard.chassis_number || 'N/A'}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Car Make:</strong> {jobCard.car_make || 'N/A'}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Car Model:</strong> {jobCard.car_model || 'N/A'}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Car Year:</strong> {jobCard.car_year || 'N/A'}
//                         </Typography>
//                         {jobCard.number_plate && (
//                           <Typography variant="body1" gutterBottom>
//                             <strong>Number Plate:</strong> {jobCard.number_plate.plate_number || 'N/A'}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Paper>
//                   </Grid>

//                   {/* Customer Information */}
//                   <Grid item xs={12} md={6}>
//                     <Paper sx={{ p: 3, backgroundColor: '#ee358bff', color: 'white' }}>
//                       <Typography variant="h6" gutterBottom fontWeight="bold">
//                         👤 Customer Information
//                       </Typography>
//                       <Box sx={{ mt: 2 }}>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Customer Name:</strong> {jobCard.customer_name || 'N/A'}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Contact Number:</strong> {jobCard.customer_number || 'N/A'}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Email:</strong> {jobCard.customer_email || 'N/A'}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Insurance:</strong> {jobCard.insurance_name || 'N/A'}
//                         </Typography>
//                       </Box>
//                     </Paper>
//                   </Grid>
//                 </Grid>

//                 {/* Service Information */}
//                 <Grid container spacing={3} sx={{ mt: 1 }}>
//                   <Grid item xs={12} md={6}>
//                     <Paper sx={{ p: 3, backgroundColor: 'grey.100' }}>
//                       <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
//                         🛠️ Service Details
//                       </Typography>
//                       <Box sx={{ mt: 2 }}>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Service Advisor:</strong> {getServiceAdvisorName(jobCard.service_advisor)}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Branch:</strong> {getBranchName(jobCard.service_advisor)}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Job Date:</strong> {formatDate(jobCard.date)}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Promised Date:</strong> {formatDate(jobCard.promised_delivery_date)}
//                         </Typography>
//                       </Box>
//                     </Paper>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Paper sx={{ p: 3, backgroundColor: 'grey.100' }}>
//                       <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
//                         📅 Timeline
//                       </Typography>
//                       <Box sx={{ mt: 2 }}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                           <Typography variant="body2">Job Created</Typography>
//                           <Typography variant="body2" color="textSecondary">
//                             {formatDate(jobCard.created_at)}
//                           </Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                           <Typography variant="body2">Job Date</Typography>
//                           <Typography variant="body2" color="textSecondary">
//                             {formatDate(jobCard.date)}
//                           </Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                           <Typography variant="body2">Estimated Completion</Typography>
//                           <Typography variant="body2" color="textSecondary">
//                             {formatDate(jobCard.promised_delivery_date)}
//                           </Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                           <Typography variant="body2">Last Updated</Typography>
//                           <Typography variant="body2" color="textSecondary">
//                             {formatDate(jobCard.updated_at)}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </Paper>
//                   </Grid>
//                 </Grid>

//                 {/* Job Description */}
//                 <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f1d32bff' }}>
//                   <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
//                     📝 Job Description
//                   </Typography>
//                   <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
//                     {jobCard.job_description || 'No job description provided.'}
//                   </Typography>
//                 </Paper>

//                 {/* Petty Cash & Sales Section */}
//                 <Paper sx={{ p: 3, mt: 3 }}>
//                   <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//                     <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
//                       <Tab 
//                         icon={<AttachFileIcon />} 
//                         label="Petty Cash" 
//                         iconPosition="start"
//                       />
//                       <Tab 
//                         icon={<SalesIcon />} 
//                         label="Petty Sales" 
//                         iconPosition="start"
//                       />
//                     </Tabs>
//                   </Box>

//                   {!jobCard.job_card_number ? (
//                     <Box sx={{ textAlign: 'center', py: 4 }}>
//                       <Alert severity="info">
//                         <Typography variant="body1" gutterBottom>
//                           No job card number assigned yet.
//                         </Typography>
//                         <Typography variant="body2">
//                           Please assign a job card number to view and add petty cash/sales entries.
//                         </Typography>
//                         {isAccountsDept && (
//                           <Button 
//                             variant="outlined" 
//                             color="primary" 
//                             sx={{ mt: 1 }}
//                             onClick={handleOpenAssignDialog}
//                           >
//                             Assign Job Card Number
//                           </Button>
//                         )}
//                       </Alert>
//                     </Box>
//                   ) : (
//                     <>
//                       {/* Petty Cash Tab */}
//                       {activeTab === 0 && (
//                         <Box>
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                             <Typography variant="h6" color="primary" fontWeight="bold">
//                               💰 Petty Cash Entries
//                               <Typography variant="body2" color="textSecondary">
//                                 Filtered by Job Card Number: {jobCard.job_card_number}
//                               </Typography>
//                             </Typography>
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               startIcon={<AddIcon />}
//                               onClick={() => setAddPettyDialogOpen(true)}
//                             >
//                               Add Petty Cash
//                             </Button>
//                           </Box>

//                           {pettyCashLoading ? (
//                             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                               <CircularProgress />
//                             </Box>
//                           ) : pettyCashEntries.length > 0 ? (
//                             <TableContainer>
//                               <Table>
//                                 <TableHead>
//                                   <TableRow>
//                                     <TableCell><strong>Description</strong></TableCell>
//                                     <TableCell><strong>Amount</strong></TableCell>
//                                     <TableCell><strong>Date</strong></TableCell>
//                                     <TableCell><strong>Actions</strong></TableCell>
//                                   </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                   {pettyCashEntries.map((entry) => (
//                                     <TableRow key={entry.id}>
//                                       <TableCell>{entry.description}</TableCell>
//                                       <TableCell>{formatCurrency(entry.amount)}</TableCell>
//                                       <TableCell>{formatDate(entry.created_at)}</TableCell>
//                                       <TableCell>
//                                         <IconButton
//                                           color="primary"
//                                           onClick={() => handleViewPettyCash(entry.id)}
//                                         >
//                                           <ViewIcon />
//                                         </IconButton>
//                                       </TableCell>
//                                     </TableRow>
//                                   ))}
//                                 </TableBody>
//                               </Table>
//                             </TableContainer>
//                           ) : (
//                             <Box sx={{ textAlign: 'center', py: 4 }}>
//                               <Typography variant="body1" color="textSecondary">
//                                 No petty cash entries found for job card number: {jobCard.job_card_number}
//                               </Typography>
//                             </Box>
//                           )}
//                         </Box>
//                       )}

//                       {/* Petty Sales Tab */}
//                       {activeTab === 1 && (
//                         <Box>
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                             <Typography variant="h6" color="primary" fontWeight="bold">
//                               💳 Petty Sales Entries
//                               <Typography variant="body2" color="textSecondary">
//                                 Filtered by Job Card Number: {jobCard.job_card_number}
//                               </Typography>
//                             </Typography>
//                             <Button
//                               variant="contained"
//                               color="secondary"
//                               startIcon={<AddIcon />}
//                               onClick={() => setAddSalesDialogOpen(true)}
//                             >
//                               Add Sales Entry
//                             </Button>
//                           </Box>

//                           {pettySalesLoading ? (
//                             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                               <CircularProgress />
//                             </Box>
//                           ) : pettySalesEntries.length > 0 ? (
//                             <TableContainer>
//                               <Table>
//                                 <TableHead>
//                                   <TableRow>
//                                     <TableCell><strong>Amount</strong></TableCell>
//                                     <TableCell><strong>Payment Mode</strong></TableCell>
//                                     <TableCell><strong>Transaction #</strong></TableCell>
//                                     <TableCell><strong>Date</strong></TableCell>
//                                     <TableCell><strong>Actions</strong></TableCell>
//                                   </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                   {pettySalesEntries.map((entry) => (
//                                     <TableRow key={entry.id}>
//                                       <TableCell>{formatCurrency(entry.amount)}</TableCell>
//                                       <TableCell>
//                                         <Chip 
//                                           label={entry.mode_of_payment} 
//                                           size="small" 
//                                           color="primary" 
//                                           variant="outlined"
//                                         />
//                                       </TableCell>
//                                       <TableCell>{entry.transaction_number || 'N/A'}</TableCell>
//                                       <TableCell>{formatDate(entry.created_at)}</TableCell>
//                                       <TableCell>
//                                         <IconButton
//                                           color="primary"
//                                           onClick={() => handleViewPettySales(entry.id)}
//                                         >
//                                           <ViewIcon />
//                                         </IconButton>
//                                       </TableCell>
//                                     </TableRow>
//                                   ))}
//                                 </TableBody>
//                               </Table>
//                             </TableContainer>
//                           ) : (
//                             <Box sx={{ textAlign: 'center', py: 4 }}>
//                               <Typography variant="body1" color="textSecondary">
//                                 No sales entries found for job card number: {jobCard.job_card_number}
//                               </Typography>
//                             </Box>
//                           )}
//                         </Box>
//                       )}
//                     </>
//                   )}
//                 </Paper>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Right Side - Actions and Additional Info */}
//           <Grid item xs={12} lg={4}>
//             {/* Action Buttons Card */}
//             <Card sx={{ mb: 3, boxShadow: 3 }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
//                   Quick Actions
//                 </Typography>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                   <Button 
//                     variant="contained" 
//                     color="primary"
//                     size="large"
//                     onClick={() => navigate(`/job-cards/edit/${jobCard.id}`)}
//                     fullWidth
//                   >
//                     Edit Job Card
//                   </Button>
                  
//                   {/* Add Petty Cash Button */}
//                   <Button 
//                     variant="contained" 
//                     color="success"
//                     size="large"
//                     startIcon={<AddIcon />}
//                     onClick={() => setAddPettyDialogOpen(true)}
//                     disabled={!jobCard.job_card_number}
//                     fullWidth
//                   >
//                     {jobCard.job_card_number ? 'Add Petty Cash' : 'Assign Number First'}
//                   </Button>

//                   {/* Add Sales Button */}
//                   <Button 
//                     variant="contained" 
//                     color="secondary"
//                     size="large"
//                     startIcon={<SalesIcon />}
//                     onClick={() => setAddSalesDialogOpen(true)}
//                     disabled={!jobCard.job_card_number}
//                     fullWidth
//                   >
//                     {jobCard.job_card_number ? 'Add Sales Entry' : 'Assign Number First'}
//                   </Button>
                  
//                   {/* Assign Number Button - Only for Accounts Department */}
//                   {isAccountsDept && (
//                     <Button 
//                       variant="contained" 
//                       color="warning"
//                       size="large"
//                       startIcon={<AssignmentIcon />}
//                       onClick={handleOpenAssignDialog}
//                       disabled={!!jobCard.job_card_number}
//                       fullWidth
//                     >
//                       {jobCard.job_card_number ? 'Number Assigned' : 'Assign Job Card Number'}
//                     </Button>
//                   )}
                  
//                   <Button 
//                     variant="outlined" 
//                     color="secondary"
//                     size="large"
//                     onClick={() => window.print()}
//                     fullWidth
//                   >
//                     Print Job Card
//                   </Button>
//                   <Button 
//                     variant="outlined" 
//                     size="large"
//                     onClick={() => navigate('/job-cards')}
//                     fullWidth
//                   >
//                     Back to List
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>

//             {/* Assigned Number Card - Only for Accounts Department */}
//             {isAccountsDept && (
//               <Card sx={{ mb: 3, boxShadow: 3, border: '2px solid', borderColor: jobCard.job_card_number ? 'success.main' : 'warning.main' }}>
//                 <CardContent sx={{ p: 3 }}>
//                   <Typography variant="h6" gutterBottom color={jobCard.job_card_number ? 'success.main' : 'warning.main'} fontWeight="bold">
//                     📋 Job Card Number
//                   </Typography>
//                   {jobCard.job_card_number ? (
//                     <Box sx={{ textAlign: 'center', py: 2 }}>
//                       <Typography variant="h3" color="success.main" fontWeight="bold">
//                         {jobCard.job_card_number}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//                         Assigned by Accounts Department
//                       </Typography>
//                     </Box>
//                   ) : (
//                     <Box sx={{ textAlign: 'center', py: 2 }}>
//                       <Typography variant="body1" color="textSecondary" gutterBottom>
//                         No number assigned yet
//                       </Typography>
//                       <Button 
//                         variant="outlined" 
//                         color="warning"
//                         startIcon={<AssignmentIcon />}
//                         onClick={handleOpenAssignDialog}
//                         size="small"
//                       >
//                         Assign Number
//                       </Button>
//                     </Box>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {/* Financial Summary */}
//             <Card sx={{ mb: 3, boxShadow: 3 }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
//                   💰 Financial Summary
//                 </Typography>
//                 <Box sx={{ mt: 2 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                     <Typography variant="body2">Petty Cash Total:</Typography>
//                     <Typography variant="body2" fontWeight="bold">
//                       {formatCurrency(pettyCashEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0))}
//                     </Typography>
//                   </Box>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                     <Typography variant="body2">Sales Total:</Typography>
//                     <Typography variant="body2" fontWeight="bold">
//                       {formatCurrency(pettySalesEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0))}
//                     </Typography>
//                   </Box>
//                   <Divider sx={{ my: 1 }} />
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <Typography variant="body1" fontWeight="bold">Net Total:</Typography>
//                     <Typography variant="body1" fontWeight="bold" color="primary">
//                       {formatCurrency(
//                         pettySalesEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0) -
//                         pettyCashEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0)
//                       )}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>

//             {/* Service Notes */}
//             <Card sx={{ boxShadow: 3 }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
//                   ℹ️ Service Notes
//                 </Typography>
//                 <Box sx={{ mt: 2 }}>
//                   <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
//                     <Box component="span" sx={{ mr: 1 }}>•</Box>
//                     All services include complimentary vehicle inspection
//                   </Typography>
//                   <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
//                     <Box component="span" sx={{ mr: 1 }}>•</Box>
//                     Customer will be notified upon completion via SMS & Email
//                   </Typography>
//                   <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
//                     <Box component="span" sx={{ mr: 1 }}>•</Box>
//                     Additional repairs may require customer approval
//                   </Typography>
//                   <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
//                     <Box component="span" sx={{ mr: 1 }}>•</Box>
//                     Vehicle ready for pickup after final quality check
//                   </Typography>
//                   <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start' }}>
//                     <Box component="span" sx={{ mr: 1 }}>•</Box>
//                     24/7 Customer support available
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </Card>

//             {/* Contact Information */}
//             <Card sx={{ mt: 3, boxShadow: 3 }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
//                   📞 Contact Service Advisor
//                 </Typography>
//                 <Box sx={{ mt: 2 }}>
//                   <Typography variant="body1" gutterBottom>
//                     <strong>Name:</strong> {getServiceAdvisorName(jobCard.service_advisor)}
//                   </Typography>
//                   <Typography variant="body1" gutterBottom>
//                     <strong>Branch:</strong> {getBranchName(jobCard.service_advisor)}
//                   </Typography>
//                   <Typography variant="body1" gutterBottom>
//                     <strong>Email:</strong> {jobCard.service_advisor?.email || 'N/A'}
//                   </Typography>
//                   <Typography variant="body1" gutterBottom>
//                     <strong>Available:</strong> Mon - Fri, 8:00 AM - 6:00 PM
//                   </Typography>
//                   <Button 
//                     variant="contained" 
//                     color="success" 
//                     size="small" 
//                     sx={{ mt: 1 }}
//                     fullWidth
//                     onClick={() => {
//                       if (jobCard.service_advisor?.email) {
//                         window.location.href = `mailto:${jobCard.service_advisor.email}`;
//                       }
//                     }}
//                     disabled={!jobCard.service_advisor?.email}
//                   >
//                     {jobCard.service_advisor?.email ? 'Contact via Email' : 'Email Not Available'}
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>

//             {/* System Information */}
//             <Card sx={{ mt: 3, boxShadow: 3 }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
//                   🔧 System Information
//                 </Typography>
//                 <Box sx={{ mt: 2 }}>
//                   <Typography variant="body2" gutterBottom>
//                     <strong>Job Card ID:</strong> {jobCard.id}
//                   </Typography>
//                   <Typography variant="body2" gutterBottom>
//                     <strong>Number Plate ID:</strong> {jobCard.number_plate_id || 'N/A'}
//                   </Typography>
//                   <Typography variant="body2" gutterBottom>
//                     <strong>Service Advisor ID:</strong> {jobCard.service_advisor_id || 'N/A'}
//                   </Typography>
//                   <Typography variant="body2" gutterBottom>
//                     <strong>Created:</strong> {formatDate(jobCard.created_at)}
//                   </Typography>
//                   <Typography variant="body2" gutterBottom>
//                     <strong>Last Updated:</strong> {formatDate(jobCard.updated_at)}
//                   </Typography>
//                   {/* Show assigned number in system info for accounts */}
//                   {isAccountsDept && jobCard.job_card_number && (
//                     <Typography variant="body2" gutterBottom>
//                       <strong>Assigned Number:</strong> {jobCard.job_card_number}
//                     </Typography>
//                   )}
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Assign Number Dialog */}
//         <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
//           <DialogTitle>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <AssignmentIcon sx={{ mr: 1 }} />
//               Assign Job Card Number
//             </Box>
//           </DialogTitle>
//           <DialogContent>
//             {assignError && (
//               <Alert severity="error" sx={{ mb: 2 }}>
//                 {assignError}
//               </Alert>
//             )}
            
//             <Typography variant="body1" gutterBottom>
//               Assign a job card number for: <strong>{jobCard.vehicle_number}</strong>
//             </Typography>
            
//             <TextField
//               fullWidth
//               label="Job Card Number"
//               value={jobCardNumber}
//               onChange={(e) => setJobCardNumber(e.target.value)}
//               type="number"
//               sx={{ mt: 2 }}
//               placeholder="Enter job card number"
//             />
            
//             <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//               Enter the job card number to assign to this job card. This will enable petty cash and sales tracking.
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setAssignDialogOpen(false)} disabled={assignLoading}>
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleAssignNumber} 
//               variant="contained" 
//               disabled={assignLoading || !jobCardNumber}
//               startIcon={assignLoading ? <CircularProgress size={16} /> : <AssignmentIcon />}
//             >
//               {assignLoading ? 'Assigning...' : 'Assign Number'}
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Add Petty Cash Dialog */}
//         <Dialog open={addPettyDialogOpen} onClose={() => setAddPettyDialogOpen(false)} maxWidth="md" fullWidth>
//           <DialogTitle>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <AddIcon sx={{ mr: 1 }} />
//               Add Petty Cash Entry
//             </Box>
//           </DialogTitle>
//           <DialogContent>
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Description *"
//                   name="description"
//                   value={pettyCashForm.description}
//                   onChange={handlePettyCashChange}
//                   required
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Amount *"
//                   name="amount"
//                   type="number"
//                   value={pettyCashForm.amount}
//                   onChange={handlePettyCashChange}
//                   required
//                   InputProps={{
//                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                   }}
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Vehicle Number"
//                   name="vehicle_number"
//                   value={pettyCashForm.vehicle_number}
//                   onChange={handlePettyCashChange}
//                   disabled
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Job Card Number"
//                   name="job_card_number"
//                   value={pettyCashForm.job_card_number}
//                   onChange={handlePettyCashChange}
//                   disabled={!isAccountsDept}
//                   helperText={!isAccountsDept ? "Only accounts department can modify" : ""}
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <Button
//                   variant="outlined"
//                   component="label"
//                   fullWidth
//                   startIcon={<AttachFileIcon />}
//                   sx={{ height: '56px' }}
//                 >
//                   {pettyCashForm.file ? pettyCashForm.file.name : 'Attach File'}
//                   <input
//                     type="file"
//                     name="file"
//                     hidden
//                     onChange={handlePettyCashChange}
//                   />
//                 </Button>
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setAddPettyDialogOpen(false)} disabled={submittingPetty}>
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleSubmitPettyCash} 
//               variant="contained" 
//               disabled={submittingPetty || !pettyCashForm.description || !pettyCashForm.amount}
//               startIcon={submittingPetty ? <CircularProgress size={16} /> : <AddIcon />}
//             >
//               {submittingPetty ? 'Creating...' : 'Create Entry'}
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Add Petty Sales Dialog */}
//         <Dialog open={addSalesDialogOpen} onClose={() => setAddSalesDialogOpen(false)} maxWidth="md" fullWidth>
//           <DialogTitle>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <SalesIcon sx={{ mr: 1 }} />
//               Add Sales Entry
//             </Box>
//           </DialogTitle>
//           <DialogContent>
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Amount *"
//                   name="amount"
//                   type="number"
//                   value={pettySalesForm.amount}
//                   onChange={handlePettySalesChange}
//                   required
//                   InputProps={{
//                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                   }}
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   select
//                   label="Mode of Payment *"
//                   name="mode_of_payment"
//                   value={pettySalesForm.mode_of_payment}
//                   onChange={handlePettySalesChange}
//                   required
//                 >
//                   {paymentModes.map((mode) => (
//                     <MenuItem key={mode} value={mode}>
//                       {mode}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Transaction Number"
//                   name="transaction_number"
//                   value={pettySalesForm.transaction_number}
//                   onChange={handlePettySalesChange}
//                   placeholder="Optional"
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Vehicle Number"
//                   name="vehicle_number"
//                   value={pettySalesForm.vehicle_number}
//                   onChange={handlePettySalesChange}
//                   disabled
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Job Card Number"
//                   name="job_card_number"
//                   value={pettySalesForm.job_card_number}
//                   onChange={handlePettySalesChange}
//                   disabled={!isAccountsDept}
//                   helperText={!isAccountsDept ? "Only accounts department can modify" : ""}
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <Button
//                   variant="outlined"
//                   component="label"
//                   fullWidth
//                   startIcon={<AttachFileIcon />}
//                   sx={{ height: '56px' }}
//                 >
//                   {pettySalesForm.file ? pettySalesForm.file.name : 'Attach File'}
//                   <input
//                     type="file"
//                     name="file"
//                     hidden
//                     onChange={handlePettySalesChange}
//                   />
//                 </Button>
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setAddSalesDialogOpen(false)} disabled={submittingSales}>
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleSubmitPettySales} 
//               variant="contained" 
//               color="secondary"
//               disabled={submittingSales || !pettySalesForm.amount || !pettySalesForm.mode_of_payment}
//               startIcon={submittingSales ? <CircularProgress size={16} /> : <SalesIcon />}
//             >
//               {submittingSales ? 'Creating...' : 'Create Sales Entry'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </Box>
//   );
// }

// export default JobCardView;

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
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  AttachFile as AttachFileIcon,
  PointOfSale as SalesIcon,
  ExitToApp as GatePassIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function JobCardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [jobCard, setJobCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [jobCardNumber, setJobCardNumber] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');
  
  // Petty Cash States
  const [pettyCashEntries, setPettyCashEntries] = useState([]);
  const [pettyCashLoading, setPettyCashLoading] = useState(false);
  const [addPettyDialogOpen, setAddPettyDialogOpen] = useState(false);
  const [pettyCashForm, setPettyCashForm] = useState({
    description: '',
    amount: '',
    vehicle_number: '',
    job_card_number: '',
    file: null
  });
  const [submittingPetty, setSubmittingPetty] = useState(false);

  // Petty Sales States
  const [pettySalesEntries, setPettySalesEntries] = useState([]);
  const [pettySalesLoading, setPettySalesLoading] = useState(false);
  const [addSalesDialogOpen, setAddSalesDialogOpen] = useState(false);
  const [pettySalesForm, setPettySalesForm] = useState({
    vehicle_number: '',
    job_card_number: '',
    amount: '',
    mode_of_payment: '',
    transaction_number: '',
    file: null
  });
  const [submittingSales, setSubmittingSales] = useState(false);

  // Gate Pass States
  const [gatePassEntries, setGatePassEntries] = useState([]);
  const [gatePassLoading, setGatePassLoading] = useState(false);
  const [gatePassDialogOpen, setGatePassDialogOpen] = useState(false);
  const [creatingGatePass, setCreatingGatePass] = useState(false);
  const [gatePassError, setGatePassError] = useState('');

  const [activeTab, setActiveTab] = useState(0);

  // Check if current user is from accounts department
  const isAccountsDept = user?.role === 'accounts';

  // Payment modes
  const paymentModes = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Mobile Payment',
    'Check'
  ];

  // Fetch job card data from API
  useEffect(() => {
    const fetchJobCard = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('🔍 Fetching job card details...');
        
        const response = await fetch(`${BASE_URL}/api/job-cards/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch job card: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Job card fetched:', result);
        
        if (result.status && result.data) {
          setJobCard(result.data);
          // Set vehicle number in forms
          setPettyCashForm(prev => ({
            ...prev,
            vehicle_number: result.data.vehicle_number,
            job_card_number: result.data.job_card_number || ''
          }));
          setPettySalesForm(prev => ({
            ...prev,
            vehicle_number: result.data.vehicle_number,
            job_card_number: result.data.job_card_number || ''
          }));
        } else {
          throw new Error('Job card not found');
        }
        
      } catch (error) {
        console.error('❌ Error fetching job card:', error);
        setError(error.message || 'Failed to fetch job card details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobCard();
  }, [id, token, BASE_URL]);

  // Fetch petty cash entries
  const fetchPettyCashEntries = async () => {
    try {
      setPettyCashLoading(true);
      
      let url = `${BASE_URL}/api/cash/petty`;
      const params = new URLSearchParams();
      
      if (jobCard?.job_card_number) {
        params.append('job_card_number', jobCard.job_card_number);
        console.log(`🔍 Fetching petty cash for job card number: ${jobCard.job_card_number}`);
      } else {
        console.log('ℹ️ No job card number assigned, skipping petty cash fetch');
        setPettyCashEntries([]);
        return;
      }
      
      if (jobCard?.vehicle_number) {
        params.append('vehicle_number', jobCard.vehicle_number);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log(`📡 Fetching petty cash from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Petty cash entries fetched:', result);
        if (result.status && result.data) {
          setPettyCashEntries(result.data);
        } else {
          setPettyCashEntries([]);
        }
      } else {
        console.error('❌ Failed to fetch petty cash entries');
        setPettyCashEntries([]);
      }
    } catch (error) {
      console.error('❌ Error fetching petty cash entries:', error);
      setPettyCashEntries([]);
    } finally {
      setPettyCashLoading(false);
    }
  };

  // Fetch petty sales entries
  const fetchPettySalesEntries = async () => {
    try {
      setPettySalesLoading(true);
      
      let url = `${BASE_URL}/api/cash/sales`;
      const params = new URLSearchParams();
      
      if (jobCard?.job_card_number) {
        params.append('job_card_number', jobCard.job_card_number);
        console.log(`🔍 Fetching petty sales for job card number: ${jobCard.job_card_number}`);
      } else {
        console.log('ℹ️ No job card number assigned, skipping petty sales fetch');
        setPettySalesEntries([]);
        return;
      }
      
      if (jobCard?.vehicle_number) {
        params.append('vehicle_number', jobCard.vehicle_number);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log(`📡 Fetching petty sales from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Petty sales entries fetched:', result);
        if (result.status && result.data) {
          setPettySalesEntries(result.data);
        } else {
          setPettySalesEntries([]);
        }
      } else {
        console.error('❌ Failed to fetch petty sales entries');
        setPettySalesEntries([]);
      }
    } catch (error) {
      console.error('❌ Error fetching petty sales entries:', error);
      setPettySalesEntries([]);
    } finally {
      setPettySalesLoading(false);
    }
  };

  // Fetch gate pass entries
  const fetchGatePassEntries = async () => {
    try {
      setGatePassLoading(true);
      
      let url = `${BASE_URL}/api/gate-passes`;
      const params = new URLSearchParams();
      
      if (jobCard?.vehicle_number) {
        params.append('vehicle_number', jobCard.vehicle_number);
        console.log(`🔍 Fetching gate passes for vehicle: ${jobCard.vehicle_number}`);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log(`📡 Fetching gate passes from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Gate pass entries fetched:', result);
        if (result.status && Array.isArray(result.data)) {
          // Filter gate passes by job card ID
          const filteredGatePasses = result.data.filter(gatePass => 
            gatePass.job_card_id == id
          );
          setGatePassEntries(filteredGatePasses);
        } else {
          setGatePassEntries([]);
        }
      } else {
        console.error('❌ Failed to fetch gate pass entries');
        setGatePassEntries([]);
      }
    } catch (error) {
      console.error('❌ Error fetching gate pass entries:', error);
      setGatePassEntries([]);
    } finally {
      setGatePassLoading(false);
    }
  };

  // Fetch all entries when job card is loaded
  useEffect(() => {
    if (jobCard) {
      fetchPettyCashEntries();
      fetchPettySalesEntries();
      fetchGatePassEntries();
    }
  }, [jobCard, token, BASE_URL]);

  // Open assign number dialog
  const handleOpenAssignDialog = () => {
    if (!isAccountsDept) return;
    
    setAssignDialogOpen(true);
    setJobCardNumber('');
    setAssignError('');
  };

  // Assign job card number
  const handleAssignNumber = async () => {
    try {
      setAssignLoading(true);
      setAssignError('');

      if (!jobCardNumber) {
        throw new Error('Please enter a job card number');
      }

      const response = await fetch(`${BASE_URL}/api/job-cards/${id}/assign-number`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_card_number: parseInt(jobCardNumber)
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(result.message || 'Invalid job card number or already in use');
        }
        throw new Error(`Failed to assign job card number: ${response.status}`);
      }

      console.log('✅ Job card number assigned:', result);
      
      // Close dialog and refresh job card data
      setAssignDialogOpen(false);
      setJobCardNumber('');
      
      // Refresh job card to show the assigned number
      const refreshResponse = await fetch(`${BASE_URL}/api/job-cards/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (refreshResponse.ok) {
        const refreshResult = await refreshResponse.json();
        if (refreshResult.status && refreshResult.data) {
          setJobCard(refreshResult.data);
          // Update forms with new job card number
          setPettyCashForm(prev => ({
            ...prev,
            job_card_number: refreshResult.data.job_card_number
          }));
          setPettySalesForm(prev => ({
            ...prev,
            job_card_number: refreshResult.data.job_card_number
          }));
          // Refresh all entries
          fetchPettyCashEntries();
          fetchPettySalesEntries();
          fetchGatePassEntries();
        }
      }
      
    } catch (error) {
      console.error('❌ Error assigning job card number:', error);
      setAssignError(error.message);
    } finally {
      setAssignLoading(false);
    }
  };

  // Handle petty cash form changes
  const handlePettyCashChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setPettyCashForm(prev => ({
        ...prev,
        file: files[0] || null
      }));
    } else {
      setPettyCashForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle petty sales form changes
  const handlePettySalesChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setPettySalesForm(prev => ({
        ...prev,
        file: files[0] || null
      }));
    } else {
      setPettySalesForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Submit petty cash form
  const handleSubmitPettyCash = async () => {
    try {
      setSubmittingPetty(true);

      if (!pettyCashForm.description || !pettyCashForm.amount) {
        throw new Error('Description and amount are required');
      }

      const formData = new FormData();
      formData.append('description', pettyCashForm.description);
      formData.append('amount', pettyCashForm.amount);
      
      if (pettyCashForm.vehicle_number) {
        formData.append('vehicle_number', pettyCashForm.vehicle_number);
      }
      
      if (pettyCashForm.job_card_number) {
        formData.append('job_card_number', pettyCashForm.job_card_number);
      }
      
      if (pettyCashForm.file) {
        formData.append('file', pettyCashForm.file);
      }

      const response = await fetch(`${BASE_URL}/api/cash/petty`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create petty cash entry');
      }

      console.log('✅ Petty cash entry created:', result);
      
      // Reset form and close dialog
      setPettyCashForm({
        description: '',
        amount: '',
        vehicle_number: jobCard?.vehicle_number || '',
        job_card_number: jobCard?.job_card_number || '',
        file: null
      });
      setAddPettyDialogOpen(false);
      
      // Refresh petty cash entries
      fetchPettyCashEntries();
      
    } catch (error) {
      console.error('❌ Error creating petty cash entry:', error);
      alert(error.message || 'Failed to create petty cash entry');
    } finally {
      setSubmittingPetty(false);
    }
  };

  // Submit petty sales form
  const handleSubmitPettySales = async () => {
    try {
      setSubmittingSales(true);

      if (!pettySalesForm.amount || !pettySalesForm.mode_of_payment) {
        throw new Error('Amount and mode of payment are required');
      }

      const formData = new FormData();
      formData.append('amount', pettySalesForm.amount);
      formData.append('mode_of_payment', pettySalesForm.mode_of_payment);
      
      if (pettySalesForm.vehicle_number) {
        formData.append('vehicle_number', pettySalesForm.vehicle_number);
      }
      
      if (pettySalesForm.job_card_number) {
        formData.append('job_card_number', pettySalesForm.job_card_number);
      }
      
      if (pettySalesForm.transaction_number) {
        formData.append('transaction_number', pettySalesForm.transaction_number);
      }
      
      if (pettySalesForm.file) {
        formData.append('file', pettySalesForm.file);
      }

      const response = await fetch(`${BASE_URL}/api/cash/sales`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create sales entry');
      }

      console.log('✅ Sales entry created:', result);
      
      // Reset form and close dialog
      setPettySalesForm({
        vehicle_number: jobCard?.vehicle_number || '',
        job_card_number: jobCard?.job_card_number || '',
        amount: '',
        mode_of_payment: '',
        transaction_number: '',
        file: null
      });
      setAddSalesDialogOpen(false);
      
      // Refresh petty sales entries
      fetchPettySalesEntries();
      
    } catch (error) {
      console.error('❌ Error creating sales entry:', error);
      alert(error.message || 'Failed to create sales entry');
    } finally {
      setSubmittingSales(false);
    }
  };

  // View petty cash details
  const handleViewPettyCash = (pettyCashId) => {
    navigate(`/petty-cash/${pettyCashId}`);
  };

  // View petty sales details
  const handleViewPettySales = (salesId) => {
    navigate(`/petty-sales/${salesId}`);
  };

  // View gate pass details
  const handleViewGatePass = (gatePassId) => {
    navigate(`/gate-pass/view/${gatePassId}`);
  };

  // Open gate pass creation dialog
  const handleOpenGatePassDialog = () => {
    setGatePassDialogOpen(true);
    setGatePassError('');
  };

  // Create gate pass
  const handleCreateGatePass = async () => {
    try {
      setCreatingGatePass(true);
      setGatePassError('');

      const response = await fetch(`${BASE_URL}/api/gate-passes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicle_number: jobCard.vehicle_number,
          job_card_id: parseInt(id)
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(result.message || 'Gate pass already exists for this job card');
        }
        throw new Error(`Failed to create gate pass: ${response.status}`);
      }

      console.log('✅ Gate pass created:', result);
      
      // Close dialog and show success message
      setGatePassDialogOpen(false);
      alert('Gate pass created successfully!');
      
      // Refresh gate pass entries
      fetchGatePassEntries();
      
    } catch (error) {
      console.error('❌ Error creating gate pass:', error);
      setGatePassError(error.message);
    } finally {
      setCreatingGatePass(false);
    }
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

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const getServiceAdvisorName = (serviceAdvisor) => {
    if (!serviceAdvisor) return 'N/A';
    return serviceAdvisor.username || serviceAdvisor.name || 'Unknown Advisor';
  };

  const getBranchName = (serviceAdvisor) => {
    if (!serviceAdvisor?.branch) return 'N/A';
    return serviceAdvisor.branch.name || 'Unknown Branch';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
      case 'active':
        return 'warning';
      case 'pending':
        return 'default';
      case 'delivered':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusDisplay = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getGatePassStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'used':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading job card details...
        </Typography>
      </Box>
    );
  }

  if (error || !jobCard) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/job-cards')}>
          Back to Job Cards
        </Button>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Job card not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header with Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/job-cards')}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Job Card Details
          </Typography>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Side - Main Job Card Information */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                {/* Job Card Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                      {jobCard.vehicle_number}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      Job Card #JC-{jobCard.id.toString().padStart(4, '0')}
                      {jobCard.job_card_number && (
                        <Chip 
                          label={`Assigned #: ${jobCard.job_card_number}`} 
                          color="success" 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                    {/* Show assigned number prominently for accounts department */}
                    {isAccountsDept && jobCard.job_card_number && (
                      <Typography variant="h5" color="success.main" sx={{ mt: 1 }}>
                        📋 Assigned Number: {jobCard.job_card_number}
                      </Typography>
                    )}
                  </Box>
                  <Chip 
                    label={getStatusDisplay(jobCard.status)} 
                    color={getStatusColor(jobCard.status)}
                    size="large"
                    sx={{ fontSize: '1rem', px: 2 }}
                  />
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Primary Information Grid */}
                <Grid container spacing={4}>
                  {/* Vehicle Information */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: '#49a3f1', color: 'white' }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        🚗 Vehicle Information
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Vehicle Number:</strong> {jobCard.vehicle_number || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Chassis Number:</strong> {jobCard.chassis_number || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Car Make:</strong> {jobCard.car_make || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Car Model:</strong> {jobCard.car_model || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Car Year:</strong> {jobCard.car_year || 'N/A'}
                        </Typography>
                        {jobCard.number_plate && (
                          <Typography variant="body1" gutterBottom>
                            <strong>Number Plate:</strong> {jobCard.number_plate.plate_number || 'N/A'}
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Customer Information */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: '#ee358bff', color: 'white' }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        👤 Customer Information
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Customer Name:</strong> {jobCard.customer_name || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Contact Number:</strong> {jobCard.customer_number || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Email:</strong> {jobCard.customer_email || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Insurance:</strong> {jobCard.insurance_name || 'N/A'}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Service Information */}
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: 'grey.100' }}>
                      <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                        🛠️ Service Details
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Service Advisor:</strong> {getServiceAdvisorName(jobCard.service_advisor)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Branch:</strong> {getBranchName(jobCard.service_advisor)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Job Date:</strong> {formatDate(jobCard.date)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Promised Date:</strong> {formatDate(jobCard.promised_delivery_date)}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: 'grey.100' }}>
                      <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                        📅 Timeline
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Job Created</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(jobCard.created_at)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Job Date</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(jobCard.date)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Estimated Completion</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(jobCard.promised_delivery_date)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Last Updated</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(jobCard.updated_at)}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Job Description */}
                <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f1d32bff' }}>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                    📝 Job Description
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {jobCard.job_description || 'No job description provided.'}
                  </Typography>
                </Paper>

                {/* Petty Cash, Sales & Gate Pass Section */}
                <Paper sx={{ p: 3, mt: 3 }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                      <Tab 
                        icon={<AttachFileIcon />} 
                        label="Petty Cash" 
                        iconPosition="start"
                      />
                      <Tab 
                        icon={<SalesIcon />} 
                        label="Petty Sales" 
                        iconPosition="start"
                      />
                      <Tab 
                        icon={<GatePassIcon />} 
                        label="Gate Pass" 
                        iconPosition="start"
                      />
                    </Tabs>
                  </Box>

                  {!jobCard.job_card_number && activeTab !== 2 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Alert severity="info">
                        <Typography variant="body1" gutterBottom>
                          No job card number assigned yet.
                        </Typography>
                        <Typography variant="body2">
                          Please assign a job card number to view and add petty cash/sales entries.
                        </Typography>
                        {isAccountsDept && (
                          <Button 
                            variant="outlined" 
                            color="primary" 
                            sx={{ mt: 1 }}
                            onClick={handleOpenAssignDialog}
                          >
                            Assign Job Card Number
                          </Button>
                        )}
                      </Alert>
                    </Box>
                  ) : (
                    <>
                      {/* Petty Cash Tab */}
                      {activeTab === 0 && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              💰 Petty Cash Entries
                              <Typography variant="body2" color="textSecondary">
                                Filtered by Job Card Number: {jobCard.job_card_number}
                              </Typography>
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<AddIcon />}
                              onClick={() => setAddPettyDialogOpen(true)}
                            >
                              Add Petty Cash
                            </Button>
                          </Box>

                          {pettyCashLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                              <CircularProgress />
                            </Box>
                          ) : pettyCashEntries.length > 0 ? (
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell><strong>Description</strong></TableCell>
                                    <TableCell><strong>Amount</strong></TableCell>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {pettyCashEntries.map((entry) => (
                                    <TableRow key={entry.id}>
                                      <TableCell>{entry.description}</TableCell>
                                      <TableCell>{formatCurrency(entry.amount)}</TableCell>
                                      <TableCell>{formatDate(entry.created_at)}</TableCell>
                                      <TableCell>
                                        <IconButton
                                          color="primary"
                                          onClick={() => handleViewPettyCash(entry.id)}
                                        >
                                          <ViewIcon />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                              <Typography variant="body1" color="textSecondary">
                                No petty cash entries found for job card number: {jobCard.job_card_number}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* Petty Sales Tab */}
                      {activeTab === 1 && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              💳 Petty Sales Entries
                              <Typography variant="body2" color="textSecondary">
                                Filtered by Job Card Number: {jobCard.job_card_number}
                              </Typography>
                            </Typography>
                            <Button
                              variant="contained"
                              color="secondary"
                              startIcon={<AddIcon />}
                              onClick={() => setAddSalesDialogOpen(true)}
                            >
                              Add Sales Entry
                            </Button>
                          </Box>

                          {pettySalesLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                              <CircularProgress />
                            </Box>
                          ) : pettySalesEntries.length > 0 ? (
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell><strong>Amount</strong></TableCell>
                                    <TableCell><strong>Payment Mode</strong></TableCell>
                                    <TableCell><strong>Transaction #</strong></TableCell>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {pettySalesEntries.map((entry) => (
                                    <TableRow key={entry.id}>
                                      <TableCell>{formatCurrency(entry.amount)}</TableCell>
                                      <TableCell>
                                        <Chip 
                                          label={entry.mode_of_payment} 
                                          size="small" 
                                          color="primary" 
                                          variant="outlined"
                                        />
                                      </TableCell>
                                      <TableCell>{entry.transaction_number || 'N/A'}</TableCell>
                                      <TableCell>{formatDate(entry.created_at)}</TableCell>
                                      <TableCell>
                                        <IconButton
                                          color="primary"
                                          onClick={() => handleViewPettySales(entry.id)}
                                        >
                                          <ViewIcon />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                              <Typography variant="body1" color="textSecondary">
                                No sales entries found for job card number: {jobCard.job_card_number}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* Gate Pass Tab */}
                      {activeTab === 2 && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              🚪 Gate Pass Entries
                              <Typography variant="body2" color="textSecondary">
                                Filtered by Vehicle: {jobCard.vehicle_number}
                              </Typography>
                            </Typography>
                            <Button
                              variant="contained"
                              color="warning"
                              startIcon={<AddIcon />}
                              onClick={handleOpenGatePassDialog}
                            >
                              Create Gate Pass
                            </Button>
                          </Box>

                          {gatePassLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                              <CircularProgress />
                            </Box>
                          ) : gatePassEntries.length > 0 ? (
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell><strong>Gate Pass ID</strong></TableCell>
                                    <TableCell><strong>Vehicle Number</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell><strong>Created Date</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {gatePassEntries.map((entry) => (
                                    <TableRow key={entry.id}>
                                      <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                          GP-{entry.id?.toString().padStart(4, '0')}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>{entry.vehicle_number}</TableCell>
                                      <TableCell>
                                        <Chip 
                                          label={getStatusDisplay(entry.status)} 
                                          color={getGatePassStatusColor(entry.status)}
                                          size="small"
                                        />
                                      </TableCell>
                                      <TableCell>{formatDate(entry.created_at)}</TableCell>
                                      <TableCell>
                                        <IconButton
                                          color="primary"
                                          onClick={() => handleViewGatePass(entry.id)}
                                        >
                                          <ViewIcon />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                              <Typography variant="body1" color="textSecondary" gutterBottom>
                                No gate pass entries found for this job card.
                              </Typography>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<GatePassIcon />}
                                onClick={handleOpenGatePassDialog}
                                sx={{ mt: 1 }}
                              >
                                Create First Gate Pass
                              </Button>
                            </Box>
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side - Actions and Additional Info */}
          <Grid item xs={12} lg={4}>
            {/* Action Buttons Card */}
            <Card sx={{ mb: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="large"
                    onClick={() => navigate(`/job-cards/edit/${jobCard.id}`)}
                    fullWidth
                  >
                    Edit Job Card
                  </Button>
                  
                  {/* Add Petty Cash Button */}
                  <Button 
                    variant="contained" 
                    color="success"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => setAddPettyDialogOpen(true)}
                    disabled={!jobCard.job_card_number}
                    fullWidth
                  >
                    {jobCard.job_card_number ? 'Add Petty Cash' : 'Assign Number First'}
                  </Button>

                  {/* Add Sales Button */}
                  <Button 
                    variant="contained" 
                    color="secondary"
                    size="large"
                    startIcon={<SalesIcon />}
                    onClick={() => setAddSalesDialogOpen(true)}
                    disabled={!jobCard.job_card_number}
                    fullWidth
                  >
                    {jobCard.job_card_number ? 'Add Sales Entry' : 'Assign Number First'}
                  </Button>

                  {/* Create Gate Pass Button */}
                  <Button 
                    variant="contained" 
                    color="warning"
                    size="large"
                    startIcon={<GatePassIcon />}
                    onClick={handleOpenGatePassDialog}
                    fullWidth
                  >
                    Create Gate Pass
                  </Button>
                  
                  {/* Assign Number Button - Only for Accounts Department */}
                  {isAccountsDept && (
                    <Button 
                      variant="contained" 
                      color="info"
                      size="large"
                      startIcon={<AssignmentIcon />}
                      onClick={handleOpenAssignDialog}
                      disabled={!!jobCard.job_card_number}
                      fullWidth
                    >
                      {jobCard.job_card_number ? 'Number Assigned' : 'Assign Job Card Number'}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    size="large"
                    onClick={() => window.print()}
                    fullWidth
                  >
                    Print Job Card
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => navigate('/job-cards')}
                    fullWidth
                  >
                    Back to List
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Assigned Number Card - Only for Accounts Department */}
            {isAccountsDept && (
              <Card sx={{ mb: 3, boxShadow: 3, border: '2px solid', borderColor: jobCard.job_card_number ? 'success.main' : 'warning.main' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom color={jobCard.job_card_number ? 'success.main' : 'warning.main'} fontWeight="bold">
                    📋 Job Card Number
                  </Typography>
                  {jobCard.job_card_number ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h3" color="success.main" fontWeight="bold">
                        {jobCard.job_card_number}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Assigned by Accounts Department
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="body1" color="textSecondary" gutterBottom>
                        No number assigned yet
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="warning"
                        startIcon={<AssignmentIcon />}
                        onClick={handleOpenAssignDialog}
                        size="small"
                      >
                        Assign Number
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Financial Summary */}
            <Card sx={{ mb: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  💰 Financial Summary
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Petty Cash Total:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(pettyCashEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0))}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Sales Total:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(pettySalesEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0))}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight="bold">Net Total:</Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      {formatCurrency(
                        pettySalesEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0) -
                        pettyCashEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0)
                      )}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Gate Pass Summary */}
            <Card sx={{ mb: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  🚪 Gate Pass Summary
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Total Gate Passes:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {gatePassEntries.length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Active Gate Passes:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {gatePassEntries.filter(gp => gp.status?.toLowerCase() === 'approved').length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Pending Gate Passes:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="warning.main">
                      {gatePassEntries.filter(gp => gp.status?.toLowerCase() === 'pending').length}
                    </Typography>
                  </Box>
                  {gatePassEntries.length > 0 && (
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small" 
                      fullWidth
                      sx={{ mt: 1 }}
                      onClick={() => setActiveTab(2)}
                    >
                      View All Gate Passes
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Service Notes */}
            <Card sx={{ boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  ℹ️ Service Notes
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    All services include complimentary vehicle inspection
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    Customer will be notified upon completion via SMS & Email
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    Additional repairs may require customer approval
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    Vehicle ready for pickup after final quality check
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    24/7 Customer support available
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card sx={{ mt: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  📞 Contact Service Advisor
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Name:</strong> {getServiceAdvisorName(jobCard.service_advisor)}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Branch:</strong> {getBranchName(jobCard.service_advisor)}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {jobCard.service_advisor?.email || 'N/A'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Available:</strong> Mon - Fri, 8:00 AM - 6:00 PM
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="success" 
                    size="small" 
                    sx={{ mt: 1 }}
                    fullWidth
                    onClick={() => {
                      if (jobCard.service_advisor?.email) {
                        window.location.href = `mailto:${jobCard.service_advisor.email}`;
                      }
                    }}
                    disabled={!jobCard.service_advisor?.email}
                  >
                    {jobCard.service_advisor?.email ? 'Contact via Email' : 'Email Not Available'}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card sx={{ mt: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  🔧 System Information
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Job Card ID:</strong> {jobCard.id}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Number Plate ID:</strong> {jobCard.number_plate_id || 'N/A'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Service Advisor ID:</strong> {jobCard.service_advisor_id || 'N/A'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Created:</strong> {formatDate(jobCard.created_at)}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Last Updated:</strong> {formatDate(jobCard.updated_at)}
                  </Typography>
                  {/* Show assigned number in system info for accounts */}
                  {isAccountsDept && jobCard.job_card_number && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Assigned Number:</strong> {jobCard.job_card_number}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Assign Number Dialog */}
        <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AssignmentIcon sx={{ mr: 1 }} />
              Assign Job Card Number
            </Box>
          </DialogTitle>
          <DialogContent>
            {assignError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {assignError}
              </Alert>
            )}
            
            <Typography variant="body1" gutterBottom>
              Assign a job card number for: <strong>{jobCard.vehicle_number}</strong>
            </Typography>
            
            <TextField
              fullWidth
              label="Job Card Number"
              value={jobCardNumber}
              onChange={(e) => setJobCardNumber(e.target.value)}
              type="number"
              sx={{ mt: 2 }}
              placeholder="Enter job card number"
            />
            
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Enter the job card number to assign to this job card. This will enable petty cash and sales tracking.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignDialogOpen(false)} disabled={assignLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignNumber} 
              variant="contained" 
              disabled={assignLoading || !jobCardNumber}
              startIcon={assignLoading ? <CircularProgress size={16} /> : <AssignmentIcon />}
            >
              {assignLoading ? 'Assigning...' : 'Assign Number'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Petty Cash Dialog */}
        <Dialog open={addPettyDialogOpen} onClose={() => setAddPettyDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AddIcon sx={{ mr: 1 }} />
              Add Petty Cash Entry
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description *"
                  name="description"
                  value={pettyCashForm.description}
                  onChange={handlePettyCashChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount *"
                  name="amount"
                  type="number"
                  value={pettyCashForm.amount}
                  onChange={handlePettyCashChange}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vehicle Number"
                  name="vehicle_number"
                  value={pettyCashForm.vehicle_number}
                  onChange={handlePettyCashChange}
                  disabled
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Card Number"
                  name="job_card_number"
                  value={pettyCashForm.job_card_number}
                  onChange={handlePettyCashChange}
                  disabled={!isAccountsDept}
                  helperText={!isAccountsDept ? "Only accounts department can modify" : ""}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<AttachFileIcon />}
                  sx={{ height: '56px' }}
                >
                  {pettyCashForm.file ? pettyCashForm.file.name : 'Attach File'}
                  <input
                    type="file"
                    name="file"
                    hidden
                    onChange={handlePettyCashChange}
                  />
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddPettyDialogOpen(false)} disabled={submittingPetty}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitPettyCash} 
              variant="contained" 
              disabled={submittingPetty || !pettyCashForm.description || !pettyCashForm.amount}
              startIcon={submittingPetty ? <CircularProgress size={16} /> : <AddIcon />}
            >
              {submittingPetty ? 'Creating...' : 'Create Entry'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Petty Sales Dialog */}
        <Dialog open={addSalesDialogOpen} onClose={() => setAddSalesDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SalesIcon sx={{ mr: 1 }} />
              Add Sales Entry
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount *"
                  name="amount"
                  type="number"
                  value={pettySalesForm.amount}
                  onChange={handlePettySalesChange}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Mode of Payment *"
                  name="mode_of_payment"
                  value={pettySalesForm.mode_of_payment}
                  onChange={handlePettySalesChange}
                  required
                >
                  {paymentModes.map((mode) => (
                    <MenuItem key={mode} value={mode}>
                      {mode}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Transaction Number"
                  name="transaction_number"
                  value={pettySalesForm.transaction_number}
                  onChange={handlePettySalesChange}
                  placeholder="Optional"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vehicle Number"
                  name="vehicle_number"
                  value={pettySalesForm.vehicle_number}
                  onChange={handlePettySalesChange}
                  disabled
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Card Number"
                  name="job_card_number"
                  value={pettySalesForm.job_card_number}
                  onChange={handlePettySalesChange}
                  disabled={!isAccountsDept}
                  helperText={!isAccountsDept ? "Only accounts department can modify" : ""}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<AttachFileIcon />}
                  sx={{ height: '56px' }}
                >
                  {pettySalesForm.file ? pettySalesForm.file.name : 'Attach File'}
                  <input
                    type="file"
                    name="file"
                    hidden
                    onChange={handlePettySalesChange}
                  />
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddSalesDialogOpen(false)} disabled={submittingSales}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitPettySales} 
              variant="contained" 
              color="secondary"
              disabled={submittingSales || !pettySalesForm.amount || !pettySalesForm.mode_of_payment}
              startIcon={submittingSales ? <CircularProgress size={16} /> : <SalesIcon />}
            >
              {submittingSales ? 'Creating...' : 'Create Sales Entry'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Gate Pass Dialog */}
        <Dialog open={gatePassDialogOpen} onClose={() => setGatePassDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GatePassIcon sx={{ mr: 1 }} />
              Create Gate Pass
            </Box>
          </DialogTitle>
          <DialogContent>
            {gatePassError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {gatePassError}
              </Alert>
            )}
            
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="bold">
                Are you sure you want to create a gate pass?
              </Typography>
            </Alert>
            
            <Typography variant="body1" gutterBottom>
              This will create a gate pass for:
            </Typography>
            
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Vehicle Number:</strong> {jobCard.vehicle_number}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Job Card ID:</strong> {jobCard.id}
              </Typography>
              <Typography variant="body1">
                <strong>Job Card Number:</strong> {jobCard.job_card_number || 'Not assigned'}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Note: A gate pass allows the vehicle to exit the premises. Only one gate pass can be created per job card.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGatePassDialogOpen(false)} disabled={creatingGatePass}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateGatePass} 
              variant="contained" 
              color="warning"
              disabled={creatingGatePass}
              startIcon={creatingGatePass ? <CircularProgress size={16} /> : <GatePassIcon />}
            >
              {creatingGatePass ? 'Creating...' : 'Create Gate Pass'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default JobCardView;
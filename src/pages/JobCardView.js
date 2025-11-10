
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
//   CircularProgress
// } from '@mui/material';
// import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// function JobCardView() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { token } = useAuth();
//   const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
//   const [jobCard, setJobCard] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

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

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch (error) {
//       return 'Invalid Date';
//     }
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
//                       {jobCard.job_card_number && ` (${jobCard.job_card_number})`}
//                     </Typography>
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
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
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
  TextField
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon
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

  // Check if current user is from accounts department
  const isAccountsDept = user?.role === 'accounts';

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
        }
      }
      
    } catch (error) {
      console.error('❌ Error assigning job card number:', error);
      setAssignError(error.message);
    } finally {
      setAssignLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
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

                {/* Rest of your existing content remains the same */}
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
                  
                  {/* Assign Number Button - Only for Accounts Department */}
                  {isAccountsDept && (
                    <Button 
                      variant="contained" 
                      color="secondary"
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
              <Card sx={{ mb: 3, boxShadow: 3, border: '2px solid', borderColor: 'success.main' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom color="success.main" fontWeight="bold">
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
                        color="success"
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

            {/* Rest of your existing cards remain the same */}
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
              Enter the job card number to assign to this job card.
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
      </Container>
    </Box>
  );
}

export default JobCardView;
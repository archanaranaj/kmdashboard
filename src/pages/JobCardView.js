// import React from 'react';
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
//   Container
// } from '@mui/material';
// import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// import { useParams, useNavigate } from 'react-router-dom';

// // This would typically come from your API or context
// const sampleJobCards = [
//   {
//     id: 1,
//     vehicleNumber: 'ABC-123',
//     date: '2024-01-15',
//     serviceAdvisor: 'John Doe',
//     chassisNumber: 'CHS123456789',
//     customerName: 'Alice Johnson',
//     customerNumber: '+1234567890',
//     customerEmail: 'alice@email.com',
//     carMake: 'Toyota',
//     carModel: 'Camry',
//     carYear: '2022',
//     insuranceName: 'ABC Insurance',
//     jobDescription: 'Regular maintenance and oil change. Includes filter replacement, fluid top-up, and general inspection of vehicle components.',
//     promisedDate: '2024-01-17',
//     status: 'In Progress'
//   },
//   {
//     id: 2,
//     vehicleNumber: 'XYZ-789',
//     date: '2024-01-16',
//     serviceAdvisor: 'Jane Smith',
//     chassisNumber: 'CHS987654321',
//     customerName: 'Bob Brown',
//     customerNumber: '+1987654321',
//     customerEmail: 'bob@email.com',
//     carMake: 'Honda',
//     carModel: 'Civic',
//     carYear: '2021',
//     insuranceName: 'XYZ Insurance',
//     jobDescription: 'Brake service and tire rotation. Complete brake system inspection and tire maintenance.',
//     promisedDate: '2024-01-19',
//     status: 'Pending'
//   }
// ];

// function JobCardView() {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   // Find the job card by ID
//   const jobCard = sampleJobCards.find(card => card.id === parseInt(id));

//   if (!jobCard) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/job-cards')}>
//           Back to Job Cards
//         </Button>
//         <Typography variant="h4" color="error">
//           Job Card not found
//         </Typography>
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
//                       {jobCard.vehicleNumber}
//                     </Typography>
//                     <Typography variant="h6" color="textSecondary">
//                       Job Card #JC-{jobCard.id.toString().padStart(4, '0')}
//                     </Typography>
//                   </Box>
//                   <Chip 
//                     label={jobCard.status} 
//                     color={
//                       jobCard.status === 'Completed' ? 'success' : 
//                       jobCard.status === 'In Progress' ? 'warning' : 
//                       'default'
//                     }
//                     size="large"
//                     sx={{ fontSize: '1rem', px: 2 }}
//                   />
//                 </Box>

//                 <Divider sx={{ mb: 4 }} />

//                 {/* Primary Information Grid */}
//                 <Grid container spacing={4}>
//                   {/* Vehicle Information */}
//                   <Grid item xs={12} md={6}>
//                     <Paper sx={{ p: 3, backgroundColor: 'primary.light', color: 'white' }}>
//                       <Typography variant="h6" gutterBottom fontWeight="bold">
//                         🚗 Vehicle Information
//                       </Typography>
//                       <Box sx={{ mt: 2 }}>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Vehicle Number:</strong> {jobCard.vehicleNumber}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Chassis Number:</strong> {jobCard.chassisNumber}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Car Make:</strong> {jobCard.carMake}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Car Model:</strong> {jobCard.carModel}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Car Year:</strong> {jobCard.carYear}
//                         </Typography>
//                       </Box>
//                     </Paper>
//                   </Grid>

//                   {/* Customer Information */}
//                   <Grid item xs={12} md={6}>
//                     <Paper sx={{ p: 3, backgroundColor: 'secondary.light', color: 'white' }}>
//                       <Typography variant="h6" gutterBottom fontWeight="bold">
//                         👤 Customer Information
//                       </Typography>
//                       <Box sx={{ mt: 2 }}>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Customer Name:</strong> {jobCard.customerName}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Contact Number:</strong> {jobCard.customerNumber}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Email:</strong> {jobCard.customerEmail}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Insurance:</strong> {jobCard.insuranceName}
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
//                           <strong>Service Advisor:</strong> {jobCard.serviceAdvisor}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Job Date:</strong> {jobCard.date}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                           <strong>Promised Date:</strong> {jobCard.promisedDate}
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
//                           <Typography variant="body2" color="textSecondary">{jobCard.date}</Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                           <Typography variant="body2">Estimated Completion</Typography>
//                           <Typography variant="body2" color="textSecondary">{jobCard.promisedDate}</Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                           <Typography variant="body2">Current Status</Typography>
//                           <Typography variant="body2" color="primary" fontWeight="bold">{jobCard.status}</Typography>
//                         </Box>
//                       </Box>
//                     </Paper>
//                   </Grid>
//                 </Grid>

//                 {/* Job Description */}
//                 <Paper sx={{ p: 3, mt: 3, backgroundColor: 'warning.light' }}>
//                   <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
//                     📝 Job Description
//                   </Typography>
//                   <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.6 }}>
//                     {jobCard.jobDescription}
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
//                     <strong>Name:</strong> {jobCard.serviceAdvisor}
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
//                   >
//                     Contact Now
//                   </Button>
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
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function JobCardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [jobCard, setJobCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                      {jobCard.job_card_number && ` (${jobCard.job_card_number})`}
                    </Typography>
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
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default JobCardView;
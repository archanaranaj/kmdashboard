// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   TextField,
//   MenuItem,
//   Box,
//   Container,
//   Paper,
//   Grid,
//   Alert,
//   CircularProgress
// } from '@mui/material';
// import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Warning as WarningIcon } from '@mui/icons-material';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const carMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia', 'Nissan', 'Volkswagen'];
// const insuranceCompanies = ['ABC Insurance', 'XYZ Insurance', 'Premium Insure', 'SecureCover', 'SafeGuard', 'No Insurance'];
// const statusOptions = ['Active', 'Assigned', 'Completed'];

// function JobCardForm() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const location = useLocation();
//   const { token, user } = useAuth();
//   const isEditing = Boolean(id);
//   const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';

//   const plateData = location.state?.plateData;

//   // Check if user is service advisor
//   const isServiceAdvisor = user?.role === 'service_advisor' || user?.role === 'advisor' || user?.isServiceAdvisor;

//   // Form state
//   const [formData, setFormData] = useState({
//     vehicle_number: '',
//     date: new Date().toISOString().split('T')[0],
//     chassis_number: '',
//     customer_name: '',
//     customer_number: '',
//     customer_email: '',
//     car_make: '',
//     car_model: '',
//     car_year: '',
//     insurance_name: '',
//     job_description: '',
//     promised_delivery_date: '',
//     number_plate_id: '',
//     status: 'Active'
//   });

//   const [availableNumberPlates, setAvailableNumberPlates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingPlates, setLoadingPlates] = useState(false);
//   const [fetchError, setFetchError] = useState('');
//   const [submitError, setSubmitError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [dataLoaded, setDataLoaded] = useState(false);

//   // Load job card data if editing and fetch available number plates
//   useEffect(() => {
//     const initializeData = async () => {
//       setLoadingPlates(true);
//       setFetchError('');
      
//       try {
//         // Always fetch available number plates
//         await fetchAvailableNumberPlates();
        
//         if (isEditing) {
//           await fetchJobCard();
//         } else if (plateData) {
//           // Pre-fill form if coming from number plate view
//           setFormData(prev => ({
//             ...prev,
//             vehicle_number: plateData.plateNumber || '',
//             car_make: plateData.vehicleDetails?.brand || '',
//             car_model: plateData.vehicleDetails?.type || '',
//           }));
//           setDataLoaded(true);
//         } else {
//           // For new job cards, mark as loaded immediately
//           setDataLoaded(true);
//         }
//       } catch (error) {
//         console.error('Error initializing data:', error);
//         setFetchError(error.message || 'Failed to initialize form data');
//       } finally {
//         setLoadingPlates(false);
//       }
//     };

//     initializeData();
//   }, [id, isEditing, token, plateData]);

//   // Fetch available number plates from API
//   const fetchAvailableNumberPlates = async () => {
//     try {
//       console.log('🔍 Fetching available number plates...');
      
//       const response = await fetch(`${BASE_URL}/api/number-plates`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       console.log('📥 Number plates response status:', response.status);
      
//       if (response.ok) {
//         const result = await response.json();
//         console.log('✅ Number plates API response:', result);
        
//         // Handle the complex API response structure
//         let plates = [];
        
//         if (result.status && result.data) {
//           // The data object contains mixed types - we need to find the actual plates array
//           const data = result.data;
          
//           // Strategy 1: Look for an array in the data object
//           for (const key in data) {
//             if (Array.isArray(data[key])) {
//               console.log(`📁 Found array in key "${key}":`, data[key]);
//               plates = data[key];
//               break;
//             }
//           }
          
//           // Strategy 2: If no array found, try to extract all objects that look like plates
//           if (plates.length === 0) {
//             plates = Object.values(data).filter(item => 
//               item && typeof item === 'object' && item.id && item.plate_number
//             );
//           }
          
//           // Strategy 3: If still no plates, check if data itself is the array we need
//           if (plates.length === 0 && Array.isArray(data)) {
//             plates = data;
//           }
//         }
        
//         console.log('📋 Processed number plates:', plates);
//         setAvailableNumberPlates(plates);
        
//         // Auto-select number plate if we have plateData
//         if (plateData && plates.length > 0) {
//           autoSelectNumberPlate(plates);
//         }
//       } else {
//         console.log('⚠️ Failed to fetch number plates:', response.status);
//         setAvailableNumberPlates([]);
//       }
//     } catch (error) {
//       console.log('❌ Error fetching number plates:', error);
//       setAvailableNumberPlates([]);
//     }
//   };

//   // Auto-select number plate based on plateData
//   const autoSelectNumberPlate = (plates) => {
//     if (!plateData || !plateData.plateNumber) {
//       console.log('❌ No plateData available for auto-selection');
//       return;
//     }
    
//     const scannedPlateNumber = plateData.plateNumber.trim().toLowerCase();
//     console.log('🎯 Looking for matching number plate for:', scannedPlateNumber);
//     console.log('📋 Available plates:', plates);
    
//     // Try to find exact match in available plates
//     const matchingPlate = plates.find(plate => {
//       if (!plate.plate_number) return false;
//       const availablePlateNumber = plate.plate_number.trim().toLowerCase();
//       return availablePlateNumber === scannedPlateNumber;
//     });
    
//     if (matchingPlate) {
//       console.log('✅ Found matching number plate:', matchingPlate);
//       setFormData(prev => ({
//         ...prev,
//         number_plate_id: matchingPlate.id.toString(),
//         vehicle_number: plateData.plateNumber || '',
//         car_make: plateData.vehicleDetails?.brand || matchingPlate.vehicle_details?.brand || '',
//         car_model: plateData.vehicleDetails?.type || matchingPlate.vehicle_details?.type || '',
//       }));
//     } else {
//       console.log('❌ No matching number plate found for:', scannedPlateNumber);
//       // Still set the vehicle number from plateData but don't set number_plate_id
//       setFormData(prev => ({
//         ...prev,
//         vehicle_number: plateData.plateNumber || '',
//         car_make: plateData.vehicleDetails?.brand || '',
//         car_model: plateData.vehicleDetails?.type || '',
//         number_plate_id: '' // Ensure it's empty if no match
//       }));
//     }
//   };

//   const fetchJobCard = async () => {
//     try {
//       setLoading(true);
//       setFetchError('');

//       console.log(`🔍 Fetching job card with ID: ${id}`);
      
//       const response = await fetch(`${BASE_URL}/api/job-cards/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch job card: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('✅ Job card fetched:', result);
      
//       if (result.status && result.data) {
//         const jobCard = result.data;
//         console.log('📝 Setting form data with:', jobCard);
        
//         setFormData({
//           vehicle_number: jobCard.vehicle_number || '',
//           date: jobCard.date || new Date().toISOString().split('T')[0],
//           chassis_number: jobCard.chassis_number || '',
//           customer_name: jobCard.customer_name || '',
//           customer_number: jobCard.customer_number || '',
//           customer_email: jobCard.customer_email || '',
//           car_make: jobCard.car_make || '',
//           car_model: jobCard.car_model || '',
//           car_year: jobCard.car_year || '',
//           insurance_name: jobCard.insurance_name || '',
//           job_description: jobCard.job_description || '',
//           promised_delivery_date: jobCard.promised_delivery_date || '',
//           number_plate_id: jobCard.number_plate_id || '',
//           status: jobCard.status || 'Active'
//         });
        
//         setDataLoaded(true);
//         console.log('✅ Form data loaded successfully');
//       } else {
//         throw new Error('Job card not found in response');
//       }
      
//     } catch (error) {
//       console.error('❌ Error fetching job card:', error);
//       setFetchError(error.message || 'Failed to fetch job card details');
//       setDataLoaded(true); // Still mark as loaded to show error
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Check if user is service advisor
//     if (!isServiceAdvisor) {
//       setSubmitError('Only service advisors can create job cards. Please contact a service advisor or login with appropriate permissions.');
//       return;
//     }

//     try {
//       setLoading(true);
//       setSubmitError('');
//       setSuccess('');

//       // Validate required fields
//       const requiredFields = {
//         vehicle_number: 'Vehicle Number',
//         customer_name: 'Customer Name',
//         customer_number: 'Customer Number',
//         job_description: 'Job Description'
//       };

//       const missingFields = Object.entries(requiredFields)
//         .filter(([field]) => !formData[field]?.toString().trim())
//         .map(([_, name]) => name);

//       if (missingFields.length > 0) {
//         throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
//       }

//       console.log('📤 Submitting form data as service advisor:', formData);

//       const url = isEditing ? `${BASE_URL}/api/job-cards/${id}` : `${BASE_URL}/api/job-cards`;
//       const method = isEditing ? 'PUT' : 'POST';

//       // Prepare request body based on whether we're creating or updating
//       let requestBody;

//       if (isEditing) {
//         // For UPDATE - only send fields allowed by PUT API
//         requestBody = {
//           chassis_number: formData.chassis_number?.trim() || '',
//           customer_name: formData.customer_name.trim(),
//           status: formData.status || 'Active'
//         };
//         console.log('🔄 UPDATE mode - limited fields:', requestBody);
//       } else {
//         // For CREATE - send all fields
//         requestBody = {
//           vehicle_number: formData.vehicle_number.trim(),
//           date: formData.date,
//           chassis_number: formData.chassis_number?.trim() || '',
//           customer_name: formData.customer_name.trim(),
//           customer_number: formData.customer_number.trim(),
//           customer_email: formData.customer_email?.trim() || '',
//           car_make: formData.car_make?.trim() || '',
//           car_model: formData.car_model?.trim() || '',
//           car_year: formData.car_year ? parseInt(formData.car_year) : 0,
//           insurance_name: formData.insurance_name?.trim() || '',
//           job_description: formData.job_description.trim(),
//           promised_delivery_date: formData.promised_delivery_date || formData.date,
//           // status: formData.status || 'Active'
//         };

//         // Only include number_plate_id if it's a valid number and exists
//         if (formData.number_plate_id && !isNaN(formData.number_plate_id) && formData.number_plate_id !== '') {
//           const plateId = parseInt(formData.number_plate_id);
//           const plateExists = availableNumberPlates.some(plate => plate.id === plateId);
//           if (plateExists) {
//             requestBody.number_plate_id = plateId;
//           } else {
//             console.warn('⚠️ Provided number plate ID does not exist, skipping...');
//           }
//         }
//       }

//       console.log('📦 Request body:', requestBody);

//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestBody),
//       });

//       const responseData = await response.json();
//       console.log('📥 API Response:', responseData);

//       if (!response.ok) {
//         // Handle foreign key constraint error specifically
//         if (responseData.message?.includes('foreign key constraint') || responseData.message?.includes('number_plates')) {
//           throw new Error('Invalid number plate ID. Please select a valid number plate or leave it empty.');
//         }
//         throw new Error(responseData.message || `Failed to ${isEditing ? 'update' : 'create'} job card: ${response.status}`);
//       }

//       console.log('✅ Job card saved successfully:', responseData);
      
//       setSuccess(isEditing ? 'Job card updated successfully!' : 'Job card created successfully!');
      
//       // Navigate back after a short delay
//       setTimeout(() => {
//         navigate('/job-cards');
//       }, 1500);
      
//     } catch (error) {
//       console.error('❌ Error saving job card:', error);
//       setSubmitError(error.message || `Failed to ${isEditing ? 'update' : 'create'} job card`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/job-cards');
//   };

//   // Show loading state while fetching data
//   if ((loading && isEditing) || loadingPlates) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//         <CircularProgress size={60} />
//         <Typography variant="h6" sx={{ ml: 2 }}>
//           {isEditing ? 'Loading job card...' : 'Loading form...'}
//         </Typography>
//       </Box>
//     );
//   }

//   // Show error if data loading failed
//   if (fetchError && isEditing) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Button startIcon={<ArrowBackIcon />} onClick={handleCancel}>
//           Back to Job Cards
//         </Button>
//         <Alert severity="error" sx={{ mt: 2 }}>
//           {fetchError}
//         </Alert>
//         <Button 
//           variant="contained" 
//           onClick={fetchJobCard}
//           sx={{ mt: 2 }}
//         >
//           Retry Loading
//         </Button>
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
//             onClick={handleCancel}
//             variant="outlined"
//             sx={{ mr: 2 }}
//             disabled={loading}
//           >
//             Back
//           </Button>
//           <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
//             {isEditing ? 'Edit Job Card' : 'Create New Job Card'}
//           </Typography>
//         </Box>

//         {/* Permission Warning */}
//         {!isServiceAdvisor && (
//           <Alert 
//             severity="warning" 
//             sx={{ mb: 2 }}
//             icon={<WarningIcon />}
//           >
//             <Typography variant="h6" gutterBottom>
//               Permission Required
//             </Typography>
//             <Typography>
//               Only service advisors can create job cards. 
//               {user ? (
//                 <> Your current role ({user.role || 'user'}) does not have permission to create job cards.</>
//               ) : (
//                 ' Please login as a service advisor.'
//               )}
//             </Typography>
//             <Box sx={{ mt: 1 }}>
//               <Button 
//                 variant="outlined" 
//                 color="warning"
//                 onClick={() => navigate('/job-cards')}
//                 size="small"
//               >
//                 View Existing Job Cards
//               </Button>
//             </Box>
//           </Alert>
//         )}

//         {submitError && (
//           <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError('')}>
//             {submitError}
//           </Alert>
//         )}

//         {success && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             {success}
//           </Alert>
//         )}

//         {/* Edit Mode Warning */}
//         {isEditing && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             <Typography variant="body2">
//               <strong>Note:</strong> In edit mode, only chassis number, customer name, and status can be updated. 
//               Other fields are displayed for reference but cannot be modified.
//             </Typography>
//           </Alert>
//         )}

//         <Card sx={{ boxShadow: 3, opacity: isServiceAdvisor ? 1 : 0.6 }}>
//           <CardContent sx={{ p: 4 }}>
//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={3}>
//                 {/* Current User Info */}
//                 {isServiceAdvisor && user && (
//                   <Grid item xs={12}>
//                     <Alert severity="info">
//                       <Typography variant="body2">
//                         <strong>Service Advisor:</strong> {user.name || user.email} 
//                         {user.role && ` (${user.role})`}
//                       </Typography>
//                       <Typography variant="body2" sx={{ mt: 0.5 }}>
//                         You are authorized to {isEditing ? 'update' : 'create'} job cards.
//                       </Typography>
//                     </Alert>
//                   </Grid>
//                 )}

//                 {/* Vehicle Information */}
//                 <Grid item xs={12}>
//                   <Paper sx={{ p: 3, backgroundColor: '#e3f2fd', color: '#1565c0' }}>
//                     <Typography variant="h6" gutterBottom fontWeight="bold">
//                       🚗 Vehicle Information
//                     </Typography>
//                   </Paper>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Vehicle Number *"
//                     name="vehicle_number"
//                     value={formData.vehicle_number}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Date"
//                     name="date"
//                     type="date"
//                     value={formData.date}
//                     onChange={handleInputChange}
//                     fullWidth
//                     InputLabelProps={{ shrink: true }}
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Chassis Number"
//                     name="chassis_number"
//                     value={formData.chassis_number}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Car Make"
//                     name="car_make"
//                     value={formData.car_make}
//                     onChange={handleInputChange}
//                     select
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   >
//                     <MenuItem value="">Select Car Make</MenuItem>
//                     {carMakes.map(make => (
//                       <MenuItem key={make} value={make}>{make}</MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Car Model"
//                     name="car_model"
//                     value={formData.car_model}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Car Year"
//                     name="car_year"
//                     type="number"
//                     value={formData.car_year}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
//                 </Grid>

//                 {/* Customer Information */}
//                 <Grid item xs={12}>
//                   <Paper sx={{ p: 3, backgroundColor: '#fce4ec', color: '#ad1457', mt: 2 }}>
//                     <Typography variant="h6" gutterBottom fontWeight="bold">
//                       👤 Customer Information
//                     </Typography>
//                   </Paper>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Customer Name *"
//                     name="customer_name"
//                     value={formData.customer_name}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Customer Number *"
//                     name="customer_number"
//                     value={formData.customer_number}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Customer Email"
//                     name="customer_email"
//                     type="email"
//                     value={formData.customer_email}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Insurance Name"
//                     name="insurance_name"
//                     value={formData.insurance_name}
//                     onChange={handleInputChange}
//                     select
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   >
//                     <MenuItem value="">Select Insurance</MenuItem>
//                     {insuranceCompanies.map(company => (
//                       <MenuItem key={company} value={company}>{company}</MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>

//                 {/* Service Information */}
//                 <Grid item xs={12}>
//                   <Paper sx={{ p: 3, backgroundColor: '#fff9c4', color: '#f57f17', mt: 2 }}>
//                     <Typography variant="h6" gutterBottom fontWeight="bold">
//                       🛠️ Service Information
//                     </Typography>
//                   </Paper>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Promised Delivery Date"
//                     name="promised_delivery_date"
//                     type="date"
//                     value={formData.promised_delivery_date}
//                     onChange={handleInputChange}
//                     fullWidth
//                     InputLabelProps={{ shrink: true }}
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
//                 </Grid>

               

//                 {!isEditing && (
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Number Plate"
//                       name="number_plate_id"
//                       value={formData.number_plate_id}
//                       onChange={handleInputChange}
//                       select
//                       fullWidth
//                       variant="outlined"
//                       disabled={loading || !isServiceAdvisor || availableNumberPlates.length === 0}
//                       helperText={
//                         availableNumberPlates.length === 0 
//                           ? "No number plates available" 
//                           : "Optional: Link to existing number plate"
//                       }
//                     >
//                       <MenuItem value="">No Number Plate</MenuItem>
//                       {Array.isArray(availableNumberPlates) && availableNumberPlates.map(plate => (
//                         <MenuItem key={plate.id} value={plate.id}>
//                           {plate.plate_number} {plate.vehicle_details ? `- ${plate.vehicle_details.brand} ${plate.vehicle_details.type}` : ''}
//                         </MenuItem>
//                       ))}
//                     </TextField>
                    
                   
//                   </Grid>
//                 )}

//                 <Grid item xs={12}>
//                   <TextField
//                     label="Job Description *"
//                     name="job_description"
//                     value={formData.job_description}
//                     onChange={handleInputChange}
//                     multiline
//                     rows={4}
//                     fullWidth
//                     required
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     placeholder="Describe the work to be done..."
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
//                 </Grid>

//                 {/* Action Buttons */}
//                 <Grid item xs={12}>
//                   <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
//                     <Button 
//                       onClick={handleCancel}
//                       variant="outlined"
//                       size="large"
//                       disabled={loading}
//                     >
//                       Cancel
//                     </Button>
//                     <Button 
//                       type="submit"
//                       variant="contained"
//                       size="large"
//                       startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
//                       disabled={loading || !isServiceAdvisor}
//                     >
//                       {loading ? 'Saving...' : (isEditing ? 'Update Job Card' : 'Create Job Card')}
//                     </Button>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </form>
//           </CardContent>
//         </Card>
//       </Container>
//     </Box>
//   );
// }

// export default JobCardForm;




import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  Container,
  Paper,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Warning as WarningIcon } from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const carMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia', 'Nissan', 'Volkswagen'];
const insuranceCompanies = ['ABC Insurance', 'XYZ Insurance', 'Premium Insure', 'SecureCover', 'SafeGuard', 'No Insurance'];
const statusOptions = ['Active', 'Assigned', 'Completed'];
const fuelLevels = ['Empty', '1/4', '1/2', '3/4', 'Full'];
const workTypes = ['Repair', 'Maintenance', 'Body Work', 'Paint', 'Electrical', 'AC Service', 'Insurance Claim', 'Others'];
const colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Gray', 'Green', 'Yellow', 'Other'];

function JobCardForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { token, user } = useAuth();
  const isEditing = Boolean(id);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';

  const plateData = location.state?.plateData;

  // Check if user is service advisor
  const isServiceAdvisor = user?.role === 'service_advisor' || user?.role === 'advisor' || user?.isServiceAdvisor;

  // Form state - Updated with all new fields
  const [formData, setFormData] = useState({
    vehicle_number: '',
    date: new Date().toISOString().split('T')[0],
    chassis_number: '',
    customer_name: '',
    customer_number: '',
    customer_email: '',
    car_make: '',
    car_model: '',
    car_year: '',
    insurance_name: '',
    job_description: '',
    promised_delivery_date: '',
    number_plate_id: '',
    status: 'Active',
    // New fields from API
    vin_number: '',
    odometer_in: '',
    fuel_level_in: '',
    color: '',
    work_type: '',
    insurer: '',
    policy_no: '',
    claim_no: '',
    accessories: '',
    valuable_declared: ''
  });

  const [availableNumberPlates, setAvailableNumberPlates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlates, setLoadingPlates] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load job card data if editing and fetch available number plates
  useEffect(() => {
    const initializeData = async () => {
      setLoadingPlates(true);
      setFetchError('');
      
      try {
        // Always fetch available number plates
        await fetchAvailableNumberPlates();
        
        if (isEditing) {
          await fetchJobCard();
        } else if (plateData) {
          // Pre-fill form if coming from number plate view
          setFormData(prev => ({
            ...prev,
            vehicle_number: plateData.plateNumber || '',
            car_make: plateData.vehicleDetails?.brand || '',
            car_model: plateData.vehicleDetails?.type || '',
          }));
          setDataLoaded(true);
        } else {
          // For new job cards, mark as loaded immediately
          setDataLoaded(true);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        setFetchError(error.message || 'Failed to initialize form data');
      } finally {
        setLoadingPlates(false);
      }
    };

    initializeData();
  }, [id, isEditing, token, plateData]);

  // Fetch available number plates from API
  const fetchAvailableNumberPlates = async () => {
    try {
      console.log('🔍 Fetching available number plates...');
      
      const response = await fetch(`${BASE_URL}/api/number-plates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📥 Number plates response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Number plates API response:', result);
        
        // Handle the complex API response structure
        let plates = [];
        
        if (result.status && result.data) {
          // The data object contains mixed types - we need to find the actual plates array
          const data = result.data;
          
          // Strategy 1: Look for an array in the data object
          for (const key in data) {
            if (Array.isArray(data[key])) {
              console.log(`📁 Found array in key "${key}":`, data[key]);
              plates = data[key];
              break;
            }
          }
          
          // Strategy 2: If no array found, try to extract all objects that look like plates
          if (plates.length === 0) {
            plates = Object.values(data).filter(item => 
              item && typeof item === 'object' && item.id && item.plate_number
            );
          }
          
          // Strategy 3: If still no plates, check if data itself is the array we need
          if (plates.length === 0 && Array.isArray(data)) {
            plates = data;
          }
        }
        
        console.log('📋 Processed number plates:', plates);
        setAvailableNumberPlates(plates);
        
        // Auto-select number plate if we have plateData
        if (plateData && plates.length > 0) {
          autoSelectNumberPlate(plates);
        }
      } else {
        console.log('⚠️ Failed to fetch number plates:', response.status);
        setAvailableNumberPlates([]);
      }
    } catch (error) {
      console.log('❌ Error fetching number plates:', error);
      setAvailableNumberPlates([]);
    }
  };

  // Auto-select number plate based on plateData
  const autoSelectNumberPlate = (plates) => {
    if (!plateData || !plateData.plateNumber) {
      console.log('❌ No plateData available for auto-selection');
      return;
    }
    
    const scannedPlateNumber = plateData.plateNumber.trim().toLowerCase();
    console.log('🎯 Looking for matching number plate for:', scannedPlateNumber);
    console.log('📋 Available plates:', plates);
    
    // Try to find exact match in available plates
    const matchingPlate = plates.find(plate => {
      if (!plate.plate_number) return false;
      const availablePlateNumber = plate.plate_number.trim().toLowerCase();
      return availablePlateNumber === scannedPlateNumber;
    });
    
    if (matchingPlate) {
      console.log('✅ Found matching number plate:', matchingPlate);
      setFormData(prev => ({
        ...prev,
        number_plate_id: matchingPlate.id.toString(),
        vehicle_number: plateData.plateNumber || '',
        car_make: plateData.vehicleDetails?.brand || matchingPlate.vehicle_details?.brand || '',
        car_model: plateData.vehicleDetails?.type || matchingPlate.vehicle_details?.type || '',
      }));
    } else {
      console.log('❌ No matching number plate found for:', scannedPlateNumber);
      // Still set the vehicle number from plateData but don't set number_plate_id
      setFormData(prev => ({
        ...prev,
        vehicle_number: plateData.plateNumber || '',
        car_make: plateData.vehicleDetails?.brand || '',
        car_model: plateData.vehicleDetails?.type || '',
        number_plate_id: '' // Ensure it's empty if no match
      }));
    }
  };

  const fetchJobCard = async () => {
    try {
      setLoading(true);
      setFetchError('');

      console.log(`🔍 Fetching job card with ID: ${id}`);
      
      const response = await fetch(`${BASE_URL}/api/job-cards/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job card: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Job card fetched:', result);
      
      if (result.status && result.data) {
        const jobCard = result.data;
        console.log('📝 Setting form data with:', jobCard);
        
        // Updated to include all fields
        setFormData({
          vehicle_number: jobCard.vehicle_number || '',
          date: jobCard.date || new Date().toISOString().split('T')[0],
          chassis_number: jobCard.chassis_number || '',
          customer_name: jobCard.customer_name || '',
          customer_number: jobCard.customer_number || '',
          customer_email: jobCard.customer_email || '',
          car_make: jobCard.car_make || '',
          car_model: jobCard.car_model || '',
          car_year: jobCard.car_year || '',
          insurance_name: jobCard.insurance_name || '',
          job_description: jobCard.job_description || '',
          promised_delivery_date: jobCard.promised_delivery_date || '',
          number_plate_id: jobCard.number_plate_id || '',
          status: jobCard.status || 'Active',
          // New fields
          vin_number: jobCard.vin_number || '',
          odometer_in: jobCard.odometer_in || '',
          fuel_level_in: jobCard.fuel_level_in || '',
          color: jobCard.color || '',
          work_type: jobCard.work_type || '',
          insurer: jobCard.insurer || '',
          policy_no: jobCard.policy_no || '',
          claim_no: jobCard.claim_no || '',
          accessories: jobCard.accessories || '',
          valuable_declared: jobCard.valuable_declared || ''
        });
        
        setDataLoaded(true);
        console.log('✅ Form data loaded successfully');
      } else {
        throw new Error('Job card not found in response');
      }
      
    } catch (error) {
      console.error('❌ Error fetching job card:', error);
      setFetchError(error.message || 'Failed to fetch job card details');
      setDataLoaded(true); // Still mark as loaded to show error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is service advisor
    if (!isServiceAdvisor) {
      setSubmitError('Only service advisors can create job cards. Please contact a service advisor or login with appropriate permissions.');
      return;
    }

    try {
      setLoading(true);
      setSubmitError('');
      setSuccess('');

      // Validate required fields
      const requiredFields = {
        vehicle_number: 'Vehicle Number',
        customer_name: 'Customer Name',
        customer_number: 'Customer Number',
        job_description: 'Job Description'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([field]) => !formData[field]?.toString().trim())
        .map(([_, name]) => name);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      console.log('📤 Submitting form data as service advisor:', formData);

      const url = isEditing ? `${BASE_URL}/api/job-cards/${id}` : `${BASE_URL}/api/job-cards`;
      const method = isEditing ? 'PUT' : 'POST';

      // Prepare request body based on whether we're creating or updating
      let requestBody;

      if (isEditing) {
        // For UPDATE - only send fields allowed by PUT API
        requestBody = {
          chassis_number: formData.chassis_number?.trim() || '',
          customer_name: formData.customer_name.trim(),
          status: formData.status || 'Active'
        };
        console.log('🔄 UPDATE mode - limited fields:', requestBody);
      } else {
        // For CREATE - send all fields including new ones
        requestBody = {
          vehicle_number: formData.vehicle_number.trim(),
          date: formData.date,
          chassis_number: formData.chassis_number?.trim() || '',
          customer_name: formData.customer_name.trim(),
          customer_number: formData.customer_number.trim(),
          customer_email: formData.customer_email?.trim() || '',
          car_make: formData.car_make?.trim() || '',
          car_model: formData.car_model?.trim() || '',
          car_year: formData.car_year ? parseInt(formData.car_year) : 0,
          insurance_name: formData.insurance_name?.trim() || '',
          job_description: formData.job_description.trim(),
          promised_delivery_date: formData.promised_delivery_date || formData.date,
          // status: formData.status || 'Active', // Uncomment if your API accepts this in POST
          // New fields
          vin_number: formData.vin_number?.trim() || '',
          odometer_in: formData.odometer_in ? parseInt(formData.odometer_in) : 0,
          fuel_level_in: formData.fuel_level_in || '',
          color: formData.color?.trim() || '',
          work_type: formData.work_type?.trim() || '',
          insurer: formData.insurer?.trim() || '',
          policy_no: formData.policy_no?.trim() || '',
          claim_no: formData.claim_no?.trim() || '',
          accessories: formData.accessories?.trim() || '',
          valuable_declared: formData.valuable_declared?.trim() || ''
        };

        // Only include number_plate_id if it's a valid number and exists
        if (formData.number_plate_id && !isNaN(formData.number_plate_id) && formData.number_plate_id !== '') {
          const plateId = parseInt(formData.number_plate_id);
          const plateExists = availableNumberPlates.some(plate => plate.id === plateId);
          if (plateExists) {
            requestBody.number_plate_id = plateId;
          } else {
            console.warn('⚠️ Provided number plate ID does not exist, skipping...');
          }
        }
      }

      console.log('📦 Request body:', requestBody);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log('📥 API Response:', responseData);

      if (!response.ok) {
        // Handle foreign key constraint error specifically
        if (responseData.message?.includes('foreign key constraint') || responseData.message?.includes('number_plates')) {
          throw new Error('Invalid number plate ID. Please select a valid number plate or leave it empty.');
        }
        throw new Error(responseData.message || `Failed to ${isEditing ? 'update' : 'create'} job card: ${response.status}`);
      }

      console.log('✅ Job card saved successfully:', responseData);
      
      setSuccess(isEditing ? 'Job card updated successfully!' : 'Job card created successfully!');
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/job-cards');
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error saving job card:', error);
      setSubmitError(error.message || `Failed to ${isEditing ? 'update' : 'create'} job card`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/job-cards');
  };

  // Show loading state while fetching data
  if ((loading && isEditing) || loadingPlates) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          {isEditing ? 'Loading job card...' : 'Loading form...'}
        </Typography>
      </Box>
    );
  }

  // Show error if data loading failed
  if (fetchError && isEditing) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleCancel}>
          Back to Job Cards
        </Button>
        <Alert severity="error" sx={{ mt: 2 }}>
          {fetchError}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchJobCard}
          sx={{ mt: 2 }}
        >
          Retry Loading
        </Button>
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
            onClick={handleCancel}
            variant="outlined"
            sx={{ mr: 2 }}
            disabled={loading}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            {isEditing ? 'Edit Job Card' : 'Create New Job Card'}
          </Typography>
        </Box>

        {/* Permission Warning */}
        {!isServiceAdvisor && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            icon={<WarningIcon />}
          >
            <Typography variant="h6" gutterBottom>
              Permission Required
            </Typography>
            <Typography>
              Only service advisors can create job cards. 
              {user ? (
                <> Your current role ({user.role || 'user'}) does not have permission to create job cards.</>
              ) : (
                ' Please login as a service advisor.'
              )}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Button 
                variant="outlined" 
                color="warning"
                onClick={() => navigate('/job-cards')}
                size="small"
              >
                View Existing Job Cards
              </Button>
            </Box>
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError('')}>
            {submitError}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Edit Mode Warning */}
        {isEditing && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> In edit mode, only chassis number, customer name, and status can be updated. 
              Other fields are displayed for reference but cannot be modified.
            </Typography>
          </Alert>
        )}

        <Card sx={{ boxShadow: 3, opacity: isServiceAdvisor ? 1 : 0.6 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Current User Info */}
                {isServiceAdvisor && user && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Service Advisor:</strong> {user.name || user.email} 
                        {user.role && ` (${user.role})`}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        You are authorized to {isEditing ? 'update' : 'create'} job cards.
                      </Typography>
                    </Alert>
                  </Grid>
                )}

                {/* Vehicle Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: '#e3f2fd', color: '#1565c0' }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      🚗 Vehicle Information
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Vehicle Number *"
                    name="vehicle_number"
                    value={formData.vehicle_number}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Chassis Number"
                    name="chassis_number"
                    value={formData.chassis_number}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="VIN Number"
                    name="vin_number"
                    value={formData.vin_number}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Car Make"
                    name="car_make"
                    value={formData.car_make}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  >
                    <MenuItem value="">Select Car Make</MenuItem>
                    {carMakes.map(make => (
                      <MenuItem key={make} value={make}>{make}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Car Model"
                    name="car_model"
                    value={formData.car_model}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Car Year"
                    name="car_year"
                    type="number"
                    value={formData.car_year}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  >
                    <MenuItem value="">Select Color</MenuItem>
                    {colors.map(color => (
                      <MenuItem key={color} value={color}>{color}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Odometer In (km)"
                    name="odometer_in"
                    type="number"
                    value={formData.odometer_in}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    inputProps={{ min: 0 }}
                    helperText={isEditing ? "Cannot be modified in edit mode" : "Current odometer reading"}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Fuel Level In"
                    name="fuel_level_in"
                    value={formData.fuel_level_in}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  >
                    <MenuItem value="">Select Fuel Level</MenuItem>
                    {fuelLevels.map(level => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Customer Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: '#fce4ec', color: '#ad1457', mt: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      👤 Customer Information
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Customer Name *"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Customer Number *"
                    name="customer_number"
                    value={formData.customer_number}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Customer Email"
                    name="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

                {/* Insurance Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: '#e8f5e9', color: '#2e7d32', mt: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      🛡️ Insurance Information
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Insurance Name"
                    name="insurance_name"
                    value={formData.insurance_name}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  >
                    <MenuItem value="">Select Insurance</MenuItem>
                    {insuranceCompanies.map(company => (
                      <MenuItem key={company} value={company}>{company}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Insurer"
                    name="insurer"
                    value={formData.insurer}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : "Insurance company name"}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Policy Number"
                    name="policy_no"
                    value={formData.policy_no}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Claim Number"
                    name="claim_no"
                    value={formData.claim_no}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

                {/* Service Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: '#fff9c4', color: '#f57f17', mt: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      🛠️ Service Information
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Work Type"
                    name="work_type"
                    value={formData.work_type}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  >
                    <MenuItem value="">Select Work Type</MenuItem>
                    {workTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Promised Delivery Date"
                    name="promised_delivery_date"
                    type="date"
                    value={formData.promised_delivery_date}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

                {!isEditing && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Number Plate"
                      name="number_plate_id"
                      value={formData.number_plate_id}
                      onChange={handleInputChange}
                      select
                      fullWidth
                      variant="outlined"
                      disabled={loading || !isServiceAdvisor || availableNumberPlates.length === 0}
                      helperText={
                        availableNumberPlates.length === 0 
                          ? "No number plates available" 
                          : "Optional: Link to existing number plate"
                      }
                    >
                      <MenuItem value="">No Number Plate</MenuItem>
                      {Array.isArray(availableNumberPlates) && availableNumberPlates.map(plate => (
                        <MenuItem key={plate.id} value={plate.id}>
                          {plate.plate_number} {plate.vehicle_details ? `- ${plate.vehicle_details.brand} ${plate.vehicle_details.type}` : ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Accessories"
                    name="accessories"
                    value={formData.accessories}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : "List of accessories in the vehicle"}
                    placeholder="e.g., Music system, GPS, etc."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Valuable Declared"
                    name="valuable_declared"
                    value={formData.valuable_declared}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : "Declared valuable items in the vehicle"}
                    placeholder="e.g., Laptop, documents, etc."
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Job Description *"
                    name="job_description"
                    value={formData.job_description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    fullWidth
                    required
                    variant="outlined"
                    disabled={loading || !isServiceAdvisor || isEditing}
                    placeholder="Describe the work to be done..."
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

                {/* Status (for edit mode only) */}
                {isEditing && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      select
                      fullWidth
                      variant="outlined"
                      disabled={loading || !isServiceAdvisor}
                    >
                      {statusOptions.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      onClick={handleCancel}
                      variant="outlined"
                      size="large"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={loading || !isServiceAdvisor}
                    >
                      {loading ? 'Saving...' : (isEditing ? 'Update Job Card' : 'Create Job Card')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default JobCardForm;
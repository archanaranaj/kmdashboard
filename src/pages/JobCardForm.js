
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
//   CircularProgress,
//   Autocomplete
// } from '@mui/material';
// import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Warning as WarningIcon } from '@mui/icons-material';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import debounce from 'lodash/debounce';

// const carMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia', 'Nissan', 'Volkswagen'];
// const insuranceCompanies = ['ABC Insurance', 'XYZ Insurance', 'Premium Insure', 'SecureCover', 'SafeGuard', 'No Insurance'];
// const statusOptions = ['Active', 'Assigned', 'Completed'];
// const fuelLevels = ['Empty', '1/4', '1/2', '3/4', 'Full'];
// const workTypes = ['Repair', 'Maintenance', 'Body Work', 'Paint', 'Electrical', 'AC Service', 'Insurance Claim', 'Others'];
// const colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Gray', 'Green', 'Yellow', 'Other'];

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
//     customer_id: '',
//     car_make: '',
//     car_model: '',
//     car_year: '',
//     insurance_name: '',
//     job_description: '',
//     promised_delivery_date: '',
//     number_plate_id: '',
//     status: 'Active',
//     vin_number: '',
//     odometer_in: '',
//     fuel_level_in: '',
//     color: '',
//     work_type: '',
//     insurer: '',
//     policy_no: '',
//     claim_no: '',
//     accessories: '',
//     valuable_declared: ''
//   });

//   const [availableNumberPlates, setAvailableNumberPlates] = useState([]);
//   const [customerSuggestions, setCustomerSuggestions] = useState([]);
//   const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [loadingPlates, setLoadingPlates] = useState(false);
//   const [fetchError, setFetchError] = useState('');
//   const [submitError, setSubmitError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [dataLoaded, setDataLoaded] = useState(false);

//   // Debounced customer search function
//   const searchCustomers = debounce(async (searchTerm) => {
//     if (searchTerm.length < 3) {
//       setCustomerSuggestions([]);
//       return;
//     }

//     try {
//       setIsSearchingCustomers(true);
      
//       // Use the customers endpoint with search parameter
//       const response = await fetch(
//         `${BASE_URL}/api/customers?search=${encodeURIComponent(searchTerm)}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         const result = await response.json();
//         console.log('Customer search result:', result);
        
//         if (result.status_code === 200 && result.data && Array.isArray(result.data)) {
//           setCustomerSuggestions(result.data);
//         } else {
//           setCustomerSuggestions([]);
//         }
//       } else {
//         console.log('Customer search failed:', response.status);
//         setCustomerSuggestions([]);
//       }
//     } catch (error) {
//       console.error('Error searching customers:', error);
//       setCustomerSuggestions([]);
//     } finally {
//       setIsSearchingCustomers(false);
//     }
//   }, 300);

//   // Handle customer name input change with autocomplete
//   const handleCustomerNameChange = (event, value) => {
//     const newValue = typeof value === 'string' ? value : (value?.customer_name || '');
    
//     setFormData(prev => ({
//       ...prev,
//       customer_name: newValue,
//       // Clear other customer fields if we're typing a new name
//       customer_number: '',
//       customer_email: '',
//       customer_id: ''
//     }));

//     // Trigger search if we have 3+ characters
//     if (newValue && newValue.length >= 3) {
//       searchCustomers(newValue);
//     } else {
//       setCustomerSuggestions([]);
//     }
//   };

//   // Handle customer selection from dropdown
//   const handleCustomerSelect = (event, customer) => {
//     if (customer) {
//       console.log('Customer selected:', customer);
//       setFormData(prev => ({
//         ...prev,
//         customer_name: customer.customer_name || '',
//         customer_number: customer.customer_phone || '',
//         customer_email: customer.customer_email || '',
//         customer_id: customer.customer_id || ''
//       }));
//     }
//   };

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
//       const response = await fetch(`${BASE_URL}/api/number-plates`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const result = await response.json();
//         let plates = [];
        
//         if (result.status && result.data) {
//           const data = result.data;
//           for (const key in data) {
//             if (Array.isArray(data[key])) {
//               plates = data[key];
//               break;
//             }
//           }
          
//           if (plates.length === 0) {
//             plates = Object.values(data).filter(item => 
//               item && typeof item === 'object' && item.id && item.plate_number
//             );
//           }
          
//           if (plates.length === 0 && Array.isArray(data)) {
//             plates = data;
//           }
//         }
        
//         setAvailableNumberPlates(plates);
        
//         if (plateData && plates.length > 0) {
//           autoSelectNumberPlate(plates);
//         }
//       } else {
//         setAvailableNumberPlates([]);
//       }
//     } catch (error) {
//       console.log('Error fetching number plates:', error);
//       setAvailableNumberPlates([]);
//     }
//   };

//   // Auto-select number plate based on plateData
//   const autoSelectNumberPlate = (plates) => {
//     if (!plateData || !plateData.plateNumber) {
//       return;
//     }
    
//     const scannedPlateNumber = plateData.plateNumber.trim().toLowerCase();
//     const matchingPlate = plates.find(plate => {
//       if (!plate.plate_number) return false;
//       const availablePlateNumber = plate.plate_number.trim().toLowerCase();
//       return availablePlateNumber === scannedPlateNumber;
//     });
    
//     if (matchingPlate) {
//       setFormData(prev => ({
//         ...prev,
//         number_plate_id: matchingPlate.id.toString(),
//         vehicle_number: plateData.plateNumber || '',
//         car_make: plateData.vehicleDetails?.brand || matchingPlate.vehicle_details?.brand || '',
//         car_model: plateData.vehicleDetails?.type || matchingPlate.vehicle_details?.type || '',
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         vehicle_number: plateData.plateNumber || '',
//         car_make: plateData.vehicleDetails?.brand || '',
//         car_model: plateData.vehicleDetails?.type || '',
//         number_plate_id: ''
//       }));
//     }
//   };

//   const fetchJobCard = async () => {
//     try {
//       setLoading(true);
//       setFetchError('');

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
      
//       if (result.status && result.data) {
//         const jobCard = result.data;
        
//         setFormData({
//           vehicle_number: jobCard.vehicle_number || '',
//           date: jobCard.date || new Date().toISOString().split('T')[0],
//           chassis_number: jobCard.chassis_number || '',
//           customer_name: jobCard.customer_name || '',
//           customer_number: jobCard.customer_number || '',
//           customer_email: jobCard.customer_email || '',
//           customer_id: jobCard.customer_id || '',
//           car_make: jobCard.car_make || '',
//           car_model: jobCard.car_model || '',
//           car_year: jobCard.car_year || '',
//           insurance_name: jobCard.insurance_name || '',
//           job_description: jobCard.job_description || '',
//           promised_delivery_date: jobCard.promised_delivery_date || '',
//           number_plate_id: jobCard.number_plate_id || '',
//           status: jobCard.status || 'Active',
//           vin_number: jobCard.vin_number || '',
//           odometer_in: jobCard.odometer_in || '',
//           fuel_level_in: jobCard.fuel_level_in || '',
//           color: jobCard.color || '',
//           work_type: jobCard.work_type || '',
//           insurer: jobCard.insurer || '',
//           policy_no: jobCard.policy_no || '',
//           claim_no: jobCard.claim_no || '',
//           accessories: jobCard.accessories || '',
//           valuable_declared: jobCard.valuable_declared || ''
//         });
        
//         setDataLoaded(true);
//       } else {
//         throw new Error('Job card not found in response');
//       }
      
//     } catch (error) {
//       console.error('Error fetching job card:', error);
//       setFetchError(error.message || 'Failed to fetch job card details');
//       setDataLoaded(true);
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

//       const url = isEditing ? `${BASE_URL}/api/job-cards/${id}` : `${BASE_URL}/api/job-cards`;
//       const method = isEditing ? 'PUT' : 'POST';

//       // Prepare request body
//       let requestBody;

//       if (isEditing) {
//         // For UPDATE
//         requestBody = {
//           chassis_number: formData.chassis_number?.trim() || '',
//           customer_name: formData.customer_name.trim(),
//           status: formData.status || 'Active',
//           customer_id: formData.customer_id || null
//         };
//       } else {
//         // For CREATE
//         requestBody = {
//           vehicle_number: formData.vehicle_number.trim(),
//           date: formData.date,
//           chassis_number: formData.chassis_number?.trim() || '',
//           customer_name: formData.customer_name.trim(),
//           customer_number: formData.customer_number.trim(),
//           customer_email: formData.customer_email?.trim() || '',
//           customer_id: formData.customer_id || null,
//           car_make: formData.car_make?.trim() || '',
//           car_model: formData.car_model?.trim() || '',
//           car_year: formData.car_year ? parseInt(formData.car_year) : 0,
//           insurance_name: formData.insurance_name?.trim() || '',
//           job_description: formData.job_description.trim(),
//           promised_delivery_date: formData.promised_delivery_date || formData.date,
//           vin_number: formData.vin_number?.trim() || '',
//           odometer_in: formData.odometer_in ? parseInt(formData.odometer_in) : 0,
//           fuel_level_in: formData.fuel_level_in || '',
//           color: formData.color?.trim() || '',
//           work_type: formData.work_type?.trim() || '',
//           insurer: formData.insurer?.trim() || '',
//           policy_no: formData.policy_no?.trim() || '',
//           claim_no: formData.claim_no?.trim() || '',
//           accessories: formData.accessories?.trim() || '',
//           valuable_declared: formData.valuable_declared?.trim() || ''
//         };

//         // Include number_plate_id if valid
//         if (formData.number_plate_id && !isNaN(formData.number_plate_id) && formData.number_plate_id !== '') {
//           const plateId = parseInt(formData.number_plate_id);
//           const plateExists = availableNumberPlates.some(plate => plate.id === plateId);
//           if (plateExists) {
//             requestBody.number_plate_id = plateId;
//           }
//         }
//       }

//       console.log('Request body:', requestBody);

//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestBody),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         if (responseData.message?.includes('foreign key constraint') || responseData.message?.includes('number_plates')) {
//           throw new Error('Invalid number plate ID. Please select a valid number plate or leave it empty.');
//         }
//         throw new Error(responseData.message || `Failed to ${isEditing ? 'update' : 'create'} job card: ${response.status}`);
//       }

//       setSuccess(isEditing ? 'Job card updated successfully!' : 'Job card created successfully!');
      
//       setTimeout(() => {
//         navigate('/job-cards');
//       }, 1500);
      
//     } catch (error) {
//       console.error('Error saving job card:', error);
//       setSubmitError(error.message || `Failed to ${isEditing ? 'update' : 'create'} job card`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/job-cards');
//   };

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
//                     label="VIN Number"
//                     name="vin_number"
//                     value={formData.vin_number}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
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

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Color"
//                     name="color"
//                     value={formData.color}
//                     onChange={handleInputChange}
//                     select
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   >
//                     <MenuItem value="">Select Color</MenuItem>
//                     {colors.map(color => (
//                       <MenuItem key={color} value={color}>{color}</MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Odometer In (km)"
//                     name="odometer_in"
//                     type="number"
//                     value={formData.odometer_in}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     inputProps={{ min: 0 }}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "Current odometer reading"}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Fuel Level In"
//                     name="fuel_level_in"
//                     value={formData.fuel_level_in}
//                     onChange={handleInputChange}
//                     select
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   >
//                     <MenuItem value="">Select Fuel Level</MenuItem>
//                     {fuelLevels.map(level => (
//                       <MenuItem key={level} value={level}>{level}</MenuItem>
//                     ))}
//                   </TextField>
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
//                   <Autocomplete
//                     freeSolo
//                     options={customerSuggestions}
//                     getOptionLabel={(option) => {
//                       if (typeof option === 'string') return option;
//                       return option.customer_name || '';
//                     }}
//                     value={formData.customer_name}
//                     onChange={handleCustomerSelect}
//                     onInputChange={handleCustomerNameChange}
//                     loading={isSearchingCustomers}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="Customer Name *"
//                         name="customer_name"
//                         required
//                         fullWidth
//                         variant="outlined"
//                         disabled={loading || !isServiceAdvisor}
//                         helperText="Type 3+ letters to see existing customer suggestions"
//                         InputProps={{
//                           ...params.InputProps,
//                           endAdornment: (
//                             <>
//                               {isSearchingCustomers ? <CircularProgress color="inherit" size={20} /> : null}
//                               {params.InputProps.endAdornment}
//                             </>
//                           ),
//                         }}
//                       />
//                     )}
//                     renderOption={(props, option) => (
//                       <li {...props}>
//                         <Box sx={{ width: '100%' }}>
//                           <Typography variant="body1" fontWeight="medium">
//                             {option.customer_name}
//                           </Typography>
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
//                             <Typography variant="body2" color="textSecondary">
//                               📱 {option.customer_phone}
//                             </Typography>
//                             {option.customer_email && (
//                               <Typography variant="body2" color="textSecondary">
//                                 ✉️ {option.customer_email}
//                               </Typography>
//                             )}
//                           </Box>
//                         </Box>
//                       </li>
//                     )}
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
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "Will auto-fill if you select a customer"}
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
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "Will auto-fill if you select a customer"}
//                   />
//                 </Grid>

//                 {/* Hidden customer_id field */}
//                 <input
//                   type="hidden"
//                   name="customer_id"
//                   value={formData.customer_id}
//                 />

//                 {/* Insurance Information */}
//                 <Grid item xs={12}>
//                   <Paper sx={{ p: 3, backgroundColor: '#e8f5e9', color: '#2e7d32', mt: 2 }}>
//                     <Typography variant="h6" gutterBottom fontWeight="bold">
//                       🛡️ Insurance Information
//                     </Typography>
//                   </Paper>
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

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Insurer"
//                     name="insurer"
//                     value={formData.insurer}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "Insurance company name"}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Policy Number"
//                     name="policy_no"
//                     value={formData.policy_no}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Claim Number"
//                     name="claim_no"
//                     value={formData.claim_no}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
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
//                     label="Work Type"
//                     name="work_type"
//                     value={formData.work_type}
//                     onChange={handleInputChange}
//                     select
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   >
//                     <MenuItem value="">Select Work Type</MenuItem>
//                     {workTypes.map(type => (
//                       <MenuItem key={type} value={type}>{type}</MenuItem>
//                     ))}
//                   </TextField>
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

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Accessories"
//                     name="accessories"
//                     value={formData.accessories}
//                     onChange={handleInputChange}
//                     fullWidth
//                     multiline
//                     rows={2}
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "List of accessories in the vehicle"}
//                     placeholder="e.g., Music system, GPS, etc."
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Valuable Declared"
//                     name="valuable_declared"
//                     value={formData.valuable_declared}
//                     onChange={handleInputChange}
//                     fullWidth
//                     multiline
//                     rows={2}
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "Declared valuable items in the vehicle"}
//                     placeholder="e.g., Laptop, documents, etc."
//                   />
//                 </Grid>

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

//                 {isEditing && (
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Status"
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       select
//                       fullWidth
//                       variant="outlined"
//                       disabled={loading || !isServiceAdvisor}
//                     >
//                       {statusOptions.map(status => (
//                         <MenuItem key={status} value={status}>{status}</MenuItem>
//                       ))}
//                     </TextField>
//                   </Grid>
//                 )}

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
//   CircularProgress,
//   Autocomplete
// } from '@mui/material';
// import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Warning as WarningIcon } from '@mui/icons-material';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import debounce from 'lodash/debounce';

// const carMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia', 'Nissan', 'Volkswagen'];
// const insuranceCompanies = [
//   'AAFIYA INSURANCE BROKERS',
//   'Abu Dhabi National Insurance Company',
//   'ADAMJEE INSURANCE CO. LTD',
//   'AFIA INSURANCE',
//   'AL AIN AHLIA INSURANCE',
//   'AL FUJAIRAH NATIONAL INSURANCE CO',
//   'AL ITTIHAD AL WATANI (GENERAL INSURANCE SOCIETY FOR NEAR EAST)',
//   'AL NABOODA INSURANCE BROKERS LLC',
//   'AL WATHABA INSURANCE',
//   'ALLIANCE INSURANCE',
//   'ARABIA INSURANCE',
//   'ARMAB INSURANCE WORK',
//   'ARMAB INSURANCE WORKS LLC',
//   'BERNS BRETT MASOOD INSURANCE',
//   'C/O WATANIA INSURANCE',
//   'COMPASS INSURANCE BROKERS',
//   'CROSS ROADS INSURANCE BROKERS LLC',
//   'DAR AL TAKAFUL INSURANCE',
//   'Dnata Insurance',
//   'DUBAI INSURANCE',
//   'Dubai National Insurance and Reinsurance co. P.S.C',
//   'EMIRATES INSURANCE',
//   'GENERAL INSURANCE CORPORATION',
//   'GREENSHIELD INSURANCE',
//   'Insurance1',
//   'Islamic Arab Insurance Company- SALAMA',
//   'LIVA INSURANCE B.S.C CLOSED',
//   'MATAQ TAKAFUL INSURANCE',
//   'MR RAJ QATAR INSURANCE',
//   'MR SHARAD C/O NEW INDIAN INSURANCE',
//   'NANDU - AFIA INSURANCE BROKERS',
//   'NASCO INSURANCE',
//   'National General Insurance Co. (P.J.S.C)',
//   'NATIONAL LIFE AND GENERAL INSURANCE COMPANY',
//   'NEW INDIA INSURANCE -AD',
//   'OMAN INSURANCE',
//   'OMEGA INSURANCE  BROKERS',
//   'OMEGA INSURANCE BROKERS LLC',
//   'ORIENTAL INSURANCE - MR. GIRISH',
//   'Oriental Insurance Co. Ltd.',
//   'PIONEER INSURANCE',
//   'PROMINENT INSURANCE BROKERS',
//   'QATAR INSURANCE COMPANY',
//   'RAIS HASSAN SAADI INSURANCE AGENTS',
//   'Ras Al Khaimah National Insurance CO P.S.C',
//   'ROYAL & SUN INSURANCE',
//   'THE ORIENTAL INSURANCE',
//   'TOKIO MARINE & NICHIDO FIRE INSURANCE CO LTD',
//   'UNION INSURANCE',
//   'Union Insurance Company',
//   'UNITED FIDELITY INSURANCE COMPANY',
//   'UROPEAN INSURANCE BROKERS',
//   'No Insurance'
// ];
// const statusOptions = ['Active', 'Assigned', 'Completed'];
// const fuelLevels = ['Empty', '1/4', '1/2', '3/4', 'Full'];
// const workTypes = ['Repair', 'Maintenance', 'Body Work', 'Paint', 'Electrical', 'AC Service', 'Insurance Claim', 'Others'];
// const colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Gray', 'Green', 'Yellow', 'Other'];

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
//     customer_id: '',
//     car_make: '',
//     car_model: '',
//     car_year: '',
//     insurance_name: '',
//     job_description: '',
//     promised_delivery_date: '',
//     number_plate_id: '',
//     status: 'Active',
//     vin_number: '',
//     odometer_in: '',
//     fuel_level_in: '',
//     color: '',
//     work_type: '',
//     insurer: '',
//     policy_no: '',
//     claim_no: '',
//     accessories: '',
//     valuable_declared: ''
//   });

//   const [availableNumberPlates, setAvailableNumberPlates] = useState([]);
//   const [customerSuggestions, setCustomerSuggestions] = useState([]);
//   const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [loadingPlates, setLoadingPlates] = useState(false);
//   const [fetchError, setFetchError] = useState('');
//   const [submitError, setSubmitError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [dataLoaded, setDataLoaded] = useState(false);

//   // Debounced customer search function
//   const searchCustomers = debounce(async (searchTerm) => {
//     if (searchTerm.length < 3) {
//       setCustomerSuggestions([]);
//       return;
//     }

//     try {
//       setIsSearchingCustomers(true);
      
//       // Use the customers endpoint with search parameter
//       const response = await fetch(
//         `${BASE_URL}/api/customers?search=${encodeURIComponent(searchTerm)}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         const result = await response.json();
//         console.log('Customer search result:', result);
        
//         if (result.status_code === 200 && result.data && Array.isArray(result.data)) {
//           setCustomerSuggestions(result.data);
//         } else {
//           setCustomerSuggestions([]);
//         }
//       } else {
//         console.log('Customer search failed:', response.status);
//         setCustomerSuggestions([]);
//       }
//     } catch (error) {
//       console.error('Error searching customers:', error);
//       setCustomerSuggestions([]);
//     } finally {
//       setIsSearchingCustomers(false);
//     }
//   }, 300);

//   // Handle customer name input change with autocomplete
//   const handleCustomerNameChange = (event, value) => {
//     const newValue = typeof value === 'string' ? value : (value?.customer_name || '');
    
//     setFormData(prev => ({
//       ...prev,
//       customer_name: newValue,
//       // Clear other customer fields if we're typing a new name
//       customer_number: '',
//       customer_email: '',
//       customer_id: ''
//     }));

//     // Trigger search if we have 3+ characters
//     if (newValue && newValue.length >= 3) {
//       searchCustomers(newValue);
//     } else {
//       setCustomerSuggestions([]);
//     }
//   };

//   // Handle customer selection from dropdown
//   const handleCustomerSelect = (event, customer) => {
//     if (customer) {
//       console.log('Customer selected:', customer);
//       setFormData(prev => ({
//         ...prev,
//         customer_name: customer.customer_name || '',
//         customer_number: customer.customer_phone || '',
//         customer_email: customer.customer_email || '',
//         customer_id: customer.customer_id || ''
//       }));
//     }
//   };

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
//       const response = await fetch(`${BASE_URL}/api/number-plates`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const result = await response.json();
//         let plates = [];
        
//         if (result.status && result.data) {
//           const data = result.data;
//           for (const key in data) {
//             if (Array.isArray(data[key])) {
//               plates = data[key];
//               break;
//             }
//           }
          
//           if (plates.length === 0) {
//             plates = Object.values(data).filter(item => 
//               item && typeof item === 'object' && item.id && item.plate_number
//             );
//           }
          
//           if (plates.length === 0 && Array.isArray(data)) {
//             plates = data;
//           }
//         }
        
//         setAvailableNumberPlates(plates);
        
//         if (plateData && plates.length > 0) {
//           autoSelectNumberPlate(plates);
//         }
//       } else {
//         setAvailableNumberPlates([]);
//       }
//     } catch (error) {
//       console.log('Error fetching number plates:', error);
//       setAvailableNumberPlates([]);
//     }
//   };

//   // Auto-select number plate based on plateData
//   const autoSelectNumberPlate = (plates) => {
//     if (!plateData || !plateData.plateNumber) {
//       return;
//     }
    
//     const scannedPlateNumber = plateData.plateNumber.trim().toLowerCase();
//     const matchingPlate = plates.find(plate => {
//       if (!plate.plate_number) return false;
//       const availablePlateNumber = plate.plate_number.trim().toLowerCase();
//       return availablePlateNumber === scannedPlateNumber;
//     });
    
//     if (matchingPlate) {
//       setFormData(prev => ({
//         ...prev,
//         number_plate_id: matchingPlate.id.toString(),
//         vehicle_number: plateData.plateNumber || '',
//         car_make: plateData.vehicleDetails?.brand || matchingPlate.vehicle_details?.brand || '',
//         car_model: plateData.vehicleDetails?.type || matchingPlate.vehicle_details?.type || '',
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         vehicle_number: plateData.plateNumber || '',
//         car_make: plateData.vehicleDetails?.brand || '',
//         car_model: plateData.vehicleDetails?.type || '',
//         number_plate_id: ''
//       }));
//     }
//   };

//   const fetchJobCard = async () => {
//     try {
//       setLoading(true);
//       setFetchError('');

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
      
//       if (result.status && result.data) {
//         const jobCard = result.data;
        
//         setFormData({
//           vehicle_number: jobCard.vehicle_number || '',
//           date: jobCard.date || new Date().toISOString().split('T')[0],
//           chassis_number: jobCard.chassis_number || '',
//           customer_name: jobCard.customer_name || '',
//           customer_number: jobCard.customer_number || '',
//           customer_email: jobCard.customer_email || '',
//           customer_id: jobCard.customer_id || '',
//           car_make: jobCard.car_make || '',
//           car_model: jobCard.car_model || '',
//           car_year: jobCard.car_year || '',
//           insurance_name: jobCard.insurance_name || '',
//           job_description: jobCard.job_description || '',
//           promised_delivery_date: jobCard.promised_delivery_date || '',
//           number_plate_id: jobCard.number_plate_id || '',
//           status: jobCard.status || 'Active',
//           vin_number: jobCard.vin_number || '',
//           odometer_in: jobCard.odometer_in || '',
//           fuel_level_in: jobCard.fuel_level_in || '',
//           color: jobCard.color || '',
//           work_type: jobCard.work_type || '',
//           insurer: jobCard.insurer || '',
//           policy_no: jobCard.policy_no || '',
//           claim_no: jobCard.claim_no || '',
//           accessories: jobCard.accessories || '',
//           valuable_declared: jobCard.valuable_declared || ''
//         });
        
//         setDataLoaded(true);
//       } else {
//         throw new Error('Job card not found in response');
//       }
      
//     } catch (error) {
//       console.error('Error fetching job card:', error);
//       setFetchError(error.message || 'Failed to fetch job card details');
//       setDataLoaded(true);
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

//       const url = isEditing ? `${BASE_URL}/api/job-cards/${id}` : `${BASE_URL}/api/job-cards`;
//       const method = isEditing ? 'PUT' : 'POST';

//       // Prepare request body
//       let requestBody;

//       if (isEditing) {
//         // For UPDATE
//         requestBody = {
//           chassis_number: formData.chassis_number?.trim() || '',
//           customer_name: formData.customer_name.trim(),
//           status: formData.status || 'Active',
//           customer_id: formData.customer_id || null
//         };
//       } else {
//         // For CREATE
//         requestBody = {
//           vehicle_number: formData.vehicle_number.trim(),
//           date: formData.date,
//           chassis_number: formData.chassis_number?.trim() || '',
//           customer_name: formData.customer_name.trim(),
//           customer_number: formData.customer_number.trim(),
//           customer_email: formData.customer_email?.trim() || '',
//           customer_id: formData.customer_id || null,
//           car_make: formData.car_make?.trim() || '',
//           car_model: formData.car_model?.trim() || '',
//           car_year: formData.car_year ? parseInt(formData.car_year) : 0,
//           insurance_name: formData.insurance_name?.trim() || '',
//           job_description: formData.job_description.trim(),
//           promised_delivery_date: formData.promised_delivery_date || formData.date,
//           vin_number: formData.vin_number?.trim() || '',
//           odometer_in: formData.odometer_in ? parseInt(formData.odometer_in) : 0,
//           fuel_level_in: formData.fuel_level_in || '',
//           color: formData.color?.trim() || '',
//           work_type: formData.work_type?.trim() || '',
//           insurer: formData.insurer?.trim() || '',
//           policy_no: formData.policy_no?.trim() || '',
//           claim_no: formData.claim_no?.trim() || '',
//           accessories: formData.accessories?.trim() || '',
//           valuable_declared: formData.valuable_declared?.trim() || ''
//         };

//         // Include number_plate_id if valid
//         if (formData.number_plate_id && !isNaN(formData.number_plate_id) && formData.number_plate_id !== '') {
//           const plateId = parseInt(formData.number_plate_id);
//           const plateExists = availableNumberPlates.some(plate => plate.id === plateId);
//           if (plateExists) {
//             requestBody.number_plate_id = plateId;
//           }
//         }
//       }

//       console.log('Request body:', requestBody);

//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestBody),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         if (responseData.message?.includes('foreign key constraint') || responseData.message?.includes('number_plates')) {
//           throw new Error('Invalid number plate ID. Please select a valid number plate or leave it empty.');
//         }
//         throw new Error(responseData.message || `Failed to ${isEditing ? 'update' : 'create'} job card: ${response.status}`);
//       }

//       setSuccess(isEditing ? 'Job card updated successfully!' : 'Job card created successfully!');
      
//       setTimeout(() => {
//         navigate('/job-cards');
//       }, 1500);
      
//     } catch (error) {
//       console.error('Error saving job card:', error);
//       setSubmitError(error.message || `Failed to ${isEditing ? 'update' : 'create'} job card`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/job-cards');
//   };

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
//                     label="VIN Number"
//                     name="vin_number"
//                     value={formData.vin_number}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
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

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Color"
//                     name="color"
//                     value={formData.color}
//                     onChange={handleInputChange}
//                     select
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   >
//                     <MenuItem value="">Select Color</MenuItem>
//                     {colors.map(color => (
//                       <MenuItem key={color} value={color}>{color}</MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Odometer In (km)"
//                     name="odometer_in"
//                     type="number"
//                     value={formData.odometer_in}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     inputProps={{ min: 0 }}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "Current odometer reading"}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Fuel Level In"
//                     name="fuel_level_in"
//                     value={formData.fuel_level_in}
//                     onChange={handleInputChange}
//                     select
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   >
//                     <MenuItem value="">Select Fuel Level</MenuItem>
//                     {fuelLevels.map(level => (
//                       <MenuItem key={level} value={level}>{level}</MenuItem>
//                     ))}
//                   </TextField>
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
//                   <Autocomplete
//                     freeSolo
//                     options={customerSuggestions}
//                     getOptionLabel={(option) => {
//                       if (typeof option === 'string') return option;
//                       return option.customer_name || '';
//                     }}
//                     value={formData.customer_name}
//                     onChange={handleCustomerSelect}
//                     onInputChange={handleCustomerNameChange}
//                     loading={isSearchingCustomers}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="Customer Name *"
//                         name="customer_name"
//                         required
//                         fullWidth
//                         variant="outlined"
//                         disabled={loading || !isServiceAdvisor}
//                         helperText="Type 3+ letters to see existing customer suggestions"
//                         InputProps={{
//                           ...params.InputProps,
//                           endAdornment: (
//                             <>
//                               {isSearchingCustomers ? <CircularProgress color="inherit" size={20} /> : null}
//                               {params.InputProps.endAdornment}
//                             </>
//                           ),
//                         }}
//                       />
//                     )}
//                     renderOption={(props, option) => (
//                       <li {...props}>
//                         <Box sx={{ width: '100%' }}>
//                           <Typography variant="body1" fontWeight="medium">
//                             {option.customer_name}
//                           </Typography>
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
//                             <Typography variant="body2" color="textSecondary">
//                               📱 {option.customer_phone}
//                             </Typography>
//                             {option.customer_email && (
//                               <Typography variant="body2" color="textSecondary">
//                                 ✉️ {option.customer_email}
//                               </Typography>
//                             )}
//                           </Box>
//                         </Box>
//                       </li>
//                     )}
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
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "Will auto-fill if you select a customer"}
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
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "Will auto-fill if you select a customer"}
//                   />
//                 </Grid>

//                 {/* Hidden customer_id field */}
//                 <input
//                   type="hidden"
//                   name="customer_id"
//                   value={formData.customer_id}
//                 />

//                 {/* Insurance Information */}
//                 <Grid item xs={12}>
//                   <Paper sx={{ p: 3, backgroundColor: '#e8f5e9', color: '#2e7d32', mt: 2 }}>
//                     <Typography variant="h6" gutterBottom fontWeight="bold">
//                       🛡️ Insurance Information
//                     </Typography>
//                   </Paper>
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

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Insurer"
//                     name="insurer"
//                     value={formData.insurer}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "Insurance company name"}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Policy Number"
//                     name="policy_no"
//                     value={formData.policy_no}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Claim Number"
//                     name="claim_no"
//                     value={formData.claim_no}
//                     onChange={handleInputChange}
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   />
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
//                     label="Work Type"
//                     name="work_type"
//                     value={formData.work_type}
//                     onChange={handleInputChange}
//                     select
//                     fullWidth
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : ""}
//                   >
//                     <MenuItem value="">Select Work Type</MenuItem>
//                     {workTypes.map(type => (
//                       <MenuItem key={type} value={type}>{type}</MenuItem>
//                     ))}
//                   </TextField>
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

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Accessories"
//                     name="accessories"
//                     value={formData.accessories}
//                     onChange={handleInputChange}
//                     fullWidth
//                     multiline
//                     rows={2}
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "List of accessories in the vehicle"}
//                     placeholder="e.g., Music system, GPS, etc."
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Valuable Declared"
//                     name="valuable_declared"
//                     value={formData.valuable_declared}
//                     onChange={handleInputChange}
//                     fullWidth
//                     multiline
//                     rows={2}
//                     variant="outlined"
//                     disabled={loading || !isServiceAdvisor || isEditing}
//                     helperText={isEditing ? "Cannot be modified in edit mode" : "Declared valuable items in the vehicle"}
//                     placeholder="e.g., Laptop, documents, etc."
//                   />
//                 </Grid>

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

//                 {isEditing && (
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Status"
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       select
//                       fullWidth
//                       variant="outlined"
//                       disabled={loading || !isServiceAdvisor}
//                     >
//                       {statusOptions.map(status => (
//                         <MenuItem key={status} value={status}>{status}</MenuItem>
//                       ))}
//                     </TextField>
//                   </Grid>
//                 )}

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
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Warning as WarningIcon } from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import debounce from 'lodash/debounce';

const carMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia', 'Nissan', 'Volkswagen'];
const insuranceCompanies = [
  'AAFIYA INSURANCE BROKERS',
  'Abu Dhabi National Insurance Company',
  'ADAMJEE INSURANCE CO. LTD',
  'AFIA INSURANCE',
  'AL AIN AHLIA INSURANCE',
  'AL FUJAIRAH NATIONAL INSURANCE CO',
  'AL ITTIHAD AL WATANI (GENERAL INSURANCE SOCIETY FOR NEAR EAST)',
  'AL NABOODA INSURANCE BROKERS LLC',
  'AL WATHABA INSURANCE',
  'ALLIANCE INSURANCE',
  'ARABIA INSURANCE',
  'ARMAB INSURANCE WORK',
  'ARMAB INSURANCE WORKS LLC',
  'BERNS BRETT MASOOD INSURANCE',
  'C/O WATANIA INSURANCE',
  'COMPASS INSURANCE BROKERS',
  'CROSS ROADS INSURANCE BROKERS LLC',
  'DAR AL TAKAFUL INSURANCE',
  'Dnata Insurance',
  'DUBAI INSURANCE',
  'Dubai National Insurance and Reinsurance co. P.S.C',
  'EMIRATES INSURANCE',
  'GENERAL INSURANCE CORPORATION',
  'GREENSHIELD INSURANCE',
  'Insurance1',
  'Islamic Arab Insurance Company- SALAMA',
  'LIVA INSURANCE B.S.C CLOSED',
  'MATAQ TAKAFUL INSURANCE',
  'MR RAJ QATAR INSURANCE',
  'MR SHARAD C/O NEW INDIAN INSURANCE',
  'NANDU - AFIA INSURANCE BROKERS',
  'NASCO INSURANCE',
  'National General Insurance Co. (P.J.S.C)',
  'NATIONAL LIFE AND GENERAL INSURANCE COMPANY',
  'NEW INDIA INSURANCE -AD',
  'OMAN INSURANCE',
  'OMEGA INSURANCE  BROKERS',
  'OMEGA INSURANCE BROKERS LLC',
  'ORIENTAL INSURANCE - MR. GIRISH',
  'Oriental Insurance Co. Ltd.',
  'PIONEER INSURANCE',
  'PROMINENT INSURANCE BROKERS',
  'QATAR INSURANCE COMPANY',
  'RAIS HASSAN SAADI INSURANCE AGENTS',
  'Ras Al Khaimah National Insurance CO P.S.C',
  'ROYAL & SUN INSURANCE',
  'THE ORIENTAL INSURANCE',
  'TOKIO MARINE & NICHIDO FIRE INSURANCE CO LTD',
  'UNION INSURANCE',
  'Union Insurance Company',
  'UNITED FIDELITY INSURANCE COMPANY',
  'UROPEAN INSURANCE BROKERS',
  'No Insurance'
];
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

  // Form state
  const [formData, setFormData] = useState({
    vehicle_number: '',
    date: new Date().toISOString().split('T')[0],
    chassis_number: '',
    customer_name: '',
    customer_number: '',
    customer_email: '',
    customer_id: '',
    car_make: '',
    car_model: '',
    car_year: '',
    insurance_name: '',
    job_description: '',
    promised_delivery_date: '',
    number_plate_id: '',
    status: 'Active',
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
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPlates, setLoadingPlates] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  // Debounced customer search function
  const searchCustomers = debounce(async (searchTerm) => {
    if (searchTerm.length < 3) {
      setCustomerSuggestions([]);
      return;
    }

    try {
      setIsSearchingCustomers(true);
      
      // Use the customers endpoint with search parameter
      const response = await fetch(
        `${BASE_URL}/api/customers?search=${encodeURIComponent(searchTerm)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Customer search result:', result);
        
        if (result.status_code === 200 && result.data && Array.isArray(result.data)) {
          setCustomerSuggestions(result.data);
        } else {
          setCustomerSuggestions([]);
        }
      } else {
        console.log('Customer search failed:', response.status);
        setCustomerSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching customers:', error);
      setCustomerSuggestions([]);
    } finally {
      setIsSearchingCustomers(false);
    }
  }, 300);

  // Handle customer name input change with autocomplete
  const handleCustomerNameChange = (event, value) => {
    const newValue = typeof value === 'string' ? value : (value?.customer_name || '');
    
    setFormData(prev => ({
      ...prev,
      customer_name: newValue,
      // Clear other customer fields if we're typing a new name
      customer_number: '',
      customer_email: '',
      customer_id: ''
    }));

    // Trigger search if we have 3+ characters
    if (newValue && newValue.length >= 3) {
      searchCustomers(newValue);
    } else {
      setCustomerSuggestions([]);
    }
  };

  // Handle customer selection from dropdown
  const handleCustomerSelect = (event, customer) => {
    if (customer) {
      console.log('Customer selected:', customer);
      setFormData(prev => ({
        ...prev,
        customer_name: customer.customer_name || '',
        customer_number: customer.customer_phone || '',
        customer_email: customer.customer_email || '',
        customer_id: customer.customer_id || ''
      }));
    }
  };

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
      const response = await fetch(`${BASE_URL}/api/number-plates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        let plates = [];
        
        if (result.status && result.data) {
          const data = result.data;
          for (const key in data) {
            if (Array.isArray(data[key])) {
              plates = data[key];
              break;
            }
          }
          
          if (plates.length === 0) {
            plates = Object.values(data).filter(item => 
              item && typeof item === 'object' && item.id && item.plate_number
            );
          }
          
          if (plates.length === 0 && Array.isArray(data)) {
            plates = data;
          }
        }
        
        setAvailableNumberPlates(plates);
        
        if (plateData && plates.length > 0) {
          autoSelectNumberPlate(plates);
        }
      } else {
        setAvailableNumberPlates([]);
      }
    } catch (error) {
      console.log('Error fetching number plates:', error);
      setAvailableNumberPlates([]);
    }
  };

  // Auto-select number plate based on plateData
  const autoSelectNumberPlate = (plates) => {
    if (!plateData || !plateData.plateNumber) {
      return;
    }
    
    const scannedPlateNumber = plateData.plateNumber.trim().toLowerCase();
    const matchingPlate = plates.find(plate => {
      if (!plate.plate_number) return false;
      const availablePlateNumber = plate.plate_number.trim().toLowerCase();
      return availablePlateNumber === scannedPlateNumber;
    });
    
    if (matchingPlate) {
      setFormData(prev => ({
        ...prev,
        number_plate_id: matchingPlate.id.toString(),
        vehicle_number: plateData.plateNumber || '',
        car_make: plateData.vehicleDetails?.brand || matchingPlate.vehicle_details?.brand || '',
        car_model: plateData.vehicleDetails?.type || matchingPlate.vehicle_details?.type || '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        vehicle_number: plateData.plateNumber || '',
        car_make: plateData.vehicleDetails?.brand || '',
        car_model: plateData.vehicleDetails?.type || '',
        number_plate_id: ''
      }));
    }
  };

  const fetchJobCard = async () => {
    try {
      setLoading(true);
      setFetchError('');

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
      
      if (result.status && result.data) {
        const jobCard = result.data;
        
        setFormData({
          vehicle_number: jobCard.vehicle_number || '',
          date: jobCard.date || new Date().toISOString().split('T')[0],
          chassis_number: jobCard.chassis_number || '',
          customer_name: jobCard.customer_name || '',
          customer_number: jobCard.customer_number || '',
          customer_email: jobCard.customer_email || '',
          customer_id: jobCard.customer_id || '',
          car_make: jobCard.car_make || '',
          car_model: jobCard.car_model || '',
          car_year: jobCard.car_year || '',
          insurance_name: jobCard.insurance_name || '',
          job_description: jobCard.job_description || '',
          promised_delivery_date: jobCard.promised_delivery_date || '',
          number_plate_id: jobCard.number_plate_id || '',
          status: jobCard.status || 'Active',
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
      } else {
        throw new Error('Job card not found in response');
      }
      
    } catch (error) {
      console.error('Error fetching job card:', error);
      setFetchError(error.message || 'Failed to fetch job card details');
      setDataLoaded(true);
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
    
    {/* TEMPORARILY COMMENTED OUT: Permission check for service advisors only */}
    {/* 
    if (!isServiceAdvisor) {
      setSubmitError('Only service advisors can create job cards. Please contact a service advisor or login with appropriate permissions.');
      return;
    }
    */}

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

      const url = isEditing ? `${BASE_URL}/api/job-cards/${id}` : `${BASE_URL}/api/job-cards`;
      const method = isEditing ? 'PUT' : 'POST';

      // Prepare request body
      let requestBody;

      if (isEditing) {
        // For UPDATE
        requestBody = {
          chassis_number: formData.chassis_number?.trim() || '',
          customer_name: formData.customer_name.trim(),
          status: formData.status || 'Active',
          customer_id: formData.customer_id || null
        };
      } else {
        // For CREATE
        requestBody = {
          vehicle_number: formData.vehicle_number.trim(),
          date: formData.date,
          chassis_number: formData.chassis_number?.trim() || '',
          customer_name: formData.customer_name.trim(),
          customer_number: formData.customer_number.trim(),
          customer_email: formData.customer_email?.trim() || '',
          customer_id: formData.customer_id || null,
          car_make: formData.car_make?.trim() || '',
          car_model: formData.car_model?.trim() || '',
          car_year: formData.car_year ? parseInt(formData.car_year) : 0,
          insurance_name: formData.insurance_name?.trim() || '',
          job_description: formData.job_description.trim(),
          promised_delivery_date: formData.promised_delivery_date || formData.date,
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

        // Include number_plate_id if valid
        if (formData.number_plate_id && !isNaN(formData.number_plate_id) && formData.number_plate_id !== '') {
          const plateId = parseInt(formData.number_plate_id);
          const plateExists = availableNumberPlates.some(plate => plate.id === plateId);
          if (plateExists) {
            requestBody.number_plate_id = plateId;
          }
        }
      }

      console.log('Request body:', requestBody);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.message?.includes('foreign key constraint') || responseData.message?.includes('number_plates')) {
          throw new Error('Invalid number plate ID. Please select a valid number plate or leave it empty.');
        }
        throw new Error(responseData.message || `Failed to ${isEditing ? 'update' : 'create'} job card: ${response.status}`);
      }

      setSuccess(isEditing ? 'Job card updated successfully!' : 'Job card created successfully!');
      
      setTimeout(() => {
        navigate('/job-cards');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving job card:', error);
      setSubmitError(error.message || `Failed to ${isEditing ? 'update' : 'create'} job card`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/job-cards');
  };

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

        {/* TEMPORARILY COMMENTED OUT: Permission warning */}
        {/* 
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
        */}

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

        {isEditing && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> In edit mode, only chassis number, customer name, and status can be updated. 
              Other fields are displayed for reference but cannot be modified.
            </Typography>
          </Alert>
        )}

        {/* Changed from: opacity: isServiceAdvisor ? 1 : 0.6 */}
        <Card sx={{ boxShadow: 3, opacity: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                    disabled={loading}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                  <Autocomplete
                    freeSolo
                    options={customerSuggestions}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') return option;
                      return option.customer_name || '';
                    }}
                    value={formData.customer_name}
                    onChange={handleCustomerSelect}
                    onInputChange={handleCustomerNameChange}
                    loading={isSearchingCustomers}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer Name *"
                        name="customer_name"
                        required
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                        helperText="Type 3+ letters to see existing customer suggestions"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isSearchingCustomers ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="body1" fontWeight="medium">
                            {option.customer_name}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="body2" color="textSecondary">
                              📱 {option.customer_phone}
                            </Typography>
                            {option.customer_email && (
                              <Typography variant="body2" color="textSecondary">
                                ✉️ {option.customer_email}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </li>
                    )}
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
                    disabled={loading || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : "Will auto-fill if you select a customer"}
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
                    disabled={loading || isEditing}
                    helperText={isEditing ? "Cannot be modified in edit mode" : "Will auto-fill if you select a customer"}
                  />
                </Grid>

                {/* Hidden customer_id field */}
                <input
                  type="hidden"
                  name="customer_id"
                  value={formData.customer_id}
                />

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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                      disabled={loading || availableNumberPlates.length === 0}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
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
                    disabled={loading || isEditing}
                    placeholder="Describe the work to be done..."
                    helperText={isEditing ? "Cannot be modified in edit mode" : ""}
                  />
                </Grid>

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
                      disabled={loading}
                    >
                      {statusOptions.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}

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
                      disabled={loading}
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
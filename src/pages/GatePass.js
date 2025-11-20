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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
  QrCode as QrCodeIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function GatePass() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [gatePasses, setGatePasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    issuedBy: '',
    additionalNotes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch all gate passes from API
  // const fetchGatePasses = async () => {
  //   try {
  //     setLoading(true);
  //     setError('');

  //     console.log('🔍 Fetching gate passes...');
      
  //     const response = await fetch(`${BASE_URL}/api/gate-passes`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch gate passes: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     console.log('✅ Gate passes fetched:', result);
      
  //     if (result.status && Array.isArray(result.data)) {
  //       setGatePasses(result.data);
  //     } else {
  //       throw new Error('Invalid response format from gate passes API');
  //     }
      
  //   } catch (error) {
  //     console.error('❌ Error fetching gate passes:', error);
  //     setError(error.message || 'Failed to fetch gate passes');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Fetch all gate passes from API
const fetchGatePasses = async () => {
  try {
    setLoading(true);
    setError('');

    console.log('🔍 Fetching gate passes...');
    
    const response = await fetch(`${BASE_URL}/api/gate-passes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch gate passes: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Gate passes fetched:', result);
    
    if (result.status && result.data && Array.isArray(result.data.gate_passes)) {
      setGatePasses(result.data.gate_passes);
    } else if (result.status && Array.isArray(result.data)) {
      // Fallback: if data is directly an array
      setGatePasses(result.data);
    } else {
      throw new Error('Invalid response format from gate passes API');
    }
    
  } catch (error) {
    console.error('❌ Error fetching gate passes:', error);
    setError(error.message || 'Failed to fetch gate passes');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchGatePasses();
  }, []);

  // Filter vehicles that are eligible for gate pass (job completed and no existing gate pass)
  // This would need to be fetched from your job cards API
  const [eligibleVehicles, setEligibleVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  // Fetch eligible vehicles (job cards that are completed and don't have gate passes)
  // const fetchEligibleVehicles = async () => {
  //   try {
  //     setVehiclesLoading(true);
      
  //     // First, fetch job cards that are completed
  //     const jobCardsResponse = await fetch(`${BASE_URL}/api/job-cards?status=completed`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });

  //     if (jobCardsResponse.ok) {
  //       const jobCardsResult = await jobCardsResponse.json();
        
  //       if (jobCardsResult.status && Array.isArray(jobCardsResult.data)) {
  //         // Filter job cards that don't have gate passes
  //         const jobCardsWithoutGatePass = jobCardsResult.data.filter(jobCard => {
  //           // Check if this job card already has a gate pass
  //           return !gatePasses.some(gatePass => gatePass.job_card_id === jobCard.id);
  //         });

  //         // Transform job cards to vehicle format
  //         const vehiclesData = jobCardsWithoutGatePass.map(jobCard => ({
  //           id: jobCard.id,
  //           vehicleNumber: jobCard.vehicle_number,
  //           customerName: jobCard.customer_name,
  //           carMake: jobCard.car_make,
  //           carModel: jobCard.car_model,
  //           carYear: jobCard.car_year,
  //           chassisNumber: jobCard.chassis_number,
  //           jobCardId: jobCard.id,
  //           jobCompleted: true,
  //           gatePassCreated: false
  //         }));

  //         setEligibleVehicles(vehiclesData);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('❌ Error fetching eligible vehicles:', error);
  //     // If API fails, use empty array
  //     setEligibleVehicles([]);
  //   } finally {
  //     setVehiclesLoading(false);
  //   }
  // };
// Fetch eligible vehicles (job cards that are completed and don't have gate passes)
const fetchEligibleVehicles = async () => {
  try {
    setVehiclesLoading(true);
    
    // First, fetch job cards that are completed
    const jobCardsResponse = await fetch(`${BASE_URL}/api/job-cards?status=completed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (jobCardsResponse.ok) {
      const jobCardsResult = await jobCardsResponse.json();
      
      // Handle both response structures
      const jobCardsData = jobCardsResult.data?.job_cards || jobCardsResult.data || [];
      
      if (jobCardsResult.status && Array.isArray(jobCardsData)) {
        // Filter job cards that don't have gate passes
        const jobCardsWithoutGatePass = jobCardsData.filter(jobCard => {
          // Check if this job card already has a gate pass
          return !gatePasses.some(gatePass => gatePass.job_card_id === jobCard.id);
        });

        // Transform job cards to vehicle format
        const vehiclesData = jobCardsWithoutGatePass.map(jobCard => ({
          id: jobCard.id,
          vehicleNumber: jobCard.vehicle_number,
          customerName: jobCard.customer_name,
          carMake: jobCard.car_make,
          carModel: jobCard.car_model,
          carYear: jobCard.car_year,
          chassisNumber: jobCard.chassis_number,
          jobCardId: jobCard.id,
          jobCompleted: true,
          gatePassCreated: false
        }));

        setEligibleVehicles(vehiclesData);
      }
    }
  } catch (error) {
    console.error('❌ Error fetching eligible vehicles:', error);
    // If API fails, use empty array
    setEligibleVehicles([]);
  } finally {
    setVehiclesLoading(false);
  }
};
  useEffect(() => {
    if (gatePasses.length > 0) {
      fetchEligibleVehicles();
    }
  }, [gatePasses]);

  const handleOpenCreate = (vehicle = null) => {
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setFormData({
        vehicleNumber: vehicle.vehicleNumber,
        issuedBy: user?.username || 'Service Advisor',
        additionalNotes: ''
      });
    } else {
      setFormData({
        vehicleNumber: '',
        issuedBy: user?.username || 'Service Advisor',
        additionalNotes: ''
      });
    }
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setSelectedVehicle(null);
    setFormData({
      vehicleNumber: '',
      issuedBy: user?.username || 'Service Advisor',
      additionalNotes: ''
    });
  };

  const handleOpenView = (gatePass) => {
    navigate(`/gate-pass/view/${gatePass.id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleCreateGatePass = async () => {
  //   try {
  //     setSubmitting(true);
      
  //     const vehicle = eligibleVehicles.find(v => v.vehicleNumber === formData.vehicleNumber);
  //     if (!vehicle) {
  //       throw new Error('Selected vehicle not found');
  //     }

  //     // Create gate pass via API
  //     const response = await fetch(`${BASE_URL}/api/gate-passes`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         vehicle_number: formData.vehicleNumber,
  //         job_card_id: vehicle.jobCardId
  //       }),
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       if (response.status === 400) {
  //         throw new Error(result.message || 'Gate pass already exists for this job card');
  //       }
  //       throw new Error(`Failed to create gate pass: ${response.status}`);
  //     }

  //     console.log('✅ Gate pass created:', result);
      
  //     // Show success message
  //     setSuccessMessage('Gate pass created successfully!');
      
  //     // Refresh the gate passes list
  //     fetchGatePasses();
      
  //     handleCloseCreateDialog();
      
  //   } catch (error) {
  //     console.error('❌ Error creating gate pass:', error);
  //     setError(error.message || 'Failed to create gate pass');
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
const handleCreateGatePass = async () => {
  try {
    setSubmitting(true);
    
    const vehicle = eligibleVehicles.find(v => v.vehicleNumber === formData.vehicleNumber);
    if (!vehicle) {
      throw new Error('Selected vehicle not found');
    }

    // Create gate pass via API
    const response = await fetch(`${BASE_URL}/api/gate-passes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        vehicle_number: formData.vehicleNumber,
        job_card_id: vehicle.jobCardId
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
    
    // Show success message
    setSuccessMessage('Gate pass created successfully!');
    
    // Refresh the gate passes list
    fetchGatePasses();
    
    handleCloseCreateDialog();
    
  } catch (error) {
    console.error('❌ Error creating gate pass:', error);
    setError(error.message || 'Failed to create gate pass');
  } finally {
    setSubmitting(false);
  }
};
  const handlePrintGatePass = (gatePass) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Gate Pass - ${gatePass.gate_pass_number || `GP-${gatePass.id}`}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .details { margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; }
            .qr-code { text-align: center; margin: 20px 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>GATE PASS</h1>
            <h2>${gatePass.gate_pass_number || `GP-${gatePass.id}`}</h2>
          </div>
          <div class="details">
            <div class="detail-row"><strong>Vehicle Number:</strong> ${gatePass.vehicle_number}</div>
            <div class="detail-row"><strong>Job Card ID:</strong> ${gatePass.job_card_id}</div>
            <div class="detail-row"><strong>Issue Date:</strong> ${new Date(gatePass.created_at).toLocaleDateString()}</div>
            <div class="detail-row"><strong>Issue Time:</strong> ${new Date(gatePass.created_at).toLocaleTimeString()}</div>
            <div class="detail-row"><strong>Status:</strong> ${gatePass.status || 'Active'}</div>
            ${gatePass.additional_notes ? `<div class="detail-row"><strong>Notes:</strong> ${gatePass.additional_notes}</div>` : ''}
          </div>
          <div class="qr-code">
            <div>Scan QR Code for Verification</div>
            <div style="margin-top: 10px;">[QR Code Placeholder]</div>
            <div style="font-size: 12px; margin-top: 5px;">Gate Pass ID: ${gatePass.id}</div>
          </div>
          <div class="footer">
            <p>This gate pass must be presented when exiting the premises.</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
        return 'success';
      case 'used':
      case 'completed':
        return 'info';
      case 'pending':
        return 'warning';
      case 'expired':
      case 'rejected':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusDisplay = (status) => {
    if (!status) return 'Active';
    return status.charAt(0).toUpperCase() + status.slice(1);
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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading gate passes...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Gate Pass Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Create and manage vehicle gate passes for completed jobs
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchGatePasses}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenCreate()}
          >
            Create Gate Pass
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />

      {/* Alert Info */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Important:</strong> Gate passes can only be created for vehicles with completed jobs. 
          Once a gate pass is created, the camera system will ignore repeat entries for this vehicle.
          When the vehicle returns, it will be treated as a new job card.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Eligible Vehicles Card */}
        {/* <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Vehicles Ready for Gate Pass ({eligibleVehicles.length})
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Vehicles with completed jobs that can receive gate passes
              </Typography>
              
              {vehiclesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Vehicle No.</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Car Details</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {eligibleVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell>{vehicle.vehicleNumber}</TableCell>
                          <TableCell>{vehicle.customerName}</TableCell>
                          <TableCell>{vehicle.carMake} {vehicle.carModel}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleOpenCreate(vehicle)}
                            >
                              Create Pass
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {eligibleVehicles.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <Typography variant="body2" color="textSecondary">
                              No vehicles ready for gate pass
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid> */}

        {/* Gate Pass Statistics */}
        {/* <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Gate Pass Statistics
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'primary.main', color: 'white' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {gatePasses.length}
                    </Typography>
                    <Typography variant="body2">
                      Total Gate Passes
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'success.main', color: 'white' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {gatePasses.filter(gp => gp.status?.toLowerCase() === 'active' || !gp.status).length}
                    </Typography>
                    <Typography variant="body2">
                      Active Passes
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'info.main', color: 'white' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {gatePasses.filter(gp => gp.status?.toLowerCase() === 'used').length}
                    </Typography>
                    <Typography variant="body2">
                      Used Passes
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'warning.main', color: 'white' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {eligibleVehicles.length}
                    </Typography>
                    <Typography variant="body2">
                      Ready for Pass
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Gate Passes History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="primary">
                  Gate Pass History
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total: {gatePasses.length} gate passes
                </Typography>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Gate Pass ID</strong></TableCell>
                      <TableCell><strong>Vehicle Number</strong></TableCell>
                      <TableCell><strong>Job Card ID</strong></TableCell>
                      <TableCell><strong>Issue Date & Time</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gatePasses.map((gatePass) => (
                      <TableRow key={gatePass.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {gatePass.gate_pass_number || `GP-${gatePass.id.toString().padStart(4, '0')}`}
                          </Typography>
                        </TableCell>
                        <TableCell>{gatePass.vehicle_number}</TableCell>
                        <TableCell>
                          <Chip 
                            label={`JC-${gatePass.job_card_id}`} 
                            color="primary" 
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(gatePass.created_at)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(gatePass.created_at).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusDisplay(gatePass.status)} 
                            color={getStatusColor(gatePass.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenView(gatePass)}
                            size="small"
                            title="View Details"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton 
                            color="secondary" 
                            onClick={() => handlePrintGatePass(gatePass)}
                            size="small"
                            title="Print Gate Pass"
                          >
                            <PrintIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {gatePasses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="textSecondary">
                            No gate passes created yet
                          </Typography>
                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenCreate()}
                            sx={{ mt: 1 }}
                          >
                            Create First Gate Pass
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Gate Pass Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Create Gate Pass
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Select Vehicle"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleInputChange}
              select
              fullWidth
              required
              disabled={submitting}
            >
              {eligibleVehicles.map(vehicle => (
                <MenuItem key={vehicle.id} value={vehicle.vehicleNumber}>
                  {vehicle.vehicleNumber} - {vehicle.customerName} ({vehicle.carMake} {vehicle.carModel})
                </MenuItem>
              ))}
            </TextField>
            
            {formData.vehicleNumber && (
              <>
                <TextField
                  label="Issued By"
                  name="issuedBy"
                  value={formData.issuedBy}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  disabled={submitting}
                />
                <TextField
                  label="Additional Notes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Any special instructions or notes..."
                  disabled={submitting}
                />
                
                {/* Vehicle Details Preview */}
                <Card variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Vehicle Details:
                  </Typography>
                  {(() => {
                    const vehicle = eligibleVehicles.find(v => v.vehicleNumber === formData.vehicleNumber);
                    return vehicle ? (
                      <Typography variant="body2">
                        <strong>Customer:</strong> {vehicle.customerName}<br/>
                        <strong>Vehicle:</strong> {vehicle.carMake} {vehicle.carModel} ({vehicle.carYear})<br/>
                        <strong>Chassis:</strong> {vehicle.chassisNumber}<br/>
                        <strong>Job Card ID:</strong> {vehicle.jobCardId}
                      </Typography>
                    ) : null;
                  })()}
                </Card>

                {/* API Note */}
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Note:</strong> The gate pass will be automatically linked to the job card. 
                    The vehicle number and job card ID will be sent to the API.
                  </Typography>
                </Alert>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGatePass} 
            variant="contained"
            disabled={!formData.vehicleNumber || submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : <AddIcon />}
          >
            {submitting ? 'Creating...' : 'Create Gate Pass'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GatePass;
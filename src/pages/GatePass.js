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
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function GatePass() {
  const navigate = useNavigate();
  
  // Sample data - in real app, this would come from API
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      vehicleNumber: 'ABC-123',
      customerName: 'Alice Johnson',
      carMake: 'Toyota',
      carModel: 'Camry',
      carYear: '2022',
      chassisNumber: 'CHS123456789',
      jobCardId: 1,
      jobCompleted: true,
      gatePassCreated: false
    },
    {
      id: 2,
      vehicleNumber: 'XYZ-789',
      customerName: 'Bob Brown',
      carMake: 'Honda',
      carModel: 'Civic',
      carYear: '2021',
      chassisNumber: 'CHS987654321',
      jobCardId: 2,
      jobCompleted: true,
      gatePassCreated: true
    },
    {
      id: 3,
      vehicleNumber: 'DEF-456',
      customerName: 'Carol Davis',
      carMake: 'Ford',
      carModel: 'Focus',
      carYear: '2020',
      chassisNumber: 'CHS456789123',
      jobCardId: 3,
      jobCompleted: false,
      gatePassCreated: false
    }
  ]);

  const [gatePasses, setGatePasses] = useState([
    {
      id: 1,
      gatePassNumber: 'GP-001',
      vehicleNumber: 'XYZ-789',
      customerName: 'Bob Brown',
      carDetails: 'Honda Civic (2021)',
      issueDate: '2024-01-19',
      issueTime: '14:30',
      issuedBy: 'John Doe',
      status: 'Active',
      jobCardId: 2,
      chassisNumber: 'CHS987654321',
      additionalNotes: ''
    }
  ]);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    issuedBy: '',
    additionalNotes: ''
  });

  // Filter vehicles that are eligible for gate pass (job completed and no existing gate pass)
  const eligibleVehicles = vehicles.filter(vehicle => 
    vehicle.jobCompleted && !vehicle.gatePassCreated
  );

  const handleOpenCreate = (vehicle = null) => {
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setFormData({
        vehicleNumber: vehicle.vehicleNumber,
        issuedBy: 'Service Advisor', // In real app, this would be current user
        additionalNotes: ''
      });
    } else {
      setFormData({
        vehicleNumber: '',
        issuedBy: 'Service Advisor',
        additionalNotes: ''
      });
    }
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setSelectedVehicle(null);
  };

  const handleOpenView = (gatePass) => {
    // Navigate to gate pass view page
    navigate(`/gate-pass/view/${gatePass.id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateGatePass = () => {
    const vehicle = vehicles.find(v => v.vehicleNumber === formData.vehicleNumber);
    if (!vehicle) return;

    const newGatePass = {
      id: gatePasses.length + 1,
      gatePassNumber: `GP-${String(gatePasses.length + 1).padStart(3, '0')}`,
      vehicleNumber: formData.vehicleNumber,
      customerName: vehicle.customerName,
      carDetails: `${vehicle.carMake} ${vehicle.carModel} (${vehicle.carYear})`,
      issueDate: new Date().toISOString().split('T')[0],
      issueTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      issuedBy: formData.issuedBy,
      additionalNotes: formData.additionalNotes,
      status: 'Active',
      jobCardId: vehicle.jobCardId,
      chassisNumber: vehicle.chassisNumber
    };

    // Add to gate passes
    setGatePasses(prev => [...prev, newGatePass]);

    // Update vehicle to mark gate pass as created
    setVehicles(prev => prev.map(v => 
      v.id === vehicle.id ? { ...v, gatePassCreated: true } : v
    ));

    handleCloseCreateDialog();
  };

  const handlePrintGatePass = (gatePass) => {
    // In real app, this would generate a printable gate pass
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Gate Pass - ${gatePass.gatePassNumber}</title>
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
            <h2>${gatePass.gatePassNumber}</h2>
          </div>
          <div class="details">
            <div class="detail-row"><strong>Vehicle Number:</strong> ${gatePass.vehicleNumber}</div>
            <div class="detail-row"><strong>Customer Name:</strong> ${gatePass.customerName}</div>
            <div class="detail-row"><strong>Car Details:</strong> ${gatePass.carDetails}</div>
            <div class="detail-row"><strong>Chassis Number:</strong> ${gatePass.chassisNumber}</div>
            <div class="detail-row"><strong>Issue Date:</strong> ${gatePass.issueDate}</div>
            <div class="detail-row"><strong>Issue Time:</strong> ${gatePass.issueTime}</div>
            <div class="detail-row"><strong>Issued By:</strong> ${gatePass.issuedBy}</div>
            ${gatePass.additionalNotes ? `<div class="detail-row"><strong>Notes:</strong> ${gatePass.additionalNotes}</div>` : ''}
          </div>
          <div class="qr-code">
            <div>Scan QR Code for Verification</div>
            <div style="margin-top: 10px;">[QR Code Placeholder]</div>
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
    switch (status) {
      case 'Active': return 'success';
      case 'Used': return 'default';
      case 'Expired': return 'error';
      default: return 'default';
    }
  };

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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenCreate()}
        >
          Create Gate Pass
        </Button>
      </Box>

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
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Vehicles Ready for Gate Pass ({eligibleVehicles.length})
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Vehicles with completed jobs that can receive gate passes
              </Typography>
              
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
            </CardContent>
          </Card>
        </Grid>

        {/* All Vehicles Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                All Vehicles Status
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Current gate pass status for all vehicles
              </Typography>
              
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle No.</TableCell>
                      <TableCell>Job Status</TableCell>
                      <TableCell>Gate Pass</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>{vehicle.vehicleNumber}</TableCell>
                        <TableCell>
                          <Chip 
                            label={vehicle.jobCompleted ? 'Completed' : 'In Progress'} 
                            color={vehicle.jobCompleted ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={vehicle.gatePassCreated ? 'Issued' : 'Not Issued'} 
                            color={vehicle.gatePassCreated ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Gate Passes History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Gate Pass History
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Gate Pass No.</TableCell>
                      <TableCell>Vehicle No.</TableCell>
                      <TableCell>Customer Name</TableCell>
                      <TableCell>Issue Date</TableCell>
                      <TableCell>Issued By</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gatePasses.map((gatePass) => (
                      <TableRow key={gatePass.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {gatePass.gatePassNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{gatePass.vehicleNumber}</TableCell>
                        <TableCell>{gatePass.customerName}</TableCell>
                        <TableCell>{gatePass.issueDate}</TableCell>
                        <TableCell>{gatePass.issuedBy}</TableCell>
                        <TableCell>
                          <Chip 
                            label={gatePass.status} 
                            color={getStatusColor(gatePass.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenView(gatePass)}
                            size="small"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton 
                            color="secondary" 
                            onClick={() => handlePrintGatePass(gatePass)}
                            size="small"
                          >
                            <PrintIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {gatePasses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No gate passes created yet
                          </Typography>
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
                        <strong>Chassis:</strong> {vehicle.chassisNumber}
                      </Typography>
                    ) : null;
                  })()}
                </Card>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateGatePass} 
            variant="contained"
            disabled={!formData.vehicleNumber}
          >
            Create Gate Pass
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GatePass;
import React from 'react';
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
  Container
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Print as PrintIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

// Sample data - in real app, this would come from API
const sampleGatePasses = [
  {
    id: 1,
    gatePassNumber: 'GP-001',
    vehicleNumber: 'XYZ-789',
    customerName: 'Bob Brown',
    carDetails: 'Honda Civic (2021)',
    chassisNumber: 'CHS987654321',
    issueDate: '2024-01-19',
    issueTime: '14:30',
    issuedBy: 'John Doe',
    additionalNotes: 'Vehicle ready for pickup. All services completed successfully.',
    status: 'Active',
    jobCardId: 2
  },
  {
    id: 2,
    gatePassNumber: 'GP-002',
    vehicleNumber: 'ABC-123',
    customerName: 'Alice Johnson',
    carDetails: 'Toyota Camry (2022)',
    chassisNumber: 'CHS123456789',
    issueDate: '2024-01-20',
    issueTime: '10:15',
    issuedBy: 'Jane Smith',
    additionalNotes: 'Customer requested early delivery.',
    status: 'Active',
    jobCardId: 1
  }
];

function GatePassView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the gate pass by ID
  const gatePass = sampleGatePasses.find(pass => pass.id === parseInt(id));

  if (!gatePass) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/gate-pass')}>
          Back to Gate Pass
        </Button>
        <Typography variant="h4" color="error">
          Gate Pass not found
        </Typography>
      </Box>
    );
  }

  const handlePrint = () => {
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
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>GATE PASS</h1>
            <h2>${gatePass.gatePassNumber}</h2>
          </div>
          
          <div class="section">
            <h3>Vehicle Information</h3>
            <div class="detail-row"><strong>Vehicle Number:</strong> ${gatePass.vehicleNumber}</div>
            <div class="detail-row"><strong>Customer Name:</strong> ${gatePass.customerName}</div>
            <div class="detail-row"><strong>Car Details:</strong> ${gatePass.carDetails}</div>
            <div class="detail-row"><strong>Chassis Number:</strong> ${gatePass.chassisNumber}</div>
          </div>

          <div class="section">
            <h3>Gate Pass Details</h3>
            <div class="detail-row"><strong>Issue Date:</strong> ${gatePass.issueDate}</div>
            <div class="detail-row"><strong>Issue Time:</strong> ${gatePass.issueTime}</div>
            <div class="detail-row"><strong>Issued By:</strong> ${gatePass.issuedBy}</div>
            <div class="detail-row"><strong>Status:</strong> ${gatePass.status}</div>
          </div>

          ${gatePass.additionalNotes ? `
          <div class="section">
            <h3>Additional Notes</h3>
            <div class="detail-row">${gatePass.additionalNotes}</div>
          </div>
          ` : ''}

          <div class="qr-code">
            <div>Scan QR Code for Verification</div>
            <div style="margin-top: 10px;">[QR Code Placeholder]</div>
          </div>

          <div class="footer">
            <p><strong>This gate pass must be presented when exiting the premises.</strong></p>
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header with Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/gate-pass')}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
              Gate Pass Details
            </Typography>
          </Box>
          <Chip 
            label={gatePass.status} 
            color={getStatusColor(gatePass.status)}
            size="large"
            sx={{ fontSize: '1rem', px: 2 }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Main Gate Pass Information */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                {/* Gate Pass Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                    {gatePass.gatePassNumber}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Vehicle Gate Pass
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Information Grid */}
                <Grid container spacing={4}>
                  {/* Vehicle Information */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: 'primary.light', color: 'white' }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        🚗 Vehicle Information
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Vehicle Number:</strong> {gatePass.vehicleNumber}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Customer Name:</strong> {gatePass.customerName}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Car Details:</strong> {gatePass.carDetails}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Chassis Number:</strong> {gatePass.chassisNumber}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Gate Pass Details */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: 'secondary.light', color: 'white' }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        📄 Gate Pass Details
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Issue Date:</strong> {gatePass.issueDate}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Issue Time:</strong> {gatePass.issueTime}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Issued By:</strong> {gatePass.issuedBy}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Job Card ID:</strong> JC-{gatePass.jobCardId.toString().padStart(4, '0')}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Additional Notes */}
                {gatePass.additionalNotes && (
                  <Paper sx={{ p: 3, mt: 3, backgroundColor: 'warning.light' }}>
                    <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                      📝 Additional Notes
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.6 }}>
                      {gatePass.additionalNotes}
                    </Typography>
                  </Paper>
                )}

                {/* Important Notice */}
                <Paper sx={{ p: 3, mt: 3, backgroundColor: 'info.light', color: 'white' }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    ⚠️ Important Notice
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    • This gate pass must be presented when exiting the premises<br/>
                    • Vehicle will be treated as new entry when it returns<br/>
                    • Camera system will ignore repeat entries for this vehicle<br/>
                    • Gate pass is valid for one-time exit only
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side - Actions and QR Code */}
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
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    fullWidth
                  >
                    Print Gate Pass
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => navigate('/gate-pass')}
                    fullWidth
                  >
                    Back to List
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card sx={{ boxShadow: 3 }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  📱 QR Code
                </Typography>
                <Box 
                  sx={{ 
                    width: 200, 
                    height: 200, 
                    backgroundColor: 'grey.200', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '20px auto',
                    border: '2px dashed grey'
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    QR Code Placeholder
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Scan this code for quick verification
                </Typography>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card sx={{ mt: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  🔒 Security Features
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    Unique gate pass number
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    Vehicle chassis number verification
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    Issued by authorized personnel only
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    One-time use only
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

export default GatePassView;
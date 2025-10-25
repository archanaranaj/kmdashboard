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
const sampleRequisitions = [
  {
    id: 1,
    requisitionNumber: 'PR-001',
    supplier: 'Saitech',
    plateNumber: 'ABC-123',
    jobCardNumber: 'JC-001',
    description: 'Replacement brake pads and rotors. Front brake pads are completely worn out and rotors show significant wear. Requires immediate replacement for safety.',
    damagedPartPhoto: 'brake_pads.jpg',
    status: 'Pending',
    createdDate: '2024-01-15',
    createdBy: 'John Doe',
    priority: 'High',
    vehicleDetails: 'Toyota Camry 2022',
    customerName: 'Alice Johnson'
  },
  {
    id: 2,
    requisitionNumber: 'PR-002',
    supplier: 'KM',
    plateNumber: 'XYZ-789',
    jobCardNumber: 'JC-002',
    description: 'Engine oil filter and synthetic oil for regular maintenance service.',
    damagedPartPhoto: 'oil_filter.jpg',
    status: 'Approved',
    createdDate: '2024-01-16',
    createdBy: 'Jane Smith',
    priority: 'Medium',
    vehicleDetails: 'Honda Civic 2021',
    customerName: 'Bob Brown'
  },
  {
    id: 3,
    requisitionNumber: 'PR-003',
    supplier: 'Used',
    plateNumber: 'DEF-456',
    jobCardNumber: 'JC-003',
    description: 'Used alternator replacement. Original alternator failed during diagnostic test.',
    damagedPartPhoto: 'alternator.jpg',
    status: 'Rejected',
    createdDate: '2024-01-17',
    createdBy: 'Mike Johnson',
    priority: 'Low',
    vehicleDetails: 'Ford Focus 2020',
    customerName: 'Carol Davis'
  }
];

function PurchaseRequisitionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the requisition by ID
  const requisition = sampleRequisitions.find(req => req.id === parseInt(id));

  if (!requisition) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/purchase-requisition')}>
          Back to Purchase Requisitions
        </Button>
        <Typography variant="h4" color="error">
          Purchase Requisition not found
        </Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Completed': return 'info';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Purchase Requisition - ${requisition.requisitionNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .detail-row { margin: 10px 0; display: flex; }
            .detail-label { font-weight: bold; width: 200px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PURCHASE REQUISITION</h1>
            <h2>${requisition.requisitionNumber}</h2>
          </div>
          
          <div class="section">
            <h3>Requisition Details</h3>
            <div class="detail-row">
              <div class="detail-label">Requisition Number:</div>
              <div>${requisition.requisitionNumber}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Supplier:</div>
              <div>${requisition.supplier}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Status:</div>
              <div>${requisition.status}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Priority:</div>
              <div>${requisition.priority}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Created Date:</div>
              <div>${requisition.createdDate}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Created By:</div>
              <div>${requisition.createdBy}</div>
            </div>
          </div>

          <div class="section">
            <h3>Vehicle Information</h3>
            <div class="detail-row">
              <div class="detail-label">Plate Number:</div>
              <div>${requisition.plateNumber}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Job Card Number:</div>
              <div>${requisition.jobCardNumber}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Vehicle Details:</div>
              <div>${requisition.vehicleDetails}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Customer Name:</div>
              <div>${requisition.customerName}</div>
            </div>
          </div>

          <div class="section">
            <h3>Part Description</h3>
            <div class="detail-row">
              <div style="white-space: pre-wrap;">${requisition.description}</div>
            </div>
          </div>

          <div class="section">
            <h3>Damaged Part Photo</h3>
            <div class="detail-row">
              <div>[Photo: ${requisition.damagedPartPhoto}]</div>
            </div>
          </div>

          <div class="footer">
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>KM Group - Purchase Requisition System</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header with Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/purchase-requisition')}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
              Purchase Requisition
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={requisition.priority} 
              color={getPriorityColor(requisition.priority)}
              size="medium"
            />
            <Chip 
              label={requisition.status} 
              color={getStatusColor(requisition.status)}
              size="medium"
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Main Requisition Information */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                {/* Requisition Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                    {requisition.requisitionNumber}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Purchase Requisition
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Information Grid */}
                <Grid container spacing={4}>
                  {/* Requisition Details */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: 'primary.light', color: 'white' }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        📋 Requisition Details
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Supplier:</strong> {requisition.supplier}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Created Date:</strong> {requisition.createdDate}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Created By:</strong> {requisition.createdBy}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Status:</strong> {requisition.status}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Vehicle Information */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: 'secondary.light', color: 'white' }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        🚗 Vehicle Information
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Plate Number:</strong> {requisition.plateNumber}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Job Card:</strong> {requisition.jobCardNumber}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Vehicle:</strong> {requisition.vehicleDetails}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Customer:</strong> {requisition.customerName}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Part Description */}
                <Paper sx={{ p: 3, mt: 3, backgroundColor: 'warning.light' }}>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                    📝 Part Description
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {requisition.description}
                  </Typography>
                </Paper>

                {/* Damaged Part Photo */}
                <Paper sx={{ p: 3, mt: 3, backgroundColor: 'grey.100' }}>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                    📷 Damaged Part Photo
                  </Typography>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Box
                      component="img"
                      src={`/api/photos/${requisition.damagedPartPhoto}`}
                      alt="Damaged part"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: 300,
                        border: '1px solid #ddd',
                        borderRadius: 1
                      }}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {requisition.damagedPartPhoto}
                    </Typography>
                  </Box>
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
                    onClick={() => navigate(`/purchase-requisition/edit/${requisition.id}`)}
                    fullWidth
                  >
                    Edit Requisition
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    size="large"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    fullWidth
                  >
                    Print Requisition
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => navigate('/purchase-requisition')}
                    fullWidth
                  >
                    Back to List
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Status Information */}
            <Card sx={{ boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  ℹ️ Status Information
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    <strong>Pending:</strong> Waiting for approval
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    <strong>Approved:</strong> Ready for procurement
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    <strong>Rejected:</strong> Requisition denied
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    <strong>Completed:</strong> Parts received
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Supplier Information */}
            <Card sx={{ mt: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  🏢 Supplier Details
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Supplier:</strong> {requisition.supplier}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {requisition.supplier === 'Saitech' && 'Official parts supplier for new components'}
                    {requisition.supplier === 'KM' && 'Internal KM parts inventory'}
                    {requisition.supplier === 'Used' && 'Used parts from salvage vehicles'}
                    {requisition.supplier === 'Other' && 'External parts supplier'}
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

export default PurchaseRequisitionView;
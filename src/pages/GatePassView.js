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
import { ArrowBack as ArrowBackIcon, Print as PrintIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function GatePassView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';
  
  const [gatePass, setGatePass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch gate pass details from API
  useEffect(() => {
    const fetchGatePass = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('🔍 Fetching gate pass details...');
        
        const response = await fetch(`${BASE_URL}/api/gate-passes/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Gate pass not found');
          }
          throw new Error(`Failed to fetch gate pass: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Gate pass fetched:', result);
        
        if (result.status && result.data) {
          setGatePass(result.data);
        } else {
          throw new Error('Gate pass not found');
        }
        
      } catch (error) {
        console.error('❌ Error fetching gate pass:', error);
        setError(error.message || 'Failed to fetch gate pass details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGatePass();
    } else {
      setError('No gate pass ID provided');
      setLoading(false);
    }
  }, [id, token, BASE_URL]);

  const handlePrint = () => {
    if (!gatePass) return;

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
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>GATE PASS</h1>
            <h2>${gatePass.gate_pass_number || `GP-${gatePass.id.toString().padStart(4, '0')}`}</h2>
          </div>
          
          <div class="section">
            <h3>Vehicle Information</h3>
            <div class="detail-row"><strong>Vehicle Number:</strong> ${gatePass.vehicle_number}</div>
            <div class="detail-row"><strong>Job Card ID:</strong> ${gatePass.job_card_id}</div>
            <div class="detail-row"><strong>Chassis Number:</strong> ${gatePass.chassis_number || 'N/A'}</div>
          </div>

          <div class="section">
            <h3>Gate Pass Details</h3>
            <div class="detail-row"><strong>Issue Date:</strong> ${formatDate(gatePass.created_at)}</div>
            <div class="detail-row"><strong>Issue Time:</strong> ${new Date(gatePass.created_at).toLocaleTimeString()}</div>
            <div class="detail-row"><strong>Status:</strong> ${getStatusDisplay(gatePass.status)}</div>
            <div class="detail-row"><strong>Gate Pass ID:</strong> ${gatePass.id}</div>
          </div>

          ${gatePass.additional_notes ? `
          <div class="section">
            <h3>Additional Notes</h3>
            <div class="detail-row">${gatePass.additional_notes}</div>
          </div>
          ` : ''}

          <div class="qr-code">
            <div>Scan QR Code for Verification</div>
            <div style="margin-top: 10px;">[QR Code Placeholder]</div>
            <div style="font-size: 12px; margin-top: 5px;">ID: ${gatePass.id}</div>
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
    if (!status) return 'success';
    
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
        month: 'long',
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
          Loading gate pass details...
        </Typography>
      </Box>
    );
  }

  if (error || !gatePass) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/gate-pass')}>
          Back to Gate Pass
        </Button>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Gate pass not found'}
        </Alert>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Gate Pass ID: {id}
        </Typography>
      </Box>
    );
  }

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
            label={getStatusDisplay(gatePass.status)} 
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
                    {gatePass.gate_pass_number || `GP-${gatePass.id.toString().padStart(4, '0')}`}
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
                          <strong>Vehicle Number:</strong> {gatePass.vehicle_number}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Job Card ID:</strong> JC-{gatePass.job_card_id?.toString().padStart(4, '0') || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Chassis Number:</strong> {gatePass.chassis_number || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Gate Pass ID:</strong> {gatePass.id}
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
                          <strong>Issue Date:</strong> {formatDate(gatePass.created_at)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Issue Time:</strong> {new Date(gatePass.created_at).toLocaleTimeString()}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Status:</strong> {getStatusDisplay(gatePass.status)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Last Updated:</strong> {formatDateTime(gatePass.updated_at)}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Additional Notes */}
                {gatePass.additional_notes && (
                  <Paper sx={{ p: 3, mt: 3, backgroundColor: 'warning.light' }}>
                    <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                      📝 Additional Notes
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.6 }}>
                      {gatePass.additional_notes}
                    </Typography>
                  </Paper>
                )}

                {/* System Information */}
                <Paper sx={{ p: 3, mt: 3, backgroundColor: 'grey.100' }}>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                    🔧 System Information
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Gate Pass ID:</strong> {gatePass.id}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Job Card ID:</strong> {gatePass.job_card_id}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Created:</strong> {formatDateTime(gatePass.created_at)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Last Updated:</strong> {formatDateTime(gatePass.updated_at)}
                    </Typography>
                  </Box>
                </Paper>

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
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => navigate(`/job-cards/${gatePass.job_card_id}`)}
                    fullWidth
                    disabled={!gatePass.job_card_id}
                  >
                    View Job Card
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
                    border: '2px dashed grey',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      QR Code
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {gatePass.id}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Scan this code for quick verification
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  Contains: Gate Pass #{gatePass.id}
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
                    Unique gate pass ID: {gatePass.id}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    Vehicle number verification
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    Job card linkage
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    One-time use only
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Information */}
            <Card sx={{ mt: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  ℹ️ Quick Info
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Vehicle:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {gatePass.vehicle_number}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Job Card:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      JC-{gatePass.job_card_id?.toString().padStart(4, '0')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Status:</Typography>
                    <Typography variant="body2" fontWeight="bold" color={getStatusColor(gatePass.status)}>
                      {getStatusDisplay(gatePass.status)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Created:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatDate(gatePass.created_at)}
                    </Typography>
                  </Box>
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
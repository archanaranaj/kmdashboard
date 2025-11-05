// src/pages/NumberPlateView.js
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Paper
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Download as DownloadIcon,
  BrokenImage as BrokenImageIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function NumberPlateView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [plateData, setPlateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';

  // Fetch number plate details by ID
  useEffect(() => {
    if (token && id) {
      fetchNumberPlateDetails();
    }
  }, [id, token]);

  const fetchNumberPlateDetails = async () => {
    try {
      setLoading(true);
      setError('');
      setImageError(false);
      setImageLoading(true);

      console.log(`🔍 Fetching details for plate ID: ${id}`);
      
      // Always use the list API since it has complete data in image_full_text
      await fetchFromListAndFilter();
      
    } catch (error) {
      console.error('❌ Error fetching number plate details:', error);
      setError(error.message || 'Failed to fetch number plate details');
      setLoading(false);
    }
  };

  const fetchFromListAndFilter = async () => {
    try {
      console.log('🔄 Fetching all plates and filtering...');
      
      // Fetch multiple pages to find the plate
      let foundPlate = null;
      let page = 1;
      const limit = 50;
      
      while (page <= 10 && !foundPlate) {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        });

        const response = await fetch(`${BASE_URL}/api/number-plates?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch plates list: ${response.status}`);
        }

        const result = await response.json();
        console.log(`📄 Fetched page ${page} with ${result.data?.plates?.length || 0} plates`);

        // Find the specific plate from the list
        const plates = result.data?.plates || [];
        foundPlate = plates.find(plate => plate.id == id);

        if (foundPlate) {
          console.log('✅ Found plate in list:', foundPlate);
          processPlateData(foundPlate);
          return;
        }

        // Check if we've reached the last page
        if (!plates.length || page >= result.data?.totalPages) {
          break;
        }
        
        page++;
      }

      if (!foundPlate) {
        throw new Error(`Plate with ID ${id} not found in the system`);
      }
      
    } catch (error) {
      console.error('❌ Error fetching from list:', error);
      setError(error.message || 'Number plate not found. It may have been deleted or you may not have permission to view it.');
      setLoading(false);
    }
  };

  const processPlateData = (plateDetails) => {
    if (!plateDetails) {
      throw new Error('No plate data received from API');
    }

    console.log('🔧 Processing plate data:', plateDetails);

    // Parse the image_full_text JSON to extract all data
    let parsedImageData = {};
    let plateNumber = 'Unknown';
    let deviceNo = 'BINFARIS ANPR';
    let captureTime = 'Unknown';
    let vehicleColor = 'Unknown';
    let vehicleType = 'Unknown';
    let vehicleBrand = 'Unknown';

    if (plateDetails.image_full_text) {
      try {
        parsedImageData = JSON.parse(plateDetails.image_full_text);
        console.log('📝 Parsed image data:', parsedImageData);
        
        // Extract data from parsed JSON
        plateNumber = parsedImageData.plateNo || plateDetails.plate_number || 'Unknown';
        deviceNo = parsedImageData.deviceNo || plateDetails.device_no || 'BINFARIS ANPR';
        captureTime = parsedImageData.captureTime || plateDetails.capture_time || 'Unknown';
        vehicleColor = parsedImageData.vehicleColor || plateDetails.vehicle_color || 'Unknown';
        vehicleType = parsedImageData.vehicleType || plateDetails.vehicle_type || 'Unknown';
        vehicleBrand = parsedImageData.vehicleBrand || plateDetails.vehicle_brand || 'Unknown';
        
      } catch (error) {
        console.warn('Failed to parse image_full_text:', error);
        // Fallback: try to extract data manually from the string
        try {
          const text = plateDetails.image_full_text;
          plateNumber = extractFromJsonString(text, 'plateNo') || plateDetails.plate_number || 'Unknown';
          deviceNo = extractFromJsonString(text, 'deviceNo') || plateDetails.device_no || 'BINFARIS ANPR';
          captureTime = extractFromJsonString(text, 'captureTime') || plateDetails.capture_time || 'Unknown';
          vehicleColor = extractFromJsonString(text, 'vehicleColor') || plateDetails.vehicle_color || 'Unknown';
          vehicleType = extractFromJsonString(text, 'vehicleType') || plateDetails.vehicle_type || 'Unknown';
          vehicleBrand = extractFromJsonString(text, 'vehicleBrand') || plateDetails.vehicle_brand || 'Unknown';
        } catch (fallbackError) {
          console.warn('Fallback extraction also failed:', fallbackError);
        }
      }
    } else {
      // Use direct fields if no image_full_text
      plateNumber = plateDetails.plate_number || 'Unknown';
      deviceNo = plateDetails.device_no || 'BINFARIS ANPR';
      captureTime = plateDetails.capture_time || 'Unknown';
      vehicleColor = plateDetails.vehicle_color || 'Unknown';
      vehicleType = plateDetails.vehicle_type || 'Unknown';
      vehicleBrand = plateDetails.vehicle_brand || 'Unknown';
    }

    // Transform API response to match our app structure
    const transformedData = {
      id: plateDetails.id,
      plateNumber: plateNumber,
      timestamp: plateDetails.date_detected,
      imageUrl: plateDetails.image_url,
      status: plateDetails.status || 'pending',
      
      // Vehicle details from API response
      vehicleDetails: {
        color: vehicleColor,
        type: vehicleType,
        brand: vehicleBrand,
        make: vehicleBrand, // Using brand as make
      },
      
      // Camera and device information
      cameraInfo: {
        deviceNo: deviceNo,
        cameraNo: plateDetails.camera_no || parsedImageData.cameraNo || 'Unknown',
        captureTime: captureTime
      },
      
      // Image information
      imageInfo: {
        name: plateDetails.image_name,
        size: plateDetails.image_size,
        startTime: plateDetails.image_starttime,
        endTime: plateDetails.image_endtime,
        trackId: plateDetails.track_id
      },
      
      // Processing info
      processingInfo: {
        processingTime: '2.3s',
        algorithm: 'ANPR v2.1',
        confidence: 0.95
      },
      
      // Raw data for debugging
      rawData: {
        plateDetails,
        parsedImageData
      }
    };

    console.log('🔄 Final transformed plate data:', transformedData);
    setPlateData(transformedData);
    setLoading(false);
  };

  // Helper function to extract values from JSON string manually
  const extractFromJsonString = (jsonString, key) => {
    try {
      const regex = new RegExp(`"${key}":"([^"]*)"`);
      const match = jsonString.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.warn(`Failed to extract ${key} from JSON string:`, error);
      return null;
    }
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully');
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('❌ Image failed to load - Authentication required');
    setImageLoading(false);
    setImageError(true);
  };

  const handleDownloadImage = async () => {
    if (!plateData?.imageUrl) return;

    try {
      setImageLoading(true);
      
      // Create a hidden iframe to handle the download
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = plateData.imageUrl;
      document.body.appendChild(iframe);
      
      // Remove the iframe after a delay
      setTimeout(() => {
        document.body.removeChild(iframe);
        setImageLoading(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error downloading image:', error);
      // Fallback: open in new tab
      window.open(plateData.imageUrl, '_blank');
      setImageLoading(false);
    }
  };

  const handleViewFullImage = () => {
    if (plateData?.imageUrl) {
      // Open in new tab - might prompt for authentication
      window.open(plateData.imageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      
      const response = await fetch(`${BASE_URL}/api/number-plates/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('✅ Number plate approved successfully');
        setApproveDialogOpen(false);
        setError('');
        // Refresh the data
        fetchNumberPlateDetails();
      } else {
        throw new Error('Failed to approve number plate');
      }
    } catch (error) {
      console.error('Error approving number plate:', error);
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      
      const response = await fetch(`${BASE_URL}/api/number-plates/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: rejectReason
        }),
      });

      if (response.ok) {
        console.log('✅ Number plate rejected successfully');
        setRejectDialogOpen(false);
        setRejectReason('');
        setError('');
        // Refresh the data
        fetchNumberPlateDetails();
      } else {
        throw new Error('Failed to reject number plate');
      }
    } catch (error) {
      console.error('Error rejecting number plate:', error);
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'processed': return 'info';
      default: return 'default';
    }
  };

  const handleBack = () => {
    navigate('/number-plates');
  };

  const handleCreateJobCard = () => {
    if (plateData) {
      navigate('/job-cards/create', { 
        state: { 
          plateData: {
            plateNumber: plateData.plateNumber,
            vehicleDetails: plateData.vehicleDetails
          }
        }
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading number plate details...
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Plate ID: #{id}
        </Typography>
      </Box>
    );
  }

  // Show error state if no plate data
  if (error && !plateData) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back to List
          </Button>
          <Typography variant="h4">
            Number Plate Details
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleBack}>
          Return to Number Plates
        </Button>
      </Box>
    );
  }

  // Show not found state
  if (!plateData) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back to List
          </Button>
          <Typography variant="h4">
            Number Plate Details
          </Typography>
        </Box>
        <Alert severity="warning">
          No number plate data found for ID: #{id}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back to List
          </Button>
          <Box>
            <Typography variant="h4" gutterBottom>
              Number Plate Details
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Plate ID: #{plateData.id}
            </Typography>
          </Box>
        </Box>
        
        <Chip 
          label={plateData.status?.toUpperCase()} 
          color={getStatusColor(plateData.status)}
          size="large"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Information & Image */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Plate Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Plate Number
                    </Typography>
                    <Typography variant="h3" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1976d2' }}>
                      {plateData.plateNumber}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Detection Confidence
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {((plateData.processingInfo.confidence || 0) * 100).toFixed(1)}%
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Date Detected
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(plateData.timestamp)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Device Number
                      </Typography>
                      <Typography variant="body1">
                        {plateData.cameraInfo.deviceNo}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Capture Time
                      </Typography>
                      <Typography variant="body1">
                        {plateData.cameraInfo.captureTime}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      CAPTURED IMAGE
                    </Typography>
                    
                    {imageLoading && !imageError && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                        <CircularProgress />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Loading image...
                        </Typography>
                      </Box>
                    )}
                    
                    {imageError && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                        <BrokenImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                        <Typography color="textSecondary" align="center" gutterBottom>
                          Image requires authentication
                        </Typography>
                        <Typography variant="body2" color="textSecondary" align="center">
                          Click "View Full" to open in new window
                        </Typography>
                        <Typography variant="caption" color="textSecondary" align="center" sx={{ mt: 1 }}>
                          You may need to login to the camera system
                        </Typography>
                      </Box>
                    )}
                    
                    {!imageError && plateData.imageUrl && (
                      <Box>
                        <img 
                          src={plateData.imageUrl} 
                          alt={`Number plate ${plateData.plateNumber}`}
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '200px', 
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            objectFit: 'contain',
                            display: imageLoading ? 'none' : 'block'
                          }}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                        <Box sx={{ mt: 1 }}>
                          <Button
                            startIcon={<DownloadIcon />}
                            onClick={handleDownloadImage}
                            size="small"
                            sx={{ mr: 1 }}
                            disabled={imageLoading}
                          >
                            {imageLoading ? 'Downloading...' : 'Download'}
                          </Button>
                          <Button
                            size="small"
                            onClick={handleViewFullImage}
                            variant="outlined"
                          >
                            View Full
                          </Button>
                        </Box>
                        {plateData.imageInfo.name && (
                          <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                            Image: {plateData.imageInfo.name}
                          </Typography>
                        )}
                      </Box>
                    )}
                    
                    {!plateData.imageUrl && (
                      <Box sx={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="textSecondary">
                          No image available
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Vehicle Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Brand/Make
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {plateData.vehicleDetails.brand}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Vehicle Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {plateData.vehicleDetails.type}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Color
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {plateData.vehicleDetails.color}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Image Details */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Image Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Image Size
                  </Typography>
                  <Typography variant="body1">
                    {formatFileSize(plateData.imageInfo.size)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Track ID
                  </Typography>
                  <Typography variant="body1">
                    {plateData.imageInfo.trackId || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Camera Number
                  </Typography>
                  <Typography variant="body1">
                    {plateData.cameraInfo.cameraNo}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Actions & Info */}
        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {plateData.status === 'pending' && (
                  <>
                    <Button 
                      variant="contained" 
                      startIcon={<CheckIcon />}
                      onClick={() => setApproveDialogOpen(true)}
                      disabled={actionLoading}
                      sx={{ bgcolor: 'success.main' }}
                    >
                      Approve Plate
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<CloseIcon />}
                      onClick={() => setRejectDialogOpen(true)}
                      disabled={actionLoading}
                      color="error"
                    >
                      Reject Plate
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={handleCreateJobCard}
                  startIcon={<EditIcon />}
                >
                  Create Job Card
                </Button>
                
                <Button variant="outlined" fullWidth startIcon={<HistoryIcon />}>
                  View History
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Processing Information */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Processing Details
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Algorithm Version
                  </Typography>
                  <Typography variant="body1">
                    {plateData.processingInfo.algorithm}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Processing Time
                  </Typography>
                  <Typography variant="body1">
                    {plateData.processingInfo.processingTime}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Confidence Score
                  </Typography>
                  <Typography variant="body1">
                    {((plateData.processingInfo.confidence || 0) * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Approve Confirmation Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle>Approve Number Plate</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve plate number <strong>{plateData?.plateNumber}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            This will mark the plate as approved and it will be moved to the approved list.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleApprove} 
            variant="contained" 
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} /> : <CheckIcon />}
          >
            {actionLoading ? 'Approving...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Number Plate</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to reject plate number <strong>{plateData?.plateNumber}</strong>?
          </Typography>
          <TextField
            label="Rejection Reason"
            multiline
            rows={3}
            fullWidth
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleReject} 
            variant="contained" 
            color="error"
            disabled={actionLoading || !rejectReason.trim()}
            startIcon={actionLoading ? <CircularProgress size={16} /> : <CloseIcon />}
          >
            {actionLoading ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default NumberPlateView;
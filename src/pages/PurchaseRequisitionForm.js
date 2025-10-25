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
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

// Sample data - in real app, this would come from API
const sampleRequisitions = [
  {
    id: 1,
    requisitionNumber: 'PR-001',
    supplier: 'Saitech',
    plateNumber: 'ABC-123',
    jobCardNumber: 'JC-001',
    description: 'Replacement brake pads and rotors',
    damagedPartPhoto: 'brake_pads.jpg',
    status: 'Pending',
    createdDate: '2024-01-15',
    createdBy: 'John Doe',
    priority: 'High'
  },
  {
    id: 2,
    requisitionNumber: 'PR-002',
    supplier: 'KM',
    plateNumber: 'XYZ-789',
    jobCardNumber: 'JC-002',
    description: 'Engine oil filter and synthetic oil',
    damagedPartPhoto: 'oil_filter.jpg',
    status: 'Approved',
    createdDate: '2024-01-16',
    createdBy: 'Jane Smith',
    priority: 'Medium'
  }
];

// Sample vehicles with job cards
const vehicles = [
  { plateNumber: 'ABC-123', jobCardNumber: 'JC-001', customerName: 'Alice Johnson', carModel: 'Toyota Camry' },
  { plateNumber: 'XYZ-789', jobCardNumber: 'JC-002', customerName: 'Bob Brown', carModel: 'Honda Civic' },
  { plateNumber: 'DEF-456', jobCardNumber: 'JC-003', customerName: 'Carol Davis', carModel: 'Ford Focus' },
  { plateNumber: 'GHI-789', jobCardNumber: 'JC-004', customerName: 'David Wilson', carModel: 'BMW X5' }
];

const suppliers = ['Used', 'Saitech', 'KM', 'Other'];
const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Pending', 'Approved', 'Rejected', 'Completed'];

function PurchaseRequisitionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    supplier: '',
    plateNumber: '',
    jobCardNumber: '',
    description: '',
    damagedPartPhoto: null,
    priority: 'Medium',
    status: 'Pending'
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Load requisition data if editing
  useEffect(() => {
    if (isEditing) {
      const requisition = sampleRequisitions.find(req => req.id === parseInt(id));
      if (requisition) {
        setFormData({
          supplier: requisition.supplier,
          plateNumber: requisition.plateNumber,
          jobCardNumber: requisition.jobCardNumber,
          description: requisition.description,
          damagedPartPhoto: requisition.damagedPartPhoto,
          priority: requisition.priority,
          status: requisition.status
        });
      }
    }
  }, [id, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-populate job card number when plate number is selected
    if (name === 'plateNumber') {
      const vehicle = vehicles.find(v => v.plateNumber === value);
      if (vehicle) {
        setFormData(prev => ({
          ...prev,
          jobCardNumber: vehicle.jobCardNumber
        }));
      }
    }

    // Clear error when field is filled
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        damagedPartPhoto: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplier) newErrors.supplier = 'Supplier is required';
    if (!formData.plateNumber) newErrors.plateNumber = 'Plate number is required';
    if (!formData.jobCardNumber) newErrors.jobCardNumber = 'Job card number is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.damagedPartPhoto && !isEditing) newErrors.damagedPartPhoto = 'Damaged part photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Here you would typically save to API
    console.log('Form submitted:', formData);
    
    // Show success message and navigate back
    alert(isEditing ? 'Purchase requisition updated successfully!' : 'Purchase requisition created successfully!');
    navigate('/purchase-requisition');
  };

  const handleCancel = () => {
    navigate('/purchase-requisition');
  };

  const getSelectedVehicle = () => {
    return vehicles.find(v => v.plateNumber === formData.plateNumber);
  };

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
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            {isEditing ? 'Edit Purchase Requisition' : 'Create New Purchase Requisition'}
          </Typography>
        </Box>

        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Supplier Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: 'primary.light', color: 'white' }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      🏢 Supplier Information
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.supplier}>
                    <InputLabel>Supplier *</InputLabel>
                    <Select
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      label="Supplier *"
                    >
                      {suppliers.map(supplier => (
                        <MenuItem key={supplier} value={supplier}>{supplier}</MenuItem>
                      ))}
                    </Select>
                    {errors.supplier && <FormHelperText>{errors.supplier}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      label="Priority"
                    >
                      {priorities.map(priority => (
                        <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Vehicle Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: 'secondary.light', color: 'white', mt: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      🚗 Vehicle Information
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.plateNumber}>
                    <InputLabel>Plate Number *</InputLabel>
                    <Select
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleInputChange}
                      label="Plate Number *"
                    >
                      {vehicles.map(vehicle => (
                        <MenuItem key={vehicle.plateNumber} value={vehicle.plateNumber}>
                          {vehicle.plateNumber} - {vehicle.carModel} ({vehicle.customerName})
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.plateNumber && <FormHelperText>{errors.plateNumber}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Job Card Number *"
                    name="jobCardNumber"
                    value={formData.jobCardNumber}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.jobCardNumber}
                    helperText={errors.jobCardNumber}
                    disabled
                  />
                </Grid>

                {/* Vehicle Details Preview */}
                {formData.plateNumber && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, backgroundColor: 'grey.50', border: '1px solid', borderColor: 'grey.300' }}>
                      <Typography variant="subtitle2" gutterBottom color="primary">
                        Vehicle Details:
                      </Typography>
                      {(() => {
                        const vehicle = getSelectedVehicle();
                        return vehicle ? (
                          <Typography variant="body2">
                            <strong>Customer:</strong> {vehicle.customerName} | 
                            <strong> Vehicle:</strong> {vehicle.carModel} | 
                            <strong> Job Card:</strong> {vehicle.jobCardNumber}
                          </Typography>
                        ) : null;
                      })()}
                    </Paper>
                  </Grid>
                )}

                {/* Part Description */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: 'warning.light', color: 'white', mt: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      📝 Part Description
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description *"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description || "Describe the required parts and reason for requisition"}
                    placeholder="Enter detailed description of the required parts, including part numbers, specifications, and reason for replacement..."
                  />
                </Grid>

                {/* Damaged Part Photo */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: 'info.light', color: 'white', mt: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      📷 Damaged Part Photo
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Upload Photo {!isEditing && '*'}
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AttachFileIcon />}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      {formData.damagedPartPhoto ? 'Change Photo' : 'Upload Photo'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                    {errors.damagedPartPhoto && (
                      <FormHelperText error>{errors.damagedPartPhoto}</FormHelperText>
                    )}
                    <Typography variant="caption" color="textSecondary">
                      Upload a clear photo of the damaged part for reference
                    </Typography>
                    
                    {(photoPreview || (isEditing && formData.damagedPartPhoto)) && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Photo Preview:
                        </Typography>
                        <Box
                          component="img"
                          src={photoPreview || `/api/photos/${formData.damagedPartPhoto}`}
                          alt="Damaged part preview"
                          sx={{
                            maxWidth: '100%',
                            maxHeight: 200,
                            border: '1px solid #ddd',
                            borderRadius: 1
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Status (for editing only) */}
                {isEditing && (
                  <>
                    <Grid item xs={12}>
                      <Paper sx={{ p: 3, backgroundColor: 'success.light', color: 'white', mt: 2 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          📊 Requisition Status
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          label="Status"
                        >
                          {statuses.map(status => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      onClick={handleCancel}
                      variant="outlined"
                      size="large"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SaveIcon />}
                    >
                      {isEditing ? 'Update Requisition' : 'Create Requisition'}
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

export default PurchaseRequisitionForm;
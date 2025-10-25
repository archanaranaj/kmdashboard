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
  Grid
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

// Sample data - in real app, this would come from API/context
const sampleJobCards = [
  {
    id: 1,
    vehicleNumber: 'ABC-123',
    date: '2024-01-15',
    serviceAdvisor: 'John Doe',
    chassisNumber: 'CHS123456789',
    customerName: 'Alice Johnson',
    customerNumber: '+1234567890',
    customerEmail: 'alice@email.com',
    carMake: 'Toyota',
    carModel: 'Camry',
    carYear: '2022',
    insuranceName: 'ABC Insurance',
    jobDescription: 'Regular maintenance and oil change',
    promisedDate: '2024-01-17'
  },
  {
    id: 2,
    vehicleNumber: 'XYZ-789',
    date: '2024-01-16',
    serviceAdvisor: 'Jane Smith',
    chassisNumber: 'CHS987654321',
    customerName: 'Bob Brown',
    customerNumber: '+1987654321',
    customerEmail: 'bob@email.com',
    carMake: 'Honda',
    carModel: 'Civic',
    carYear: '2021',
    insuranceName: 'XYZ Insurance',
    jobDescription: 'Brake service and tire rotation',
    promisedDate: '2024-01-19'
  }
];

const carMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia'];
const insuranceCompanies = ['ABC Insurance', 'XYZ Insurance', 'Premium Insure', 'SecureCover', 'SafeGuard'];

function JobCardForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    date: new Date().toISOString().split('T')[0],
    serviceAdvisor: '',
    chassisNumber: '',
    customerName: '',
    customerNumber: '',
    customerEmail: '',
    carMake: '',
    carModel: '',
    carYear: '',
    insuranceName: '',
    jobDescription: '',
    promisedDate: ''
  });

  // Load job card data if editing
  useEffect(() => {
    if (isEditing) {
      const jobCard = sampleJobCards.find(card => card.id === parseInt(id));
      if (jobCard) {
        setFormData(jobCard);
      }
    }
  }, [id, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save to API
    console.log('Form submitted:', formData);
    
    // Show success message and navigate back
    alert(isEditing ? 'Job card updated successfully!' : 'Job card created successfully!');
    navigate('/job-cards');
  };

  const handleCancel = () => {
    navigate('/job-cards');
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
            {isEditing ? 'Edit Job Card' : 'Create New Job Card'}
          </Typography>
        </Box>

        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Vehicle Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: '#49a3f1', color: 'white' }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      🚗 Vehicle Information
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Vehicle Number"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
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
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Chassis Number"
                    name="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Car Make"
                    name="carMake"
                    value={formData.carMake}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    required
                    variant="outlined"
                  >
                    {carMakes.map(make => (
                      <MenuItem key={make} value={make}>{make}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Car Model"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Car Year"
                    name="carYear"
                    value={formData.carYear}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>

                {/* Customer Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: '#ee358bff', color: 'white', mt: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      👤 Customer Information
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Customer Name"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Customer Number"
                    name="customerNumber"
                    value={formData.customerNumber}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Customer Email"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Insurance Name"
                    name="insuranceName"
                    value={formData.insuranceName}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    variant="outlined"
                  >
                    {insuranceCompanies.map(company => (
                      <MenuItem key={company} value={company}>{company}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Service Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: '#f1d32bff', color: 'white', mt: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      🛠️ Service Information
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Service Advisor Name"
                    name="serviceAdvisor"
                    value={formData.serviceAdvisor}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Promised Delivery Date"
                    name="promisedDate"
                    type="date"
                    value={formData.promisedDate}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Job Description"
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>

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
                      {isEditing ? 'Update Job Card' : 'Create Job Card'}
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
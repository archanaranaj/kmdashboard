import React, { useState } from 'react';
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
  Box
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function JobCards() {
  const navigate = useNavigate();
  const [jobCards, setJobCards] = useState([
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
  ]);

  const handleOpenAdd = () => {
    // Navigate to the add job card page
    navigate('/job-cards/add');
  };

  const handleOpenEdit = (jobCard) => {
    // Navigate to the edit job card page
    navigate(`/job-cards/edit/${jobCard.id}`);
  };

  const handleOpenView = (jobCard) => {
    // Navigate to the JobCardView page
    navigate(`/job-cards/view/${jobCard.id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job card?')) {
      setJobCards(prev => prev.filter(card => card.id !== id));
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Job Cards Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Add Job Card
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle No.</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Car Details</TableCell>
                  <TableCell>Service Advisor</TableCell>
                  <TableCell>Promised Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobCards.map((jobCard) => (
                  <TableRow key={jobCard.id}>
                    <TableCell>{jobCard.vehicleNumber}</TableCell>
                    <TableCell>{jobCard.customerName}</TableCell>
                    <TableCell>{jobCard.carMake} {jobCard.carModel} ({jobCard.carYear})</TableCell>
                    <TableCell>{jobCard.serviceAdvisor}</TableCell>
                    <TableCell>{jobCard.promisedDate}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenView(jobCard)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleOpenEdit(jobCard)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(jobCard.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default JobCards;
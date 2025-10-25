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
  Box,
  Grid,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function PurchaseRequisition() {
  const navigate = useNavigate();
  
  // Sample data - in real app, this would come from API
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([
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
    },
    {
      id: 3,
      requisitionNumber: 'PR-003',
      supplier: 'Used',
      plateNumber: 'DEF-456',
      jobCardNumber: 'JC-003',
      description: 'Used alternator replacement',
      damagedPartPhoto: 'alternator.jpg',
      status: 'Rejected',
      createdDate: '2024-01-17',
      createdBy: 'Mike Johnson',
      priority: 'Low'
    }
  ]);

  const handleOpenView = (requisition) => {
    navigate(`/purchase-requisition/view/${requisition.id}`);
  };

  const handleOpenEdit = (requisition) => {
    navigate(`/purchase-requisition/edit/${requisition.id}`);
  };

  const handleOpenAdd = () => {
    navigate('/purchase-requisition/add');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this purchase requisition?')) {
      setPurchaseRequisitions(prev => prev.filter(req => req.id !== id));
    }
  };

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

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Purchase Requisition
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Supplier requisition for internal network
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Create Requisition
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Requisitions
              </Typography>
              <Typography variant="h4">
                {purchaseRequisitions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" color="warning.main">
                {purchaseRequisitions.filter(req => req.status === 'Pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Approved
              </Typography>
              <Typography variant="h4" color="success.main">
                {purchaseRequisitions.filter(req => req.status === 'Approved').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Rejected
              </Typography>
              <Typography variant="h4" color="error.main">
                {purchaseRequisitions.filter(req => req.status === 'Rejected').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Purchase Requisitions
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Req. Number</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Plate Number</TableCell>
                      <TableCell>Job Card</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseRequisitions.map((requisition) => (
                      <TableRow key={requisition.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {requisition.requisitionNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{requisition.supplier}</TableCell>
                        <TableCell>{requisition.plateNumber}</TableCell>
                        <TableCell>{requisition.jobCardNumber}</TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {requisition.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={requisition.priority} 
                            color={getPriorityColor(requisition.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={requisition.status} 
                            color={getStatusColor(requisition.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{requisition.createdDate}</TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenView(requisition)}
                            size="small"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton 
                            color="secondary" 
                            onClick={() => handleOpenEdit(requisition)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(requisition.id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {purchaseRequisitions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No purchase requisitions found
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
    </Box>
  );
}

export default PurchaseRequisition;
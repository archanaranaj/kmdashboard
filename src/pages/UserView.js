import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Person as PersonIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError('');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status) {
        setUser(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to fetch user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'service_advisor': return 'primary';
      case 'accounts': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (is_active) => {
    return is_active ? 'success' : 'error';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/users')} sx={{ mb: 2 }}>
          Back to Users
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/users')} sx={{ mb: 2 }}>
          Back to Users
        </Button>
        <Alert severity="warning">User not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/users')} sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant="h4" component="h1">
            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            User Details
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/users/edit/${user.id}`)}
        >
          Edit User
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Username
                </Typography>
                <Typography variant="body1">
                  {user.username}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Email Address
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Role
                </Typography>
                <Chip 
                  label={user.role.replace('_', ' ')} 
                  color={getRoleColor(user.role)}
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Chip 
                  label={user.is_active ? 'Active' : 'Inactive'} 
                  color={getStatusColor(user.is_active)}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Branch
                </Typography>
                <Typography variant="body1">
                  {user.branch ? user.branch.name : 'Not assigned'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  User ID
                </Typography>
                <Typography variant="body1">
                  {user.id}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Created Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(user.created_at)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {formatDate(user.updated_at)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserView;
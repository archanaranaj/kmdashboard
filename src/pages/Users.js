
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  Chip,
  Alert,
  Tooltip,
  CircularProgress,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  MenuItem,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'service_advisor', label: 'Service Advisor' },
  { value: 'accounts', label: 'Accounts' },
];

const statusOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

function Users() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    role: '',
    branch_id: '',
    is_active: '',
    search: ''
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.branch_id) queryParams.append('branch_id', filters.branch_id);
      if (filters.is_active) queryParams.append('is_active', filters.is_active);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(
        `${API_BASE_URL}/api/users?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status) {
        setUsers(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch users: ' + error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || `Failed to delete user: ${response.status}`);
        }

        if (result.status) {
          setSnackbar({
            open: true,
            message: 'User deleted successfully',
            severity: 'success'
          });
          fetchUsers(); // Refresh the list
        } else {
          throw new Error(result.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete user: ' + error.message,
          severity: 'error'
        });
      }
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    fetchUsers();
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      branch_id: '',
      is_active: '',
      search: ''
    });
    setTimeout(() => fetchUsers(), 100);
  };

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
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Check if user has permission to manage users (only admin)
  const canManageUsers = user?.role === 'admin';

  if (!canManageUsers) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error">
          You don't have permission to access this page. Only administrators can manage users.
        </Alert>
      </Box>
    );
  }

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/users/add')}
        >
          Add User
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search by email or username"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={filters.role}
                  label="Role"
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.is_active}
                  label="Status"
                  onChange={(e) => handleFilterChange('is_active', e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="text"
                  onClick={clearFilters}
                >
                  Clear
                </Button>
                <Button
                  variant="text"
                  startIcon={<RefreshIcon />}
                  onClick={fetchUsers}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role.replace('_', ' ')} 
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.branch ? user.branch.name : 'N/A'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.is_active ? 'Active' : 'Inactive'} 
                    color={getStatusColor(user.is_active)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View User">
                    <IconButton 
                      color="info" 
                      onClick={() => navigate(`/users/view/${user.id}`)}
                      size="small"
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit User">
                    <IconButton 
                      color="primary" 
                      onClick={() => navigate(`/users/edit/${user.id}`)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(user.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Loading overlay for table */}
      {loading && users.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Users;
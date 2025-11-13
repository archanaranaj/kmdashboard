import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Autocomplete
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Business as BranchIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'service_advisor', label: 'Service Advisor' },
  { value: 'accounts', label: 'Accounts' },
];

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    branch_id: '',
    is_active: true
  });
  
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [fetchingBranches, setFetchingBranches] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch branches from API
  const fetchBranches = async () => {
    try {
      setFetchingBranches(true);
      const response = await fetch(`${API_BASE_URL}/api/branches`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch branches: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status_code === 200) {
        setBranches(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch branches');
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      setError('Failed to load branches: ' + error.message);
    } finally {
      setFetchingBranches(false);
    }
  };

  // Fetch user data for editing
  const fetchUser = async () => {
    try {
      setFetching(true);
      setError('');

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
        const user = result.data;
        setFormData({
          username: user.username || '',
          email: user.email || '',
          password: '', // Don't pre-fill password for security
          role: user.role || '',
          branch_id: user.branch_id || '',
          is_active: user.is_active
        });
      } else {
        throw new Error(result.message || 'Failed to fetch user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to fetch user: ' + error.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    // Fetch branches on component mount
    fetchBranches();

    // Fetch user data if in edit mode
    if (isEdit) {
      fetchUser();
    }
  }, [id, isEdit, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Prepare data for API
      const submitData = { ...formData };
      
      // Remove password field if it's empty (for edit)
      if (isEdit && !submitData.password) {
        delete submitData.password;
      }

      // Convert branch_id to number or null
      if (submitData.branch_id === '') {
        submitData.branch_id = null;
      } else {
        submitData.branch_id = parseInt(submitData.branch_id);
      }

      const url = isEdit 
        ? `${API_BASE_URL}/api/users/${id}`
        : `${API_BASE_URL}/api/users`;
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${isEdit ? 'update' : 'create'} user`);
      }

      if (result.status) {
        setSuccess(`User ${isEdit ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          navigate('/users');
        }, 2000);
      } else {
        throw new Error(result.message || `Failed to ${isEdit ? 'update' : 'create'} user`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleBranchChange = (event, value) => {
    setFormData(prev => ({
      ...prev,
      branch_id: value ? value.id : ''
    }));
  };

  // Get selected branch object for Autocomplete
  const getSelectedBranch = () => {
    if (!formData.branch_id) return null;
    return branches.find(branch => branch.id === parseInt(formData.branch_id)) || null;
  };

  if (fetching || fetchingBranches) {
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/users')} sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant="h4" component="h1">
            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {isEdit ? 'Edit User' : 'Add New User'}
          </Typography>
        </Box>
      </Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {error && (
                    <Grid item xs={12}>
                      <Alert severity="error">{error}</Alert>
                    </Grid>
                  )}
                  
                  {success && (
                    <Grid item xs={12}>
                      <Alert severity="success">{success}</Alert>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Username"
                      value={formData.username}
                      onChange={handleChange('username')}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange('password')}
                      required={!isEdit} // Password required only for new users
                      variant="outlined"
                      helperText={isEdit ? "Leave blank to keep current password" : ""}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={formData.role}
                        label="Role"
                        onChange={handleChange('role')}
                        required
                      >
                        {roleOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.is_active}
                        label="Status"
                        onChange={handleChange('is_active')}
                      >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Autocomplete
                        options={branches}
                        getOptionLabel={(option) => `${option.name} - ${option.location}`}
                        value={getSelectedBranch()}
                        onChange={handleBranchChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Branch"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <BranchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                  {params.InputProps.startAdornment}
                                </>
                              )
                            }}
                            // helperText="Optional - assign user to a specific branch"
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Box>
                              <Typography variant="body1">
                                {option.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {option.location}
                              </Typography>
                            </Box>
                          </li>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* Alternative: Simple Select dropdown for branches */}
                  {/* <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Branch (Optional)</InputLabel>
                      <Select
                        value={formData.branch_id || ''}
                        label="Branch (Optional)"
                        onChange={handleChange('branch_id')}
                        startAdornment={<BranchIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                      >
                        <MenuItem value="">
                          <em>No Branch Assigned</em>
                        </MenuItem>
                        {branches.map((branch) => (
                          <MenuItem key={branch.id} value={branch.id}>
                            {branch.name} - {branch.location}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid> */}

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/users')}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserForm;
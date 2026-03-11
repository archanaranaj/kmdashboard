import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    platesScannedToday: 0,
    jobCardsCreatedToday: 0,
    pendingPlatesToday: 0
  });
  const [jobStatusData, setJobStatusData] = useState([]);
  const [weeklyJobData, setWeeklyJobData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'https://gms-api.kmgarage.com/api';

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/branches`, {
          headers: {
            'Accept': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const json = await res.json();

        if (Array.isArray(json?.data)) {
          setBranches(json.data);
          if (!selectedBranchId && json.data.length > 0) {
            setSelectedBranchId(String(json.data[0].id ?? json.data[0].branch_id));
          }
        }
      } catch (error) {
        console.error('Failed to fetch branches', error);
      }
    };

    fetchBranches();
  }, [API_BASE_URL, selectedBranchId, token]);

  useEffect(() => {
    if (!selectedBranchId) return;

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard?branch_id=${selectedBranchId}`, {
          headers: {
            'Accept': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const json = await res.json();

        if (json?.status && json?.data) {
          const data = json.data;

          // Map API to stats cards
          setStats({
            totalJobs: data.totalJobs ?? 0,
            platesScannedToday: data.today?.platesScanned ?? data.todayJobs ?? 0,
            jobCardsCreatedToday: data.today?.jobCardsCreated ?? 0,
            pendingPlatesToday: data.today?.pending ?? data.pendingJobs ?? 0
          });

          // Charts data
          setJobStatusData(Array.isArray(data.jobStatusData) ? data.jobStatusData : []);
          setWeeklyJobData(Array.isArray(data.weeklyJobData) ? data.weeklyJobData : []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [API_BASE_URL, selectedBranchId, token]);


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              textAlign: { xs: 'left', sm: 'left' }
            }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            gutterBottom
            sx={{
              textAlign: { xs: 'left', sm: 'left' },
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Welcome back, {user?.name}!
          </Typography>
        </Box>

        <FormControl
          size="small"
          sx={{ minWidth: 200 }}
        >
          <InputLabel id="branch-select-label">Branch</InputLabel>
          <Select
            labelId="branch-select-label"
            id="branch-select"
            label="Branch"
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            disabled={loading && !branches.length}
          >
            {branches.map((branch) => (
              <MenuItem
                key={branch.id ?? branch.branch_id}
                value={String(branch.id ?? branch.branch_id)}
              >
                {branch.name ?? branch.branch_name ?? `Branch ${branch.id ?? branch.branch_id}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{
            position: 'relative',
            overflow: 'visible',
            height: '100%',
            minHeight: 140
          }}>
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -12, sm: -15 },
                left: { xs: 12, sm: 15 },
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <AssignmentIcon sx={{ fontSize: { xs: 24, sm: 30 }, color: 'white' }} />
            </Box>
            <CardContent sx={{
              pt: { xs: 3, sm: 4 },
              textAlign: 'right',
              pb: '16px !important'
            }}>
              <Typography
                color="textSecondary"
                gutterBottom
                sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
              >
                Total Jobs
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
              >
                {stats.totalJobs}
              </Typography>
              <Typography
                variant="body2"
                color="success.main"
                sx={{
                  mt: 1,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}
              >
                till today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{
            position: 'relative',
            overflow: 'visible',
            height: '100%',
            minHeight: 140
          }}>
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -12, sm: -15 },
                left: { xs: 12, sm: 15 },
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
                backgroundColor: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <ScheduleIcon sx={{ fontSize: { xs: 24, sm: 30 }, color: 'white' }} />
            </Box>
            <CardContent sx={{
              pt: { xs: 3, sm: 4 },
              textAlign: 'right',
              pb: '16px !important'
            }}>
              <Typography
                color="textSecondary"
                gutterBottom
                sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
              >
                Plates Scanned
              </Typography>
              <Typography
                variant="h4"
                component="div"
                color="warning.main"
                sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
              >
                {stats.platesScannedToday}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  mt: 1,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}
              >
                by today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{
            position: 'relative',
            overflow: 'visible',
            height: '100%',
            minHeight: 140
          }}>
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -12, sm: -15 },
                left: { xs: 12, sm: 15 },
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
                backgroundColor: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: { xs: 24, sm: 30 }, color: 'white' }} />
            </Box>
            <CardContent sx={{
              pt: { xs: 3, sm: 4 },
              textAlign: 'right',
              pb: '16px !important'
            }}>
              <Typography
                color="textSecondary"
                gutterBottom
                sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
              >
                Job Cards Created against Plates
              </Typography>
              <Typography
                variant="h4"
                component="div"
                color="success.main"
                sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
              >
                {stats.jobCardsCreatedToday}
              </Typography>
              <Typography
                variant="body2"
                color="success.main"
                sx={{
                  mt: 1,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}
              >
                by today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{
            position: 'relative',
            overflow: 'visible',
            height: '100%',
            minHeight: 140
          }}>
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -12, sm: -15 },
                left: { xs: 12, sm: 15 },
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
                backgroundColor: 'info.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <TodayIcon sx={{ fontSize: { xs: 24, sm: 30 }, color: 'white' }} />
            </Box>
            <CardContent sx={{
              pt: { xs: 3, sm: 4 },
              textAlign: 'right',
              pb: '16px !important'
            }}>
              <Typography
                color="textSecondary"
                gutterBottom
                sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
              >
                Pending Plates
              </Typography>
              <Typography
                variant="h4"
                component="div"
                color="info.main"
                sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
              >
                {stats.pendingPlatesToday}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  mt: 1,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}
              >
                by today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Weekly Reports
              </Typography>
              <Box sx={{ width: '100%', height: { xs: 250, sm: 300 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyJobData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="jobs" fill="#8884d8" name="Plates Scanned" />
                    <Bar dataKey="completed" fill="#82ca9d" name="Job Cards Created" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Number Plates Status
              </Typography>
              <Box sx={{ width: '100%', height: { xs: 250, sm: 300 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jobStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {jobStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
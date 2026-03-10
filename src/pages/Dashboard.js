import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
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
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 45,
    pendingJobs: 12,
    completedJobs: 28,
    todayJobs: 5
  });

  // Sample data for charts
  const jobStatusData = [
    { name: 'Pending', value: 12 },
    { name: 'In Progress', value: 5 },
    { name: 'Completed', value: 28 },
  ];

  const weeklyJobData = [
    { day: 'Mon', jobs: 8, completed: 5 },
    { day: 'Tue', jobs: 12, completed: 8 },
    { day: 'Wed', jobs: 6, completed: 4 },
    { day: 'Thu', jobs: 14, completed: 10 },
    { day: 'Fri', jobs: 10, completed: 7 },
    { day: 'Sat', jobs: 4, completed: 3 },
    { day: 'Sun', jobs: 2, completed: 1 },
  ];


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header Section */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          gutterBottom
          sx={{
            textAlign: { xs: 'center', sm: 'left' },
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Welcome back, {user?.name}!
        </Typography>
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
                +55% than last week
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
                Pending Jobs
              </Typography>
              <Typography
                variant="h4"
                component="div"
                color="warning.main"
                sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
              >
                {stats.pendingJobs}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  mt: 1,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}
              >
                +3% than last month
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
                Completed Jobs
              </Typography>
              <Typography
                variant="h4"
                component="div"
                color="success.main"
                sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
              >
                {stats.completedJobs}
              </Typography>
              <Typography
                variant="body2"
                color="success.main"
                sx={{
                  mt: 1,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}
              >
                +1% than yesterday
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
                Today's Jobs
              </Typography>
              <Typography
                variant="h4"
                component="div"
                color="info.main"
                sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
              >
                {stats.todayJobs}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  mt: 1,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}
              >
                Just updated
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
                Weekly Job Trends
              </Typography>
              <Box sx={{ width: '100%', height: { xs: 250, sm: 300 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyJobData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="jobs" fill="#8884d8" name="Total Jobs" />
                    <Bar dataKey="completed" fill="#82ca9d" name="Completed Jobs" />
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
                Job Status Distribution
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
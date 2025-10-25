// // import React, { useState, useEffect } from 'react';
// // import Grid from '@mui/material/Grid';
// // import Card from '@mui/material/Card';
// // import CardContent from '@mui/material/CardContent';
// // import Typography from '@mui/material/Typography';
// // import { useAuth } from '../contexts/AuthContext';

// // function Dashboard() {
// //   const { user } = useAuth();
// //   const [stats, setStats] = useState({
// //     totalJobs: 45,
// //     pendingJobs: 12,
// //     completedJobs: 28,
// //     todayJobs: 5
// //   });

// //   return (
// //     <div>
// //       <Typography variant="h4" gutterBottom>
// //         Dashboard
// //       </Typography>
// //       <Typography variant="subtitle1" color="textSecondary" gutterBottom>
// //         Welcome back, {user?.name}!
// //       </Typography>

// //       <Grid container spacing={3} sx={{ mt: 2 }}>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card>
// //             <CardContent>
// //               <Typography color="textSecondary" gutterBottom>
// //                 Total Jobs
// //               </Typography>
// //               <Typography variant="h4" component="div">
// //                 {stats.totalJobs}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card>
// //             <CardContent>
// //               <Typography color="textSecondary" gutterBottom>
// //                 Pending Jobs
// //               </Typography>
// //               <Typography variant="h4" component="div" color="warning.main">
// //                 {stats.pendingJobs}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card>
// //             <CardContent>
// //               <Typography color="textSecondary" gutterBottom>
// //                 Completed Jobs
// //               </Typography>
// //               <Typography variant="h4" component="div" color="success.main">
// //                 {stats.completedJobs}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card>
// //             <CardContent>
// //               <Typography color="textSecondary" gutterBottom>
// //                 Today's Jobs
// //               </Typography>
// //               <Typography variant="h4" component="div" color="info.main">
// //                 {stats.todayJobs}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //       </Grid>

// //       <Grid container spacing={3} sx={{ mt: 2 }}>
// //         <Grid item xs={12} md={8}>
// //           <Card>
// //             <CardContent>
// //               <Typography variant="h6" gutterBottom>
// //                 Recent Activity
// //               </Typography>
// //               <Typography variant="body2" color="textSecondary">
// //                 • New job card created for vehicle ABC-123 <br />
// //                 • Gate pass issued for vehicle XYZ-789 <br />
// //                 • Purchase requisition approved <br />
// //                 • Service completed for vehicle DEF-456
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //         <Grid item xs={12} md={4}>
// //           <Card>
// //             <CardContent>
// //               <Typography variant="h6" gutterBottom>
// //                 Quick Stats
// //               </Typography>
// //               <Typography variant="body2" color="textSecondary">
// //                 Branch: {user?.branchName || 'All Branches'} <br />
// //                 Role: {user?.role} <br />
// //                 Active Since: Today
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //       </Grid>
// //     </div>
// //   );
// // }

// // export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import Grid from '@mui/material/Grid';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import { 
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
// } from 'recharts';
// import { 
//   Assignment as AssignmentIcon,
//   Schedule as ScheduleIcon,
//   CheckCircle as CheckCircleIcon,
//   Today as TodayIcon
// } from '@mui/icons-material';
// import { useAuth } from '../contexts/AuthContext';

// function Dashboard() {
//   const { user } = useAuth();
//   const [stats, setStats] = useState({
//     totalJobs: 45,
//     pendingJobs: 12,
//     completedJobs: 28,
//     todayJobs: 5
//   });

//   // Sample data for charts
//   const jobStatusData = [
//     { name: 'Pending', value: 12 },
//     { name: 'In Progress', value: 5 },
//     { name: 'Completed', value: 28 },
//   ];

//   const weeklyJobData = [
//     { day: 'Mon', jobs: 8, completed: 5 },
//     { day: 'Tue', jobs: 12, completed: 8 },
//     { day: 'Wed', jobs: 6, completed: 4 },
//     { day: 'Thu', jobs: 14, completed: 10 },
//     { day: 'Fri', jobs: 10, completed: 7 },
//     { day: 'Sat', jobs: 4, completed: 3 },
//     { day: 'Sun', jobs: 2, completed: 1 },
//   ];

//   const serviceTypeData = [
//     { name: 'Oil Change', count: 15 },
//     { name: 'Brake Service', count: 8 },
//     { name: 'Tire Rotation', count: 6 },
//     { name: 'Engine Repair', count: 12 },
//     { name: 'Electrical', count: 4 },
//   ];

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

//   return (
//     <div>
//       <Typography variant="h4" gutterBottom>
//         Dashboard
//       </Typography>
//       <Typography variant="subtitle1" color="textSecondary" gutterBottom>
//         Welcome back, {user?.name}!
//       </Typography>

//       <Grid container spacing={3} sx={{ mt: 2 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ position: 'relative', overflow: 'visible' }}>
//             <Box
//               sx={{
//                 position: 'absolute',
//                 top: -15,
//                 left: 15,
//                 width: 60,
//                 height: 60,
//                 backgroundColor: 'primary.main',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 borderRadius: 2,
//                 boxShadow: 3,
//               }}
//             >
//               <AssignmentIcon sx={{ fontSize: 30, color: 'white' }} />
//             </Box>
//             <CardContent sx={{ pt: 4, textAlign: 'right' }}>
//               <Typography color="textSecondary" gutterBottom>
//                 Total Jobs
//               </Typography>
//               <Typography variant="h4" component="div">
//                 {stats.totalJobs}
//               </Typography>
//               <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
//                 +55% than last week
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ position: 'relative', overflow: 'visible' }}>
//             <Box
//               sx={{
//                 position: 'absolute',
//                 top: -15,
//                 left: 15,
//                 width: 60,
//                 height: 60,
//                 backgroundColor: 'warning.main',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 borderRadius: 2,
//                 boxShadow: 3,
//               }}
//             >
//               <ScheduleIcon sx={{ fontSize: 30, color: 'white' }} />
//             </Box>
//             <CardContent sx={{ pt: 4, textAlign: 'right' }}>
//               <Typography color="textSecondary" gutterBottom>
//                 Pending Jobs
//               </Typography>
//               <Typography variant="h4" component="div" color="warning.main">
//                 {stats.pendingJobs}
//               </Typography>
//               <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//                 +3% than last month
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ position: 'relative', overflow: 'visible' }}>
//             <Box
//               sx={{
//                 position: 'absolute',
//                 top: -15,
//                 left: 15,
//                 width: 60,
//                 height: 60,
//                 backgroundColor: 'success.main',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 borderRadius: 2,
//                 boxShadow: 3,
//               }}
//             >
//               <CheckCircleIcon sx={{ fontSize: 30, color: 'white' }} />
//             </Box>
//             <CardContent sx={{ pt: 4, textAlign: 'right' }}>
//               <Typography color="textSecondary" gutterBottom>
//                 Completed Jobs
//               </Typography>
//               <Typography variant="h4" component="div" color="success.main">
//                 {stats.completedJobs}
//               </Typography>
//               <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
//                 +1% than yesterday
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ position: 'relative', overflow: 'visible' }}>
//             <Box
//               sx={{
//                 position: 'absolute',
//                 top: -15,
//                 left: 15,
//                 width: 60,
//                 height: 60,
//                 backgroundColor: 'info.main',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 borderRadius: 2,
//                 boxShadow: 3,
//               }}
//             >
//               <TodayIcon sx={{ fontSize: 30, color: 'white' }} />
//             </Box>
//             <CardContent sx={{ pt: 4, textAlign: 'right' }}>
//               <Typography color="textSecondary" gutterBottom>
//                 Today's Jobs
//               </Typography>
//               <Typography variant="h4" component="div" color="info.main">
//                 {stats.todayJobs}
//               </Typography>
//               <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//                 Just updated
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Charts Section */}
//       <Grid container spacing={3} sx={{ mt: 2 }}>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Weekly Job Trends
//               </Typography>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={weeklyJobData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="day" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="jobs" fill="#8884d8" name="Total Jobs" />
//                   <Bar dataKey="completed" fill="#82ca9d" name="Completed Jobs" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Job Status Distribution
//               </Typography>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={jobStatusData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {jobStatusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Service Type Distribution
//               </Typography>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={serviceTypeData} layout="vertical">
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis type="number" />
//                   <YAxis type="category" dataKey="name" width={80} />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="count" fill="#ffc658" name="Number of Services" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Job Completion Rate
//               </Typography>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={weeklyJobData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="day" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line 
//                     type="monotone" 
//                     dataKey="completed" 
//                     stroke="#8884d8" 
//                     name="Completed Jobs"
//                     strokeWidth={2}
//                   />
//                   <Line 
//                     type="monotone" 
//                     dataKey="jobs" 
//                     stroke="#82ca9d" 
//                     name="Total Jobs"
//                     strokeWidth={2}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Grid container spacing={3} sx={{ mt: 2 }}>
//         <Grid item xs={12} md={8}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Recent Activity
//               </Typography>
//               <Typography variant="body2" color="textSecondary">
//                 • New job card created for vehicle ABC-123 <br />
//                 • Gate pass issued for vehicle XYZ-789 <br />
//                 • Purchase requisition approved <br />
//                 • Service completed for vehicle DEF-456
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Quick Stats
//               </Typography>
//               <Typography variant="body2" color="textSecondary">
//                 Branch: {user?.branchName || 'All Branches'} <br />
//                 Role: {user?.role} <br />
//                 Active Since: Today
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </div>
//   );
// }

// export default Dashboard;


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

  const serviceTypeData = [
    { name: 'Oil Change', count: 15 },
    { name: 'Brake Service', count: 8 },
    { name: 'Tire Rotation', count: 6 },
    { name: 'Engine Repair', count: 12 },
    { name: 'Electrical', count: 4 },
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

        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Service Type Distribution
              </Typography>
              <Box sx={{ width: '100%', height: { xs: 250, sm: 300 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceTypeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#ffc658" name="Number of Services" />
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
                Job Completion Rate
              </Typography>
              <Box sx={{ width: '100%', height: { xs: 250, sm: 300 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyJobData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#8884d8" 
                      name="Completed Jobs"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="jobs" 
                      stroke="#82ca9d" 
                      name="Total Jobs"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Recent Activity
              </Typography>
              <Typography 
                variant="body2" 
                color="textSecondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                • New job card created for vehicle ABC-123 <br />
                • Gate pass issued for vehicle XYZ-789 <br />
                • Purchase requisition approved <br />
                • Service completed for vehicle DEF-456
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Quick Stats
              </Typography>
              <Typography 
                variant="body2" 
                color="textSecondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Branch: {user?.branchName || 'All Branches'} <br />
                Role: {user?.role} <br />
                Active Since: Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
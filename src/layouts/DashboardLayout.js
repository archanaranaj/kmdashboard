import React, { useState } from 'react';
import { 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  AppBar,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as JobCardsIcon,
  Payment as CashIcon,
  ExitToApp as GatePassIcon,
  ShoppingCart as PurchaseIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
 QrCode as NumberPlateIcon,
  People as UsersIcon 
} from '@mui/icons-material';

import { useAuth } from '../contexts/AuthContext';
import DashboardNavbar from '../components/DashboardNavbar';

// Import pages
import Dashboard from '../pages/Dashboard';
import JobCards from '../pages/JobCards';
import JobCardView from '../pages/JobCardView';
import JobCardForm from '../pages/JobCardForm';
import CashManagement from '../pages/CashManagement';
import GatePass from '../pages/GatePass';
import GatePassView from '../pages/GatePassView';
import PurchaseRequisition from '../pages/PurchaseRequisition';
import PurchaseRequisitionView from '../pages/PurchaseRequisitionView';
import PurchaseRequisitionForm from '../pages/PurchaseRequisitionForm';
import NumberPlates from '../pages/NumberPlates';
import NumberPlateView from '../pages/NumberPlateView';
import Users from '../pages/Users';
import UserView from '../pages/UserView';
import UserForm from '../pages/UserForm';
import PettyCashDetails from '../pages/PettyCashDetails';
const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin','service_advisor', 'accounts'] },
  { text: 'Job Cards', icon: <JobCardsIcon />, path: '/job-cards', roles: ['admin','service_advisor', 'accounts'] },
  { text: 'Cash Management', icon: <CashIcon />, path: '/cash-management', roles: ['admin','accounts'] },
  { text: 'Gate Pass', icon: <GatePassIcon />, path: '/gate-pass', roles: ['admin','service_advisor'] },
  { text: 'Purchase Requisition', icon: <PurchaseIcon />, path: '/purchase-requisition', roles: ['admin','service_advisor'] },
  { text: 'Number Plates', icon: <NumberPlateIcon />, path: '/number-plates', roles: ['admin','service_advisor', 'accounts'] },
   { text: 'Users', icon: <UsersIcon />, path: '/users', roles: ['admin', 'service_advisor', 'accounts'] }, 

 
];

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const drawer = (
    <>
      <Toolbar>
        <Box sx={{ 
          padding: 2, 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
            KM Group
          </div>
          {!isMobile && (
            <IconButton 
              onClick={() => setDesktopOpen(false)}
              sx={{ color: 'white' }}
              size="small"
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
      <List sx={{ px: 1 }}>
        {filteredMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={location.pathname.startsWith(item.path)}
            onClick={() => {
              navigate(item.path);
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#49a3f1',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
                '&:hover': {
                  backgroundColor: '#3b8bcb',
                },
              },
              '&:hover': {
                backgroundColor: '#99b9d5ff',
              },
              borderRadius: 1,
              margin: '4px 0',
              color: 'white',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: location.pathname.startsWith(item.path) ? '600' : '400'
              }}
            />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'white',
            color: 'text.primary',
            boxShadow: 1
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" color="primary">
              KM Group
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ 
          width: { md: desktopOpen ? drawerWidth : 0 }, 
          flexShrink: { md: 0 } 
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#000000de',
              color: 'white',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="persistent"
          open={desktopOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#000000de',
              color: 'white',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          width: { 
            xs: '100%', 
            md: `calc(100% - ${desktopOpen ? drawerWidth : 0}px)` 
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Mobile spacer for AppBar */}
        {isMobile && <Toolbar />}
        
        <DashboardNavbar onMenuToggle={handleDrawerToggle} />
        
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3 },
            width: '100%',
            overflow: 'auto'
          }}
        >
          <Routes>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="job-cards" element={<JobCards />} />
            <Route path="/job-cards/view/:id" element={<JobCardView />} />
            <Route path="/job-cards/add" element={<JobCardForm />} />
            <Route path="/job-cards/edit/:id" element={<JobCardForm />} />
            <Route path="cash-management" element={<CashManagement />} />
            <Route path="gate-pass" element={<GatePass />} />
            <Route path="/gate-pass/view/:id" element={<GatePassView />} />
            <Route path="purchase-requisition" element={<PurchaseRequisition />} />
            <Route path="/purchase-requisition/view/:id" element={<PurchaseRequisitionView />} />
            <Route path="/purchase-requisition/add" element={<PurchaseRequisitionForm />} />
            <Route path="/purchase-requisition/edit/:id" element={<PurchaseRequisitionForm />} />
            <Route path="/number-plates" element={<NumberPlates />} />
<Route path="/number-plates/view/:id" element={<NumberPlateView />} />
  <Route path="users" element={<Users />} />
    <Route path="/users/view/:id" element={<UserView />} />
  <Route path="/users/add" element={<UserForm />} />
  <Route path="/users/edit/:id" element={<UserForm />} />
  <Route path="/petty-cash/:id" element={<PettyCashDetails />} />
  
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Box>
      </Box>

      {/* Mobile Menu Toggle Button when drawer is closed */}
      {!isMobile && !desktopOpen && (
        <IconButton
          onClick={() => setDesktopOpen(true)}
          sx={{
            position: 'fixed',
            left: 8,
            top: 8,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </Box>
  );
}

export default DashboardLayout;


// import React, { useState } from 'react';
// import { AppBar, Toolbar, Typography, Button, Box, TextField, InputAdornment } from '@mui/material';
// import { Search as SearchIcon } from '@mui/icons-material';
// import { useAuth } from '../contexts/AuthContext';

// function DashboardNavbar({ onSearch }) {
//   const { user, logout } = useAuth();
//   const [searchQuery, setSearchQuery] = useState('');

//   const handleSearchChange = (event) => {
//     const query = event.target.value;
//     setSearchQuery(query);
//     // If a search callback is provided, call it with the current query
//     if (onSearch) {
//       onSearch(query);
//     }
//   };

//   const handleSearchSubmit = (event) => {
//     if (event.key === 'Enter') {
//       // Trigger search on Enter key
//       if (onSearch) {
//         onSearch(searchQuery);
//       }
//     }
//   };

//   return (
//     <AppBar 
//       position="static" 
//       color="default" 
//       elevation={1}
//       sx={{ backgroundColor: 'white' }}
//     >
//       <Toolbar>
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           Vehicle Service Management System
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <TextField
//             placeholder="Quick search..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             onKeyPress={handleSearchSubmit}
//             size="small"
//             sx={{
//               width: 250,
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 2,
//               }
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon fontSize="small" color="action" />
//                 </InputAdornment>
//               ),
//             }}
//             variant="outlined"
//           />
//           <Button color="inherit" onClick={logout} variant="outlined">
//             Logout
//           </Button>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }

// export default DashboardNavbar;
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  TextField, 
  InputAdornment
} from '@mui/material';
import { 
  Search as SearchIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function DashboardNavbar({ onSearch }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  };

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={1}
      sx={{ backgroundColor: 'white' }}
    >
      <Toolbar>
        {/* Empty flex grow to push content to the right */}
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2
        }}>
          <TextField
            placeholder="Quick search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchSubmit}
            size="small"
            sx={{
              width: 250,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2
          }}>
            <Typography variant="body2">
              Welcome, {user?.name} ({user?.role})
            </Typography>
            <Button 
              color="inherit" 
              onClick={logout} 
              variant="outlined"
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default DashboardNavbar;
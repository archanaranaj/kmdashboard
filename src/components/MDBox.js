import React from 'react';
import { Box } from '@mui/material';

const MDBox = ({ children, ...props }) => {
  return (
    <Box {...props}>
      {children}
    </Box>
  );
};

export default MDBox;
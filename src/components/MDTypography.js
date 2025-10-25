import React from 'react';
import { Typography } from '@mui/material';

const MDTypography = ({ children, ...props }) => {
  return (
    <Typography {...props}>
      {children}
    </Typography>
  );
};

export default MDTypography;
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function CashManagement() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Cash Management
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">
            Cash Management System
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage petty cash and sales cash transactions.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default CashManagement;
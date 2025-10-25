import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
} from '@mui/material';
import { Assignment as JobCardIcon } from '@mui/icons-material';
import MDTypography from './MDTypography';

function PlateNumberList({ plateNumbers, onCreateJobCard }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <List>
      {plateNumbers.length === 0 ? (
        <ListItem>
          <MDTypography variant="body2" color="textSecondary">
            No plate numbers detected yet
          </MDTypography>
        </ListItem>
      ) : (
        plateNumbers.map((plate) => (
          <ListItem key={plate.id} divider>
            <ListItemText
              primary={
                <MDTypography variant="h6" fontWeight="medium">
                  {plate.plateNumber}
                </MDTypography>
              }
              secondary={
                <MDTypography variant="body2" color="textSecondary">
                  Detected: {formatDate(plate.timestamp)} at {formatTime(plate.timestamp)}
                  {plate.branchId && ` • Branch ${plate.branchId}`}
                </MDTypography>
              }
            />
            <ListItemSecondaryAction>
              <Chip 
                label="New" 
                color="primary" 
                size="small" 
                sx={{ mr: 1 }}
              />
              {onCreateJobCard && (
                <IconButton 
                  edge="end" 
                  aria-label="create-job-card"
                  onClick={() => onCreateJobCard(plate)}
                  color="primary"
                >
                  <JobCardIcon />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))
      )}
    </List>
  );
}

export default PlateNumberList;
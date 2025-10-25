import React from 'react';
import Card from '@mui/material/Card';
import { Box } from '@mui/material';

function StatisticsCard({ title, count, percentage }) {
  return (
    <Card>
      <div style={{ padding: '24px' }}>
        <h6 style={{ color: '#666', marginBottom: '8px' }}>{title}</h6>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ fontWeight: 'bold', margin: 0 }}>{count}</h4>
          {percentage && (
            <span 
              style={{ 
                color: percentage.color === 'success' ? '#4CAF50' : '#F44336',
                fontSize: '14px'
              }}
            >
              {percentage.value}
            </span>
          )}
        </Box>
      </div>
    </Card>
  );
}

export default StatisticsCard;
import React from 'react';
import HeatMap from 'react-heatmap-grid';
import { Container, Paper, Typography } from '@mui/material';

const xLabels = ['Stock A', 'Stock B', 'Stock C'];
const yLabels = ['Stock A', 'Stock B', 'Stock C'];
const data = [
  [1, 0.5, 0.2],
  [0.5, 1, 0.3],
  [0.2, 0.3, 1],
];

function CorrelationHeatmap() {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, background: '#f5f7fa' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Correlation Heatmap
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Visualize the correlation between stocks over the selected period.
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            data={data}
            xLabelsStyle={{ color: '#333', fontSize: '1rem' }}
            yLabelsStyle={{ color: '#333', fontSize: '1rem' }}
            cellStyle={(_x, _y, value) => ({
              background: `rgba(33, 150, 243, ${value})`,
              fontSize: '1rem',
              color: value > 0.5 ? '#fff' : '#222',
              borderRadius: 4,
              border: '1px solid #e0e0e0',
            })}
            cellRender={value => value.toFixed(2)}
          />
        </div>
      </Paper>
    </Container>
  );
}

export default CorrelationHeatmap;
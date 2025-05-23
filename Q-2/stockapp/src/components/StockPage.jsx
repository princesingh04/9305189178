import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Typography, Box } from '@mui/material';

const data = [
  { time: '10:00', price: 100 },
  { time: '10:05', price: 102 },
  { time: '10:10', price: 101 },
  // Add more mock data
];

function StockPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e3eafc',
        p: 0,
        m: 0,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom sx={{ color: 'black' }}>
        Stock Price Chart
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom sx={{ color: 'black' }}>
        View the stock price trend over time.
      </Typography>
      <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LineChart
          width={window.innerWidth > 800 ? window.innerWidth * 0.8 : window.innerWidth - 40}
          height={window.innerHeight > 500 ? window.innerHeight * 0.6 : window.innerHeight - 120}
          data={data}
        >
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#1976d2" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </div>
    </Box>
  );
}

export default StockPage;
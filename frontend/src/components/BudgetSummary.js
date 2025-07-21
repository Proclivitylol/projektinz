import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

function BudgetSummary({ balance, income, expense }) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Podsumowanie budżetu
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="subtitle1">Saldo</Typography>
              <Typography variant="h6" color={balance >= 0 ? 'green' : 'red'}>
                {balance} zł
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={4}>
            <Box textAlign="center">
              <Typography variant="subtitle1">Przychody</Typography>
              <Typography variant="h6" color="primary">
                {income} zł
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={4}>
            <Box textAlign="center">
              <Typography variant="subtitle1">Wydatki</Typography>
              <Typography variant="h6" color="error">
                {expense} zł
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default BudgetSummary;

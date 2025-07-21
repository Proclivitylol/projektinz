import React from 'react';
import { Box, Grid } from '@mui/material';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

function TransactionsView(props) {
  return (
    <Box sx={{ py: 4 }}>
      {/* Responsywny grid dla formularza i listy */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={4}>
          <TransactionForm {...props} />
        </Grid>
        <Grid item xs={12} lg={8}>
          <TransactionList {...props} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default TransactionsView;

import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import BudgetSummary from '../components/BudgetSummary';
import BudgetPlanner from '../components/BudgetPlanner';
import SavingsGoals from '../components/SavingsGoals';

function BudgetView({ balance, income, expense, transactions }) {
  const [categories, setCategories] = useState([]);

  // Pobieranie kategorii z localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('budgetify-categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  const handleUpdateCategories = (updatedCategories) => {
    setCategories(updatedCategories);
    localStorage.setItem('budgetify-categories', JSON.stringify(updatedCategories));
  };

  return (
    <Box sx={{ py: 4 }}>
      <BudgetSummary balance={balance} income={income} expense={expense} />
      
      {/* Responsywny grid dla BudgetPlanner i SavingsGoals */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={6}>
          <BudgetPlanner 
            transactions={transactions}
            categories={categories}
            onUpdateCategories={handleUpdateCategories}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <SavingsGoals 
            transactions={transactions}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default BudgetView;

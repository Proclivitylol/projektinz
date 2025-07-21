import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Chip, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown, PieChart, BarChart, ArrowForward } from '@mui/icons-material';
import BudgetSummary from '../components/BudgetSummary';

function DashboardView({ transactions, balance, income, expense, onNavigate }) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  
  // Miesięczne statystyki
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const monthlyExpense = monthlyTransactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  
  // Top kategorie wydatków
  const expenseCategories = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const cat = t.category || 'Inne';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {});
  
  const topCategories = Object.entries(expenseCategories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Liczba transakcji
  const totalTransactions = transactions.length;
  const monthlyTransactionsCount = monthlyTransactions.length;

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
          Witaj w Placeholder
        </Typography>
        <Typography variant="h6" sx={{ color: '#b3b3b3', fontWeight: 400 }}>
          {monthNames[currentMonth]} {currentYear}
        </Typography>
      </Box>
      
      {/* Główne podsumowanie */}
      <BudgetSummary balance={balance} income={income} expense={expense} />
      
      {/* Karty z poglądowymi statystykami */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Miesięczne podsumowanie */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            bgcolor: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            borderRadius: 3,
            p: 3,
            background: 'linear-gradient(135deg, #232323 0%, #2a2a2a 100%)',
            border: '1px solid #333',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1db954', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  Ten miesiąc
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>Przychody</Typography>
                  <Typography variant="h6" sx={{ color: '#1db954', fontWeight: 700 }}>
                    {monthlyIncome.toFixed(2)} zł
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>Wydatki</Typography>
                  <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 700 }}>
                    {monthlyExpense.toFixed(2)} zł
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="body2" sx={{ color: '#b3b3b3', mt: 2 }}>
                {monthlyTransactionsCount} transakcji w tym miesiącu
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top kategorie wydatków */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            bgcolor: '#232323',
            borderRadius: 3,
            p: 3,
            background: 'linear-gradient(135deg, #232323 0%, #2a2a2a 100%)',
            border: '1px solid #333',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
                  <PieChart />
                </Avatar>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  Top kategorie
                </Typography>
              </Box>
              {topCategories.length > 0 ? (
                <Box>
                  {topCategories.map(([category, amount], index) => (
                    <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip 
                        label={category} 
                        size="small" 
                        sx={{ bgcolor: '#333', color: '#fff' }}
                      />
                      <Typography variant="body2" sx={{ color: '#b3b3b3', fontWeight: 600 }}>
                        {amount.toFixed(2)} zł
                      </Typography>
                    </Box>
                  ))}
                  <Button 
                    variant="text" 
                    size="small" 
                    endIcon={<ArrowForward />}
                    onClick={() => onNavigate && onNavigate('statistics')}
                    sx={{ mt: 2, color: '#1db954', textTransform: 'none' }}
                  >
                    Zobacz szczegóły
                  </Button>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  Brak wydatków w tym miesiącu
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Szybkie statystyki */}
        <Grid item xs={12}>
          <Card sx={{ 
            bgcolor: '#232323',
            borderRadius: 3,
            p: 3,
            background: 'linear-gradient(135deg, #232323 0%, #2a2a2a 100%)',
            border: '1px solid #333',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>
                    <BarChart />
                  </Avatar>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                    Analiza trendów
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => onNavigate && onNavigate('statistics')}
                  sx={{ 
                    borderColor: '#1db954', 
                    color: '#1db954',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#1db954',
                      bgcolor: 'rgba(29,185,84,0.1)'
                    }
                  }}
                >
                  Pełne statystyki
                </Button>
              </Box>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>Łączne transakcje</Typography>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                    {totalTransactions}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>Średni wydatek</Typography>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                    {monthlyTransactionsCount > 0 ? (monthlyExpense / monthlyTransactions.filter(t => t.type === 'expense').length).toFixed(2) : '0.00'} zł
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>Oszczędności</Typography>
                  <Typography variant="h5" sx={{ 
                    color: balance >= 0 ? '#1db954' : '#ff6b6b', 
                    fontWeight: 700 
                  }}>
                    {balance >= 0 ? '+' : ''}{balance.toFixed(2)} zł
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardView;

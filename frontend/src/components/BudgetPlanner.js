import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import dayjs from 'dayjs';

function BudgetPlanner({ transactions, categories, onUpdateCategories }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState('');

  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  // Pobieranie transakcji z bieżącego miesiąca
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = dayjs(t.date);
    return transactionDate.month() === currentMonth && transactionDate.year() === currentYear;
  });

  // Obliczanie wydatków dla każdej kategorii w bieżącym miesiącu
  const getCategorySpending = (categoryName) => {
    return currentMonthTransactions
      .filter(t => t.type === 'expense' && t.category === categoryName)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Pobieranie kategorii wydatków z budżetami
  const expenseCategories = categories.filter(cat => cat.type === 'expense' && cat.budget > 0);

  // Obliczanie ogólnych statystyk budżetu
  const totalBudget = expenseCategories.reduce((sum, cat) => sum + (cat.budget || 0), 0);
  const totalSpent = expenseCategories.reduce((sum, cat) => sum + getCategorySpending(cat.name), 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleOpenDialog = (category) => {
    setSelectedCategory(category);
    setBudgetAmount(category.budget ? category.budget.toString() : '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    setBudgetAmount('');
  };

  const handleSaveBudget = () => {
    if (!selectedCategory || !budgetAmount) return;

    const updatedCategories = categories.map(cat => 
      cat.id === selectedCategory.id 
        ? { ...cat, budget: parseFloat(budgetAmount) }
        : cat
    );

    onUpdateCategories(updatedCategories);
    handleCloseDialog();
  };

  const getBudgetStatus = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return { status: 'over', color: '#ff6b6b', icon: <Cancel /> };
    if (percentage >= 80) return { status: 'warning', color: '#f9ca24', icon: <Warning /> };
    return { status: 'good', color: '#1db954', icon: <CheckCircle /> };
  };

  const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
          Planowanie budżetu
        </Typography>
        <Typography variant="h6" sx={{ color: '#b3b3b3', fontWeight: 400 }}>
          {monthNames[currentMonth]} {currentYear}
        </Typography>
      </Box>

      {/* Ogólne podsumowanie budżetu */}
      <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333', mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: '#1db954', mx: 'auto', mb: 1, width: 56, height: 56 }}>
                  <TrendingUp fontSize="large" />
                </Avatar>
                <Typography variant="h5" sx={{ color: '#1db954', fontWeight: 700 }}>
                  {totalBudget.toFixed(0)} zł
                </Typography>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  Całkowity budżet
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: '#ff6b6b', mx: 'auto', mb: 1, width: 56, height: 56 }}>
                  <TrendingDown fontSize="large" />
                </Avatar>
                <Typography variant="h5" sx={{ color: '#ff6b6b', fontWeight: 700 }}>
                  {totalSpent.toFixed(0)} zł
                </Typography>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  Wydano
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: budgetUtilization >= 100 ? '#ff6b6b' : budgetUtilization >= 80 ? '#f9ca24' : '#1db954',
                  mx: 'auto', 
                  mb: 1, 
                  width: 56, 
                  height: 56 
                }}>
                  {budgetUtilization >= 100 ? <Cancel fontSize="large" /> : 
                   budgetUtilization >= 80 ? <Warning fontSize="large" /> : 
                   <CheckCircle fontSize="large" />}
                </Avatar>
                <Typography variant="h5" sx={{ 
                  color: budgetUtilization >= 100 ? '#ff6b6b' : budgetUtilization >= 80 ? '#f9ca24' : '#1db954',
                  fontWeight: 700 
                }}>
                  {budgetUtilization.toFixed(1)}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  Wykorzystanie
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Progress bar ogólny */}
          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(budgetUtilization, 100)}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: '#333',
                '& .MuiLinearProgress-bar': {
                  bgcolor: budgetUtilization >= 100 ? '#ff6b6b' : budgetUtilization >= 80 ? '#f9ca24' : '#1db954',
                  borderRadius: 6,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                Pozostało: {Math.max(0, totalBudget - totalSpent).toFixed(0)} zł
              </Typography>
              <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                {totalBudget.toFixed(0)} zł
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Alerty budżetowe */}
      {expenseCategories.some(cat => {
        const spent = getCategorySpending(cat.name);
        return spent >= cat.budget;
      }) && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3, bgcolor: '#2a1f0a', borderColor: '#f9ca24', color: '#f9ca24' }}
        >
          Uwaga! Przekroczono budżet w niektórych kategoriach.
        </Alert>
      )}

      {/* Kategorie z budżetami */}
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 3 }}>
        Budżety kategorii ({expenseCategories.length})
      </Typography>

      <Grid container spacing={3}>
        {expenseCategories.map((category) => {
          const spent = getCategorySpending(category.name);
          const budget = category.budget || 0;
          const percentage = budget > 0 ? (spent / budget) * 100 : 0;
          const budgetStatus = getBudgetStatus(spent, budget);

          return (
            <Grid item xs={12} md={6} key={category.id}>
              <Card sx={{ 
                bgcolor: '#232323', 
                borderRadius: 3, 
                border: `1px solid ${percentage >= 100 ? '#ff6b6b' : percentage >= 80 ? '#f9ca24' : '#333'}`,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: budgetStatus.color, width: 32, height: 32 }}>
                        {budgetStatus.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={() => handleOpenDialog(category)}
                      sx={{ color: '#b3b3b3' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                        Wydano: {spent.toFixed(2)} zł
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                        Budżet: {budget.toFixed(2)} zł
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(percentage, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: '#333',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: budgetStatus.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ color: budgetStatus.color, fontWeight: 600 }}>
                        {percentage.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                        Pozostało: {Math.max(0, budget - spent).toFixed(2)} zł
                      </Typography>
                    </Box>
                  </Box>

                  {percentage >= 100 && (
                    <Chip
                      label={`Przekroczono o ${(spent - budget).toFixed(2)} zł`}
                      size="small"
                      sx={{ bgcolor: '#ff6b6b', color: '#fff', fontSize: '0.75rem' }}
                    />
                  )}
                  {percentage >= 80 && percentage < 100 && (
                    <Chip
                      label="Zbliżasz się do limitu"
                      size="small"
                      sx={{ bgcolor: '#f9ca24', color: '#000', fontSize: '0.75rem' }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}

        {/* Kategorie bez budżetu */}
        {categories.filter(cat => cat.type === 'expense' && (!cat.budget || cat.budget === 0)).map((category) => (
          <Grid item xs={12} md={6} key={category.id}>
            <Card sx={{ 
              bgcolor: '#1a1a1a', 
              borderRadius: 3, 
              border: '1px dashed #333',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#232323',
                borderColor: '#1db954',
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: '#b3b3b3', mb: 2 }}>
                  {category.name}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog(category)}
                  sx={{ 
                    borderColor: '#1db954', 
                    color: '#1db954',
                    '&:hover': { bgcolor: 'rgba(29,185,84,0.1)' }
                  }}
                >
                  Ustaw budżet
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog ustawiania budżetu */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#232323', color: '#fff' }}>
          Ustaw budżet dla kategorii: {selectedCategory?.name}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#232323', color: '#fff' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Budżet miesięczny (zł)"
            fullWidth
            variant="outlined"
            type="number"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': { color: '#fff' },
              '& .MuiInputLabel-root': { color: '#b3b3b3' }
            }}
          />
          <Typography variant="body2" sx={{ color: '#b3b3b3', mt: 2 }}>
            Ustaw miesięczny limit wydatków dla tej kategorii. Otrzymasz powiadomienia gdy zbliżysz się do limitu.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#232323' }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#b3b3b3' }}>
            Anuluj
          </Button>
          <Button onClick={handleSaveBudget} variant="contained" sx={{ bgcolor: '#1db954' }}>
            Zapisz budżet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BudgetPlanner;

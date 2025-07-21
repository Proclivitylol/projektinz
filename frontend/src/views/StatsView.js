import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  LinearProgress, 
  Chip,
  Avatar,
  Button,
  ButtonGroup,
  Divider 
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Timeline,
  CompareArrows
} from '@mui/icons-material';
import dayjs from 'dayjs';
import HistoryTrends from '../components/HistoryTrends';

const COLORS = ['#1db954', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];

function StatsView({ transactions }) {
  const [timeRange, setTimeRange] = useState('6months'); // 3months, 6months, 1year, all
  
  const monthNames = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
  
  // Filtrowanie transakcji według zakresu czasu
  const getFilteredTransactions = () => {
    const now = dayjs();
    let startDate;
    
    switch(timeRange) {
      case '3months':
        startDate = now.subtract(3, 'month');
        break;
      case '6months':
        startDate = now.subtract(6, 'month');
        break;
      case '1year':
        startDate = now.subtract(1, 'year');
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(t => dayjs(t.date).isAfter(startDate));
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  // Dane do wykresu kołowego wydatków
  const expenseData = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const cat = t.category || 'Inne';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {});
  const pieData = Object.keys(expenseData).map((cat) => ({ name: cat, value: expenseData[cat] }));
  
  // Dane do wykresu trendów (miesięczne)
  const getTrendData = () => {
    const monthsData = {};
    
    filteredTransactions.forEach(t => {
      const monthKey = dayjs(t.date).format('YYYY-MM');
      if (!monthsData[monthKey]) {
        monthsData[monthKey] = { income: 0, expense: 0, month: dayjs(t.date).format('MMM YY') };
      }
      
      if (t.type === 'income') {
        monthsData[monthKey].income += t.amount;
      } else {
        monthsData[monthKey].expense += t.amount;
      }
    });
    
    return Object.values(monthsData).sort((a, b) => a.month.localeCompare(b.month));
  };
  
  const trendData = getTrendData();
  
  // Top kategorie z progress barami
  const getTopCategories = () => {
    const categoryData = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const cat = t.category || 'Inne';
        if (!acc[cat]) {
          acc[cat] = { name: cat, amount: 0, count: 0 };
        }
        acc[cat].amount += t.amount;
        acc[cat].count += 1;
        return acc;
      }, {});
    
    const maxAmount = Math.max(...Object.values(categoryData).map(c => c.amount));
    
    return Object.values(categoryData)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8)
      .map(cat => ({ ...cat, percentage: (cat.amount / maxAmount) * 100 }));
  };
  
  const topCategories = getTopCategories();
  
  // Statystyki ogólne
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const avgMonthlyIncome = trendData.length > 0 ? totalIncome / trendData.length : 0;
  const avgMonthlyExpense = trendData.length > 0 ? totalExpense / trendData.length : 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  
  // Porównanie rok do roku
  const getYearComparison = () => {
    const currentYear = dayjs().year();
    const lastYear = currentYear - 1;
    
    const currentYearData = transactions.filter(t => dayjs(t.date).year() === currentYear);
    const lastYearData = transactions.filter(t => dayjs(t.date).year() === lastYear);
    
    const currentYearIncome = currentYearData.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const currentYearExpense = currentYearData.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const lastYearIncome = lastYearData.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const lastYearExpense = lastYearData.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      currentYear: { income: currentYearIncome, expense: currentYearExpense },
      lastYear: { income: lastYearIncome, expense: lastYearExpense },
      incomeChange: lastYearIncome > 0 ? ((currentYearIncome - lastYearIncome) / lastYearIncome) * 100 : 0,
      expenseChange: lastYearExpense > 0 ? ((currentYearExpense - lastYearExpense) / lastYearExpense) * 100 : 0,
    };
  };
  
  const yearComparison = getYearComparison();

  return (
    <Box sx={{ py: 4 }}>
      {/* Header z filtrem czasu */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
          Szczegółowe statystyki
        </Typography>
        <ButtonGroup variant="outlined" size="small">
          <Button 
            onClick={() => setTimeRange('3months')}
            variant={timeRange === '3months' ? 'contained' : 'outlined'}
            sx={{ color: timeRange === '3months' ? '#000' : '#1db954', bgcolor: timeRange === '3months' ? '#1db954' : 'transparent' }}
          >
            3M
          </Button>
          <Button 
            onClick={() => setTimeRange('6months')}
            variant={timeRange === '6months' ? 'contained' : 'outlined'}
            sx={{ color: timeRange === '6months' ? '#000' : '#1db954', bgcolor: timeRange === '6months' ? '#1db954' : 'transparent' }}
          >
            6M
          </Button>
          <Button 
            onClick={() => setTimeRange('1year')}
            variant={timeRange === '1year' ? 'contained' : 'outlined'}
            sx={{ color: timeRange === '1year' ? '#000' : '#1db954', bgcolor: timeRange === '1year' ? '#1db954' : 'transparent' }}
          >
            1R
          </Button>
          <Button 
            onClick={() => setTimeRange('all')}
            variant={timeRange === 'all' ? 'contained' : 'outlined'}
            sx={{ color: timeRange === 'all' ? '#000' : '#1db954', bgcolor: timeRange === 'all' ? '#1db954' : 'transparent' }}
          >
            Wszystko
          </Button>
        </ButtonGroup>
      </Box>
      
      {/* Kluczowe metryki */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#1db954', mx: 'auto', mb: 1 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h6" sx={{ color: '#1db954', fontWeight: 700 }}>
                {totalIncome.toFixed(0)} zł
              </Typography>
              <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                Łączne przychody
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#ff6b6b', mx: 'auto', mb: 1 }}>
                <TrendingDown />
              </Avatar>
              <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 700 }}>
                {totalExpense.toFixed(0)} zł
              </Typography>
              <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                Łączne wydatki
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#4ecdc4', mx: 'auto', mb: 1 }}>
                <Assessment />
              </Avatar>
              <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 700 }}>
                {savingsRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                Stopa oszczędności
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#45b7d1', mx: 'auto', mb: 1 }}>
                <Timeline />
              </Avatar>
              <Typography variant="h6" sx={{ color: '#45b7d1', fontWeight: 700 }}>
                {filteredTransactions.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                Transakcji
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        {/* Wykresy obok siebie na desktop */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 600 }}>
                Trendy finansowe
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#b3b3b3" />
                  <YAxis stroke="#b3b3b3" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#333', border: '1px solid #555', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value, name) => [`${value.toFixed(2)} zł`, name === 'income' ? 'Przychody' : 'Wydatki']}
                  />
                  <Legend formatter={(value) => value === 'income' ? 'Przychody' : 'Wydatki'} />
                  <Area type="monotone" dataKey="income" stackId="1" stroke="#1db954" fill="#1db954" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="expense" stackId="2" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Wykres kołowy wydatków */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 600 }}>
                Podział wydatków
              </Typography>
              {pieData.length === 0 ? (
                <Typography color="text.secondary">Brak wydatków do analizy.</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                    >
                      {pieData.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v.toFixed(2)} zł`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Top kategorie z progress barami */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: '#fff', fontWeight: 600 }}>
                Top kategorie wydatków
              </Typography>
              {topCategories.map((category, index) => (
                <Box key={category.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                      {category.amount.toFixed(2)} zł ({category.count} transakcji)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={category.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#333',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: COLORS[index % COLORS.length],
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Porównanie rok do roku */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#f9ca24', mr: 2 }}>
                  <CompareArrows />
                </Avatar>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  Porównanie rok do roku
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>Przychody</Typography>
                  <Typography variant="h6" sx={{ color: '#1db954', fontWeight: 700, mb: 1 }}>
                    {yearComparison.currentYear.income.toFixed(0)} zł
                  </Typography>
                  <Chip
                    size="small"
                    label={`${yearComparison.incomeChange >= 0 ? '+' : ''}${yearComparison.incomeChange.toFixed(1)}%`}
                    sx={{
                      bgcolor: yearComparison.incomeChange >= 0 ? '#1db954' : '#ff6b6b',
                      color: '#fff',
                      fontSize: '0.75rem',
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>Wydatki</Typography>
                  <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 700, mb: 1 }}>
                    {yearComparison.currentYear.expense.toFixed(0)} zł
                  </Typography>
                  <Chip
                    size="small"
                    label={`${yearComparison.expenseChange >= 0 ? '+' : ''}${yearComparison.expenseChange.toFixed(1)}%`}
                    sx={{
                      bgcolor: yearComparison.expenseChange <= 0 ? '#1db954' : '#ff6b6b',
                      color: '#fff',
                      fontSize: '0.75rem',
                    }}
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2, bgcolor: '#333' }} />
              
              <Typography variant="body2" sx={{ color: '#b3b3b3', textAlign: 'center' }}>
                Średnie miesięczne: {avgMonthlyIncome.toFixed(0)} zł przychodów, {avgMonthlyExpense.toFixed(0)} zł wydatków
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Historia i trendy */}
      <Box sx={{ mt: 4 }}>
        <HistoryTrends transactions={transactions} />
      </Box>
    </Box>
  );
}

export default StatsView;

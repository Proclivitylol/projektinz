import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Timeline,
  Insights,
  Analytics,
  History,
} from '@mui/icons-material';
import dayjs from 'dayjs';

function HistoryTrends({ transactions }) {
  const [timeRange, setTimeRange] = useState('1year'); // 6months, 1year, 2years, all
  const [viewType, setViewType] = useState('trends'); // trends, patterns, forecast, summary

  // Filtrowanie transakcji według zakresu czasu
  const getFilteredTransactions = () => {
    const now = dayjs();
    let startDate;
    
    switch(timeRange) {
      case '6months':
        startDate = now.subtract(6, 'month');
        break;
      case '1year':
        startDate = now.subtract(1, 'year');
        break;
      case '2years':
        startDate = now.subtract(2, 'year');
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(t => dayjs(t.date).isAfter(startDate));
  };

  const filteredTransactions = getFilteredTransactions();

  // Dane historyczne (miesięczne)
  const getHistoricalData = () => {
    const monthsData = {};
    
    filteredTransactions.forEach(t => {
      const monthKey = dayjs(t.date).format('YYYY-MM');
      const monthLabel = dayjs(t.date).format('MMM YYYY');
      
      if (!monthsData[monthKey]) {
        monthsData[monthKey] = { 
          month: monthLabel,
          income: 0, 
          expense: 0,
          balance: 0,
          transactions: 0,
          avgTransaction: 0
        };
      }
      
      monthsData[monthKey].transactions += 1;
      
      if (t.type === 'income') {
        monthsData[monthKey].income += t.amount;
      } else {
        monthsData[monthKey].expense += t.amount;
      }
    });
    
    // Obliczanie balansu i średnich
    return Object.values(monthsData)
      .map(month => ({
        ...month,
        balance: month.income - month.expense,
        avgTransaction: month.transactions > 0 ? (month.income + month.expense) / month.transactions : 0,
        savingsRate: month.income > 0 ? ((month.income - month.expense) / month.income) * 100 : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const historicalData = getHistoricalData();

  // Analiza wzorców wydatków
  const getSpendingPatterns = () => {
    const categoryPatterns = {};
    const monthlyPatterns = {};
    
    filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
      const category = t.category || 'Inne';
      const month = dayjs(t.date).month();
      
      // Wzorce kategorii
      if (!categoryPatterns[category]) {
        categoryPatterns[category] = { total: 0, count: 0, months: new Set() };
      }
      categoryPatterns[category].total += t.amount;
      categoryPatterns[category].count += 1;
      categoryPatterns[category].months.add(dayjs(t.date).format('YYYY-MM'));
      
      // Wzorce miesięczne
      if (!monthlyPatterns[month]) {
        monthlyPatterns[month] = 0;
      }
      monthlyPatterns[month] += t.amount;
    });
    
    return {
      categories: Object.entries(categoryPatterns).map(([name, data]) => ({
        name,
        total: data.total,
        average: data.total / data.months.size,
        frequency: data.count,
        consistency: data.months.size
      })).sort((a, b) => b.total - a.total),
      
      monthlyTrends: Object.entries(monthlyPatterns).map(([month, amount]) => ({
        month: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'][parseInt(month)],
        amount
      }))
    };
  };

  const patterns = getSpendingPatterns();

  // Prognoza na podstawie trendów
  const getForecast = () => {
    if (historicalData.length < 3) return [];
    
    const recentData = historicalData.slice(-6); // Ostatnie 6 miesięcy
    const avgIncome = recentData.reduce((sum, d) => sum + d.income, 0) / recentData.length;
    const avgExpense = recentData.reduce((sum, d) => sum + d.expense, 0) / recentData.length;
    
    // Trend liniowy
    const incomeGrowth = recentData.length > 1 ? 
      (recentData[recentData.length - 1].income - recentData[0].income) / (recentData.length - 1) : 0;
    const expenseGrowth = recentData.length > 1 ? 
      (recentData[recentData.length - 1].expense - recentData[0].expense) / (recentData.length - 1) : 0;
    
    const forecast = [];
    for (let i = 1; i <= 6; i++) {
      const futureDate = dayjs().add(i, 'month');
      forecast.push({
        month: futureDate.format('MMM YYYY'),
        predictedIncome: Math.max(0, avgIncome + (incomeGrowth * i)),
        predictedExpense: Math.max(0, avgExpense + (expenseGrowth * i)),
        confidence: Math.max(20, 90 - (i * 10)) // Malejąca pewność
      });
    }
    
    return forecast.map(f => ({
      ...f,
      predictedBalance: f.predictedIncome - f.predictedExpense
    }));
  };

  const forecast = getForecast();

  // Kluczowe insights
  const getInsights = () => {
    if (historicalData.length === 0) return [];
    
    const insights = [];
    const avgBalance = historicalData.reduce((sum, d) => sum + d.balance, 0) / historicalData.length;
    const lastMonthBalance = historicalData[historicalData.length - 1]?.balance || 0;
    const trend = lastMonthBalance > avgBalance ? 'positive' : 'negative';
    
    // Trend finansowy
    insights.push({
      type: trend,
      title: trend === 'positive' ? 'Pozytywny trend finansowy' : 'Uwaga na wydatki',
      description: trend === 'positive' 
        ? `Twój bilans poprawił się o ${((lastMonthBalance - avgBalance) / Math.abs(avgBalance) * 100).toFixed(1)}% względem średniej`
        : `Twój bilans spadł o ${((avgBalance - lastMonthBalance) / Math.abs(avgBalance) * 100).toFixed(1)}% względem średniej`,
      icon: trend === 'positive' ? <TrendingUp /> : <TrendingDown />,
      color: trend === 'positive' ? '#1db954' : '#ff6b6b'
    });
    
    // Najwyższa kategoria wydatków
    if (patterns.categories.length > 0) {
      const topCategory = patterns.categories[0];
      insights.push({
        type: 'info',
        title: 'Główna kategoria wydatków',
        description: `${topCategory.name}: ${topCategory.total.toFixed(0)} zł (średnio ${topCategory.average.toFixed(0)} zł/miesiąc)`,
        icon: <Insights />,
        color: '#45b7d1'
      });
    }
    
    // Prognoza
    if (forecast.length > 0) {
      const nextMonthForecast = forecast[0];
      insights.push({
        type: nextMonthForecast.predictedBalance >= 0 ? 'positive' : 'warning',
        title: 'Prognoza na przyszły miesiąc',
        description: `Przewidywany bilans: ${nextMonthForecast.predictedBalance.toFixed(0)} zł (pewność: ${nextMonthForecast.confidence}%)`,
        icon: <Analytics />,
        color: nextMonthForecast.predictedBalance >= 0 ? '#1db954' : '#f9ca24'
      });
    }
    
    return insights;
  };

  const insights = getInsights();

  const renderTrendsView = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 600 }}>
              Trendy finansowe w czasie
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#b3b3b3" />
                <YAxis stroke="#b3b3b3" />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value.toFixed(2)} zł`, 
                    name === 'income' ? 'Przychody' : 
                    name === 'expense' ? 'Wydatki' : 
                    name === 'balance' ? 'Bilans' : 'Stopa oszczędności'
                  ]}
                  labelStyle={{ color: '#000' }}
                  contentStyle={{ backgroundColor: '#232323', border: '1px solid #444' }}
                />
                <Legend />
                <Bar dataKey="income" fill="#1db954" name="income" />
                <Bar dataKey="expense" fill="#ff6b6b" name="expense" />
                <Line type="monotone" dataKey="balance" stroke="#45b7d1" strokeWidth={3} name="balance" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderPatternsView = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 600 }}>
              Wzorce wydatków według kategorii
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#b3b3b3' }}>Kategoria</TableCell>
                    <TableCell sx={{ color: '#b3b3b3' }}>Łącznie</TableCell>
                    <TableCell sx={{ color: '#b3b3b3' }}>Średnio/miesiąc</TableCell>
                    <TableCell sx={{ color: '#b3b3b3' }}>Częstotliwość</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patterns.categories.slice(0, 8).map((category) => (
                    <TableRow key={category.name}>
                      <TableCell sx={{ color: '#fff' }}>{category.name}</TableCell>
                      <TableCell sx={{ color: '#ff6b6b' }}>{category.total.toFixed(2)} zł</TableCell>
                      <TableCell sx={{ color: '#b3b3b3' }}>{category.average.toFixed(2)} zł</TableCell>
                      <TableCell sx={{ color: '#b3b3b3' }}>{category.frequency} transakcji</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 600 }}>
              Sezonowość wydatków
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patterns.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#b3b3b3" />
                <YAxis stroke="#b3b3b3" />
                <Tooltip formatter={(v) => [`${v.toFixed(2)} zł`, 'Wydatki']} />
                <Bar dataKey="amount" fill="#f9ca24" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderForecastView = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 600 }}>
              Prognoza finansowa (6 miesięcy)
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#b3b3b3" />
                <YAxis stroke="#b3b3b3" />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value.toFixed(2)} zł`, 
                    name === 'predictedIncome' ? 'Przewidywane przychody' : 
                    name === 'predictedExpense' ? 'Przewidywane wydatki' : 'Przewidywany bilans'
                  ]}
                />
                <Legend />
                <Area type="monotone" dataKey="predictedIncome" stackId="1" stroke="#1db954" fill="#1db954" fillOpacity={0.3} />
                <Area type="monotone" dataKey="predictedExpense" stackId="2" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
            <Typography variant="body2" sx={{ color: '#b3b3b3', mt: 2, textAlign: 'center' }}>
              * Prognoza oparta na trendach z ostatnich miesięcy. Dokładność maleje z czasem.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSummaryView = () => (
    <Grid container spacing={3}>
      {insights.map((insight, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card sx={{ 
            bgcolor: '#232323', 
            borderRadius: 3, 
            border: `1px solid ${insight.color}`,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: insight.color, mr: 2 }}>
                  {insight.icon}
                </Avatar>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  {insight.title}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                {insight.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      
      {/* Podsumowanie statystyk */}
      <Grid item xs={12}>
        <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#fff', fontWeight: 600 }}>
              Podsumowanie historyczne
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: '#1db954', mx: 'auto', mb: 1 }}>
                    <History />
                  </Avatar>
                  <Typography variant="h5" sx={{ color: '#1db954', fontWeight: 700 }}>
                    {historicalData.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                    Miesięcy danych
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: '#45b7d1', mx: 'auto', mb: 1 }}>
                    <Timeline />
                  </Avatar>
                  <Typography variant="h5" sx={{ color: '#45b7d1', fontWeight: 700 }}>
                    {filteredTransactions.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                    Transakcji
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: '#f9ca24', mx: 'auto', mb: 1 }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h5" sx={{ color: '#f9ca24', fontWeight: 700 }}>
                    {historicalData.length > 0 ? 
                      (historicalData.reduce((sum, d) => sum + d.income, 0) / historicalData.length).toFixed(0) : 0} zł
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                    Średni przychód
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: '#ff6b6b', mx: 'auto', mb: 1 }}>
                    <TrendingDown />
                  </Avatar>
                  <Typography variant="h5" sx={{ color: '#ff6b6b', fontWeight: 700 }}>
                    {historicalData.length > 0 ? 
                      (historicalData.reduce((sum, d) => sum + d.expense, 0) / historicalData.length).toFixed(0) : 0} zł
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                    Średni wydatek
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      {/* Header z kontrolkami */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
            Historia i trendy
          </Typography>
          <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
            Analiza długoterminowa i prognozy
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <ButtonGroup variant="outlined" size="small">
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
              onClick={() => setTimeRange('2years')}
              variant={timeRange === '2years' ? 'contained' : 'outlined'}
              sx={{ color: timeRange === '2years' ? '#000' : '#1db954', bgcolor: timeRange === '2years' ? '#1db954' : 'transparent' }}
            >
              2R
            </Button>
            <Button 
              onClick={() => setTimeRange('all')}
              variant={timeRange === 'all' ? 'contained' : 'outlined'}
              sx={{ color: timeRange === 'all' ? '#000' : '#1db954', bgcolor: timeRange === 'all' ? '#1db954' : 'transparent' }}
            >
              Wszystko
            </Button>
          </ButtonGroup>
          
          <ButtonGroup variant="outlined" size="small">
            <Button 
              onClick={() => setViewType('trends')}
              variant={viewType === 'trends' ? 'contained' : 'outlined'}
              sx={{ color: viewType === 'trends' ? '#000' : '#45b7d1', bgcolor: viewType === 'trends' ? '#45b7d1' : 'transparent' }}
            >
              Trendy
            </Button>
            <Button 
              onClick={() => setViewType('patterns')}
              variant={viewType === 'patterns' ? 'contained' : 'outlined'}
              sx={{ color: viewType === 'patterns' ? '#000' : '#45b7d1', bgcolor: viewType === 'patterns' ? '#45b7d1' : 'transparent' }}
            >
              Wzorce
            </Button>
            <Button 
              onClick={() => setViewType('forecast')}
              variant={viewType === 'forecast' ? 'contained' : 'outlined'}
              sx={{ color: viewType === 'forecast' ? '#000' : '#45b7d1', bgcolor: viewType === 'forecast' ? '#45b7d1' : 'transparent' }}
            >
              Prognoza
            </Button>
            <Button 
              onClick={() => setViewType('summary')}
              variant={viewType === 'summary' ? 'contained' : 'outlined'}
              sx={{ color: viewType === 'summary' ? '#000' : '#45b7d1', bgcolor: viewType === 'summary' ? '#45b7d1' : 'transparent' }}
            >
              Podsumowanie
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      {/* Renderowanie wybranego widoku */}
      {viewType === 'trends' && renderTrendsView()}
      {viewType === 'patterns' && renderPatternsView()}
      {viewType === 'forecast' && renderForecastView()}
      {viewType === 'summary' && renderSummaryView()}
    </Box>
  );
}

export default HistoryTrends;

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  Paper,
  Badge,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Fade,
  Zoom
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Event,
  TrendingUp,
  TrendingDown,
  Today
} from '@mui/icons-material';
import dayjs from 'dayjs';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarView({ transactions }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');

  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  const getTransactionsForDate = (date) => {
    return transactions.filter(transaction => {
      const transactionDate = dayjs(transaction.date);
      if (filterCategory && transaction.category !== filterCategory) {
        return false;
      }
      return transactionDate.isSame(dayjs(date), 'day');
    });
  };

  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      if (filterCategory && transaction.category !== filterCategory) {
        return false;
      }
      return true;
    });
  };

  const selectedDateTransactions = useMemo(() => {
    if (!selectedDate) return [];
    return transactions.filter(transaction => {
      const transactionDate = dayjs(transaction.date);
      return transactionDate.isSame(dayjs(selectedDate), 'day');
    });
  }, [selectedDate, transactions]);

  return (
    <Box>
      <Card sx={{ 
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
        borderRadius: 4,
        border: '1px solid #333',
        mb: 4,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          p: 3,
          background: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)',
          borderRadius: 3,
          color: '#000',
          boxShadow: '0 8px 32px rgba(29,185,84,0.3)'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            📅 Kalendarz transakcji
          </Typography>
          <TextField
            select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            SelectProps={{ native: true }}
            size="small"
            placeholder="Wybierz kategorię"
            sx={{ 
              minWidth: 180,
              '& .MuiOutlinedInput-root': { 
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#fff' }
              }
            }}
          >
            <option value="">🔍 Filtruj kategorie</option>
            {Array.from(new Set(transactions.map(t => t.category))).filter(Boolean).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </TextField>
        </Box>
      </Card>

      <Card sx={{
        bgcolor: '#1a1a1a',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        '& .react-calendar': {
          width: '100%',
          bgcolor: 'transparent',
          border: 'none',
          fontFamily: 'inherit',
          '& button.react-calendar__tile.react-calendar__tile--neighboringMonth': {
            backgroundColor: '#555 !important',
            color: '#888 !important',
            opacity: '0.5 !important'
          },
          '& .neighboring-month': {
            backgroundColor: '#555 !important',
            color: '#888 !important',
            opacity: '0.5 !important',
            '&:hover': {
              backgroundColor: '#666 !important',
              transform: 'none !important'
            }
          },
          '& .react-calendar__navigation': {
            display: 'flex',
            height: '60px',
            marginBottom: '1rem',
            '& button': {
              minWidth: '44px',
              bgcolor: '#333',
              border: 'none',
              color: '#fff',
              fontSize: '16px',
              borderRadius: '8px',
              margin: '0 4px',
              '&:hover': {
                bgcolor: '#1db954',
                color: '#000'
              },
              '&:disabled': {
                bgcolor: '#555',
                color: '#999'
              }
            },
            '& .react-calendar__navigation__label': {
              fontWeight: 'bold',
              fontSize: '18px',
              flex: 1
            }
          },
          '& .react-calendar__month-view__weekdays': {
            display: 'grid !important',
            gridTemplateColumns: 'repeat(7, 1fr) !important',
            gap: '2px !important',
            marginBottom: '16px !important',
            paddingBottom: '8px !important',
            margin: '0 !important',
            padding: '0 0 8px 0 !important',
            '& .react-calendar__month-view__weekdays__weekday': {
              padding: '12px 0 !important',
              margin: '0 !important',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1db954',
              textAlign: 'center',
              bgcolor: 'rgba(29,185,84,0.1)',
              borderRadius: '4px',
              minHeight: '40px',
              display: 'flex !important',
              alignItems: 'center !important',
              justifyContent: 'center !important',
              width: 'auto !important',
              '& abbr': {
                textDecoration: 'none'
              }
            }
          },
          '& .react-calendar__month-view__days': {
            display: 'grid !important',
            gridTemplateColumns: 'repeat(7, 1fr) !important',
            gap: '2px !important',
            marginTop: '16px !important',
            paddingTop: '8px !important',
            '& .react-calendar__tile': {
              width: 'auto !important',
              height: '80px !important',
              bgcolor: '#2a2a2a',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '4px',
              margin: '0 !important',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: '8px 4px',
              position: 'relative',
              '&:hover': {
                bgcolor: '#444',
                transform: 'scale(1.02)',
                zIndex: 1
              },
              '&.react-calendar__tile--now': {
                bgcolor: '#1db954 !important',
                color: '#000 !important',
                fontWeight: '800',
                boxShadow: '0 0 0 2px #1ed760'
              },
              '&.react-calendar__tile--neighboringMonth': {
                backgroundColor: '#555 !important',
                color: '#888 !important',
                opacity: '0.5 !important',
                '&:hover': {
                  backgroundColor: '#666 !important',
                  transform: 'none !important'
                }
              },
              '&.react-calendar__tile--hasActive': {
                bgcolor: '#1db954',
                color: '#000'
              }
            }
          }
        }
      }}>
        <CardContent sx={{ p: 4 }}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            locale="pl-PL"
            calendarType="iso8601"
            fixedWeekNumber={6}
            tileClassName={({ date, view }) => {
              if (view === 'month') {
                const currentMonth = selectedDate.getMonth();
                const tileMonth = date.getMonth();
                if (tileMonth !== currentMonth) {
                  return 'neighboring-month';
                }
              }
              return null;
            }}
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const dayTransactions = getFilteredTransactions().filter(t => 
                  dayjs(t.date).isSame(dayjs(date), 'day')
                );
                
                if (dayTransactions.length > 0) {
                  const income = dayTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);
                  const expense = dayTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                  
                  return (
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: 2,
                      left: 2,
                      right: 2,
                      fontSize: '10px',
                      textAlign: 'center'
                    }}>
                      {income > 0 && (
                        <div style={{ color: '#1db954', fontWeight: 'bold' }}>
                          +{income.toFixed(0)}
                        </div>
                      )}
                      {expense > 0 && (
                        <div style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                          -{expense.toFixed(0)}
                        </div>
                      )}
                    </Box>
                  );
                }
              }
              return null;
            }}
            onClickDay={(date) => {
              const dayTransactions = getFilteredTransactions().filter(t => 
                dayjs(t.date).isSame(dayjs(date), 'day')
              );
              if (dayTransactions.length > 0) {
                setSelectedDate(dayjs(date));
                setOpenDetailsDialog(true);
              }
            }}
          />
        </CardContent>
      </Card>

      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#232323', color: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event />
            <Typography variant="h6">
              {selectedDate && dayjs(selectedDate).format('DD MMMM YYYY')}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#232323', color: '#fff', p: 0 }}>
          <List>
            {selectedDateTransactions.map((transaction, index) => (
              <ListItem key={index} sx={{ borderBottom: '1px solid #333' }}>
                <ListItemAvatar>
                  <Avatar sx={{
                    bgcolor: transaction.type === 'income' ? '#1db954' : '#ff6b6b',
                    width: 32,
                    height: 32,
                  }}>
                    {transaction.type === 'income' ? <TrendingUp /> : <TrendingDown />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: '#fff' }}>
                        {transaction.description || transaction.category}
                      </Typography>
                      <Typography
                        sx={{
                          color: transaction.type === 'income' ? '#1db954' : '#ff6b6b',
                          fontWeight: 700,
                        }}
                      >
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} zł
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography sx={{ color: '#b3b3b3' }}>
                      {transaction.category}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default CalendarView;

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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Savings,
  TrendingUp,
  CheckCircle,
  Schedule,
  AttachMoney,
} from '@mui/icons-material';
import dayjs from 'dayjs';

function SavingsGoals({ transactions }) {
  const [goals, setGoals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalData, setGoalData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'savings',
    description: '',
  });

  // Ładowanie celów z localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('budgetify-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Zapisywanie celów do localStorage
  const saveGoals = (updatedGoals) => {
    setGoals(updatedGoals);
    localStorage.setItem('budgetify-goals', JSON.stringify(updatedGoals));
  };

  const handleOpenDialog = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setGoalData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: goal.targetDate,
        category: goal.category,
        description: goal.description || '',
      });
    } else {
      setEditingGoal(null);
      setGoalData({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        targetDate: dayjs().add(1, 'year').format('YYYY-MM-DD'),
        category: 'savings',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGoal(null);
    setGoalData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      category: 'savings',
      description: '',
    });
  };

  const handleSaveGoal = () => {
    if (!goalData.name.trim() || !goalData.targetAmount) return;

    const newGoal = {
      id: editingGoal ? editingGoal.id : Date.now(),
      name: goalData.name.trim(),
      targetAmount: parseFloat(goalData.targetAmount),
      currentAmount: parseFloat(goalData.currentAmount) || 0,
      targetDate: goalData.targetDate,
      category: goalData.category,
      description: goalData.description.trim(),
      createdAt: editingGoal ? editingGoal.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedGoals;
    if (editingGoal) {
      updatedGoals = goals.map(goal => 
        goal.id === editingGoal.id ? newGoal : goal
      );
    } else {
      updatedGoals = [...goals, newGoal];
    }

    saveGoals(updatedGoals);
    handleCloseDialog();
  };

  const handleDeleteGoal = (goalId) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
  };

  const handleAddMoney = (goalId, amount) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: goal.currentAmount + amount, updatedAt: new Date().toISOString() }
        : goal
    );
    saveGoals(updatedGoals);
  };

  const getGoalStatus = (goal) => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    const daysLeft = dayjs(goal.targetDate).diff(dayjs(), 'day');
    
    if (percentage >= 100) {
      return { status: 'completed', color: '#1db954', text: 'Ukończone!', icon: <CheckCircle /> };
    }
    
    if (daysLeft < 0) {
      return { status: 'overdue', color: '#ff6b6b', text: 'Przekroczono termin', icon: <Schedule /> };
    }
    
    if (daysLeft <= 30) {
      return { status: 'urgent', color: '#f9ca24', text: `${daysLeft} dni pozostało`, icon: <Schedule /> };
    }
    
    return { status: 'active', color: '#45b7d1', text: `${daysLeft} dni pozostało`, icon: <Schedule /> };
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'vacation': return '🏖️';
      case 'car': return '🚗';
      case 'house': return '🏠';
      case 'education': return '🎓';
      case 'emergency': return '🚨';
      case 'investment': return '📈';
      default: return '💰';
    }
  };

  const categories = [
    { value: 'savings', label: 'Oszczędności' },
    { value: 'vacation', label: 'Wakacje' },
    { value: 'car', label: 'Samochód' },
    { value: 'house', label: 'Dom/Mieszkanie' },
    { value: 'education', label: 'Edukacja' },
    { value: 'emergency', label: 'Fundusz awaryjny' },
    { value: 'investment', label: 'Inwestycje' },
    { value: 'other', label: 'Inne' },
  ];

  // Obliczenia ogólne
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
            Cele finansowe
          </Typography>
          <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
            Planuj i oszczędzaj na większe wydatki
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#1db954', '&:hover': { bgcolor: '#1ed760' } }}
        >
          Nowy cel
        </Button>
      </Box>

      {/* Ogólne podsumowanie */}
      <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333', mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: '#1db954', mx: 'auto', mb: 1, width: 56, height: 56 }}>
                  <Savings fontSize="large" />
                </Avatar>
                <Typography variant="h5" sx={{ color: '#1db954', fontWeight: 700 }}>
                  {goals.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  Aktywnych celów
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: '#45b7d1', mx: 'auto', mb: 1, width: 56, height: 56 }}>
                  <AttachMoney fontSize="large" />
                </Avatar>
                <Typography variant="h5" sx={{ color: '#45b7d1', fontWeight: 700 }}>
                  {totalCurrentAmount.toFixed(0)} zł
                </Typography>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  Zaoszczędzono
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: '#f9ca24', mx: 'auto', mb: 1, width: 56, height: 56 }}>
                  <TrendingUp fontSize="large" />
                </Avatar>
                <Typography variant="h5" sx={{ color: '#f9ca24', fontWeight: 700 }}>
                  {totalTargetAmount.toFixed(0)} zł
                </Typography>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  Cel łączny
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: '#6c5ce7', mx: 'auto', mb: 1, width: 56, height: 56 }}>
                  <CheckCircle fontSize="large" />
                </Avatar>
                <Typography variant="h5" sx={{ color: '#6c5ce7', fontWeight: 700 }}>
                  {completedGoals}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  Ukończone
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Ogólny progress bar */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                Ogólny postęp
              </Typography>
              <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                {overallProgress.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(overallProgress, 100)}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: '#333',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#1db954',
                  borderRadius: 6,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Lista celów */}
      {goals.length === 0 ? (
        <Card sx={{ bgcolor: '#1a1a1a', borderRadius: 3, border: '1px dashed #333' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Avatar sx={{ bgcolor: '#333', mx: 'auto', mb: 2, width: 64, height: 64 }}>
              <Savings fontSize="large" />
            </Avatar>
            <Typography variant="h6" sx={{ color: '#b3b3b3', mb: 2 }}>
              Brak celów finansowych
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              Zacznij oszczędzać na swoje marzenia! Dodaj pierwszy cel finansowy.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ bgcolor: '#1db954', '&:hover': { bgcolor: '#1ed760' } }}
            >
              Dodaj pierwszy cel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {goals.map((goal) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const status = getGoalStatus(goal);
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <Grid item xs={12} md={6} key={goal.id}>
                <Card sx={{ 
                  bgcolor: '#232323', 
                  borderRadius: 3, 
                  border: `1px solid ${status.color}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h4" sx={{ mr: 1 }}>
                          {getCategoryIcon(goal.category)}
                        </Typography>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                            {goal.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                            {goal.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          onClick={() => handleOpenDialog(goal)}
                          sx={{ color: '#b3b3b3' }}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteGoal(goal.id)}
                          sx={{ color: '#ff6b6b' }}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                          {goal.currentAmount.toFixed(2)} zł / {goal.targetAmount.toFixed(2)} zł
                        </Typography>
                        <Typography variant="body2" sx={{ color: status.color, fontWeight: 600 }}>
                          {percentage.toFixed(1)}%
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
                            bgcolor: status.color,
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip
                        icon={status.icon}
                        label={status.text}
                        size="small"
                        sx={{ bgcolor: status.color, color: status.status === 'urgent' ? '#000' : '#fff' }}
                      />
                      <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                        Pozostało: {remaining.toFixed(2)} zł
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          const amount = prompt('Ile chcesz dodać?');
                          if (amount && !isNaN(amount)) {
                            handleAddMoney(goal.id, parseFloat(amount));
                          }
                        }}
                        sx={{ 
                          borderColor: '#1db954', 
                          color: '#1db954',
                          '&:hover': { bgcolor: 'rgba(29,185,84,0.1)' }
                        }}
                      >
                        Dodaj środki
                      </Button>
                      <Typography variant="caption" sx={{ color: '#b3b3b3', alignSelf: 'center', ml: 1 }}>
                        Cel: {dayjs(goal.targetDate).format('DD.MM.YYYY')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Dialog dodawania/edycji celu */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#232323', color: '#fff' }}>
          {editingGoal ? 'Edytuj cel finansowy' : 'Nowy cel finansowy'}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#232323', color: '#fff' }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                label="Nazwa celu"
                fullWidth
                variant="outlined"
                value={goalData.name}
                onChange={(e) => setGoalData({ ...goalData, name: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Kategoria"
                fullWidth
                variant="outlined"
                value={goalData.category}
                onChange={(e) => setGoalData({ ...goalData, category: e.target.value })}
                SelectProps={{ native: true }}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Kwota docelowa (zł)"
                fullWidth
                variant="outlined"
                type="number"
                value={goalData.targetAmount}
                onChange={(e) => setGoalData({ ...goalData, targetAmount: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Aktualna kwota (zł)"
                fullWidth
                variant="outlined"
                type="number"
                value={goalData.currentAmount}
                onChange={(e) => setGoalData({ ...goalData, currentAmount: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Data docelowa"
                fullWidth
                variant="outlined"
                type="date"
                value={goalData.targetDate}
                onChange={(e) => setGoalData({ ...goalData, targetDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Opis (opcjonalnie)"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                value={goalData.description}
                onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#232323' }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#b3b3b3' }}>
            Anuluj
          </Button>
          <Button onClick={handleSaveGoal} variant="contained" sx={{ bgcolor: '#1db954' }}>
            {editingGoal ? 'Zapisz zmiany' : 'Dodaj cel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SavingsGoals;

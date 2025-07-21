import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

const defaultIncomeCategories = [
  'Wynagrodzenie',
  'Freelancing',
  'Inwestycje',
  'Prezenty',
  'Sprzedaż',
  'Inne przychody',
];

const defaultExpenseCategories = [
  'Jedzenie',
  'Transport',
  'Mieszkanie',
  'Rozrywka',
  'Zdrowie',
  'Ubrania',
  'Edukacja',
  'Inne wydatki',
];

function CategoryManager({ categories, onUpdateCategories }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('expense');
  const [categoryBudget, setCategoryBudget] = useState('');

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategoryType(category.type);
      setCategoryBudget(category.budget || '');
    } else {
      setEditingCategory(null);
      setCategoryName('');
      setCategoryType('expense');
      setCategoryBudget('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryBudget('');
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;

    const newCategory = {
      id: editingCategory ? editingCategory.id : Date.now(),
      name: categoryName.trim(),
      type: categoryType,
      budget: categoryBudget ? parseFloat(categoryBudget) : null,
      isCustom: true,
    };

    let updatedCategories;
    if (editingCategory) {
      updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id ? newCategory : cat
      );
    } else {
      updatedCategories = [...categories, newCategory];
    }

    onUpdateCategories(updatedCategories);
    handleCloseDialog();
  };

  const handleDeleteCategory = (categoryId) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    onUpdateCategories(updatedCategories);
  };

  const handleResetToDefaults = () => {
    const defaultCategories = [
      ...defaultIncomeCategories.map((name, index) => ({
        id: `income-${index}`,
        name,
        type: 'income',
        budget: null,
        isCustom: false,
      })),
      ...defaultExpenseCategories.map((name, index) => ({
        id: `expense-${index}`,
        name,
        type: 'expense',
        budget: null,
        isCustom: false,
      })),
    ];
    onUpdateCategories(defaultCategories);
  };

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
          Zarządzanie kategoriami
        </Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={handleResetToDefaults}
            sx={{ mr: 2, borderColor: '#666', color: '#b3b3b3' }}
          >
            Przywróć domyślne
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ bgcolor: '#1db954', '&:hover': { bgcolor: '#1ed760' } }}
          >
            Dodaj kategorię
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Kategorie przychodów */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1db954', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  Kategorie przychodów ({incomeCategories.length})
                </Typography>
              </Box>
              <List>
                {incomeCategories.map((category) => (
                  <ListItem key={category.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ color: '#fff' }}>{category.name}</Typography>
                          {category.isCustom && (
                            <Chip label="Własna" size="small" sx={{ bgcolor: '#1db954', color: '#000' }} />
                          )}
                        </Box>
                      }
                      secondary={
                        category.budget && (
                          <Typography sx={{ color: '#b3b3b3' }}>
                            Budżet: {category.budget} zł
                          </Typography>
                        )
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleOpenDialog(category)}
                        sx={{ color: '#b3b3b3', mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      {category.isCustom && (
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteCategory(category.id)}
                          sx={{ color: '#ff6b6b' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Kategorie wydatków */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#232323', borderRadius: 3, border: '1px solid #333' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#ff6b6b', mr: 2 }}>
                  <TrendingDown />
                </Avatar>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  Kategorie wydatków ({expenseCategories.length})
                </Typography>
              </Box>
              <List>
                {expenseCategories.map((category) => (
                  <ListItem key={category.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ color: '#fff' }}>{category.name}</Typography>
                          {category.isCustom && (
                            <Chip label="Własna" size="small" sx={{ bgcolor: '#ff6b6b', color: '#000' }} />
                          )}
                        </Box>
                      }
                      secondary={
                        category.budget && (
                          <Typography sx={{ color: '#b3b3b3' }}>
                            Budżet: {category.budget} zł
                          </Typography>
                        )
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleOpenDialog(category)}
                        sx={{ color: '#b3b3b3', mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      {category.isCustom && (
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteCategory(category.id)}
                          sx={{ color: '#ff6b6b' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog dodawania/edycji kategorii */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#232323', color: '#fff' }}>
          {editingCategory ? 'Edytuj kategorię' : 'Dodaj nową kategorię'}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#232323', color: '#fff' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nazwa kategorii"
            fullWidth
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff' } }}
          />
          <TextField
            select
            margin="dense"
            label="Typ kategorii"
            fullWidth
            variant="outlined"
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff' } }}
          >
            <option value="expense">Wydatek</option>
            <option value="income">Przychód</option>
          </TextField>
          <TextField
            margin="dense"
            label="Budżet miesięczny (opcjonalnie)"
            fullWidth
            variant="outlined"
            type="number"
            value={categoryBudget}
            onChange={(e) => setCategoryBudget(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#232323' }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#b3b3b3' }}>
            Anuluj
          </Button>
          <Button onClick={handleSaveCategory} variant="contained" sx={{ bgcolor: '#1db954' }}>
            {editingCategory ? 'Zapisz' : 'Dodaj'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CategoryManager;

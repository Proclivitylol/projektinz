import React, { useState } from 'react';
import { Button, TextField, MenuItem, Grid, Card, CardContent, Typography, FormControl, InputLabel, Select } from '@mui/material';

const expenseCategories = [
  'Jedzenie', 'Mieszkanie', 'Transport', 'Rozrywka', 'Zdrowie', 'Inne'
];
const incomeCategories = [
  'Wynagrodzenie', 'Stypendium', 'Sprzedaż', 'Inne'
];

function TransactionForm({ onAdd, onEdit, editData, onCancelEdit }) {
  const [form, setForm] = useState({
    type: 'income',
    amount: '',
    category: '',
    date: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (editData) {
      setForm({ ...editData, amount: editData.amount.toString() });
    } else {
      setForm({ type: 'income', amount: '', category: '', date: '', description: '' });
    }
    setErrors({});
  }, [editData]);

  const validate = () => {
    let newErrors = {};
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) newErrors.amount = 'Podaj poprawną kwotę';
    if (!form.category) newErrors.category = 'Wybierz kategorię';
    if (!form.date) newErrors.date = 'Podaj datę';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    const data = { ...form, amount: parseFloat(form.amount) };
    if (editData) {
      onEdit(data);
    } else {
      onAdd(data);
    }
    setForm({ type: 'income', amount: '', category: '', date: '', description: '' });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{editData ? 'Edytuj transakcję' : 'Dodaj transakcję'}</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Typ</InputLabel>
                <Select
                  name="type"
                  value={form.type}
                  label="Typ"
                  onChange={handleChange}
                >
                  <MenuItem value="income">Przychód</MenuItem>
                  <MenuItem value="expense">Wydatek</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                name="amount"
                label="Kwota"
                type="number"
                fullWidth
                value={form.amount}
                onChange={handleChange}
                required
                error={!!errors.amount}
                helperText={errors.amount}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Kategoria</InputLabel>
                <Select
                  name="category"
                  value={form.category}
                  label="Kategoria"
                  onChange={handleChange}
                  required
                >
                  {(form.type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                name="date"
                label="Data"
                type="date"
                fullWidth
                value={form.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                error={!!errors.date}
                helperText={errors.date}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                name="description"
                label="Opis"
                fullWidth
                value={form.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: '100%' }}>
                {editData ? 'Zapisz' : 'Dodaj'}
              </Button>
              {editData && (
                <Button onClick={onCancelEdit} color="secondary" fullWidth sx={{ mt: 1 }}>
                  Anuluj
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

export default TransactionForm;

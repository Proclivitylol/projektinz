import React, { useState } from 'react';
import { Container, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import BudgetSummary from './components/BudgetSummary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Sidebar from './components/Sidebar';

import DashboardView from './views/DashboardView';
import BudgetView from './views/BudgetView';
import CalendarView from './views/CalendarView';
import TransactionsView from './views/TransactionsView';
import StatsView from './views/StatsView';
import SettingsView from './views/SettingsView';
import { Fade } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1db954' }, // Spotify green
    background: {
      default: '#181818',
      paper: '#232323',
    },
    text: {
      primary: '#fff',
      secondary: '#b3b3b3',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
});

function App() {
  const [transactions, setTransactions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const editData = editIndex !== null ? transactions[editIndex] : null;

  const handleAdd = (t) => {
    setTransactions([t, ...transactions]);
  };
  const handleDelete = (idx) => {
    setTransactions(transactions.filter((_, i) => i !== idx));
    if (editIndex === idx) setEditIndex(null);
  };
  const handleEditInit = (idx) => {
    setEditIndex(idx);
  };
  const handleEdit = (t) => {
    setTransactions(transactions.map((item, i) => i === editIndex ? t : item));
    setEditIndex(null);
  };
  const handleCancelEdit = () => {
    setEditIndex(null);
  };

  const income = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const balance = income - expense;

  const handleMenuClick = (view) => {
    setActiveView(view);
  };
  const handleTileClick = (view) => {
    setActiveView(view);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Sidebar onMenuClick={handleMenuClick} activeView={activeView} />
      <Container maxWidth="md" sx={{ pt: 2, pl: { xs: 0, md: '240px' }, transition: 'padding-left 0.3s' }}>
        <Fade in={activeView === 'home'} mountOnEnter unmountOnExit>
          <div><DashboardView transactions={transactions} balance={balance} income={income} expense={expense} onNavigate={handleMenuClick} /></div>
        </Fade>
        <Fade in={activeView === 'budget'} mountOnEnter unmountOnExit>
          <div><BudgetView balance={balance} income={income} expense={expense} transactions={transactions} /></div>
        </Fade>
        <Fade in={activeView === 'calendar'} mountOnEnter unmountOnExit>
          <div><CalendarView transactions={transactions} /></div>
        </Fade>
        <Fade in={activeView === 'transactions'} mountOnEnter unmountOnExit>
          <div><TransactionsView
            onAdd={handleAdd}
            onEdit={handleEdit}
            editData={editData}
            onCancelEdit={handleCancelEdit}
            transactions={transactions}
            onDelete={handleDelete}
            onEditInit={handleEditInit}
          /></div>
        </Fade>
        <Fade in={activeView === 'statistics'} mountOnEnter unmountOnExit>
          <div><StatsView transactions={transactions} /></div>
        </Fade>
        <Fade in={activeView === 'settings'} mountOnEnter unmountOnExit>
          <div><SettingsView /></div>
        </Fade>
      </Container>
    </ThemeProvider>
  );
}

export default App;

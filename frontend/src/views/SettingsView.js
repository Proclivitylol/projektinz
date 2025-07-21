import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import CategoryManager from '../components/CategoryManager';

function SettingsView() {
  const [categories, setCategories] = useState([]);

  // Inicjalizacja domyślnych kategorii przy pierwszym uruchomieniu
  useEffect(() => {
    const savedCategories = localStorage.getItem('budgetify-categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Domyślne kategorie
      const defaultCategories = [
        // Przychody
        { id: 'income-1', name: 'Wynagrodzenie', type: 'income', budget: null, isCustom: false },
        { id: 'income-2', name: 'Freelancing', type: 'income', budget: null, isCustom: false },
        { id: 'income-3', name: 'Inwestycje', type: 'income', budget: null, isCustom: false },
        { id: 'income-4', name: 'Prezenty', type: 'income', budget: null, isCustom: false },
        { id: 'income-5', name: 'Inne przychody', type: 'income', budget: null, isCustom: false },
        // Wydatki
        { id: 'expense-1', name: 'Jedzenie', type: 'expense', budget: null, isCustom: false },
        { id: 'expense-2', name: 'Transport', type: 'expense', budget: null, isCustom: false },
        { id: 'expense-3', name: 'Mieszkanie', type: 'expense', budget: null, isCustom: false },
        { id: 'expense-4', name: 'Rozrywka', type: 'expense', budget: null, isCustom: false },
        { id: 'expense-5', name: 'Zdrowie', type: 'expense', budget: null, isCustom: false },
        { id: 'expense-6', name: 'Ubrania', type: 'expense', budget: null, isCustom: false },
        { id: 'expense-7', name: 'Edukacja', type: 'expense', budget: null, isCustom: false },
        { id: 'expense-8', name: 'Inne wydatki', type: 'expense', budget: null, isCustom: false },
      ];
      setCategories(defaultCategories);
      localStorage.setItem('budgetify-categories', JSON.stringify(defaultCategories));
    }
  }, []);

  const handleUpdateCategories = (updatedCategories) => {
    setCategories(updatedCategories);
    localStorage.setItem('budgetify-categories', JSON.stringify(updatedCategories));
  };

  return (
    <Box sx={{ py: 4 }}>
      <CategoryManager 
        categories={categories}
        onUpdateCategories={handleUpdateCategories}
      />
    </Box>
  );
}

export default SettingsView;

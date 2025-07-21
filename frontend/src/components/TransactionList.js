import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function TransactionList({ transactions, onDelete, onEditInit }) {
  return (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Kategoria</TableCell>
            <TableCell>Opis</TableCell>
            <TableCell>Typ</TableCell>
            <TableCell align="right">Kwota</TableCell>
            <TableCell align="center">Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="text.secondary">Brak transakcji</Typography>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((t, idx) => (
              <TableRow key={idx}>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>{t.type === 'income' ? 'Przychód' : 'Wydatek'}</TableCell>
                <TableCell align="right" style={{ color: t.type === 'income' ? 'green' : 'red' }}>
                  {t.amount} zł
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton color="primary" onClick={() => onEditInit(idx)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(idx)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionList;

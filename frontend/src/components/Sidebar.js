import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Box, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';

const menuItems = [
  { text: 'Strona główna', icon: <HomeIcon />, view: 'home' },
  { text: 'Budżet', icon: <AccountBalanceWalletIcon />, view: 'budget' },
  { text: 'Transakcje', icon: <ListAltIcon />, view: 'transactions' },
  { text: 'Kalendarz', icon: <CalendarTodayIcon />, view: 'calendar' },
  { text: 'Statystyki', icon: <PieChartIcon />, view: 'statistics' },
  { text: 'Ustawienia', icon: <SettingsIcon />, view: 'settings' },
];

function Sidebar({ onMenuClick, activeView }) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');
  const drawerWidth = isMobile ? 240 : 220;

  const sidebarContent = (
    <Box
      sx={{
        height: '100vh',
        bgcolor: '#121212',
        color: 'white',
        width: drawerWidth,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 4,
          letterSpacing: 2,
          color: '#1db954',
          cursor: 'pointer',
          transition: 'color 0.2s, text-shadow 0.2s',
          '&:hover': {
            color: '#fff',
            textShadow: '0 0 8px #1db954',
          },
          userSelect: 'none',
        }}
        onClick={() => onMenuClick && onMenuClick('dashboard')}
      >
        Placeholder
      </Typography>
      <List sx={{ width: '100%' }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={activeView === item.view}
            onClick={() => onMenuClick && onMenuClick(item.view)}
            sx={{
              mb: 1.5,
              borderRadius: 3,
              bgcolor: activeView === item.view ? 'rgba(30,215,96,0.18)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(30,215,96,0.08)' },
              transition: 'background 0.2s',
              px: 2.5,
              py: 1.2,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2,
                justifyContent: 'center',
                bgcolor: activeView === item.view ? '#1db954' : '#232323',
                color: activeView === item.view ? '#181818' : '#b3b3b3',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                fontSize: 28,
                transition: 'all 0.2s',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                color: activeView === item.view ? '#fff' : '#b3b3b3',
                fontWeight: activeView === item.view ? 700 : 400,
                ml: 1.5,
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box flexGrow={1} />
      <Typography variant="caption" sx={{ mb: 2, color: '#444' }}>
        &copy; {new Date().getFullYear()} Placeholder
      </Typography>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ position: 'fixed', top: 18, left: 18, zIndex: 1301, bgcolor: '#232323', color: '#1db954', '&:hover': { bgcolor: '#232323' } }}
          size="large"
        >
          <MenuIcon fontSize="large" />
        </IconButton>
        <Drawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{ sx: { bgcolor: '#121212', color: 'white', width: drawerWidth } }}
          transitionDuration={300}
        >
          {sidebarContent}
        </Drawer>
      </>
    );
  }
  // Desktop: sidebar zawsze widoczny
  return (
    <Box sx={{ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 1200, boxShadow: 3 }}>
      {sidebarContent}
    </Box>
  );
}

export default Sidebar;

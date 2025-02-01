import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#d66c14' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Wildfire Response & Prediction
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
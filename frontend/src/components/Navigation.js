import React from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
`;

const CustomDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    borderTopRightRadius: '30px',
    borderBottomRightRadius: '30px',
    display: 'flex',
    justifyContent: 'center', // Center items vertically
  },
}));

const CustomListItem = styled(ListItem)(({ theme }) => ({
  margin: '20px 0', // Add vertical margin
}));

const CustomListItemText = styled(ListItemText)(({ theme }) => ({
  fontFamily: 'Outfit, sans-serif', // Apply Outfit font
  fontWeight: 700, // Apply bold font weight
}));

const Navigation = () => {
  return (
    <>
      <GlobalStyle />
      <CustomDrawer variant="permanent" anchor="left">
        <List>
          <CustomListItem button component={Link} to="/">
            <CustomListItemText primary="Home" />
          </CustomListItem>
          <CustomListItem button component={Link} to="/prediction">
            <CustomListItemText primary="Prediction Dashboard" />
          </CustomListItem>
          <CustomListItem button component={Link} to="/reports">
            <CustomListItemText primary="Reports" />
          </CustomListItem>
        </List>
      </CustomDrawer>
    </>
  );
};

export default Navigation;
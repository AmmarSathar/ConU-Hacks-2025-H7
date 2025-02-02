import React from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
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
    backgroundColor: '#FFA500', // Set background color to orange
  },
}));

const CustomListItem = styled(ListItem)(({ theme }) => ({
  margin: '20px 0', // Add vertical margin
}));

const CustomButton = styled(Button)(({ theme }) => ({
  fontFamily: 'Outfit, sans-serif', // Apply Outfit font
  fontWeight: 700, // Apply bold font weight
  width: '100%', // Make button full width
  justifyContent: 'center', // Center text
  textTransform: 'none', // Disable uppercase transformation
  color: '#333', // Change text color
  fontSize: '1.3rem', // Increase font size
}));

const Navigation = () => {
  return (
    <>
      <GlobalStyle />
      <CustomDrawer variant="permanent" anchor="left">
        <List>
          <CustomListItem>
            <CustomButton component={Link} to="/">
              Deployment
            </CustomButton>
          </CustomListItem>
          <CustomListItem>
            <CustomButton component={Link} to="/prediction">
              Predictor
            </CustomButton>
          </CustomListItem>
          <CustomListItem>
            <CustomButton component={Link} to="/reports">
              Live Tracker
            </CustomButton>
          </CustomListItem>
        </List>
      </CustomDrawer>
    </>
  );
};

export default Navigation;
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const NotFound = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h2" color="textPrimary" gutterBottom>
          404
        </Typography>
        <Typography  variant="h5" component="h2" color="textSecondary" gutterBottom>
          Page non trouvée
        </Typography>
        <Typography   style={{color:'#5e72e4'}} variant="body1" color="textSecondary" paragraph>
          Désolé, la page que vous cherchez n'existe pas.
        </Typography>
       
      </Box>
    </Container>
  );

};

export default NotFound;

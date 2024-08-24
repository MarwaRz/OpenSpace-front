import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Expired = () => {
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
        <Typography variant="h3" component="h3" color="textPrimary" gutterBottom>
        Lien expiré
        </Typography>
        <Typography  variant="h6" component="h3" color="textSecondary" gutterBottom>
        Le lien que vous avez utilisé est expiré
        </Typography>
        <Typography   style={{color:'#5e72e4'}} variant="body1" color="textSecondary" paragraph>
        Veuillez vérifier votre boîte d'email pour obtenir un nouveau lien.
        </Typography>
       
      </Box>
    </Container>
  );
};

export default Expired;

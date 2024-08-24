import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { validateEmail } from '../../api/userApi'

const EmailVerificationDialog = ({ open, onClose, onVerified }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const encryptedEmail = new URLSearchParams(window.location.search).get('email');
      const response = await validateEmail(email, encryptedEmail);

      if (response.valid) {
        onVerified();
      } else {
        setError('Email non valide.');
      }
    } catch (err) {
      setError('Une erreur est survenue.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Vérification de l'email</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Veuillez entrer votre email pour accéder à cette page.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button  color="info" onClick={onClose}>Annuler</Button>
        <Button color="info" onClick={handleSubmit}>Valider</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailVerificationDialog;

import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const TermsModal = ({ closeModal }) => (
  <Dialog open={true} onClose={closeModal} fullWidth maxWidth="md">
    <DialogTitle disableTypography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" component="div">
          TERMS AND CONDITIONS
        </Typography>
        <IconButton edge="end" color="inherit" onClick={closeModal} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent dividers>
      <Typography gutterBottom>
        Welcome to 11D Commerce! These terms and conditions outline the rules
        and regulations for the use of the 11D Commerce website.
      </Typography>

      <Typography variant="h6" gutterBottom>1. Acceptance of Terms</Typography>
      <Typography gutterBottom>
        By accessing this website, we assume you accept these terms and
        conditions. Do not continue to use 11D Commerce if you do not agree
        to take all of the terms and conditions stated on this page.
      </Typography>

      <Typography variant="h6" gutterBottom>2. Privacy</Typography>
      <Typography gutterBottom>
        Your privacy is important to us. Please review our Privacy Policy,
        which also governs your visit to 11D Commerce, to understand our
        practices.
      </Typography>

      <Typography variant="h6" gutterBottom>3. Products and Services</Typography>
      <Typography gutterBottom>
        All products and services available on 11D Commerce are subject to
        availability. Prices are subject to change without notice.
      </Typography>

      <Typography variant="h6" gutterBottom>4. User Account</Typography>
      <Typography gutterBottom>
        If you create an account on 11D Commerce, you are responsible for
        maintaining the confidentiality of your account and password. You
        agree to accept responsibility for all activities that occur under
        your account.
      </Typography>

      {/* Additional terms and conditions content */}
    </DialogContent>
  </Dialog>
);

export default TermsModal;
import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Grid, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useFormik } from 'formik';

const GenerateReportModal = ({ onClose, onGenerateReport }) => {
  const formik = useFormik({
    initialValues: {
      preparerName: '',
      date: null,
      deliveryOption: '', // Default value for delivery option
      paymentMethod: '', // Default value for payment method
    },
    onSubmit: (values) => {
      onGenerateReport(values.preparerName, values.date, values.deliveryOption, values.paymentMethod);
      onClose();
    },
  });

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle className="text-center">Generate Report?</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="preparerName"
                name="preparerName"
                label="Preparer's Name"
                value={formik.values.preparerName}
                onChange={formik.handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="date"
                name="date"
                label="Date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="deliveryOptionLabel">Delivery Option</InputLabel>
                <Select
                  label="deliveryOptionLabel"
                  id="deliveryOption"
                  name="deliveryOption"
                  value={formik.values.deliveryOption}
                  onChange={formik.handleChange}
                  variant="outlined"
                >
                  <MenuItem value="pickup">Pickup</MenuItem>
                  <MenuItem value="delivery">Delivery</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="paymentMethodLabel">Payment Method</InputLabel>
                <Select
                  label="paymentMethodLabel"
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formik.values.paymentMethod}
                  onChange={formik.handleChange}
                  variant="outlined"
                >
                  <MenuItem value="gcash">GCash</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Generate
              </Button>
              <Button onClick={onClose} variant="outlined" color="secondary">
                Close
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReportModal;

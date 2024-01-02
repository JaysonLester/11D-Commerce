import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';


const GenerateReportModal = ({ onClose, onGenerateReport }) => {
  const formik = useFormik({
    initialValues: {
      preparerName: '',
      date: null,
    },
    onSubmit: (values) => {
      onGenerateReport(values.preparerName, values.date);
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

    // GenerateReportModal.js
    import React from 'react';
    import { Dialog, DialogTitle, DialogContent, TextField, Button, Grid, createTheme, ThemeProvider } from '@mui/material';
    import { useFormik } from 'formik';
    import { DatePicker } from '@mui/lab';
    import AdapterDateFns from '@mui/lab/AdapterDateFns';
    import LocalizationProvider from '@mui/lab/LocalizationProvider';

    const theme = createTheme({
        palette: {
            primary: {
                main: '#000000', // Black for primary color
            },
            secondary: {
                main: '#808080', // Gray for secondary color
            },
        },
    });

    const GenerateReportModal = ({ onClose, onGenerateReport }) => {
        const formik = useFormik({
            initialValues: {
                date: null,
                status: '',
                productType: '',
                color: '',
                size: '',
                productCode: '',
            },
            onSubmit: (values) => {
                onGenerateReport(values);
                onClose();
            },
        });

        return (
            <ThemeProvider theme={theme}>
                <Dialog open={true} onClose={onClose}>
                    <DialogTitle className="text-center">Generate Report?</DialogTitle>
                    <DialogContent>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
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
            </ThemeProvider>
        );
    };

    export default GenerateReportModal;
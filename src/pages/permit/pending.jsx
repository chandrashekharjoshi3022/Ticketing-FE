import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, TextField, Typography, Grid, Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MainCard from 'components/MainCard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';

const VisuallyHiddenInput = styled('input')({
  display: 'none'
});
const Pending = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formValues, setFormValues] = useState({
    fromDate: '',
    toDate: '',
    fileUpload: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [fileName, setFileName] = useState('');

  const itemsData = [
    {
      id: 1,
      itemName: 'Item 1',
      itemDescription: 'Description for Item 1',
      quantityInStock: 10,
      quantityOnOrder: 5,
      reorderLevel: 2,
      unitPrice: 100,
      msrp: 120,
      isDiscontinued: false,
      itemImageUrl: 'http://example.com/item1.jpg',
      notes: 'Note for Item 1',
      unitOfMeasurement: 'pcs',
      supplier: 'Supplier 1',
      categoryID: 1,
      hsnCode: '1234'
    },
    {
      id: 2,
      itemName: 'Item 2',
      itemDescription: 'Description for Item 2',
      quantityInStock: 20,
      quantityOnOrder: 10,
      reorderLevel: 5,
      unitPrice: 200,
      msrp: 240,
      isDiscontinued: true,
      itemImageUrl: 'http://example.com/item2.jpg',
      notes: 'Note for Item 2',
      unitOfMeasurement: 'pcs',
      supplier: 'Supplier 2',
      categoryID: 2,
      hsnCode: '5678'
    },
    {
      id: 3,
      itemName: 'Item 2',
      itemDescription: 'Description for Item 2',
      quantityInStock: 20,
      quantityOnOrder: 10,
      reorderLevel: 5,
      unitPrice: 200,
      msrp: 240,
      isDiscontinued: true,
      itemImageUrl: 'http://example.com/item2.jpg',
      notes: 'Note for Item 2',
      unitOfMeasurement: 'pcs',
      supplier: 'Supplier 2',
      categoryID: 2,
      hsnCode: '5678'
    },
    {
      id: 4,
      itemName: 'Item 2',
      itemDescription: 'Description for Item 2',
      quantityInStock: 20,
      quantityOnOrder: 10,
      reorderLevel: 5,
      unitPrice: 200,
      msrp: 240,
      isDiscontinued: true,
      itemImageUrl: 'http://example.com/item2.jpg',
      notes: 'Note for Item 2',
      unitOfMeasurement: 'pcs',
      supplier: 'Supplier 2',
      categoryID: 2,
      hsnCode: '5678'
    },
    {
      id: 5,
      itemName: 'Item 2',
      itemDescription: 'Description for Item 2',
      quantityInStock: 20,
      quantityOnOrder: 10,
      reorderLevel: 5,
      unitPrice: 200,
      msrp: 240,
      isDiscontinued: true,
      itemImageUrl: 'http://example.com/item2.jpg',
      notes: 'Note for Item 2',
      unitOfMeasurement: 'pcs',
      supplier: 'Supplier 2',
      categoryID: 2,
      hsnCode: '5678'
    }
  ];

  const columns = [
    { field: 'itemName', headerName: 'Item Name', width: 150 },
    { field: 'itemDescription', headerName: 'Item Description', width: 200 },
    { field: 'quantityInStock', headerName: 'Quantity In Stock', width: 150 },
    { field: 'quantityOnOrder', headerName: 'Quantity On Order', width: 150 },
    { field: 'reorderLevel', headerName: 'Reorder Level', width: 150 },
    { field: 'unitPrice', headerName: 'Unit Price', width: 100 },
    { field: 'msrp', headerName: 'MSRP', width: 100 },
    { field: 'isDiscontinued', headerName: 'Is Discontinued', width: 150, renderCell: (params) => (params.value ? 'Yes' : 'No') },
    { field: 'itemImageUrl', headerName: 'Item Image URL', width: 200 },
    { field: 'notes', headerName: 'Notes', width: 200 },
    { field: 'unitOfMeasurement', headerName: 'Unit Of Measurement', width: 150 },
    { field: 'supplier', headerName: 'Supplier', width: 150 },
    { field: 'categoryID', headerName: 'Category ID', width: 100 },
    { field: 'hsnCode', headerName: 'HSN Code', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleOpen(params.row)}>
          <UploadFileIcon />
        </IconButton>
      )
    }
  ];
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      // Update formValues with the file object itself
      setFormValues({ ...formValues, itemImageUrl: file });
    }
  };
  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setFormValues({
      fromDate: '',
      toDate: '',
      file: null
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: files ? files[0] : value
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formValues.fromDate) {
      errors.fromDate = 'Field is required';
    }
    if (!formValues.toDate) {
      errors.toDate = 'Field is required';
    }
    if (!formValues.fileUpload) {
      errors.fileUpload = 'Field is required';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      // Submit form
      console.log('Form submitted', formValues);
      handleClose();
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Navdac List</span>
        </Box>
      }
    >
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={itemsData} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <Typography variant="h3" component="div">
              <strong>Item Details</strong>
            </Typography>
            <Typography variant="h5" component="div">
              <strong>HSN/SAC Summary -12(25376537687)</strong>
            </Typography>
          </DialogTitle>

          <DialogContent>
            {selectedItem && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Item Name:</strong> {selectedItem.itemName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Quantity In Stock:</strong> {selectedItem.quantityInStock}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Quantity On Order:</strong> {selectedItem.quantityOnOrder}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Unit Price:</strong> ${selectedItem.unitPrice}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} marginTop={2}>
                <Grid item xs={12} sm={1}>
                  <Typography variant="subtitle1">From</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    id="fromDate"
                    name="fromDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    value={formValues.fromDate}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true
                    }}
                    error={!!formErrors.fromDate}
                    helperText={formErrors.fromDate}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="subtitle1">To</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    id="toDate"
                    name="toDate"
                    type="date"
                    variant="outlined"
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true
                    }}
                    error={!!formErrors.toDate}
                    helperText={formErrors.toDate}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography variant="subtitle1">Upload File</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <div>
                    <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                      Upload File
                      <VisuallyHiddenInput type="file" name="fileUpload" id="fileUpload" onChange={handleFileChange} />
                    </Button>
                    {fileName && <span style={{ color: 'blue' }}>{fileName}</span>}
                  </div>
                </Grid>
              </Grid>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" color="primary">
                  Upload
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainCard>
  );
};

export default Pending;

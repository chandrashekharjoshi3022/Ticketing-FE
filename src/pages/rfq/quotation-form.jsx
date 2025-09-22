// project-imports
import { useState } from 'react';
import MainCard from 'components/MainCard';
// material-ui
import Grid from '@mui/material/Grid';
import { TextField, Select, MenuItem, InputLabel, FormControl, Button, Box, FormHelperText } from '@mui/material';
import QuotationPage from './quatation-page';

// ==============================|| OpR Form Page ||============================== //

export default function QuotationForm({ formMode }) {
  const [errors, setErrors] = useState({});
  const [showOprForm, setShowOprForm] = useState(true);
  const [formValues, setFormValues] = useState({
    companyCodeName: '',
    division: '',
    oprDate: '',
    shipmentMode: '',
    deliveryTime: '',
    requestedByDepartment: '',
    requestedBy: '',
    quotationsEmailAlert: '',
    oprDescription: '',
    additionalRemarks: '',
    potentialSuppliers: '',
    stockItem: '',
    oprQty: '',
    stockItemCode: '',
    stockInTransit: '',
    stockInHand: '',
    monthlyConsumption: '',
    itemDescription: ''
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    if (!!errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formValues.companyCodeName) tempErrors.companyCodeName = 'Incorrect entry.';
    if (!formValues.division) tempErrors.division = 'Incorrect entry.';
    if (!formValues.oprDate) tempErrors.oprDate = 'Incorrect entry.';
    if (!formValues.shipmentMode) tempErrors.shipmentMode = 'Incorrect entry.';
    if (!formValues.deliveryTime) tempErrors.deliveryTime = 'Incorrect entry.';
    if (!formValues.requestedByDepartment) tempErrors.requestedByDepartment = 'Incorrect entry.';
    if (!formValues.requestedBy) tempErrors.requestedBy = 'Incorrect entry.';
    if (!formValues.quotationsEmailAlert) tempErrors.quotationsEmailAlert = 'Incorrect entry.';
    if (!formValues.oprDescription) tempErrors.oprDescription = 'Incorrect entry.';
    if (!formValues.additionalRemarks) tempErrors.additionalRemarks = 'Incorrect entry.';
    if (!formValues.potentialSuppliers) tempErrors.potentialSuppliers = 'Incorrect entry.';
    if (!formValues.stockItem) tempErrors.stockItem = 'Incorrect entry.';
    if (!formValues.oprQty) tempErrors.oprQty = 'Incorrect entry.';
    if (!formValues.stockItemCode) tempErrors.stockItemCode = 'Incorrect entry.';
    if (!formValues.stockInTransit) tempErrors.stockInTransit = 'Incorrect entry.';
    if (!formValues.stockInHand) tempErrors.stockInHand = 'Incorrect entry.';
    if (!formValues.monthlyConsumption) tempErrors.monthlyConsumption = 'Incorrect entry.';
    if (!formValues.itemDescription) tempErrors.itemDescription = 'Incorrect entry.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Handle form submission
      console.log('Form submitted successfully:', formValues);
    } else {
      console.log('Validation failed');
    }
  };
  const handleCancel = () => {
    setShowOprForm(false);
    setFormValues(initialFormValues);
    setErrors({});
  };

  return (
    <>
      {showOprForm ? (
        <MainCard title={formMode === 'edit' ? 'Edit OPR' : 'Create OPR'}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Grid container spacing={5}>
                  <Grid item xs={3}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="division-label">Vender Code</InputLabel>
                      <Select
                        labelId="division-label"
                        id="division"
                        name="division"
                        value={formValues.division}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Division 1</MenuItem>
                        <MenuItem value={20}>Division 2</MenuItem>
                        <MenuItem value={30}>Division 3</MenuItem>
                      </Select>
                      {!!errors.division && <FormHelperText error>{errors.division}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="division-label">Reference No</InputLabel>
                      <Select
                        labelId="division-label"
                        id="division"
                        name="division"
                        value={formValues.division}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Division 1</MenuItem>
                        <MenuItem value={20}>Division 2</MenuItem>
                        <MenuItem value={30}>Division 3</MenuItem>
                      </Select>
                      {!!errors.division && <FormHelperText error>{errors.division}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="oprDate"
                      name="oprDate"
                      label="Reference Date"
                      type="date"
                      variant="standard"
                      fullWidth
                      value={formValues.oprDate}
                      onChange={handleInputChange}
                    />
                    {!!errors.oprDate && <FormHelperText error>{errors.oprDate}</FormHelperText>}
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="oprDate"
                      name="oprDate"
                      label="Quotation Date"
                      type="date"
                      variant="standard"
                      fullWidth
                      value={formValues.oprDate}
                      onChange={handleInputChange}
                    />
                    {!!errors.oprDate && <FormHelperText error>{errors.oprDate}</FormHelperText>}
                  </Grid>
                </Grid>
                <Grid container spacing={5} sx={{ marginTop: 1 }}>
                  <Grid item xs={3}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="division-label">Currency</InputLabel>
                      <Select
                        labelId="division-label"
                        id="division"
                        name="division"
                        value={formValues.division}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Division 1</MenuItem>
                        <MenuItem value={20}>Division 2</MenuItem>
                        <MenuItem value={30}>Division 3</MenuItem>
                      </Select>
                      {!!errors.division && <FormHelperText error>{errors.division}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="division-label">Delivery Terms</InputLabel>
                      <Select
                        labelId="division-label"
                        id="division"
                        name="division"
                        value={formValues.division}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Division 1</MenuItem>
                        <MenuItem value={20}>Division 2</MenuItem>
                        <MenuItem value={30}>Division 3</MenuItem>
                      </Select>
                      {!!errors.division && <FormHelperText error>{errors.division}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="division-label">Country of Origin</InputLabel>
                      <Select
                        labelId="division-label"
                        id="division"
                        name="division"
                        value={formValues.division}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Division 1</MenuItem>
                        <MenuItem value={20}>Division 2</MenuItem>
                        <MenuItem value={30}>Division 3</MenuItem>
                      </Select>
                      {!!errors.division && <FormHelperText error>{errors.division}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="division-label">Country of Supply</InputLabel>
                      <Select
                        labelId="division-label"
                        id="division"
                        name="division"
                        value={formValues.division}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Division 1</MenuItem>
                        <MenuItem value={20}>Division 2</MenuItem>
                        <MenuItem value={30}>Division 3</MenuItem>
                      </Select>
                      {!!errors.division && <FormHelperText error>{errors.division}</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={5} sx={{ marginTop: 1 }}>
                  <Grid item xs={3}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="division-label">Port of Loading</InputLabel>
                      <Select
                        labelId="division-label"
                        id="division"
                        name="division"
                        value={formValues.division}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Division 1</MenuItem>
                        <MenuItem value={20}>Division 2</MenuItem>
                        <MenuItem value={30}>Division 3</MenuItem>
                      </Select>
                      {!!errors.division && <FormHelperText error>{errors.division}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="division-label">Lead Time</InputLabel>
                      <Select
                        labelId="division-label"
                        id="division"
                        name="division"
                        value={formValues.division}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Division 1</MenuItem>
                        <MenuItem value={20}>Division 2</MenuItem>
                        <MenuItem value={30}>Division 3</MenuItem>
                      </Select>
                      {!!errors.division && <FormHelperText error>{errors.division}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="oprDescription"
                      name="oprDescription"
                      label="Payment Terms"
                      variant="standard"
                      fullWidth
                      value={formValues.oprDescription}
                      onChange={handleInputChange}
                    />
                    {!!errors.oprDescription && <FormHelperText error>{errors.oprDescription}</FormHelperText>}
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="oprDescription"
                      name="oprDescription"
                      label="Remarks"
                      variant="standard"
                      fullWidth
                      value={formValues.oprDescription}
                      onChange={handleInputChange}
                    />
                    {!!errors.oprDescription && <FormHelperText error>{errors.oprDescription}</FormHelperText>}
                  </Grid>
                </Grid>
                <Grid container spacing={5} sx={{ marginTop: 1 }}>
                  <Grid item xs={3}>
                    <TextField
                      id="additionalRemarks"
                      name="additionalRemarks"
                      label="Inland Charges"
                      variant="standard"
                      fullWidth
                      value={formValues.additionalRemarks}
                      onChange={handleInputChange}
                    />
                    {!!errors.additionalRemarks && <FormHelperText error>{errors.additionalRemarks}</FormHelperText>}
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="potentialSuppliers"
                      name="potentialSuppliers"
                      label="Freight Charges"
                      variant="standard"
                      fullWidth
                      value={formValues.potentialSuppliers}
                      onChange={handleInputChange}
                    />
                    {!!errors.potentialSuppliers && <FormHelperText error>{errors.potentialSuppliers}</FormHelperText>}
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="potentialSuppliers"
                      name="potentialSuppliers"
                      label="Inspection Charges"
                      variant="standard"
                      fullWidth
                      value={formValues.potentialSuppliers}
                      onChange={handleInputChange}
                    />
                    {!!errors.potentialSuppliers && <FormHelperText error>{errors.potentialSuppliers}</FormHelperText>}
                  </Grid>
                  {/* <Grid item xs={3}>
                    <TextField
                      id="stockItem"
                      name="stockItem"
                      label="Stock Item"
                      variant="standard"
                      fullWidth
                      value={formValues.stockItem}
                      onChange={handleInputChange}
                    />
                    {!!errors.stockItem && <FormHelperText error>{errors.stockItem}</FormHelperText>}
                  </Grid> */}
                </Grid>
                <Grid item xs={12}>
                  <h2>FOB Charges</h2>
                </Grid>
                <Grid container spacing={5} sx={{ marginTop: 1 }}>
                  <Grid item xs={2}>
                    <TextField
                      id="oprQty"
                      name="oprQty"
                      label="THC"
                      variant="standard"
                      fullWidth
                      value={formValues.oprQty}
                      onChange={handleInputChange}
                    />
                    {!!errors.oprQty && <FormHelperText error>{errors.oprQty}</FormHelperText>}
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      id="stockItemCode"
                      name="stockItemCode"
                      label="Container Stuffing"
                      variant="standard"
                      fullWidth
                      value={formValues.stockItemCode}
                      onChange={handleInputChange}
                    />
                    {!!errors.stockItemCode && <FormHelperText error>{errors.stockItemCode}</FormHelperText>}
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      id="stockInTransit"
                      name="stockInTransit"
                      label="Container Seal"
                      variant="standard"
                      fullWidth
                      value={formValues.stockInTransit}
                      onChange={handleInputChange}
                    />
                    {!!errors.stockInTransit && <FormHelperText error>{errors.stockInTransit}</FormHelperText>}
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      id="stockInTransit"
                      name="stockInTransit"
                      label="BL"
                      variant="standard"
                      fullWidth
                      value={formValues.stockInTransit}
                      onChange={handleInputChange}
                    />
                    {!!errors.stockInTransit && <FormHelperText error>{errors.stockInTransit}</FormHelperText>}
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      id="stockInTransit"
                      name="stockInTransit"
                      label="VGM"
                      variant="standard"
                      fullWidth
                      value={formValues.stockInTransit}
                      onChange={handleInputChange}
                    />
                    {!!errors.stockInTransit && <FormHelperText error>{errors.stockInTransit}</FormHelperText>}
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      id="stockInTransit"
                      name="stockInTransit"
                      label="Miscellaneous"
                      variant="standard"
                      fullWidth
                      value={formValues.stockInTransit}
                      onChange={handleInputChange}
                    />
                    {!!errors.stockInTransit && <FormHelperText error>{errors.stockInTransit}</FormHelperText>}
                  </Grid>
                </Grid>
                <Grid container spacing={5} sx={{ marginTop: 1 }}>
                  <Grid item xs={3}>
                    <TextField
                      id="stockInHand"
                      name="stockInHand"
                      label="Stock In Hand"
                      variant="standard"
                      fullWidth
                      value={formValues.stockInHand}
                      onChange={handleInputChange}
                    />
                    {!!errors.stockInHand && <FormHelperText error>{errors.stockInHand}</FormHelperText>}
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="monthlyConsumption"
                      name="monthlyConsumption"
                      label="Monthly Consumption"
                      variant="standard"
                      fullWidth
                      value={formValues.monthlyConsumption}
                      onChange={handleInputChange}
                    />
                    {!!errors.monthlyConsumption && <FormHelperText error>{errors.monthlyConsumption}</FormHelperText>}
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="itemDescription"
                      name="itemDescription"
                      label="Item Description"
                      variant="standard"
                      fullWidth
                      value={formValues.itemDescription}
                      onChange={handleInputChange}
                    />
                    {!!errors.itemDescription && <FormHelperText error>{errors.itemDescription}</FormHelperText>}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                Submit
              </Button>
              <Button variant="outlined" color="error" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </form>
        </MainCard>
      ) : (
        <QuotationPage />
      )}
    </>
  );
}

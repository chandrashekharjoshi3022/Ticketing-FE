import { useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
  Button,
  FormControl,
  FormHelperText
} from '@mui/material';
import { BASE_URL } from 'AppConstants';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';

const VisuallyHiddenInput = styled('input')({
  display: 'none'
});

// ==============================|| OpR Form Page ||============================== //
const initialFormValues = {
  itemName: '',
  itemDescription: '',
  quantityInStock: '',
  quantityOnOrder: '',
  reorderLevel: '',
  unitPrice: '',
  msrp: '',
  isDiscontinued: '',
  itemImageUrl: '',
  notes: '',
  unitOfMeasurement: '',
  supplier: '',
  categoryID: '',
  hsnCode: ''
};

const NafForm = ({ onClose, user, formMode }) => {
  const [showTableHeading, setShowTableHeading] = useState({
    userPersonalDetail: true,
    userAddressDetails: true
  });
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [category, setCategory] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [unit, setUnit] = useState([]);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    getCateroryAPI();
    getVendorAPI();
    getUOMAPI();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // if (name === 'isDiscontinued') {
    //   newValue = value === 'true' ? 1 : 2;
    // }
    if (!!errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};

    if (!formValues.itemName) tempErrors.itemName = 'Item Name is required.';
    else if (formValues.itemName.length < 3) tempErrors.itemName = 'Item Name must be at least 3 characters.';

    if (!formValues.itemDescription) tempErrors.itemDescription = 'Item Description is required.';
    else if (formValues.itemDescription.length < 10) tempErrors.itemDescription = 'Item Description must be at least 10 characters.';

    // if (!formValues.quantityInStock) tempErrors.quantityInStock = 'Quantity In Stock is required.';
    // else if (isNaN(formValues.quantityInStock) || formValues.quantityInStock < 0)
    //   tempErrors.quantityInStock = 'Quantity In Stock must be a positive number.';

    // if (!formValues.quantityOnOrder) tempErrors.quantityOnOrder = 'Quantity On Order is required.';
    // else if (isNaN(formValues.quantityOnOrder) || formValues.quantityOnOrder < 0)
    //   tempErrors.quantityOnOrder = 'Quantity On Order must be a positive number.';

    // if (!formValues.reorderLevel) tempErrors.reorderLevel = 'Reorder Level is required.';
    // else if (isNaN(formValues.reorderLevel) || formValues.reorderLevel < 0)
    //   tempErrors.reorderLevel = 'Reorder Level must be a positive number.';

    // if (!formValues.unitPrice) tempErrors.unitPrice = 'Unit Price is required.';
    // else if (isNaN(formValues.unitPrice) || formValues.unitPrice <= 0) tempErrors.unitPrice = 'Unit Price must be a positive number.';

    // if (!formValues.msrp) tempErrors.msrp = 'MSRP is required.';
    // else if (isNaN(formValues.msrp) || formValues.msrp <= 0) tempErrors.msrp = 'MSRP must be a positive number.';

    // if (formValues.isDiscontinued === '') tempErrors.isDiscontinued = 'Please select if the item is discontinued.';

    // if (formValues.itemImageUrl && !/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(formValues.itemImageUrl))
    //   tempErrors.itemImageUrl = 'Please enter a valid image URL (jpg, jpeg, png, gif).';

    // if (!formValues.weight) tempErrors.weight = 'Weight is required.';
    // else if (isNaN(formValues.weight) || formValues.weight <= 0) tempErrors.weight = 'Weight must be a positive number.';

    // if (!formValues.dimensions) tempErrors.dimensions = 'Dimensions are required.';
    // else if (formValues.dimensions.length < 5) tempErrors.dimensions = 'Dimensions must be at least 5 characters.';

    // if (!formValues.notes) tempErrors.notes = 'Notes are required.';

    // if (!formValues.unitOfMeasurement) tempErrors.unitOfMeasurement = 'Unit of Measurement is required.';

    // if (!formValues.supplier) tempErrors.supplier = 'Supplier is required.';

    // if (!formValues.categoryID) tempErrors.categoryID = 'Category ID is required.';

    // if (!formValues.hsnCode) tempErrors.hsnCode = 'HSN Code is required.';
    // else if (isNaN(formValues.hsnCode) || formValues.hsnCode.length !== 6) tempErrors.hsnCode = 'HSN Code must be a 6 digit number.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell colSpan={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              {sectionLabel}
            </Typography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  // For get User Role
  const getCateroryAPI = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/category`);
      const deliveryTimelineData = response.data.map((timeline) => ({
        id: timeline.category_id,
        name: timeline.category_name
      }));
      setCategory(deliveryTimelineData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryTime: 'Failed to load timeline'
      }));
    }
  };
  // get vender dropdown data
  const getVendorAPI = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/vendor`);
      const deliveryTimelineData = response.data.map((timeline) => ({
        id: timeline.vendor_id,
        name: timeline.vendor_name
      }));
      setVendor(deliveryTimelineData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryTime: 'Failed to load timeline'
      }));
    }
  };
  // get UNIT dropdown data
  const getUOMAPI = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/unit`);
      console.log('UOM', response);
      const deliveryTimelineData = response.data.map((timeline) => ({
        id: timeline.unit_of_measurement_id,
        name: timeline.unit_of_measurement_name
      }));
      setUnit(deliveryTimelineData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryTime: 'Failed to load timeline'
      }));
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('event', event);

    // Function to map frontend keys to backend keys
    const mapFrontendToBackendKeys = (frontendData) => {
      console.log('frontData', frontendData);
      return {
        item_name: frontendData.itemName,
        item_description: frontendData.itemDescription,
        hs_code: frontendData.hsnCode,
        quantity_in_stock: frontendData.quantityInStock,
        quantity_on_order: frontendData.quantityOnOrder,
        reorder_level: frontendData.reorderLevel,
        unit_price: frontendData.unitPrice,
        msrp: frontendData.msrp,
        is_discontinued: frontendData.isDiscontinued,
        item_image_url: '',
        weight: '',
        dimensions: '',
        notes: frontendData.notes,
        Unit_of_measurement_id: frontendData.unitOfMeasurement,
        vendor_id: frontendData.venders,
        category_id: frontendData.categoryID,
        created_by: 'Item By'
      };
    };

    // Validate the form before submission
    const isValid = validate();
    // const isValid = true;

    if (isValid) {
      // Map frontend keys to backend keys
      const requestData = mapFrontendToBackendKeys(formValues);

      try {
        console.log('API hitted', requestData);
        // Make a POST request to your backend API endpoint
        const response = await axios.post(`${BASE_URL}/item`, requestData);

        // Handle response accordingly
        console.log('Form submitted successfully:', response);

        // Optionally, reset form values after successful submission
        setFormValues(initialFormValues);
        // setShowTableHeading((prevState) => ({
        //   ...prevState,
        //   createOPR: false,
        //   userPersonalDetail: true
        // }));
      } catch (error) {
        // Handle error if the request fails
        console.error('Error submitting form:', error);
      }
    } else {
      // If form is invalid, do something (e.g., display error messages)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Table>
        {renderTableHeader('userPersonalDetail', 'Basic Info')}
        {showTableHeading.userPersonalDetail && (
          <TableBody>
            <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Item Name</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      id="itemName"
                      name="itemName"
                      variant="outlined"
                      fullWidth
                      value={formValues.itemName}
                      onChange={handleInputChange}
                    />
                    {!!errors.itemName && <FormHelperText error>{errors.itemName}</FormHelperText>}
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Item Description</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      id="itemDescription"
                      name="itemDescription"
                      variant="outlined"
                      fullWidth
                      value={formValues.itemDescription}
                      onChange={handleInputChange}
                    />
                    {!!errors.itemDescription && <FormHelperText error>{errors.itemDescription}</FormHelperText>}
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Item Image</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <div>
                      <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload File
                        <VisuallyHiddenInput type="file" name="itemImageUrl" id="itemImageUrl" onChange={handleFileChange} />
                      </Button>
                      {fileName && <span style={{ color: 'blue' }}>{fileName}</span>}
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">UOM ID</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl variant="outlined" fullWidth>
                      <Select
                        id="unitOfMeasurement"
                        name="unitOfMeasurement"
                        value={formValues.unitOfMeasurement}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {unit.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {!!errors.unitOfMeasurement && <FormHelperText error>{errors.unitOfMeasurement}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Notes</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField id="notes" name="notes" variant="outlined" fullWidth value={formValues.notes} onChange={handleInputChange} />
                    {!!errors.notes && <FormHelperText error>{errors.notes}</FormHelperText>}
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">HSN Code</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      id="hsnCode"
                      name="hsnCode"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={formValues.hsnCode}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Table>
        {renderTableHeader('userAddressDetails', 'Other Details')}
        {showTableHeading.userAddressDetails && (
          <TableBody>
            <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Quantity In Stock</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      id="quantityInStock"
                      name="quantityInStock"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={formValues.quantityInStock}
                      onChange={handleInputChange}
                    />
                    {!!errors.quantityInStock && <FormHelperText error>{errors.quantityInStock}</FormHelperText>}
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Quantity On Order</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      id="quantityOnOrder"
                      name="quantityOnOrder"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={formValues.quantityOnOrder}
                      onChange={handleInputChange}
                    />
                    {!!errors.quantityOnOrder && <FormHelperText error>{errors.quantityOnOrder}</FormHelperText>}
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Reorder Level</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      id="reorderLevel"
                      name="reorderLevel"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={formValues.reorderLevel}
                      onChange={handleInputChange}
                    />
                    {!!errors.reorderLevel && <FormHelperText error>{errors.reorderLevel}</FormHelperText>}
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Unit Price</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      id="unitPrice"
                      name="unitPrice"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={formValues.unitPrice}
                      onChange={handleInputChange}
                    />
                    {!!errors.unitPrice && <FormHelperText error>{errors.unitPrice}</FormHelperText>}
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">MSRP</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      id="msrp"
                      name="msrp"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={formValues.msrp}
                      onChange={handleInputChange}
                    />
                    {!!errors.msrp && <FormHelperText error>{errors.msrp}</FormHelperText>}
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Is Discontinued</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl variant="outlined" fullWidth>
                      <Select id="isDiscontinued" name="isDiscontinued" value={formValues.isDiscontinued} onChange={handleInputChange}>
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="1">Yes</MenuItem>
                        <MenuItem value="0">No</MenuItem>
                      </Select>
                      {!!errors.isDiscontinued && <FormHelperText error>{errors.isDiscontinued}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Vendors</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl variant="outlined" fullWidth>
                      <Select id="venders" name="venders" value={formValues.venders} onChange={handleInputChange}>
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {vendor.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {!!errors.venders && <FormHelperText error>{errors.venders}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle1">Category ID</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl variant="outlined" fullWidth>
                      <Select id="categoryID" name="categoryID" value={formValues.categoryID} onChange={handleInputChange}>
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {category.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {!!errors.categoryID && <FormHelperText error>{errors.categoryID}</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
          {formMode === 'create' ? 'Submit' : 'Update'}
        </Button>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default NafForm;

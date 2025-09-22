// project-imports
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
  itemCode: '',
  baseItem: '',
  itemDescription: '',
  itemType: '',
  hsnCode: '',
  unitOfMeasurement: '',
  cria: '',
  itemImageUrl: '',
  notes: '',
  quantityInStock: '',
  quantityOnOrder: '',
  nafdac: '',
  nafdacCategory: '',
  tolerance: '',
  reorderLevel: '',
  unitPrice: '',
  msrp: '',
  isDiscontinued: '',
  venders: '',
  group: '',
  subGroup: ''
};

export default function ItemForm({ onClose, onFormSubmit, formMode }) {
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
    if (!formValues.itemName) {
      tempErrors.itemName = 'Item Name is required.';
    }
    if (!formValues.itemCode) {
      tempErrors.itemCode = 'Item Name is required.';
    }
    if (!formValues.baseItem) {
      tempErrors.baseItem = 'Item Name is required.';
    }
    if (!formValues.itemDescription) {
      tempErrors.itemDescription = 'Item Description is required.';
    }

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

    // if (!formValues.venders) tempErrors.venders = 'Supplier is required.';

    // if (!formValues.group) tempErrors.group = 'Category ID is required.';

    // if (!formValues.hsnCode) tempErrors.hsnCode = 'HSN Code is required.';
    // else if (isNaN(formValues.hsnCode) || formValues.hsnCode.length !== 6) tempErrors.hsnCode = 'HSN Code must be a 6 digit number.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      // Update formValues with the file object itself
      setFormValues({ ...formValues, itemImageUrl: file });
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
    const mapFrontendToBackendKeys = (frontendData) => {
      const formData = new FormData();
      formData.append('item_name', frontendData.itemName);
      formData.append('item_code', frontendData.itemCode);
      formData.append('base_item', frontendData.baseItem);
      formData.append('item_type', frontendData.itemType);
      formData.append('item_description', frontendData.itemDescription);
      formData.append('Unit_of_measurement_id', frontendData.unitOfMeasurement);
      formData.append('cria', frontendData.cria);
      formData.append('hs_code', frontendData.hsnCode);
      formData.append('quantity_in_stock', '');
      formData.append('quantity_on_order', '');
      formData.append('nafdac_name', frontendData.nafdac);
      formData.append('nafdac_category', frontendData.nafdacCategory);
      formData.append('tolerance', frontendData.tolerance);
      formData.append('reorder_level', frontendData.reorderLevel);
      formData.append('unit_price', frontendData.unitPrice);
      formData.append('msrp', frontendData.msrp);
      formData.append('is_discontinued', frontendData.isDiscontinued);
      formData.append('doc', frontendData.itemImageUrl); //
      formData.append('notes', frontendData.notes);
      formData.append('vendor_id', frontendData.venders);
      formData.append('group', frontendData.group);
      formData.append('sub_group', frontendData.subGroup);
      formData.append('created_by', 'Item By');

      return formData;
    };
    // console.log('FORMDATA', formData);
    const isValid = validate();
    if (isValid) {
      const requestData = mapFrontendToBackendKeys(formValues);

      try {
        console.log('API hit', requestData);
        const response = await axios.post(`${BASE_URL}/item`, requestData);

        console.log('Form submitted successfully:', response);

        onFormSubmit();
        setFormValues(initialFormValues);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Table>
          {renderTableHeader('userPersonalDetail', 'Basic Info')}
          {showTableHeading.userPersonalDetail && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Item Code<span className="validation-star">*</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="itemCode"
                        name="itemCode"
                        variant="outlined"
                        fullWidth
                        value={formValues.itemCode}
                        onChange={handleInputChange}
                      />
                      {!!errors.itemCode && <FormHelperText error>{errors.itemCode}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Item Name<span className="validation-star">*</span>
                      </Typography>
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
                      <Typography variant="subtitle1">
                        Base Item<span className="validation-star">*</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="baseItem"
                        name="baseItem"
                        variant="outlined"
                        fullWidth
                        value={formValues.baseItem}
                        onChange={handleInputChange}
                      />
                      {!!errors.baseItem && <FormHelperText error>{errors.baseItem}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Item Description<span className="validation-star">*</span>
                      </Typography>
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
                      <Typography variant="subtitle1">
                        Item Type<span className="validation-star">*</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="itemType" name="itemType" value={formValues.itemType} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="1">ABC</MenuItem>
                          <MenuItem value="2">MNO</MenuItem>
                        </Select>
                        {!!errors.itemType && <FormHelperText error>{errors.itemType}</FormHelperText>}
                      </FormControl>
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
                      <Typography variant="subtitle1">CRIA</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="cria" name="cria" value={formValues.cria} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="1">CRIA 1</MenuItem>
                          <MenuItem value="2">CRIA 2</MenuItem>
                          <MenuItem value="3">CRIA 3</MenuItem>
                          <MenuItem value="4">CRIA 4</MenuItem>
                          <MenuItem value="5">CRIA 5</MenuItem>
                        </Select>
                        {!!errors.cria && <FormHelperText error>{errors.cria}</FormHelperText>}
                      </FormControl>
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
                      <Typography variant="subtitle1">Remarks</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id="notes"
                        name="notes"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={2}
                        value={formValues.notes}
                        onChange={handleInputChange}
                      />
                      {!!errors.notes && <FormHelperText error>{errors.notes}</FormHelperText>}
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
                        disabled
                        color="secondary"
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
                        disabled
                        color="secondary"
                        type="number"
                        value={formValues.quantityOnOrder}
                        onChange={handleInputChange}
                      />
                      {!!errors.quantityOnOrder && <FormHelperText error>{errors.quantityOnOrder}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">NAFDAC</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="nafdac" name="nafdac" value={formValues.nafdac} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="1">NAFDAC 1</MenuItem>
                          <MenuItem value="2">NAFDAC 2</MenuItem>
                          <MenuItem value="3">NAFDAC 3</MenuItem>
                          <MenuItem value="4">NAFDAC 4</MenuItem>
                          <MenuItem value="5">NAFDAC 5</MenuItem>
                        </Select>
                        {!!errors.nafdac && <FormHelperText error>{errors.nafdac}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">NAFDAC Category</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="nafdacCategory" name="nafdacCategory" value={formValues.nafdacCategory} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="1">NAFDAC Category 1</MenuItem>
                          <MenuItem value="2">NAFDAC Category 2</MenuItem>
                          <MenuItem value="3">NAFDAC Category 3</MenuItem>
                          <MenuItem value="4">NAFDAC Category 4</MenuItem>
                          <MenuItem value="5">NAFDAC Category 5</MenuItem>
                        </Select>
                        {!!errors.nafdacCategory && <FormHelperText error>{errors.nafdacCategory}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Tolerance</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="tolerance"
                        name="tolerance"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValues.tolerance}
                        onChange={handleInputChange}
                      />
                      {!!errors.tolerance && <FormHelperText error>{errors.tolerance}</FormHelperText>}
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
                      <Typography variant="subtitle1">Group</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="group" name="group" value={formValues.group} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {category.map((data) => (
                            <MenuItem key={data.id} value={data.id}>
                              {data.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.group && <FormHelperText error>{errors.group}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Sub Group</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="subGroup" name="subGroup" value={formValues.subGroup} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {category.map((data) => (
                            <MenuItem key={data.id} value={data.id}>
                              {data.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.subGroup && <FormHelperText error>{errors.subGroup}</FormHelperText>}
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
    </>
  );
}

// project-imports
import { useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
import axios from 'axios';
import Grid from '@mui/material/Grid';
// import { TextField, Select, MenuItem, InputLabel, FormControl, Button, Box, FormHelperText } from '@mui/material';
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
  FormHelperText,
  InputLabel,
  Input,
  FormControlLabel,
  Checkbox
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
  venderName: '',
  email: '',
  phoneNumber: '',
  alterntPhoneNumber: '',
  venderType: '',
  venderStatus: '',
  registrationDate: '',
  taxId: '',
  contactPerson: '',
  contactPerPhn: '',
  ContPerEmail: '',
  paymentTerm: '',
  reference_by: '',

  address1: '',
  address2: '',
  country: '',
  state: '',
  city: '',
  pinCode: '',

  address11: '',
  address22: '',
  country1: '',
  state1: '',
  city1: '',
  pinCode1: '',

  compilanceStatus: '',
  last_audited_docs: null,
  pan_num: '',
  tin_num: '',
  gst_num: '',
  vat_num: '',

  bankName: '',
  accountNumber: '',
  ifscCode: '',
  bank_ref_cheque: null,

  bankName1: '',
  accountNumber1: '',
  ifscCode1: '',
  bank_ref_cheque1: null,

  remark: ''
};
export default function VenderForm({ onClose, user, formMode }) {
  const [showTableHeading, setShowTableHeading] = useState({
    contactInformation: true,
    currentAddress: true,
    permanentAddress: false,
    complianceInformation: true,
    bankDetails: true,
    otherInformation: true
  });
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    getCountry();
    // getState();
    // getCity();
  }, []);
  const venderData = [
    { id: 10, name: 'Vendor Type 1' },
    { id: 20, name: 'Vendor Type 2' },
    { id: 30, name: 'Vendor Type 3' }
  ];
  const validate = () => {
    let tempErrors = {};
    if (!formValues.venderName) tempErrors.venderName = 'Incorrect entry.';
    if (!formValues.phoneNumber) {
      tempErrors.phoneNumber = 'Incorrect entry.';
    } else if (!/^\d{10}$/.test(formValues.phoneNumber)) {
      tempErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
    }
    if (!formValues.email) {
      tempErrors.email = 'Incorrect entry.';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      tempErrors.email = 'Email is not valid.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
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

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setFormValues((prevValues) => ({
        ...prevValues,
        permanentAddress: prevValues.currentAddress,
        country: prevValues.country,
        state: prevValues.state,
        city: prevValues.city,
        pinCode: prevValues.pinCode
      }));
    }
  };
  // get Country Data
  const getCountry = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/country`);
      const countries = response.data.map((country) => ({ id: country.country_id, name: country.country_name }));
      setCountryData(countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };
  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setFormValues({ ...formValues, country: selectedCountry, state: '', city: '' });
    await getState(selectedCountry);
  };
  // For State Data
  const getState = async (countryId) => {
    try {
      const response = await axios.get(`${BASE_URL}/country/state/${countryId}`);
      const states = response.data.map((state) => ({ id: state.state_id, name: state.state_name }));
      setStateData(states);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };
  const handleStateChange = async (e) => {
    const selectedState = e.target.value;
    setFormValues({ ...formValues, state: selectedState, city: '' });
    await getCity(formValues.country, selectedState);
  };
  // For City Data
  const getCity = async (countryId, stateId) => {
    try {
      const response = await axios.get(`${BASE_URL}/country/state/city/${stateId}`);
      const cities = response.data.map((city) => ({ id: city.city_id, name: city.city_name }));
      setCityData(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    if (!!errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      // Update formValues with the file object itself
      setFormValues({ ...formValues, itemImageUrl: file });
    }
  };
  const handleSubmit = async (event) => {
    console.log('event', event);
    event.preventDefault();
    if (validate()) {
      try {
        const postData = {
          vendor_name: formValues.venderName,
          address_line1: formValues.currentAddress,
          address_line2: formValues.perAddress,
          city_id: formValues.city,
          country_id: formValues.country,
          state_id: formValues.state,
          postal_code: formValues.pincode,
          phone_number: formValues.phoneNumber,
          alternate_phone_number: formValues.alterntPhoneNumber,
          email: formValues.email,
          contact_person: formValues.contactPerson,
          contact_person_phone: formValues.contactPerPhn,
          contact_person_email: formValues.ContPerEmail,
          tax_id: formValues.taxId,
          payment_terms: formValues.paymentTerm,
          bank1_name: formValues.bankName,
          bank1_account_number: formValues.accountNumber,
          bank1_ifsc_code: formValues.ifscCode,
          bank1_ref_cheque: formValues.bank_ref_cheque,
          bank2_name: formValues.bankName1,
          bank2_account_number: formValues.accountNumber1,
          bank2_ifsc_code: formValues.ifscCode1,
          bank2_ref_cheque: formValues.bank_ref_cheque1,
          last_audited_docs: formValues.last_audited_docs,
          pan_num: formValues.pan_num,
          tin_num: formValues.tin_num,
          gst_num: formValues.gst_num,
          vat_num: formValues.vat_num,
          reference_by: formValues.reference_by,
          vendor_type: formValues.venderType,
          vendor_status: formValues.venderStatus,
          registration_date: formValues.registrationDate,
          compliance_status: formValues.compilanceStatus,
          notes: formValues.remark,
          created_by: 'Riya'
        };
        console.log('postData', postData);

        const response = await axios.post(`${BASE_URL}/vendor`, postData);
        console.log('Form submitted successfully:', response.data);
      } catch (error) {
        console.error('Error submitting the form:', error);
      }
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Table>
          {renderTableHeader('contactInformation', 'Personal Detail')}
          {showTableHeading.contactInformation && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Vendor Name<span className="validation-star">*</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="venderName"
                        name="venderName"
                        variant="outlined"
                        fullWidth
                        value={formValues.venderName}
                        onChange={handleInputChange}
                      />
                      {!!errors.venderName && <FormHelperText error>{errors.venderName}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Email <span className="validation-star">*</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="email"
                        name="email"
                        variant="outlined"
                        fullWidth
                        value={formValues.email}
                        onChange={handleInputChange}
                      />
                      {!!errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Phone Number <span className="validation-star">*</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="phoneNumber"
                        name="phoneNumber"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.phoneNumber}
                        onChange={handleInputChange}
                      />
                      {!!errors.phoneNumber && <FormHelperText error>{errors.phoneNumber}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Alternate Phone Number</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="alterntPhoneNumber"
                        name="alterntPhoneNumber"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValues.alterntPhoneNumber}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Vendor Type</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select
                          labelId="venderType-label"
                          id="venderType"
                          name="venderType"
                          value={formValues.venderType}
                          onChange={handleInputChange}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {venderData.map((vender) => (
                            <MenuItem key={vender.id} value={vender.id}>
                              {vender.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.venderType && <FormHelperText error>{errors.venderType}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Vendor Status</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select
                          labelId="venderStatus-label"
                          id="venderStatus"
                          name="venderStatus"
                          value={formValues.venderStatus}
                          onChange={handleInputChange}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Active</MenuItem>
                          <MenuItem value={20}>Inactive</MenuItem>
                          <MenuItem value={30}>Blacklisted</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Registration Date</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="registrationDate"
                        name="registrationDate"
                        type="date"
                        variant="outlined"
                        fullWidth
                        value={formValues.registrationDate}
                        onChange={handleInputChange}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Tax ID</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="taxId"
                        name="taxId"
                        variant="outlined"
                        fullWidth
                        value={formValues.taxId}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Contact Person</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="contactPerson"
                        name="contactPerson"
                        variant="outlined"
                        fullWidth
                        value={formValues.contactPerson}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Contact Person Phone</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="contactPerPhn"
                        name="contactPerPhn"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.contactPerPhn}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Contact Person Email</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="ContPerEmail"
                        name="ContPerEmail"
                        variant="outlined"
                        fullWidth
                        value={formValues.ContPerEmail}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Payment Term</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="paymentTerm"
                        name="paymentTerm"
                        variant="outlined"
                        fullWidth
                        value={formValues.paymentTerm}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Reference By</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="reference_by"
                        name="reference_by"
                        variant="outlined"
                        fullWidth
                        value={formValues.reference_by}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        {/*...............address 1 ........... */}
        <Table>
          {renderTableHeader('currentAddress', 'Current Address')}
          {showTableHeading.currentAddress && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1"> Address 1</Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        id="address1"
                        name="address1"
                        variant="outlined"
                        fullWidth
                        value={formValues.address1}
                        onChange={handleInputChange}
                      />
                      {!!errors.address1 && <FormHelperText error>{errors.address1}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1"> Address 2</Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        id="address2"
                        name="address2"
                        variant="outlined"
                        fullWidth
                        value={formValues.address2}
                        onChange={handleInputChange}
                      />
                      {!!errors.address2 && <FormHelperText error>{errors.address2}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1" align="left">
                        Country
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="country" name="country" value={formValues.country} onChange={handleCountryChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {countryData.map((country) => (
                            <MenuItem key={country.id} value={country.id}>
                              {country.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.country && <FormHelperText error>{errors.country}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1" align="left">
                        State
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="state" name="state" value={formValues.state} onChange={handleStateChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {stateData.map((state) => (
                            <MenuItem key={state.id} value={state.id}>
                              {state.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.state && <FormHelperText error>{errors.state}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1" align="left">
                        City
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="city" name="city" value={formValues.city} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {cityData.map((city) => (
                            <MenuItem key={city.id} value={city.id}>
                              {city.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.city && <FormHelperText error>{errors.city}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1" align="left">
                        Pincode
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="pinCode"
                        name="pinCode"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValues.pinCode}
                        onChange={handleInputChange}
                      />
                      {!!errors.pinCode && <FormHelperText error>{errors.pinCode}</FormHelperText>}
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        {/*...............address 2 ........... */}
        <Table>
          {renderTableHeader('permanentAddress', 'Permanent Address')}
          {showTableHeading.permanentAddress && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <FormControlLabel
                    control={<Checkbox onChange={handleCheckboxChange} size="small" className="custom-checkbox" />}
                    label="Same as Current Address"
                    // style={{ fontSize: '5px' }}
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1" align="left">
                        Address 1
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        id="address11"
                        name="address11"
                        variant="outlined"
                        fullWidth
                        value={formValues.address11}
                        onChange={handleInputChange}
                      />
                      {!!errors.address11 && <FormHelperText error>{errors.address11}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1" align="left">
                        Address 2
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        id="address22"
                        name="address22"
                        variant="outlined"
                        fullWidth
                        value={formValues.address22}
                        onChange={handleInputChange}
                      />
                      {!!errors.address22 && <FormHelperText error>{errors.address22}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1" align="left">
                        Country
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="country1" name="country1" value={formValues.country1} onChange={handleCountryChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {countryData.map((country1) => (
                            <MenuItem key={country1.id} value={country1.id}>
                              {country1.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.country1 && <FormHelperText error>{errors.country1}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1" align="left">
                        State
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="state1" name="state1" value={formValues.state1} onChange={handleStateChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {stateData.map((state1) => (
                            <MenuItem key={state1.id} value={state1.id}>
                              {state1.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.state1 && <FormHelperText error>{errors.state1}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1" align="left">
                        City
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="city1" name="city1" value={formValues.city1} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {cityData.map((city1) => (
                            <MenuItem key={city1.id} value={city1.id}>
                              {city1.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.city && <FormHelperText error>{errors.city}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1" align="left">
                        Pincode
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="pinCode1"
                        name="pinCode1"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValues.pinCode1}
                        onChange={handleInputChange}
                      />
                      {!!errors.pinCode1 && <FormHelperText error>{errors.pinCode1}</FormHelperText>}
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <Table>
          {renderTableHeader('complianceInformation', 'Compliance Information')}
          {showTableHeading.complianceInformation && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Compliance Status</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="compilanceStatus"
                        name="compilanceStatus"
                        variant="outlined"
                        fullWidth
                        value={formValues.compilanceStatus}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Last Audited Docs</Typography>
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
                      <Typography variant="subtitle1">PAN Number</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="pan_num"
                        name="pan_num"
                        variant="outlined"
                        fullWidth
                        value={formValues.pan_num}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">TIN Number</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="tin_num"
                        name="tin_num"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.tin_num}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">GST Number</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="gst_num"
                        name="gst_num"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.gst_num}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">VAT Number</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="vat_num"
                        name="vat_num"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={formValues.vat_num}
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
          {renderTableHeader('bankDetails', 'Bank Detail')}
          {showTableHeading.bankDetails && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Bank Name</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="bankName"
                        name="bankName"
                        variant="outlined"
                        fullWidth
                        value={formValues.bankName}
                        onChange={handleInputChange}
                      />
                      {!!errors.bankName && <FormHelperText error>{errors.bankName}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Account Number</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="accountNumber"
                        name="accountNumber"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValues.accountNumber}
                        onChange={handleInputChange}
                      />
                      {!!errors.accountNumber && <FormHelperText error>{errors.accountNumber}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">IFSC Code</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="ifscCode"
                        name="ifscCode"
                        variant="outlined"
                        fullWidth
                        value={formValues.ifscCode}
                        onChange={handleInputChange}
                      />
                      {!!errors.ifscCode && <FormHelperText error>{errors.ifscCode}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Bank Ref Cheque</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div>
                        <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                          Upload File
                          <VisuallyHiddenInput type="file" name="bank_ref_cheque" id="bank_ref_cheque" onChange={handleFileChange} />
                        </Button>
                        {fileName && <span style={{ color: 'blue' }}>{fileName}</span>}
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Bank Name 1</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="bankName1"
                        name="bankName1"
                        variant="outlined"
                        fullWidth
                        value={formValues.bankName1}
                        onChange={handleInputChange}
                      />
                      {!!errors.bankName1 && <FormHelperText error>{errors.bankName1}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Account Number 1</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="accountNumber1"
                        name="accountNumber1"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={formValues.accountNumber1}
                        onChange={handleInputChange}
                      />
                      {!!errors.accountNumber1 && <FormHelperText error>{errors.accountNumber1}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">IFSC Code 1</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="ifscCode1"
                        name="ifscCode1"
                        variant="outlined"
                        fullWidth
                        value={formValues.ifscCode1}
                        onChange={handleInputChange}
                      />
                      {!!errors.ifscCode1 && <FormHelperText error>{errors.ifscCode1}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Bank Ref Cheque 1</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <div>
                        <Button component="label" sx={{ marginBottom: '0' }} variant="contained" startIcon={<CloudUploadIcon />}>
                          Upload File
                          <VisuallyHiddenInput type="file" name="bank_ref_cheque1" id="bank_ref_cheque1" onChange={handleFileChange} />
                        </Button>
                        {fileName && <span style={{ color: 'blue' }}>{fileName}</span>}
                      </div>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <Table>
          {renderTableHeader('otherInformation', 'Other Detail')}
          {showTableHeading.otherInformation && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Remark</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id="remark"
                        name="remark"
                        variant="outlined"
                        fullWidth
                        value={formValues.remark}
                        onChange={handleInputChange}
                      />
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

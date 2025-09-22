import React, { useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
import axios from 'axios';
import Grid from '@mui/material/Grid';
// import { Select, MenuItem, InputLabel, FormControl, Button, Box, FormHelperText, TextField } from '@mui/material';
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
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { BASE_URL } from 'AppConstants';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

// Initial form values
const initialFormValues = {
  userName: '',
  password: '',
  resigDate: '',
  role: '',
  firstName: '',
  lastName: '',
  phoneNo: '',
  email: '',
  dobBirth: '',
  designation: '',
  department: '',

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
  pinCode1: ''
};

export default function UserForm({ onClose, user, formMode }) {
  const [showTableHeading, setShowTableHeading] = useState({
    userLoginDetails: true,
    userPersonalDetail: true,
    currentAddressDetails: true,
    permanentAddressDetails: true
  });
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [userRole, setUserRole] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  useEffect(() => {
    getUserRole();
    getCountry();
  }, []);
  const department = [
    { id: 1, name: 'Human Resources' },
    { id: 2, name: 'Finance' },
    { id: 3, name: 'Engineering' },
    { id: 4, name: 'Marketing' },
    { id: 5, name: 'Sales' }
  ];

  const designation = [
    { id: 1, name: 'Manager' },
    { id: 2, name: 'Team Lead' },
    { id: 3, name: 'Senior Developer' },
    { id: 4, name: 'Junior Developer' },
    { id: 5, name: 'Intern' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    if (!!errors[name]) {
      setErrors({ ...errors, [name]: '' });
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
        <TableCell colSpan={6}>
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

  const validate = () => {
    let tempErrors = {};
    if (!formValues.firstName) tempErrors.firstName = 'Field Required.';
    if (!formValues.lastName) tempErrors.lastName = 'Field Required.';
    if (!formValues.phoneNo) {
      tempErrors.phoneNo = 'Field Required.';
    } else if (!/^\d{10}$/.test(formValues.phoneNo)) {
      tempErrors.phoneNo = 'Phone number must be exactly 10 digits.';
    }
    if (!formValues.email) {
      tempErrors.email = 'Field Required.';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      tempErrors.email = 'Email is not valid.';
    }
    // if (!formValues.requestedBy) tempErrors.requestedBy = 'Incorrect entry.';
    // if (!formValues.address1) tempErrors.address1 = 'Incorrect entry.';
    // if (!formValues.permanentAddress) tempErrors.permanentAddress = 'Incorrect entry.';
    // if (!formValues.country) tempErrors.country = 'Incorrect entry.';
    // if (!formValues.state) tempErrors.state = 'Incorrect entry.';
    // if (!formValues.city) tempErrors.city = 'Incorrect entry.';
    // if (!formValues.pinCode) tempErrors.pinCode = 'Incorrect entry.';
    // if (!formValues.dobBirth) tempErrors.dobBirth = 'Incorrect entry.';
    // if (!formValues.resigDate) tempErrors.resigDate = 'Incorrect entry.';
    // if (!formValues.role) tempErrors.role = 'Incorrect entry.';
    // if (!formValues.password && formMode === 'create') tempErrors.password = 'Incorrect entry.';
    // if (!formValues.userName) tempErrors.userName = 'Incorrect entry.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setFormValues((prevValues) => ({
        ...prevValues,
        permanentAddress: prevValues.address1,
        country: prevValues.country,
        state: prevValues.state,
        city: prevValues.city,
        pinCode: prevValues.pinCode
      }));
    }
  };

  // For get User Role
  const getUserRole = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/role/getroles`);
      console.log('res', response);
      const deliveryTimelineData = response.data.map((timeline) => ({
        id: timeline.role_id,
        name: timeline.role_name
      }));
      setUserRole(deliveryTimelineData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryTime: 'Failed to load timeline'
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submit', event);

    const mapFrontendToBackendKeys = (frontendData) => {
      return {
        employee_id: '',
        username: frontendData.userName,
        password: frontendData.password,
        first_name: frontendData.firstName,
        last_name: frontendData.lastName,
        email: frontendData.email,
        phone_number: frontendData.phoneNo,
        address_line11: frontendData.address1,
        address_line12: frontendData.address2,
        city: frontendData.city,
        state: frontendData.state,
        country: frontendData.country,
        postal_code: frontendData.pinCode,
        address_line21: frontendData.address11,
        address_line22: frontendData.address22,
        city1: frontendData.city1,
        state1: frontendData.state1,
        country1: frontendData.country1,
        postal_code1: frontendData.pinCode1,
        date_of_birth: frontendData.dobBirth,
        registration_date: frontendData.resigDate,
        is_active: '',
        role: frontendData.role,
        department: frontendData.department,
        designation: frontendData.designation,
        notes: '',
        created_by: 'User'
      };
    };

    const isValid = validate();
    // const isValid = true;

    if (isValid) {
      const requestData = mapFrontendToBackendKeys(formValues);
      console.log(requestData);

      try {
        console.log('API hit', requestData);
        const response = await axios.post(`${BASE_URL}/api/user/adduser`, requestData);

        console.log('Form submitted successfully:', response);
        setFormValues(initialFormValues);
        // setShowTableHeading((prevState) => ({
        //   ...prevState,
        //   createOPR: false,
        //   userPersonalDetail: true
        // }));
      } catch (error) {
        console.error('Error submitting form:', error.response ? error.response.data : error.message);
      }
    } else {
      console.log('Validation failed', errors);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Table>
          {renderTableHeader('userLoginDetails', 'User Login Detail')}
          {showTableHeading.userLoginDetails && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">User Name</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="userName"
                        name="userName"
                        variant="outlined"
                        fullWidth
                        value={formValues.userName}
                        onChange={handleInputChange}
                      />
                      {!!errors.userName && <FormHelperText error>{errors.userName}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Password</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="password"
                        name="password"
                        variant="outlined"
                        fullWidth
                        value={formValues.password}
                        onChange={handleInputChange}
                        type="password"
                      />
                      {!!errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Registration Date</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="resigDate"
                        name="resigDate"
                        variant="outlined"
                        fullWidth
                        type="date"
                        value={formValues.resigDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                      {!!errors.resigDate && <FormHelperText error>{errors.resigDate}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Role</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="role" name="role" value={formValues.role} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {userRole.map((data) => (
                            <MenuItem key={data.id} value={data.id}>
                              {data.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.role && <FormHelperText error>{errors.role}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <Table>
          {renderTableHeader('userPersonalDetail', 'Personal Detail')}
          {showTableHeading.userPersonalDetail && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        First Name <span className="validation-star">*</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="firstName"
                        name="firstName"
                        variant="outlined"
                        fullWidth
                        value={formValues.firstName}
                        onChange={handleInputChange}
                      />
                      {!!errors.firstName && <FormHelperText error>{errors.firstName}</FormHelperText>}
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Last Name <span className="validation-star">*</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="lastName"
                        name="lastName"
                        variant="outlined"
                        fullWidth
                        value={formValues.lastName}
                        onChange={handleInputChange}
                      />
                      {!!errors.lastName && <FormHelperText error>{errors.lastName}</FormHelperText>}
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">
                        Phone No <span className="validation-star">*</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="phoneNo"
                        name="phoneNo"
                        variant="outlined"
                        fullWidth
                        value={formValues.phoneNo}
                        onChange={handleInputChange}
                      />
                      {!!errors.phoneNo && <FormHelperText error>{errors.phoneNo}</FormHelperText>}
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
                      <Typography variant="subtitle1">DOB</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="dobBirth"
                        name="dobBirth"
                        variant="outlined"
                        fullWidth
                        type="date"
                        value={formValues.dobBirth}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                      {!!errors.dobBirth && <FormHelperText error>{errors.dobBirth}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Designation</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="designation" name="designation" value={formValues.designation} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {designation.map((designation) => (
                            <MenuItem key={designation.id} value={designation.id}>
                              {designation.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.designation && <FormHelperText error>{errors.designation}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Department</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="department" name="department" value={formValues.department} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {department.map((department) => (
                            <MenuItem key={department.id} value={department.id}>
                              {department.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.department && <FormHelperText error>{errors.department}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <Table>
          {renderTableHeader('currentAddressDetails', 'Current Address Detail')}

          {showTableHeading.currentAddressDetails && (
            <TableBody>
              <TableRow sx={{ marginTop: '10px', marginBottom: '10px' }}>
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
        <Table>
          {renderTableHeader('permanentAddressDetails', 'Permanent Address Detail')}

          {showTableHeading.permanentAddressDetails && (
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

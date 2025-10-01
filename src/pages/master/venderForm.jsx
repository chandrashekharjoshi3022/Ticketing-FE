import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Box,
  IconButton,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import SubmitButton from 'components/CustomSubmitBtn';
import CancelButton from 'components/CustomCancelButton';

const initialFormValues = {
  userName: '',
  password: '',
  resigDate: new Date().toISOString().split('T')[0],
  role: '',
  firstName: '',
  lastName: '',
  phoneNo: '',
  email: '',
  dobBirth: '',
  designation: '',
  is_active: 1,
  department: '',
  address1: '',
  address2: '',
  country: '',
  state: '',
  city: '',
  pincode: '',
  address11: '',
  address22: '',
  country1: '',
  state1: '',
  city1: '',
  pinCode1: ''
};

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, 'User Name should be alphabetical')
    .required('User Name is required'),
  password: Yup.string().required('Password is required'),
  resigDate: Yup.date().required('Registration Date is required'),
  firstName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, 'First Name should be alphabetical')
    .required('First name is required'),
  lastName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, 'Last Name should be alphabetical')
    .required('Last Name is required'),
  phoneNo: Yup.string()
    .matches(/^\d{10}$/, 'Phone No must be 10 digits')
    .required('Phone No is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  role: Yup.string().required('Please select role'),
  dobBirth: Yup.date().required('DOB is required'),
  designation: Yup.string().required('Designation is required'),
  department: Yup.string().required('Department is required'),
  pincode: Yup.string()
    .matches(/^\d*$/, 'Pincode must be a number')
    .min(6, 'Pincode must be exactly 6 digits')
    .max(6, 'Pincode must be exactly 6 digits')
    .required('Pincode is required')
});

// Hardcoded data
const hardcodedRoles = [
  { role_id: 1, role_name: 'Admin' },
  { role_id: 2, role_name: 'Manager' },
  { role_id: 3, role_name: 'User' }
];

const hardcodedDepartments = [
  { dept_id: 1, dept_name: 'IT' },
  { dept_id: 2, dept_name: 'HR' },
  { dept_id: 3, dept_name: 'Finance' }
];

const hardcodedDesignations = [
  { designation_id: 1, designation_name: 'Software Engineer' },
  { designation_id: 2, designation_name: 'Senior Software Engineer' },
  { designation_id: 3, designation_name: 'Team Lead' }
];

const hardcodedCountries = [
  { id: 1, name: 'United States' },
  { id: 2, name: 'India' },
  { id: 3, name: 'United Kingdom' }
];

const hardcodedStates = [
  { id: 1, name: 'California' },
  { id: 2, name: 'Texas' },
  { id: 3, name: 'Maharashtra' }
];

const hardcodedCities = [
  { id: 1, name: 'Los Angeles' },
  { id: 2, name: 'Mumbai' },
  { id: 3, name: 'London' }
];

export default function VenderForm({ onClose, formMode }) {
  const [showTableHeading, setShowTableHeading] = useState({
    userLoginDetails: true,
    userPersonalDetail: true,
    currentAddressDetails: true,
    permanentAddressDetails: true
  });

  const [countriesList, setCountriesList] = useState(hardcodedCountries);
  const [stateList, setStateList] = useState(hardcodedStates);
  const [cityList, setCityList] = useState(hardcodedCities);
  const [same, setSame] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('=== FORM SUBMISSION DATA ===');
    console.log('Form Values:', values);
    console.log('Form Mode:', formMode);
    console.log('Same Address:', same);
    console.log('=== END FORM DATA ===');

    // Show success message
    setSnackbarMessage(formMode === 'create' ? 'User created successfully!' : 'User updated successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);

    setSubmitting(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const handleCountryChange = (event, value, setFieldValue, fieldName) => {
    console.log('Country selected:', value);
    if (value) {
      setFieldValue(fieldName, value.name);
    } else {
      setFieldValue(fieldName, '');
    }
  };

  const handleStateChange = (event, value, setFieldValue, fieldName) => {
    console.log('State selected:', value);
    if (value) {
      setFieldValue(fieldName, value.name);
    } else {
      setFieldValue(fieldName, '');
    }
  };

  const handleCityChange = (event, value, setFieldValue, fieldName) => {
    console.log('City selected:', value);
    if (value) {
      setFieldValue(fieldName, value.name);
    } else {
      setFieldValue(fieldName, '');
    }
  };

  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0, paddingLeft: '8px !important' }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600} textTransform={'none'}>
              {sectionLabel}
            </Typography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  // Simple styled components for the form
  const FieldPadding = ({ field, form, ...props }) => (
    <TextField {...field} {...props} size="small" sx={{ '& .MuiInputBase-input': { padding: '8px 12px' } }} />
  );

  const SelectFieldPadding = ({ field, form, children, ...props }) => (
    <Select {...field} {...props} size="small" sx={{ '& .MuiSelect-select': { padding: '8px 12px' } }}>
      {children}
    </Select>
  );

  const CustomNumberField = ({ field, form, ...props }) => (
    <TextField {...field} {...props} type="number" size="small" sx={{ '& .MuiInputBase-input': { padding: '8px 12px' } }} />
  );

  const ValidationStar = () => <span style={{ color: 'red' }}>*</span>;

  const errorMessageStyle = { color: 'red', fontSize: '12px', marginTop: '4px' };

  return (
    <>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <Table>
              {renderTableHeader('userLoginDetails', 'User Login Detail')}
              {showTableHeading.userLoginDetails && (
                <Box padding={1}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        User Name
                        <ValidationStar />
                      </Typography>
                      <Field as={FieldPadding} name="userName" variant="outlined" fullWidth />
                      <ErrorMessage name="userName" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Password
                        <ValidationStar />
                      </Typography>
                      <Field as={FieldPadding} name="password" type="password" variant="outlined" fullWidth />
                      <ErrorMessage name="password" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Registration Date
                        <ValidationStar />
                      </Typography>
                      <Field as={FieldPadding} type="date" name="resigDate" variant="outlined" fullWidth />
                      <ErrorMessage name="resigDate" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Role
                        <ValidationStar />
                      </Typography>
                      <Field as={SelectFieldPadding} name="role" variant="outlined" value={values.role} fullWidth>
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {hardcodedRoles.map((role) => (
                          <MenuItem key={role.role_id} value={role.role_id}>
                            {role.role_name}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="role" component="div" style={errorMessageStyle} />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Table>

            <Table>
              {renderTableHeader('userPersonalDetail', 'Personal Detail')}
              {showTableHeading.userPersonalDetail && (
                <Box padding={1}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        First Name
                        <ValidationStar />
                      </Typography>
                      <Field as={FieldPadding} name="firstName" variant="outlined" fullWidth />
                      <ErrorMessage name="firstName" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Last Name
                        <ValidationStar />
                      </Typography>
                      <Field as={FieldPadding} name="lastName" variant="outlined" fullWidth />
                      <ErrorMessage name="lastName" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Phone No
                        <ValidationStar />
                      </Typography>
                      <Field as={CustomNumberField} name="phoneNo" variant="outlined" fullWidth />
                      <ErrorMessage name="phoneNo" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Email
                        <ValidationStar />
                      </Typography>
                      <Field as={FieldPadding} name="email" type="email" variant="outlined" fullWidth />
                      <ErrorMessage name="email" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        DOB
                        <ValidationStar />
                      </Typography>
                      <Field as={FieldPadding} name="dobBirth" type="date" variant="outlined" fullWidth />
                      <ErrorMessage name="dobBirth" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Department
                        <ValidationStar />
                      </Typography>
                      <Field as={SelectFieldPadding} name="department" variant="outlined" value={values.department} fullWidth>
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {hardcodedDepartments.map((department) => (
                          <MenuItem key={department.dept_id} value={department.dept_id}>
                            {department.dept_name}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="department" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Designation
                        <ValidationStar />
                      </Typography>
                      <Field as={SelectFieldPadding} name="designation" variant="outlined" value={values.designation} fullWidth>
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {hardcodedDesignations.map((designation) => (
                          <MenuItem key={designation.designation_id} value={designation.designation_id}>
                            {designation.designation_name}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="designation" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Is Active
                        <ValidationStar />
                      </Typography>
                      <Field as={SelectFieldPadding} name="is_active" variant="outlined" value={values.is_active} fullWidth>
                        <MenuItem value={0}>No</MenuItem>
                        <MenuItem value={1}>Yes</MenuItem>
                      </Field>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Table>

            <Table>
              {renderTableHeader('currentAddressDetails', 'Current Address Detail')}
              {showTableHeading.currentAddressDetails && (
                <Box padding={1}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <Typography variant="body2">Address 1</Typography>
                      <Field as={FieldPadding} name="address1" variant="outlined" fullWidth />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <Typography variant="body2">Address 2</Typography>
                      <Field as={FieldPadding} name="address2" variant="outlined" fullWidth />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">Country</Typography>
                      <Autocomplete
                        options={countriesList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
                        value={countriesList.find((country) => country.name === values.country) || null}
                        onChange={(event, value) => handleCountryChange(event, value, setFieldValue, 'country')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">State</Typography>
                      <Autocomplete
                        options={stateList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
                        value={stateList.find((state) => state.name === values.state) || null}
                        onChange={(event, value) => handleStateChange(event, value, setFieldValue, 'state')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">City</Typography>
                      <Autocomplete
                        options={cityList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
                        value={cityList.find((city) => city.name === values.city) || null}
                        onChange={(event, value) => handleCityChange(event, value, setFieldValue, 'city')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">Pincode</Typography>
                      <Field as={CustomNumberField} name="pincode" variant="outlined" fullWidth />
                      <ErrorMessage name="pincode" component="div" style={errorMessageStyle} />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Table>

            <Table>
              {renderTableHeader('permanentAddressDetails', 'Permanent Address Detail')}
              {showTableHeading.permanentAddressDetails && (
                <Box padding={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => {
                          if (!same) {
                            setFieldValue('address11', values.address1);
                            setFieldValue('address22', values.address2);
                            setFieldValue('country1', values.country);
                            setFieldValue('state1', values.state);
                            setFieldValue('city1', values.city);
                            setFieldValue('pinCode1', values.pincode);
                          } else {
                            setFieldValue('address11', '');
                            setFieldValue('address22', '');
                            setFieldValue('country1', '');
                            setFieldValue('state1', '');
                            setFieldValue('city1', '');
                            setFieldValue('pinCode1', '');
                          }
                          setSame((prev) => !prev);
                        }}
                        checked={same}
                      />
                    }
                    label="Same as Current Address"
                  />

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <Typography variant="body2">Address 1</Typography>
                      <Field as={FieldPadding} name="address11" variant="outlined" fullWidth />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <Typography variant="body2">Address 2</Typography>
                      <Field as={FieldPadding} name="address22" variant="outlined" fullWidth />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">Country</Typography>
                      <Autocomplete
                        options={countriesList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
                        value={countriesList.find((country) => country.name === values.country1) || null}
                        onChange={(event, value) => handleCountryChange(event, value, setFieldValue, 'country1')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">State</Typography>
                      <Autocomplete
                        options={stateList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
                        value={stateList.find((state) => state.name === values.state1) || null}
                        onChange={(event, value) => handleStateChange(event, value, setFieldValue, 'state1')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">City</Typography>
                      <Autocomplete
                        options={cityList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
                        value={cityList.find((city) => city.name === values.city1) || null}
                        onChange={(event, value) => handleCityChange(event, value, setFieldValue, 'city1')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2">Pincode</Typography>
                      <Field as={CustomNumberField} name="pinCode1" variant="outlined" fullWidth />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Table>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
              <SubmitButton variant="contained" type="submit" disabled={isSubmitting}>
                {formMode === 'create' ? 'Submit' : 'Update'}
              </SubmitButton>
              <CancelButton type="button" onClick={onClose}>
                Cancel
              </CancelButton>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}

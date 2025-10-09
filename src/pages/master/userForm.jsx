import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import FieldPadding from 'components/FieldPadding';
import SelectFieldPadding from 'components/selectFieldPadding';

// Redux imports - only import what actually exists
import { createUser, updateUser, clearUserError } from 'features/users/usersSlice';
import { toast } from 'react-toastify';

// Initial form values
const getInitialFormValues = (user = null) => ({
  // User Login Details
  userName: user?.username || '',
  password: '',
  resigDate: user?.registration_date
    ? new Date(user.registration_date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0],
  role: user?.role_name || '',

  // Personal Details
  firstName: user?.first_name || '',
  lastName: user?.last_name || '',
  phoneNo: user?.phone_no || '',
  email: user?.email || '',
  dobBirth: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
  designation: user?.designation || '',
  is_active: user?.is_active !== undefined ? (user.is_active ? 1 : 0) : 1,
  department: user?.department || '',

  // Current Address
  address1: user?.address1 || '',
  address2: user?.address2 || '',
  country: user?.country || '',
  state: user?.state || '',
  city: user?.city || '',
  pincode: user?.pincode || '',

  // Permanent Address
  address11: user?.permanent_address1 || '',
  address22: user?.permanent_address2 || '',
  country1: user?.permanent_country || '',
  state1: user?.permanent_state || '',
  city1: user?.permanent_city || '',
  pinCode1: user?.permanent_pincode || ''
});

// Validation Schema
const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, 'User Name should be alphabetical')
    .required('User Name is required'),
  // password: Yup.string()
  //   .when('formMode', {
  //     is: 'create',
  //     then: (schema) => schema.required('Password is required'),
  //     otherwise: (schema) => schema.notRequired()
  //   }),
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

// Hardcoded data - use this directly since APIs don't exist
const hardcodedRoles = [
  { role_id: 1, role_name: 'admin' },
  { role_id: 2, role_name: 'manager' },
  { role_id: 3, role_name: 'user' },
  { role_id: 4, role_name: 'executive' }
];

const hardcodedDepartments = [
  { dept_id: 1, dept_name: 'IT' },
  { dept_id: 2, dept_name: 'HR' },
  { dept_id: 3, dept_name: 'Finance' },
  { dept_id: 4, dept_name: 'Operations' }
];

const hardcodedDesignations = [
  { designation_id: 1, designation_name: 'Software Engineer' },
  { designation_id: 2, designation_name: 'Senior Software Engineer' },
  { designation_id: 3, designation_name: 'Team Lead' },
  { designation_id: 4, designation_name: 'Project Manager' }
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

export default function UserForm({ user, formMode, onClose }) {
  const dispatch = useDispatch();

  // Only get the state properties that actually exist
  const { operationLoading, operationError } = useSelector((state) => state.users);

  const [showTableHeading, setShowTableHeading] = useState({
    userLoginDetails: true,
    userPersonalDetail: true,
    currentAddressDetails: true,
    permanentAddressDetails: true
  });

  const [countriesList] = useState(hardcodedCountries);
  const [stateList] = useState(hardcodedStates);
  const [cityList] = useState(hardcodedCities);
  const [same, setSame] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Use hardcoded data directly - no API calls needed
  const rolesList = hardcodedRoles;
  const departmentsList = hardcodedDepartments;
  const designationsList = hardcodedDesignations;

  // Handle operation status changes
  useEffect(() => {
    if (operationError) {
      toast.error(operationError.message || 'Operation failed');
      dispatch(clearUserError());
    }
  }, [operationError, dispatch]);

  // Handle form submission with Redux
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      console.log('=== FORM SUBMISSION DATA ===');
      console.log('Form Values:', values);
      console.log('Form Mode:', formMode);
      console.log('Same Address:', same);
      console.log('=== END FORM DATA ===');

      const userData = {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone_no: values.phoneNo,
        dob: values.dobBirth,
        designation: values.designation,
        department: values.department,
        role_name: values.role,
        address1: values.address1,
        address2: values.address2,
        country: values.country,
        state: values.state,
        city: values.city,
        pincode: values.pincode,
        permanent_address1: values.address11,
        permanent_address2: values.address22,
        permanent_country: values.country1,
        permanent_state: values.state1,
        permanent_city: values.city1,
        permanent_pincode: values.pinCode1,
        is_active: values.is_active === 1
      };

      if (formMode === 'create') {
        userData.username = values.userName;
        userData.password = values.password;

        await dispatch(createUser(userData)).unwrap();

        toast.success('User created successfully! Login credentials sent to email.');

        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        if (values.password) {
          userData.reset_password = true;
          userData.password = values.password;
        }

        await dispatch(
          updateUser({
            id: user.user_id || user.id,
            payload: userData
          })
        ).unwrap();

        toast.success(values.password ? 'User updated successfully! New credentials sent to email.' : 'User updated successfully!');

        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to save user');
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
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
    if (value) {
      setFieldValue(fieldName, value.name);
    } else {
      setFieldValue(fieldName, '');
    }
  };

  const handleStateChange = (event, value, setFieldValue, fieldName) => {
    if (value) {
      setFieldValue(fieldName, value.name);
    } else {
      setFieldValue(fieldName, '');
    }
  };

  const handleCityChange = (event, value, setFieldValue, fieldName) => {
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

      <Formik initialValues={getInitialFormValues(user)} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form>
            {/* Add formMode to context for conditional validation */}
            <input type="hidden" name="formMode" value={formMode} />

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
                      <Field as={FieldPadding} name="userName" variant="outlined" fullWidth disabled={formMode === 'edit'} />
                      <ErrorMessage name="userName" component="div" style={errorMessageStyle} />
                    </Grid>

                    {/* <Grid item xs={12} sm={2}>
                      <Typography variant="body2">
                        Password
                        {formMode === 'create' && <ValidationStar />}
                      </Typography>
                      <Field 
                        as={FieldPadding} 
                        name="password" 
                        type="password" 
                        variant="outlined" 
                        fullWidth 
                        placeholder={formMode === 'edit' ? 'Leave blank to keep current password' : ''}
                      />
                      <ErrorMessage name="password" component="div" style={errorMessageStyle} />
                    </Grid> */}

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
                          <em>Select Role</em>
                        </MenuItem>
                        {rolesList.map((role) => (
                          <MenuItem key={role.role_id} value={role.role_name}>
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
                          <em>Select Department</em>
                        </MenuItem>
                        {departmentsList.map((department) => (
                          <MenuItem key={department.dept_id} value={department.dept_name}>
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
                          <em>Select Designation</em>
                        </MenuItem>
                        {designationsList.map((designation) => (
                          <MenuItem key={designation.designation_id} value={designation.designation_name}>
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
                      <Typography variant="body2">
                        Pincode <ValidationStar />
                      </Typography>
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
              <SubmitButton variant="contained" type="submit" disabled={isSubmitting || operationLoading}>
                {operationLoading ? 'Processing...' : formMode === 'create' ? 'Submit' : 'Update'}
              </SubmitButton>
              <CancelButton type="button" onClick={onClose} disabled={operationLoading}>
                Cancel
              </CancelButton>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}

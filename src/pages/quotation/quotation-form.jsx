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
import { DataGrid } from '@mui/x-data-grid';

// Initial form values
const initialFormValues = {
  vendor_id: '',
  reference_no: '',
  reference_date: '',
  quo_date: '',
  currency_id: '',
  delivery_terms: '',
  country_origin_id: '',
  country_supply_id: '',
  port_loading: '',
  lead_time: '',
  payment_terms: '',
  remarks: '',
  invalid_charges: '',
  freight_charges: '',
  inspection_charges: '',
  thc: '',
  container_stuffing: '',
  container_seal: '',
  bl: '',
  vgm: '',
  miscellaneous: ''
};

export default function QuotationForm({ onClose, user, formMode }) {
  const [showTableHeading, setShowTableHeading] = useState({
    userLoginDetails: true,
    userPersonalDetail: true,
    currentAddressDetails: true,
    permanentAddressDetails: true
  });
  const [country, setCountry] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [itemCost, setItemCost] = useState({});
  const [sum, setSum] = useState(0);

  useEffect(() => {
    getLoadCountry();
    getLoadVendor();
  }, []);
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
  const handleInputTextField = (e, id) => {
    const { name, value } = e.target;
    const updatedItemCost = {
      ...itemCost,
      [id]: {
        ...itemCost[id],
        [name]: value
      }
    };
    setItemCost(updatedItemCost);
  };
  const TableHeader = [
    { field: 'quo_num', headerName: 'OPR Line Number', width: 150 },
    { field: 'rfq_id', headerName: 'Item Type', width: 150 },
    { field: 'vendor_id', headerName: 'Item Specification', width: 150 },
    { field: 'reference_no', headerName: 'Item Description', width: 200 },
    { field: 'reference_date', headerName: 'OPR Qty', width: 75 },
    { field: 'quo_date', headerName: 'OPO Qty', width: 75 },
    {
      field: 'quote_qty',
      headerName: 'Quote Qty',
      width: 150,
      renderCell: (params) => (
        <TextField
          type="number"
          name="qty"
          value={itemCost[params.row.id]?.qty || 0}
          onChange={(e) => handleInputTextField(e, params.row.id)}
        />
      )
    },
    {
      field: 'rate',
      headerName: 'Rate',
      width: 150,
      renderCell: (params) => (
        <TextField
          type="number"
          name="rate"
          value={itemCost[params.row.id]?.rate || 0}
          onChange={(e) => handleInputTextField(e, params.row.id)}
        />
      )
    },
    {
      field: 'Remarks',
      headerName: 'remarks',
      width: 150,
      renderCell: (params) => (
        <TextField
          type="text"
          name="remarks"
          value={itemCost[params.row.id]?.remarks}
          onChange={(e) => handleInputTextField(e, params.row.id)}
        />
      )
    },
    {
      field: 'total_cost',
      headerName: 'Total Cost',
      width: 150,
      renderCell: (params) => <span>{calculateTotalCost(itemCost)[params.row.id] || 0}</span>
    }
  ];

  const initialFaQItemData = [
    {
      id: 1,
      quo_num: '001',
      rfq_id: 'Type A',
      vendor_id: 'Spec 1',
      reference_no: 'Description of Item 1',
      reference_date: '100',
      quo_date: '90',
      quote_qty: '',
      rate: '',
      remark: ''
    },
    {
      id: 2,
      quo_num: '002',
      rfq_id: 'Type B',
      vendor_id: 'Spec 2',
      reference_no: 'Description of Item 2',
      reference_date: '200',
      quo_date: '180',
      quote_qty: '',
      rate: '',
      remark: ''
    },
    {
      id: 3,
      quo_num: '003',
      rfq_id: 'Type C',
      vendor_id: 'Spec 3',
      reference_no: 'Description of Item 3',
      reference_date: '150',
      quo_date: '140',
      quote_qty: '',
      rate: '',
      remark: ''
    },
    {
      id: 4,
      quo_num: '004',
      rfq_id: 'Type D',
      vendor_id: 'Spec 4',
      reference_no: 'Description of Item 4',
      reference_date: '300',
      quo_date: '290',
      quote_qty: '',
      rate: '',
      remark: ''
    },
    {
      id: 5,
      quo_num: '005',
      rfq_id: 'Type E',
      vendor_id: 'Spec 5',
      reference_no: 'Description of Item 5',
      reference_date: '250',
      quo_date: '240',
      quote_qty: '',
      rate: '',
      remark: ''
    }
  ];

  const [faqItemData, setFaqItemData] = useState(initialFaQItemData);
  const handleFAQInputChange = (e, field, id) => {
    const newValue = e.target.value;
    setFaqItemData(faqItemData.map((row) => (row.id === id ? { ...row, [field]: newValue } : row)));
  };
  const calculateTotals = () => {
    let totalCost = 0;
    faqItemData.forEach((row) => {
      const qty = parseFloat(row.quote_qty) || 0;
      const rate = parseFloat(row.rate) || 0;
      totalCost += qty * rate;
    });
    const additionalCost = totalCost * 0.1; // Example additional cost (10% of total cost)
    const grandTotal = totalCost + additionalCost;
    return { totalCost, additionalCost, grandTotal };
  };
  const totals = calculateTotals();

  // For Country
  const getLoadCountry = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/country`);
      const countryData = response.data.map((country) => ({
        id: country.country_id,
        name: country.country_name,
        currency: country.currency
      }));
      setCountry(countryData);
    } catch (error) {
      console.error('Error fetching country:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        division: 'Failed to load country'
      }));
    }
  };

  // For Vendor
  const getLoadVendor = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/vendor`);
      let vendorData = response.data.map((vendor) => ({
        id: vendor.vendor_id,
        name: vendor.vendor_name
      }));
      setVendorData(vendorData);
    } catch (error) {
      console.error('Error fetching Vendor:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        Vendor: 'Failed to load Vendor'
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    if (!errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formValues.vendor_id) tempErrors.vendor_id = 'Required *';
    if (!formValues.reference_no) tempErrors.reference_no = 'Required *';
    if (!formValues.reference_date) tempErrors.reference_date = 'Required *';
    if (!formValues.quo_date) tempErrors.quo_date = 'Required *';
    if (!formValues.currency_id) tempErrors.currency_id = 'Required *';
    if (!formValues.delivery_terms) tempErrors.delivery_terms = 'Required *';
    if (!formValues.country_origin_id) tempErrors.country_origin_id = 'Required *';
    if (!formValues.country_supply_id) tempErrors.country_supply_id = 'Required *';
    if (!formValues.port_loading) tempErrors.port_loading = 'Required *';
    if (!formValues.lead_time) tempErrors.lead_time = 'Required *';
    if (!formValues.payment_terms) tempErrors.payment_terms = 'Required *';
    if (!formValues.remarks) tempErrors.remarks = 'Required *';
    if (!formValues.invalid_charges) tempErrors.invalid_charges = 'Required *';
    if (!formValues.freight_charges) tempErrors.freight_charges = 'Required *';
    if (!formValues.inspection_charges) tempErrors.inspection_charges = 'Required *';
    if (!formValues.thc) tempErrors.thc = 'Required *';
    if (!formValues.container_stuffing) tempErrors.container_stuffing = 'Required *';
    if (!formValues.container_seal) tempErrors.container_seal = 'Required *';
    if (!formValues.bl) tempErrors.bl = 'Required *';
    if (!formValues.vgm) tempErrors.vgm = 'Required *';
    if (!formValues.miscellaneous) tempErrors.miscellaneous = 'Required *';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const mapFrontendToBackendKeys = (frontendData) => {
      const mappedData = faqItemData?.map((item, index) => ({
        id: index + 1,
        quo_num: `00${index + 1}`,
        rfq_id: item.rfq_id,
        vendor_id: item.vendor_id,
        reference_no: item.reference_no,
        reference_date: item.reference_date,
        quo_date: item.quo_date,
        quote_qty: itemCost[index + 1].qty,
        rate: itemCost[index + 1].rate,
        remark: itemCost[index + 1].remarks
      }));
      return {
        rfq_id: 4,
        ...frontendData,
        created_by: 'Admin',
        ItemData: mappedData
      };
    };
    const isValid = true;
    if (isValid) {
      const requestData = mapFrontendToBackendKeys(formValues);

      try {
        console.log('API hitted', requestData);
        const response = await axios.post(`${BASE_URL}/quotationmaster`, requestData);
        console.log('Form submitted successfully:', response);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    } else {
    }
  };
  const calculateTotalCost = (itemCost) => {
    let totalCost = {};
    for (let key in itemCost) {
      const qty = itemCost[key].qty || 0;
      const rate = itemCost[key].rate || 0;
      totalCost[key] = qty * rate;
    }
    // setSum((preVal) => preVal + totalCost);
    return totalCost;
  };
  const fetchItems = async () => {
    const { data } = await axios.get(`${BASE_URL}/quotationmaster/items/2`);
    const mappedData = data?.map((item, index) => ({
      id: index + 1,
      quo_num: `00${index + 1}`,
      rfq_id: item.item_type,
      vendor_id: item.opr_id,
      reference_no: item.item_description,
      reference_date: item.orp_qty,
      quo_date: item.orp_qty,
      quote_qty: '',
      rate: '',
      remark: ''
    }));
    setFaqItemData(mappedData);
  };
  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Table>
          {renderTableHeader('userLoginDetails', 'Basic Info')}
          {showTableHeading.userLoginDetails && (
            <TableBody loading={true}>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Vendor Name </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" sx={{ width: '13vw' }}>
                        <Select id="vendor_id" name="vendor_id" value={formValues.vendor_id} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {vendorData.map((data) => (
                            <MenuItem key={data.id} value={data.id}>
                              {data.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.vendor_id && <FormHelperText error>{errors.vendor_id}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Reference No </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="reference_no"
                        name="reference_no"
                        value={formValues.reference_no}
                        onChange={handleInputChange}
                      />
                      {!!errors.reference_no && <FormHelperText error>{errors.reference_no}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Reference Date </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        type="date"
                        id="reference_date"
                        name="reference_date"
                        variant="outlined"
                        fullWidth
                        value={formValues.reference_date}
                        onChange={handleInputChange}
                      />
                      {!!errors.reference_date && <FormHelperText error>{errors.reference_date}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Quotation Date </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        type="date"
                        id="quo_date"
                        name="quo_date"
                        variant="outlined"
                        fullWidth
                        value={formValues.quo_date}
                        onChange={handleInputChange}
                      />
                      {!!errors.quo_date && <FormHelperText error>{errors.quo_date}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Currency </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl variant="outlined" fullWidth>
                        <Select id="currency_id" name="currency_id" value={formValues.currency_id} onChange={handleInputChange}>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {country.map((data) => (
                            <MenuItem key={data.id} value={data.id}>
                              {data.currency}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.currency_id && <FormHelperText error>{errors.currency_id}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Delivery Terms </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Select
                        id="delivery_terms"
                        name="delivery_terms"
                        variant="outlined"
                        fullWidth
                        value={formValues.delivery_terms}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>CFR</MenuItem>
                        <MenuItem value={20}>Term 1</MenuItem>
                        <MenuItem value={30}>Term 2</MenuItem>
                      </Select>
                      {!!errors.delivery_terms && <FormHelperText error>{errors.delivery_terms}</FormHelperText>}
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <Table>
          {renderTableHeader('userPersonalDetail', 'Logistics')}
          {showTableHeading.userPersonalDetail && (
            <TableBody>
              <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Country of Origin </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Select
                        variant="outlined"
                        sx={{ width: '13vw' }}
                        id="country_origin_id"
                        name="country_origin_id"
                        value={formValues.country_origin_id}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {country.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {!!errors.country_origin_id && <FormHelperText error>{errors.country_origin_id}</FormHelperText>}
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Country of Supply </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Select
                        variant="outlined"
                        fullWidth
                        id="country_supply_id"
                        name="country_supply_id"
                        value={formValues.country_supply_id}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {country.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {!!errors.country_supply_id && <FormHelperText error>{errors.country_supply_id}</FormHelperText>}
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Port of Loading </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Select
                        variant="outlined"
                        sx={{ width: '13vw' }}
                        id="port_loading"
                        name="port_loading"
                        value={formValues.port_loading}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>ANY</MenuItem>
                        <MenuItem value={20}>Loading 1</MenuItem>
                        <MenuItem value={30}>Loading 2</MenuItem>
                      </Select>
                      {!!errors.port_loading && <FormHelperText error>{errors.port_loading}</FormHelperText>}
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Lead Time </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Select
                        variant="outlined"
                        sx={{ width: '13vw' }}
                        id="lead_time"
                        name="lead_time"
                        value={formValues.lead_time}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>3 weeks</MenuItem>
                        <MenuItem value={20}>5 weeks</MenuItem>
                        <MenuItem value={30}>7 weeks</MenuItem>
                      </Select>
                      {!!errors.lead_time && <FormHelperText error>{errors.lead_time}</FormHelperText>}
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Payment Terms </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Select
                        variant="outlined"
                        fullWidth
                        id="payment_terms"
                        name="payment_terms"
                        value={formValues.payment_terms}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>15% Advance 85% before dispatch after successful inspection </MenuItem>
                        <MenuItem value={20}>25% Advance 85% before dispatch after successful inspection</MenuItem>
                        <MenuItem value={30}>50% Advance 85% before dispatch after successful inspection</MenuItem>
                      </Select>
                      {!!errors.payment_terms && <FormHelperText error>{errors.payment_terms}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Remarks </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="remarks"
                        name="remarks"
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={formValues.remarks}
                        onChange={handleInputChange}
                      />
                      {!!errors.remarks && <FormHelperText error>{errors.remarks}</FormHelperText>}
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <Table>
          {renderTableHeader('currentAddressDetails', 'Charges')}

          {showTableHeading.currentAddressDetails && (
            <TableBody>
              <TableRow sx={{ marginTop: '10px', marginBottom: '10px' }}>
                <TableCell colSpan={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Inland Charges </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="invalid_charges"
                        name="invalid_charges"
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={formValues.invalid_charges}
                        onChange={handleInputChange}
                      />
                      {!!errors.invalid_charges && <FormHelperText error>{errors.invalid_charges}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Freight Charges </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="freight_charges"
                        name="freight_charges"
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={formValues.freight_charges}
                        onChange={handleInputChange}
                      />
                      {!!errors.freight_charges && <FormHelperText error>{errors.freight_charges}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Inspection Charges </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="inspection_charges"
                        name="inspection_charges"
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={formValues.inspection_charges}
                        onChange={handleInputChange}
                      />
                      {!!errors.inspection_charges && <FormHelperText error>{errors.inspection_charges}</FormHelperText>}
                    </Grid>
                  </Grid>

                  <Typography variant="h5" color="primary">
                    <br></br>
                    FOB Charges
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">THC </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="thc"
                        name="thc"
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={formValues.thc}
                        onChange={handleInputChange}
                      />
                      {!!errors.thc && <FormHelperText error>{errors.thc}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Container Stuffing </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="container_stuffing"
                        name="container_stuffing"
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={formValues.container_stuffing}
                        onChange={handleInputChange}
                      />
                      {!!errors.container_stuffing && <FormHelperText error>{errors.container_stuffing}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Container Seal </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="container_seal"
                        name="container_seal"
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={formValues.container_seal}
                        onChange={handleInputChange}
                      />
                      {!!errors.container_seal && <FormHelperText error>{errors.container_seal}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">BL </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField id="bl" name="bl" variant="outlined" fullWidth value={formValues.bl} onChange={handleInputChange} />
                      {!!errors.bl && <FormHelperText error>{errors.bl}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">VGM </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="vgm"
                        name="vgm"
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={formValues.vgm}
                        onChange={handleInputChange}
                      />
                      {!!errors.vgm && <FormHelperText error>{errors.vgm}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography variant="subtitle1">Miscellaneous </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        id="miscellaneous"
                        name="miscellaneous"
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={formValues.miscellaneous}
                        onChange={handleInputChange}
                      />
                      {!!errors.miscellaneous && <FormHelperText error>{errors.miscellaneous}</FormHelperText>}
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: '0' }}>
          <Table>
            {renderTableHeader('permanentAddressDetails', 'Item Details')}
            {showTableHeading.permanentAddressDetails && (
              <>
                <DataGrid
                  rows={faqItemData.map((row) => ({
                    ...row,
                    handleInputChange: (e, field) => handleFAQInputChange(e, field, row.id)
                  }))}
                  // rows={}
                  columns={TableHeader}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Box textAlign="right" marginRight="20px" marginBottom="20px">
                    {/* <Typography>Total Cost: {totals.totalCost.toFixed(2)}</Typography>
                    <br /> */}
                    <Typography>Additional Cost: {totals.additionalCost.toFixed(2)}</Typography>
                    <TextField
                      id="additionalCost"
                      name="additionalCost"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={formValues.miscellaneous}
                      onChange={handleInputChange}
                    />
                    <br />
                    <Typography>Total: {0}</Typography>
                  </Box>
                </Box>
              </>
            )}
          </Table>
        </TableContainer>
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

import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
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
  Grid,
  FormControl,
  Tooltip
} from '@mui/material';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import axios from 'axios';
import { BASE_URL } from 'AppConstants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportProblemOutlined from '@mui/icons-material/ReportProblemOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

// import WarningIcon from '@material-ui/icons/Warning';

const FormateForm = ({ oprViewData }) => {
  const [showTableBodies, setShowTableBodies] = useState({
    createOPR: true,
    itemsDetail: true,
    itemsTable: true,
    viewOprDetail: false,
    basicInfo: true,
    requestDetails: true,
    shipmentDetail: true
  });
  const [itemList, setItemList] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [deliveryTime, setDeliveryTime] = useState([]);
  const [shipmentMode, setShipmentMode] = useState([]);
  const [reqByDept, setReqByDept] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hsnMessage, setHsnMessage] = useState('');
  const [verticalData, setVerticalData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [buyingHouseData, setBuyingHouseData] = useState([]);
  const [showBuyingHouse, setShowBuyingHouse] = useState(false);
  const [oprId, setOprId] = useState(null);
  const [oprData, setOprData] = useState([]);
  console.log('oprViewData', oprData);

  const [stockData, setStockData] = useState([]);
  console.log('oprId', oprId);
  useEffect(() => {
    getLoadDivisions();
    getDeliveryTime();
    getShipmentMode();
    getReqByDepartment();
    getVertical();
    getBuyingHouse();
    getOprData();

    if (oprId) {
      getStockAPI(oprId);
    }
    getStockitems();
    // getHSNCode();
  }, [oprId]);
  const initialValues = {
    vertical: '',
    company: '',
    division: '',
    buyFrom: '',
    buyingHouse: '',
    requestByDepartment: '',
    requestedBy: '',
    quotationsEmailAlert: '',
    shipmentMode: '',
    deliveryTimeline: '',
    date: '',
    oprDescription: '',
    additionalRemark: '',
    potentialSuppliers: ''
  };
  const validationSchema = Yup.object().shape({
    vertical: Yup.string().required('Field is required'),
    company: Yup.string().required('Field is required'),
    division: Yup.string().required('Field is required'),
    // buyFrom: Yup.string().required('Buy From is required'),
    // buyingHouse: Yup.string().required('Buying House is required'),
    requestByDepartment: Yup.string().required('Field is required'),
    // requestedBy: Yup.string().required('Field is required'),
    // quotationsEmailAlert: Yup.string().required('Field is required'),
    shipmentMode: Yup.string().required('Field is required'),
    deliveryTimeline: Yup.string().required('Field is required')
    // date: Yup.date().required('Field is required')
    // oprDescription: Yup.string().required('OPR Description is required'),
    // additionalRemark: Yup.string().required('Additional Remark is required'),
    // potentialSuppliers: Yup.string().required('Potential Suppliers is required')
  });
  // Initial values for Stock Items Formik form
  const initialStockItemValues = {
    stockItems: [
      {
        stockItem: '',
        oprQty: '',
        stockItemCode: '',
        stockInTransit: '',
        stockInHand: '',
        monthlyConsumption: '',
        itemDescription: ''
      }
    ]
  };
  // Yup validation schema for Stock Items Formik form
  const validationSchemaItems = Yup.object().shape({
    stockItems: Yup.array().of(
      Yup.object().shape({
        stockItem: Yup.string().required('Stock Item is required'),
        oprQty: Yup.number().required('OPR Quantity is required'),
        stockItemCode: Yup.string().required('Stock Item Code is required'),
        stockInTransit: Yup.number().required('Stock In Transit is required'),
        stockInHand: Yup.number().required('Stock In Hand is required'),
        monthlyConsumption: Yup.number().required('Monthly Consumption is required'),
        itemDescription: Yup.string().required('Item Description is required')
      })
    )
  });

  const handleBuyFromChange = (event, setFieldValue) => {
    const value = event.target.value;
    setFieldValue('buyFrom', value);
    setShowBuyingHouse(value === 'Buying House');
  };
  // Toggle function to switch the visibility of a specific table body
  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const handleSelectChange = (e, index) => {
    const updatedItemList = [...itemList];
    updatedItemList[index] = { ...itemList[index], [e.target.name]: e.target.value };
    setItemList(updatedItemList);
  };
  const handleTextFieldChange = (e, index) => {
    const updatedItemList = [...itemList];
    updatedItemList[index] = { ...itemList[index], [e.target.name]: e.target.value };
    setItemList(updatedItemList);
  };
  // Function to render table headers with toggle icons
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              {sectionLabel}
            </Typography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)}>
              {showTableBodies[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  const columns = [
    { field: 'stockItem', headerName: 'Stock Item', flex: 1 },
    { field: 'oprQty', headerName: 'OPR Qty', flex: 1 },
    { field: 'stockItemCode', headerName: 'Stock Item Code', flex: 1 },
    { field: 'stockInTransit', headerName: 'Stock In Transit', flex: 1 },
    { field: 'stockInHand', headerName: 'Stock In Hand', flex: 1 },
    { field: 'monthlyConsumption', headerName: 'Monthly Consumption', flex: 1 },
    { field: 'itemDescription', headerName: 'Item Description', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleEditRow(params.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteRow(params.id)}>
            <DeleteIcon color="red" />
          </IconButton>
        </Box>
      )
    }
  ];
  const getOprData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/opr`);
      const mappedData = response.data.map((item, index) => ({
        id: index + 1,
        oprID: item.opr_id,
        division: item.division_creation,
        shipmentMode: item.shipment_mode,
        deliveryTime: item.delivery_timeline,
        requestedByDept: item.department,
        requestedBy: item.requested_by,
        additionalRemarks: item.remarks,
        oprDescription: item.opr_description,
        potentialSuppliers: item.suppliers
      }));
      setOprData(mappedData);
    } catch (error) {
      console.error('Error fetching OPR data:', error);
    }
  };

  const getVertical = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/vertical`);
      const formattedVerticalData = response.data.map((item) => ({
        id: item.vertical_id,
        name: item.vertical_name
      }));
      setVerticalData(formattedVerticalData);
    } catch (error) {
      console.error('Error fetching vertical:', error);
      setErrors((prevErrors) => ({
        ...prevErrors
      }));
    }
  };
  const handleVerticalChange = async (event, setFieldValue) => {
    const selectedVerticalId = event.target.value;
    setFieldValue('vertical', selectedVerticalId);

    try {
      const response = await axios.get(`${BASE_URL}/company/${selectedVerticalId}`);
      console.log('response', response);
      const formattedCompanyData = response.data.map((item) => ({
        code: item.company_code,
        comanyId: item.company_id,
        name: item.company_name
      }));
      setCompanyData(formattedCompanyData);
    } catch (error) {
      console.error('Error fetching company data:', error);
      setErrors((prevErrors) => ({
        ...prevErrors
      }));
    }
  };
  const getBuyingHouse = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/buyhouse`);
      const buyingHouseData = response.data.map((item) => ({
        id: item.buy_house_id,
        name: item.buy_house_name
      }));
      setBuyingHouseData(buyingHouseData);
    } catch (error) {
      console.error('Error fetching vertical:', error);
      setErrors((prevErrors) => ({
        ...prevErrors
      }));
    }
  };
  const getLoadDivisions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/division`);
      const divisionData = response.data.map((division) => ({
        id: division.division_id,
        name: division.division_creation_option
      }));
      setDivisions(divisionData);
    } catch (error) {
      console.error('Error fetching divisions:', error);
      setErrors((prevErrors) => ({
        ...prevErrors
      }));
    }
  };
  const getShipmentMode = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/mode`);
      const shipmentModeData = response.data.map((shipmentMode) => ({
        id: shipmentMode.shipment_mode_id,
        name: shipmentMode.shipment_mode_option
      }));
      setShipmentMode(shipmentModeData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setErrors((prevErrors) => ({
        ...prevErrors
      }));
    }
  };
  const getDeliveryTime = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/timeline`);
      const deliveryTimelineData = response.data.map((timeline) => ({
        id: timeline.delivery_timeline_id,
        name: timeline.delivery_timeline_option
      }));
      setDeliveryTime(deliveryTimelineData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setErrors((prevErrors) => ({
        ...prevErrors
      }));
    }
  };

  const getReqByDepartment = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/department`);
      const reqByDepartmentData = response.data.map((department) => ({
        id: department.department_id,
        name: department.department_name
      }));
      setReqByDept(reqByDepartmentData);
    } catch (error) {
      console.error('Error fetching department:', error);
      setErrors((prevErrors) => ({
        ...prevErrors
      }));
    }
  };
  const getStockitems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/item`);
      console.log('item response', response);
      const itemsList = response.data.map((data) => ({
        id: data.item_id,
        name: data.item_name
      }));
      setItemsData(itemsList);
    } catch (error) {
      console.error('Error fetching items:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        items: 'Error fetching items'
      }));
    }
  };
  const getHSNCode = async (itemId) => {
    try {
      const response = await axios.get(`${BASE_URL}/opr/hsn/${itemId}`);
      console.log('hsn response', response);
      if (response.data.message) {
        setHsnMessage(response.data.message);
      } else {
        setHsnMessage('');
      }
    } catch (error) {
      console.error('Error fetching HSN code:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        hsn: 'Error fetching HSN code'
      }));
    }
  };
  // const handleItemChange = async (event) => {
  //   const itemId = event.target.value;
  //   console.log(itemId);
  //   setSelectedItem(itemId);
  //   setHsnMessage('');
  //   if (itemId) {
  //     await getHSNCode(itemId);
  //   }
  // };
  const getStockAPI = async (oprID) => {
    try {
      const response = await axios.get(`${BASE_URL}/opr/items/1070`);
      console.log(response);
      const mappedData = response.data.map((item, index) => ({
        id: index + 1,
        stockItem: item.item_name,
        oprQty: item.orp_qty,
        stockItemCode: item.stock_item_code,
        stockInTransit: item.stock_transit,
        stockInHand: item.stock_hand,
        monthlyConsumption: item.monthly_consumption,
        itemDescription: item.item_description
      }));
      setStockData(mappedData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        stockData: 'Failed to load stock data'
      }));
    }
  };
  const handleOPRSubmit = async (formValues, { resetForm }) => {
    try {
      const postData = {
        vertical: formValues.vertical,
        company_name: formValues.company,
        opr_date: new Date().toISOString(),
        division_id: formValues.division,
        buy_from: formValues.buyFrom,
        buy_house: formValues.buyingHouse,
        shipment_mode_id: formValues.shipmentMode,
        delivery_timeline_id: formValues.deliveryTimeline,
        department_id: formValues.requestByDepartment,
        requested_by: formValues.requestedBy,
        quotations: formValues.quotationsEmailAlert,
        opr_des: formValues.oprDescription,
        remarks: formValues.additionalRemark,
        suppliers: formValues.potentialSuppliers,
        created_by: 'Pooja'
      };
      const response = await axios.post(`${BASE_URL}/opr`, postData);
      console.log('OPR submitted successfully:', response.data);
      setOprId(response.data.opr_id);
      resetForm();
      setShowTableBodies((prevState) => ({
        ...prevState,
        createOPR: false,
        viewOprDetail: true
      }));
    } catch (error) {
      console.error('Error submitting OPR:', error);
    }
  };
  const handleSubmitStockItems = async (values, { resetForm }) => {
    console.log(itemList);
    try {
      const formattedStockItems = values.stockItems.map((item) => ({
        opr_id: oprId,
        stock_item_id: item.stockItem,
        quantity: item.oprQty,
        item_code: item.stockItemCode,
        transit: item.stockInTransit,
        hand: item.stockInHand,
        consumption: item.monthlyConsumption,
        item_des: item.itemDescription,
        created_by: 'Sharma'
      }));

      // console.log('post data of stock Items', formattedStockItems);
      const updatedItemList = itemList.map((item) => ({
        ...item,
        opr_id: oprId,
        created_by: 'Sharma'
      }));

      console.log(updatedItemList);
      // const responses = await Promise.all(formattedStockItems.map((item) => axios.post(`${BASE_URL}/opr/items`, item)));

      const responses = await axios.post(
        `${BASE_URL}/opr/items`,
        { itemsList: updatedItemList },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Responses:', responses);
      resetForm();
      getStockAPI(oprId);
    } catch (error) {
      console.error('Error adding stock items:', error);
    }
  };
  const getStockItemsForConfirm = async (oprId) => {
    try {
      const response = await axios.get(`${BASE_URL}/opr/items/${oprId}`);
      console.log(response);
      const mappedData = response.data.map((item, index) => ({
        id: index + 1,
        stockItem: item.item_name,
        oprQty: item.orp_qty,
        stockItemCode: item.stock_item_code,
        stockInTransit: item.stock_transit,
        stockInHand: item.stock_hand,
        monthlyConsumption: item.monthly_consumption,
        itemDescription: item.item_description
      }));
      setStockData(mappedData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        stockData: 'Failed to load stock data'
      }));
    }
  };
  const handleConfirmItems = async () => {
    const { data } = await axios.get(`${BASE_URL}/opr/confirmopr/${oprId}`);
    console.log(data.message);
    window.alert(data.message);
  };
  useEffect(() => {
    // getStockAPI()
    getStockItemsForConfirm(oprId);
  }, []);

  return (
    <>
      {/* ......................................OPR View  ........................... */}
      {showTableBodies.viewOprDetail && (
        <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: '0' }}>
          <Table>
            {renderTableHeader('viewOprDetail', 'View OPR Detail')}

            {showTableBodies.viewOprDetail && oprData.length > 0 && (
              <TableBody>
                {oprData.map((oprViewData, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Division:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.division}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Shipment Mode:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.shipmentMode}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Delivery Time:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.deliveryTime}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Request By Department:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.requestedByDept}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Requested By:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.requestedBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Quotations Email Alert:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{oprViewData.quotationsEmailAlert}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          OPR Description:
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={5}>
                        <Typography>{oprViewData.oprDescription}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Additional Remark:
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={5}>
                        <Typography>{oprViewData.additionalRemarks}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          Potential Suppliers:
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={5}>
                        <Typography>{oprViewData.potentialSuppliers}</Typography>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      )}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleOPRSubmit}>
        {({ values, errors, touched, setFieldValue }) => {
          return (
            <Form>
              {showTableBodies.createOPR && (
                <TableContainer component={Paper} sx={{ borderRadius: '0' }}>
                  <Table>
                    {/* Basic Info Section */}
                    {renderTableHeader('basicInfo', 'Basic Info')}
                    {showTableBodies.basicInfo && (
                      <TableBody>
                        <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                          <TableCell colSpan={6}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Vertical</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={Select}
                                  name="vertical"
                                  variant="outlined"
                                  fullWidth
                                  // error={touched.vertical && Boolean(errors.vertical)}
                                  onChange={(e) => handleVerticalChange(e, setFieldValue)}
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {verticalData.map((vertical) => (
                                    <MenuItem key={vertical.id} value={vertical.id}>
                                      {vertical.name}
                                    </MenuItem>
                                  ))}
                                </Field>
                                <ErrorMessage name="vertical" component="div" className="error-message" />
                              </Grid>
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Company</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={Select}
                                  name="company"
                                  variant="outlined"
                                  fullWidth
                                  // error={touched.company && Boolean(errors.company)}
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {companyData.map((company) => (
                                    <MenuItem key={company.comanyId} value={company.comanyId}>
                                      {company.name}
                                    </MenuItem>
                                  ))}
                                </Field>
                                <ErrorMessage name="company" component="div" className="error-message" />
                              </Grid>
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Division</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={Select}
                                  name="division"
                                  variant="outlined"
                                  fullWidth
                                  // error={touched.division && Boolean(errors.division)}
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {divisions.map((division) => (
                                    <MenuItem key={division.id} value={division.id}>
                                      {division.name}
                                    </MenuItem>
                                  ))}
                                </Field>
                                <ErrorMessage name="division" component="div" className="error-message" />
                              </Grid>
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Buying From</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={Select}
                                  name="buyFrom"
                                  variant="outlined"
                                  fullWidth
                                  value={values.buyFrom}
                                  // error={touched.buyFrom && Boolean(errors.buyFrom)}
                                  onChange={(e) => handleBuyFromChange(e, setFieldValue)}
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  <MenuItem value="Buying House">Buying House</MenuItem>
                                  <MenuItem value="Direct">Direct</MenuItem>
                                </Field>
                                <ErrorMessage name="buyFrom" component="div" className="error-message" />
                              </Grid>
                              {showBuyingHouse && (
                                <>
                                  <Grid item xs={12} sm={1}>
                                    <Typography variant="body1">Buying House</Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={2}>
                                    <Field
                                      as={Select}
                                      name="buyingHouse"
                                      variant="outlined"
                                      fullWidth
                                      // error={touched.buyingHouse && Boolean(errors.buyingHouse)}
                                    >
                                      <MenuItem value="">
                                        <em>None</em>
                                      </MenuItem>
                                      {/* {buyingHouseData.map((data) => (
                                    <MenuItem key={data.id} value={data.id}>
                                      {data.name}
                                    </MenuItem>
                                  ))} */}
                                      {buyingHouseData.map((vertical) => (
                                        <MenuItem key={vertical.id} value={vertical.id}>
                                          {vertical.name}
                                        </MenuItem>
                                      ))}
                                    </Field>
                                    <ErrorMessage name="buyingHouse" component="div" className="error-message" />
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                  <Table>
                    {/* Request Details Section */}
                    {renderTableHeader('requestDetails', 'Request Details')}
                    {showTableBodies.requestDetails && (
                      <TableBody>
                        <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                          <TableCell colSpan={6}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Request By Department</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={Select}
                                  name="requestByDepartment"
                                  variant="outlined"
                                  fullWidth
                                  // error={touched.requestByDepartment && Boolean(errors.requestByDepartment)}
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {reqByDept.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      {dept.name}
                                    </MenuItem>
                                  ))}
                                </Field>
                                <ErrorMessage name="requestByDepartment" component="div" className="error-message" />
                              </Grid>
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Requested By</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={TextField}
                                  name="requestedBy"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  // error={touched.requestedBy && Boolean(errors.requestedBy)}
                                />
                                <ErrorMessage name="requestedBy" component="div" className="error-message" />
                              </Grid>
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Quotations Email Alert</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={TextField}
                                  type="number"
                                  name="quotationsEmailAlert"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  // error={touched.quotationsEmailAlert && Boolean(errors.quotationsEmailAlert)}
                                />
                                <ErrorMessage name="quotationsEmailAlert" component="div" className="error-message" />
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                  <Table>
                    {/* Shipment Details Section */}
                    {renderTableHeader('shipmentDetail', 'Shipment Details')}
                    {showTableBodies.shipmentDetail && (
                      <TableBody>
                        <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                          <TableCell colSpan={6}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Shipment Mode</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={Select}
                                  name="shipmentMode"
                                  variant="outlined"
                                  fullWidth
                                  // error={touched.shipmentMode && Boolean(errors.shipmentMode)}
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {shipmentMode.map((mode) => (
                                    <MenuItem key={mode.id} value={mode.id}>
                                      {mode.name}
                                    </MenuItem>
                                  ))}
                                </Field>
                                <ErrorMessage name="shipmentMode" component="div" className="error-message" />
                              </Grid>
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Delivery Timeline</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={Select}
                                  name="deliveryTimeline"
                                  variant="outlined"
                                  fullWidth
                                  // error={touched.deliveryTimeline && Boolean(errors.deliveryTimeline)}
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {deliveryTime.map((time) => (
                                    <MenuItem key={time.id} value={time.id}>
                                      {time.name}
                                    </MenuItem>
                                  ))}
                                </Field>
                                <ErrorMessage name="deliveryTimeline" component="div" className="error-message" />
                              </Grid>
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Date</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field as={TextField} type="date" name="date" variant="outlined" fullWidth size="small" />
                                <ErrorMessage name="date" component="div" className="error-message" />
                              </Grid>
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">OPR Description</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={TextField}
                                  name="oprDescription"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  // error={touched.oprDescription && Boolean(errors.oprDescription)}
                                />
                                <ErrorMessage name="oprDescription" component="div" className="error-message" />
                              </Grid>
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Additional Remark</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={TextField}
                                  name="additionalRemark"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  // error={touched.additionalRemark && Boolean(errors.additionalRemark)}
                                />
                                <ErrorMessage name="additionalRemark" component="div" className="error-message" />
                              </Grid>
                              <Grid item xs={12} sm={1}>
                                <Typography variant="body1">Potential Suppliers</Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Field
                                  as={TextField}
                                  name="potentialSuppliers"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  // error={touched.potentialSuppliers && Boolean(errors.potentialSuppliers)}
                                />
                                <ErrorMessage name="potentialSuppliers" component="div" className="error-message" />
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                  {showTableBodies.shipmentDetail && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                      <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }}>
                        Cancel
                      </Button>
                      <Button variant="contained" size="small" color="primary" type="submit">
                        Add Items
                      </Button>
                    </Box>
                  )}
                </TableContainer>
              )}
            </Form>
          );
        }}
      </Formik>
      {oprId /* ...................................... Create Items ........................... */ && (
        <Formik initialValues={initialStockItemValues} onSubmit={handleSubmitStockItems}>
          {/* <Formik initialValues={initialStockItemValues} validationSchema={validationSchemaItems} onSubmit={handleSubmitStockItems}> */}
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <FieldArray name="stockItems">
                {({ insert, remove, push }) => (
                  <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: '0' }}>
                    <Table>
                      {renderTableHeader('itemsDetail', 'Add Items')}
                      {showTableBodies.itemsDetail && (
                        <TableBody>
                          {values.stockItems &&
                            values.stockItems.map((item, index) => (
                              <React.Fragment key={index}>
                                <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                                  <TableCell colSpan={6}>
                                    <Grid container spacing={2} alignItems="center">
                                      <Grid item xs={12} sm={1}>
                                        <Typography variant="body1">Stock Item</Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <Field
                                            name={`stockItem`}
                                            as={Select}
                                            variant="outlined"
                                            fullWidth
                                            value={itemList[index]?.oprType}
                                            onChange={(e) => handleSelectChange(e, index)}
                                          >
                                            <MenuItem value="">
                                              <em>None</em>
                                            </MenuItem>
                                            {itemsData.map((data) => (
                                              <MenuItem key={data.id} value={data.id}>
                                                {data.name}
                                              </MenuItem>
                                            ))}
                                          </Field>
                                          {hsnMessage && (
                                            <Tooltip title={hsnMessage}>
                                              <PriorityHighIcon style={{ marginLeft: '8px', verticalAlign: 'middle', color: 'red' }} />
                                            </Tooltip>
                                          )}
                                        </div>
                                        <ErrorMessage
                                          name={`stockItems.${index}.stockItem`}
                                          component={Typography}
                                          variant="body2"
                                          color="error"
                                        />
                                      </Grid>

                                      <Grid item xs={12} sm={1}>
                                        <Typography variant="body1">OPR Quantity</Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <Field
                                          value={itemList[index]?.oprQty}
                                          onChange={(e) => handleTextFieldChange(e, index)}
                                          name={`oprQty`}
                                          as={TextField}
                                          variant="outlined"
                                          fullWidth
                                        />

                                        <ErrorMessage
                                          name={`stockItems.${index}.oprQty`}
                                          component={Typography}
                                          variant="body2"
                                          color="error"
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={1}>
                                        <Typography variant="body1">Stock Item Code</Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <Field
                                          value={itemList[index]?.stockItemCode}
                                          onChange={(e) => handleTextFieldChange(e, index)}
                                          name={`stockItemCode`}
                                          as={TextField}
                                          variant="outlined"
                                          fullWidth
                                        />
                                        <ErrorMessage
                                          name={`stockItems.${index}.stockItemCode`}
                                          component={Typography}
                                          variant="body2"
                                          color="error"
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={1}>
                                        <Typography variant="body1">Stock In Transit</Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <FormControl variant="outlined" fullWidth>
                                          <Field
                                            value={itemList[index]?.stockInTransit}
                                            onChange={(e) => handleTextFieldChange(e, index)}
                                            name={`stockInTransit`}
                                            as={TextField}
                                            variant="outlined"
                                            fullWidth
                                          />
                                          <ErrorMessage
                                            name={`stockItems.${index}.stockInTransit`}
                                            component={Typography}
                                            variant="body2"
                                            color="error"
                                          />
                                        </FormControl>
                                      </Grid>
                                      <Grid item xs={12} sm={1}>
                                        <Typography variant="body1">Stock In Hand</Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <Field
                                          value={itemList[index]?.stockInHand}
                                          onChange={(e) => handleTextFieldChange(e, index)}
                                          name={`stockInHand`}
                                          as={TextField}
                                          variant="outlined"
                                          fullWidth
                                        />
                                        <ErrorMessage
                                          name={`stockItems.${index}.stockInHand`}
                                          component={Typography}
                                          variant="body2"
                                          color="error"
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={1}>
                                        <Typography variant="body1">Monthly Consumption</Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <Field
                                          value={itemList[index]?.monthlyConsumption}
                                          onChange={(e) => handleTextFieldChange(e, index)}
                                          name={`monthlyConsumption`}
                                          as={TextField}
                                          variant="outlined"
                                          fullWidth
                                        />
                                        <ErrorMessage
                                          name={`stockItems.${index}.monthlyConsumption`}
                                          component={Typography}
                                          variant="body2"
                                          color="error"
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={1}>
                                        <Typography variant="body1">Item Description</Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <Field
                                          value={itemList[index]?.itemDescription}
                                          onChange={(e) => handleTextFieldChange(e, index)}
                                          name={`itemDescription`}
                                          as={TextField}
                                          variant="outlined"
                                          fullWidth
                                          multiline
                                          rows={2}
                                        />
                                        <ErrorMessage
                                          name={`stockItems.${index}.itemDescription`}
                                          component={Typography}
                                          variant="body2"
                                          color="error"
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={1}>
                                        {/* <Typography variant="body1">Item Description</Typography> */}
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            ))}
                          <TableRow>
                            <TableCell colSpan={6}>
                              {/* <Box display="flex" justifyContent={"end"} alignItems={"end"}>
                              <Button
                                variant="outlined"
                                size="small"
                                color="secondary"
                                onClick={() =>
                                  push({
                                    stockItem: '',
                                    oprQty: '',
                                    stockItemCode: '',
                                    stockInTransit: '',
                                    stockInHand: '',
                                    monthlyConsumption: '',
                                    itemDescription: ''
                                  })
                                }
                              >
                                Add Item
                              </Button>
                              <Button variant="outlined" size="small" color="primary" type="submit" sx={{ ml: 1 }}>
                                Submit Items
                              </Button>
                            </Box> */}

                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                                {/* <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }}
                                  onClick={() =>
                                    push({
                                      stockItem: '',
                                      oprQty: '',
                                      stockItemCode: '',
                                      stockInTransit: '',
                                      stockInHand: '',
                                      monthlyConsumption: '',
                                      itemDescription: ''
                                    })
                                  }
                                >
                                  Add More
                                </Button> */}
                                <Button variant="contained" size="small" color="primary" type="submit">
                                  Submit Items
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      )}
      {/* /* ...................................... Items table ........................... */}
      {oprId && (
        <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: '0' }}>
          <Table>
            {renderTableHeader('itemsTable', 'Items Table')}
            {showTableBodies.itemsTable && (
              <TableBody>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1, marginRight: '20px' }}>
                  <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }}>
                    Cancel
                  </Button>
                  <Button variant="contained" size="small" color="primary" onClick={handleConfirmItems}>
                    Confirm Items
                  </Button>
                </Box>
                <TableRow>
                  <TableCell colSpan={6}>
                    <div style={{ width: '100%' }}>
                      <DataGrid
                        rows={stockData}
                        columns={columns}
                        disableSelectionOnClick
                        autoHeight
                        sx={{ cursor: 'pointer' }}
                        pagination={false}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default FormateForm;

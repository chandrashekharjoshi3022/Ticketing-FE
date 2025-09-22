import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MainCard from 'components/MainCard';
import { borderRadius } from '@mui/system';

const FormateForm = () => {
  const [showTableBodies, setShowTableBodies] = useState({
    oprDetail: false,
    itemsDetail: false,
    itemsTable: false,
    viewOprDetail: false
  });

  // Toggle function to switch the visibility of a specific table body
  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
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
            <IconButton aria-label="expand row" size="small" onClick={() => toggleTableBody(sectionName)}>
              {showTableBodies[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  // Mock data for DataGrid
  const stockData = [
    {
      id: 1,
      stockItem: 'Laptop',
      oprQty: 50,
      stockItemCode: 'LP1001',
      stockInTransit: 20,
      stockInHand: 30,
      monthlyConsumption: 25,
      itemDescription: 'High-end laptop for office use'
    },
    {
      id: 2,
      stockItem: 'Monitor',
      oprQty: 75,
      stockItemCode: 'MN2002',
      stockInTransit: 30,
      stockInHand: 45,
      monthlyConsumption: 40,
      itemDescription: '24-inch HD monitor'
    },
    {
      id: 3,
      stockItem: 'Monitor',
      oprQty: 75,
      stockItemCode: 'MN2002',
      stockInTransit: 30,
      stockInHand: 45,
      monthlyConsumption: 40,
      itemDescription: '24-inch HD monitor'
    },
    {
      id: 4,
      stockItem: 'Monitor',
      oprQty: 75,
      stockItemCode: 'MN2002',
      stockInTransit: 30,
      stockInHand: 45,
      monthlyConsumption: 40,
      itemDescription: '24-inch HD monitor'
    }
  ];

  const columns = [
    { field: 'stockItem', headerName: 'Stock Item', flex: 1 },
    { field: 'oprQty', headerName: 'OPR Qty', flex: 1 },
    { field: 'stockItemCode', headerName: 'Stock Item Code', flex: 1 },
    { field: 'stockInTransit', headerName: 'Stock In Transit', flex: 1 },
    { field: 'stockInHand', headerName: 'Stock In Hand', flex: 1 },
    { field: 'monthlyConsumption', headerName: 'Monthly Consumption', flex: 1 },
    { field: 'itemDescription', headerName: 'Item Description', flex: 1 }
  ];

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: '0' }}>
        <Table>
          {renderTableHeader('viewOprDetail', 'View OPR Detail')}

          {showTableBodies.viewOprDetail && (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Division:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>Division 1</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Shipment Mode:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>Shipment Mode 1</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Delivery Time:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>12:54:20 PM</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Request By Department:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>ABC</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Requested By:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>Amit</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Quotations Email Alert:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>40</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    OPR Description:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>This portal is the global communication.</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Additional Remark:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>This portal is the global communication channel.</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Potential Suppliers:
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>This portal is the global communication.</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TableContainer component={Paper} sx={{ marginTop: 4, borderRadius: '0' }}>
        <Table>
          {renderTableHeader('oprDetail', 'Create OPR')}

          {showTableBodies.oprDetail && (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body1">Vertical</Typography>
                </TableCell>
                <TableCell>
                  <Select
                    labelId="requestedByDepartment-label"
                    id="requestedByDepartment"
                    name="requestedByDepartment"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Vertical 1</MenuItem>
                    <MenuItem value={20}>Vertical 2</MenuItem>
                    <MenuItem value={30}>Vertical 3</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Company</Typography>
                </TableCell>
                <TableCell>
                  <Select
                    labelId="requestedByDepartment-label"
                    id="requestedByDepartment"
                    name="requestedByDepartment"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Company 1</MenuItem>
                    <MenuItem value={20}>Company 2</MenuItem>
                    <MenuItem value={30}>Company 3</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Division</Typography>
                </TableCell>
                <TableCell>
                  <Select
                    labelId="requestedByDepartment-label"
                    id="requestedByDepartment"
                    name="requestedByDepartment"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Division 1</MenuItem>
                    <MenuItem value={20}>Division 2</MenuItem>
                    <MenuItem value={30}>Division 3</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography variant="body1">Request By Department</Typography>
                </TableCell>
                <TableCell>
                  <Select
                    labelId="requestedByDepartment-label"
                    id="requestedByDepartment"
                    name="requestedByDepartment"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Department 1</MenuItem>
                    <MenuItem value={20}>Department 2</MenuItem>
                    <MenuItem value={30}>Department 3</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Requested By</Typography>
                </TableCell>
                <TableCell>
                  <Select
                    labelId="requestedByDepartment-label"
                    id="requestedByDepartment"
                    name="requestedByDepartment"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Department 1</MenuItem>
                    <MenuItem value={20}>Department 2</MenuItem>
                    <MenuItem value={30}>Department 3</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Quotations Email Alert</Typography>
                </TableCell>
                <TableCell>
                  <Select
                    labelId="requestedByDepartment-label"
                    id="requestedByDepartment"
                    name="requestedByDepartment"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Department 1</MenuItem>
                    <MenuItem value={20}>Department 2</MenuItem>
                    <MenuItem value={30}>Department 3</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1">Shipment Mode</Typography>
                </TableCell>
                <TableCell>
                  <Select
                    labelId="requestedByDepartment-label"
                    id="requestedByDepartment"
                    name="requestedByDepartment"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Shipment Mode 1</MenuItem>
                    <MenuItem value={20}>Shipment Mode 2</MenuItem>
                    <MenuItem value={30}>Shipment Mode 3</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Delivery Time</Typography>
                </TableCell>
                <TableCell>
                  <Select
                    labelId="requestedByDepartment-label"
                    id="requestedByDepartment"
                    name="requestedByDepartment"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Delivery Time 1</MenuItem>
                    <MenuItem value={20}>Delivery Time 2</MenuItem>
                    <MenuItem value={30}>Delivery Time 3</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">OPR Description</Typography>
                </TableCell>
                <TableCell>
                  <TextField id="email" name="email" variant="standard" fullWidth size="small" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1">Additional Remark</Typography>
                </TableCell>
                <TableCell>
                  <TextField id="email" name="email" variant="standard" fullWidth size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Potential Suppliers</Typography>
                </TableCell>
                <TableCell>
                  <TextField id="email" name="email" variant="standard" fullWidth size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Buying House</Typography>
                </TableCell>
                <TableCell>
                  <Select
                    labelId="requestedByDepartment-label"
                    id="requestedByDepartment"
                    name="requestedByDepartment"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Buying House 1</MenuItem>
                    <MenuItem value={20}>Buying House 2</MenuItem>
                    <MenuItem value={30}>Buying House 3</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        {showTableBodies.oprDetail && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
            <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" size="small" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        )}
      </TableContainer>

      {/* Second Section */}
      <TableContainer component={Paper} sx={{ marginTop: 4, borderRadius: '0' }}>
        <Table>
          {renderTableHeader('itemsDetail', 'Items Detail')}
          {showTableBodies.itemsDetail && (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body1">Stock Item</Typography>
                </TableCell>
                <TableCell>
                  <Select
                    labelId="requestedByDepartment-label"
                    id="requestedByDepartment"
                    name="requestedByDepartment"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Department 1</MenuItem>
                    <MenuItem value={20}>Department 2</MenuItem>
                    <MenuItem value={30}>Department 3</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">OPR Quantity</Typography>
                </TableCell>
                <TableCell>
                  <TextField id="email" name="email" variant="standard" fullWidth size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Stock Item Code</Typography>
                </TableCell>
                <TableCell>
                  <TextField id="email" name="email" variant="standard" fullWidth size="small" />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography variant="body1">Stock In Transit</Typography>
                </TableCell>
                <TableCell>
                  <TextField id="email" name="email" variant="standard" fullWidth size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Stock In Hand </Typography>
                </TableCell>
                <TableCell>
                  <TextField id="email" name="email" variant="standard" fullWidth size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Monthly Consumption</Typography>
                </TableCell>
                <TableCell>
                  <TextField id="email" name="email" variant="standard" fullWidth size="small" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1">Item Description</Typography>
                </TableCell>
                <TableCell>
                  <TextField id="email" name="email" variant="standard" fullWidth size="small" />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        {showTableBodies.itemsDetail && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
            <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" size="small" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        )}
      </TableContainer>

      {/* Third Section */}
      <TableContainer component={Paper} sx={{ marginTop: 4, borderRadius: '0' }}>
        <Table>
          {renderTableHeader('itemsTable', 'Items Table')}
          {showTableBodies.itemsTable && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <DataGrid
                    rows={stockData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    autoHeight
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </>
  );
};

export default FormateForm;

import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from '@mui/material';

const OprForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    vertical: '',
    company: '',
    division: '',
    requestedByDepartment: '',
    requestedBy: '',
    quotationsEmailAlert: '',
    shipmentMode: '',
    deliveryTime: '',
    oprDescription: '',
    additionalRemark: '',
    potentialSuppliers: '',
    buyingHouse: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to the server
    console.log(formData);
    onClose(); // Close the form after submission
  };

  const renderTableHeader = (key, title) => (
    <TableRow key={key}>
      <TableCell colSpan={6} align="center">
        <Typography variant="h6">{title}</Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <form onSubmit={handleSubmit}>
      <TableContainer component={Paper} sx={{ marginTop: 4, borderRadius: '0' }}>
        <Table>
          {renderTableHeader('oprDetail', 'Create OPR')}
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Vertical</Typography>
              </TableCell>
              <TableCell>
                <Select
                  labelId="vertical-label"
                  id="vertical"
                  name="vertical"
                  value={formData.vertical}
                  onChange={handleChange}
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
                  labelId="company-label"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
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
                  labelId="division-label"
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
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
                  value={formData.requestedByDepartment}
                  onChange={handleChange}
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
                  labelId="requestedBy-label"
                  id="requestedBy"
                  name="requestedBy"
                  value={formData.requestedBy}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Person 1</MenuItem>
                  <MenuItem value={20}>Person 2</MenuItem>
                  <MenuItem value={30}>Person 3</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Typography variant="body1">Quotations Email Alert</Typography>
              </TableCell>
              <TableCell>
                <Select
                  labelId="quotationsEmailAlert-label"
                  id="quotationsEmailAlert"
                  name="quotationsEmailAlert"
                  value={formData.quotationsEmailAlert}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Option 1</MenuItem>
                  <MenuItem value={20}>Option 2</MenuItem>
                  <MenuItem value={30}>Option 3</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Shipment Mode</Typography>
              </TableCell>
              <TableCell>
                <Select
                  labelId="shipmentMode-label"
                  id="shipmentMode"
                  name="shipmentMode"
                  value={formData.shipmentMode}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Mode 1</MenuItem>
                  <MenuItem value={20}>Mode 2</MenuItem>
                  <MenuItem value={30}>Mode 3</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Typography variant="body1">Delivery Time</Typography>
              </TableCell>
              <TableCell>
                <Select
                  labelId="deliveryTime-label"
                  id="deliveryTime"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Time 1</MenuItem>
                  <MenuItem value={20}>Time 2</MenuItem>
                  <MenuItem value={30}>Time 3</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Typography variant="body1">OPR Description</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  id="oprDescription"
                  name="oprDescription"
                  value={formData.oprDescription}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  size="small"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Additional Remark</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  id="additionalRemark"
                  name="additionalRemark"
                  value={formData.additionalRemark}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body1">Potential Suppliers</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  id="potentialSuppliers"
                  name="potentialSuppliers"
                  value={formData.potentialSuppliers}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body1">Buying House</Typography>
              </TableCell>
              <TableCell>
                <Select
                  labelId="buyingHouse-label"
                  id="buyingHouse"
                  name="buyingHouse"
                  value={formData.buyingHouse}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>House 1</MenuItem>
                  <MenuItem value={20}>House 2</MenuItem>
                  <MenuItem value={30}>House 3</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
          <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" size="small" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </TableContainer>
    </form>
  );
};

export default OprForm;

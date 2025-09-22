import React from 'react';
import { Table, TableBody, TableCell, TableRow, Typography, Box, Button, TableContainer, Paper, TableHead } from '@mui/material';
import MainCard from 'components/MainCard';

const OprView = ({ oprViewData, onClose }) => {
  if (!oprViewData) return null;

  const { stockItems } = oprViewData;
  console.log('oprViewData', oprViewData);

  // Define columns for stockItems table
  const stockItemColumns = [
    { id: 'stockItem', label: 'Stock Item', minWidth: 150 },
    { id: 'oprQty', label: 'OPR Quantity', minWidth: 150 },
    { id: 'stockItemCode', label: 'Stock Item Code', minWidth: 150 },
    { id: 'stockInTransit', label: 'Stock In Transit', minWidth: 150 },
    { id: 'stockInHand', label: 'Stock In Hand', minWidth: 150 },
    { id: 'monthlyConsumption', label: 'Monthly Consumption', minWidth: 150 },
    { id: 'itemDescription', label: 'Item Description', minWidth: 200 }
  ];

  return (
    <MainCard>
      <Typography variant="h6">
        <h3 style={{ padding: '0', margin: '0' }}>Item Detail</h3>
      </Typography>
      <Box sx={{ marginBottom: '10px' }}>
        <Table>
          <TableBody>
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
          </TableBody>
        </Table>
        {/* 
        {stockItems && stockItems.length > 0 && (
          <>
            <Typography variant="h6" sx={{ marginTop: '20px' }}>
              Stock Items
            </Typography>
            <Table>
              <TableBody>
                {stockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Potential Suppliers:
                      </Typography>
                      {item.stockItem}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Quantity:
                      </Typography>
                      {item.oprQty}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        StockItemCode:
                      </Typography>
                      {item.stockItemCode}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        stockInTransit:
                      </Typography>
                      {item.stockInTransit}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        stockInHand:
                      </Typography>
                      {item.stockInHand}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        monthlyConsumption:
                      </Typography>
                      {item.monthlyConsumption}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        itemDescription:
                      </Typography>
                      {item.itemDescription}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )} */}
        {stockItems && stockItems.length > 0 && (
          <>
            <Typography variant="h6">
              <h3> Stock Items</h3>
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {stockItemColumns.map((column) => (
                      <TableCell key={column.id} style={{ fontWeight: 'bold' }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockItems.map((item) => (
                    <TableRow key={item.id}>
                      {stockItemColumns.map((column) => (
                        <TableCell key={column.id}>{item[column.id]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        <Box sx={{ marginTop: '20px', textAlign: 'right' }}>
          <Button color="primary" variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </MainCard>
  );
};

export default OprView;

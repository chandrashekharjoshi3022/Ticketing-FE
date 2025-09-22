import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { BASE_URL } from 'AppConstants';

const OprTable = ({ setSelectedOpr }) => {
  const [oprData, setOprData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOprData();
  }, []);

  const headingName = [
    { field: 'oprID', headerName: 'OPR ID', width: 80 },
    { field: 'division', headerName: 'Vertical', width: 120 },
    { field: 'company_name', headerName: 'Company', width: 120 },
    { field: 'division_creation', headerName: 'Division', width: 120 },
    { field: 'shipmentMode', headerName: 'Shipment Mode', width: 120 },
    { field: 'deliveryTime', headerName: 'Delivery Time', width: 120 },
    { field: 'department', headerName: 'Requested By Department', width: 180 },
    { field: 'requestedBy', headerName: 'Requested By', width: 120 },
    { field: 'remarks', headerName: 'Additional Remarks', width: 150 },
    { field: 'opr_description', headerName: 'OPR Description', width: 150 },
    { field: 'suppliers', headerName: 'Potential Suppliers', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleViewClick(params.row)}>
          <VisibilityIcon />
        </IconButton>
      )
    }
  ];

  const getOprData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/opr`);
      console.log('oprdataaaaaaaaaaaaaaa', response);
      const mappedData = response.data.map((item, index) => ({
        id: index + 1,
        oprID: item.opr_id,
        division: item.division_creation,
        company_name: item.company_name,
        division_creation: item.division_creation,
        shipmentMode: item.shipment_mode,
        deliveryTime: item.delivery_timeline,
        department: item.department,
        requestedBy: item.requested_by,
        remarks: item.remarks,
        opr_description: item.opr_description,
        suppliers: item.suppliers
      }));
      setOprData(mappedData);
    } catch (error) {
      console.error('Error fetching OPR data:', error);
      setError('Failed to load OPR data');
    }
  };

  const getStockItem = async (oprId) => {
    try {
      const response = await axios.get(`${BASE_URL}/opr/items/${oprId}`);
      return response.data.map((item, index) => ({
        id: index + 1,
        stockItem: item.stock_item,
        oprQty: item.orp_qty,
        stockItemCode: item.stock_item_code,
        stockInTransit: item.stock_transit,
        stockInHand: item.stock_hand,
        monthlyConsumption: item.monthly_consumption,
        itemDescription: item.item_description
      }));
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to load stock data');
      return [];
    }
  };

  const handleViewClick = async (opr) => {
    const stockItems = await getStockItem(opr.oprID);
    setSelectedOpr({ ...opr, stockItems });
  };

  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <DataGrid rows={oprData} columns={headingName} pageSize={5} rowsPerPageOptions={[5]} sx={{ cursor: 'pointer' }} />
      </div>
    </>
  );
};

export default OprTable;

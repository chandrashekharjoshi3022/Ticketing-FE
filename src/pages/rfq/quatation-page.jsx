import { Button, Box, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import QuotationForm from './quotation-form';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { BASE_URL } from 'AppConstants';

// ==============================|| OpR PAGE ||============================== //

export default function OprPage() {
  const [showOprForm, setShowOprForm] = useState(false);
  const [quotationData, setQuotationData] = useState([]);
  useEffect(() => {
    getQuotationData();
  }, []);

  const headingName = [
    { field: 'vendor_id', headerName: 'Vendor Name', width: 150 },
    { field: 'reference_no', headerName: 'Reference Number', width: 150 },
    { field: 'reference_date', headerName: 'Reference Date', width: 150 },
    { field: 'quo_date', headerName: 'Quotation Date', width: 150 },
    { field: 'currency_id', headerName: 'Currency', width: 150 },
    { field: 'delivery_terms', headerName: 'Delivery Terms', width: 150 },
    { field: 'country_origin_id', headerName: 'Country of Origin', width: 150 },
    { field: 'country_supply_id', headerName: 'Country of Supply', width: 150 },
    { field: 'port_loading', headerName: 'Port of Loading', width: 150 },
    { field: 'lead_time', headerName: 'Lead Time', width: 150 },
    { field: 'payment_terms', headerName: 'Payment Terms', width: 150 },
    { field: 'remarks', headerName: 'Remarks', width: 150 },
    { field: 'invalid_charges', headerName: 'Inland Charges', width: 150 },
    { field: 'freight_charges', headerName: 'Freight Charges', width: 150 },
    { field: 'inspection_charges', headerName: 'Inspection Charges', width: 150 },
    { field: 'thc', headerName: 'THC', width: 150 },
    { field: 'container_stuffing', headerName: 'Container Stuffing', width: 150 },
    { field: 'container_seal', headerName: 'Container Seal', width: 150 },
    { field: 'bl', headerName: 'BL', width: 150 },
    { field: 'vgm', headerName: 'VGM', width: 150 },
    { field: 'miscellaneous', headerName: 'Miscellaneous', width: 150 }
  ];
  const getQuotationData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/quotationmaster`);
      // const response = await axios.get('http://192.168.1.4:4001/quotationmaster');
      const mappedData = response.data.map((item, index) => ({
        id: index + 1,
        vendor_id: item.vendor_id,
        reference_no: item.reference_no,
        reference_date: item.reference_date,
        quo_date: item.quo_date,
        currency_id: item.currency_id,
        delivery_terms: item.delivery_terms,
        country_origin_id: item.country_origin_id,
        country_supply_id: item.country_supply_id,
        port_loading: item.port_loading,
        lead_time: item.lead_time,
        payment_terms: item.payment_terms,
        remarks: item.remarks,
        invalid_charges: item.invalid_charges,
        freight_charges: item.freight_charges,
        inspection_charges: item.inspection_charges,
        thc: item.thc,
        container_stuffing: item.container_stuffing,
        container_seal: item.container_seal,
        bl: item.bl,
        vgm: item.vgm,
        miscellaneous: item.miscellaneous
      }));

      setQuotationData(mappedData);
      console.log(mappedData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      // setErrors((prevErrors) => ({
      //   ...prevErrors,
      //   oprData: 'Failed to load timeline'
      // }));
    }
  };
  const handleCreateOpr = () => {
    setShowOprForm(true);
  };

  return (
    <>
      {showOprForm ? (
        <div className="row card my-3 p-2">
          {formMode === 'view' ? (
            <OprView user={selectedOPR} onClose={handleCloseForm} />
          ) : (
            <OprForm user={selectedOPR} formMode={formMode} onClose={handleCloseForm} />
          )}
        </div>
      ) : (
        <>
          <MainCard
            title={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Quatation Details</span>
                <Button color="primary" className="plus-btn-color" onClick={handleCreateOpr}>
                  + Create Quotation
                </Button>
              </Box>
            }
          >
            <div>
              <DataGrid rows={quotationData} columns={headingName} pageSize={5} rowsPerPageOptions={[5]} sx={{ cursor: 'pointer' }} />
            </div>
          </MainCard>
        </>
      )}
    </>
  );
}

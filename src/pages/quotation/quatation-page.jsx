import { Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { BASE_URL } from 'AppConstants';
import QuotationForm from './quotation-form';
export default function QuotationPage() {
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [quotationData, setQuotationData] = useState([]);

  useEffect(() => {
    getQuotationData();
  }, []);
  const TableHeader = [
    { field: 'quo_num', headerName: 'Quotation Number', width: 150 },
    { field: 'rfq_id', headerName: 'RFQ Number', width: 150 },
    { field: 'vendor_id', headerName: 'Vendor Name', width: 150 },
    { field: 'referenceNo', headerName: 'Reference Number', width: 150 },
    { field: 'referenceDate', headerName: 'Reference Date', width: 150 },
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
    { field: 'miscellaneous', headerName: 'Miscellaneous', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        // <Button variant="contained" size="small" color="primary" type="submit" onClick={() => handleEdit(params.row.id)}>
        <Button variant="contained" size="small" color="primary" type="submit" onClick={handleCreateOpr}>
          Edit
        </Button>
      )
    }
  ];
  const getQuotationData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/quotationmaster`);
      const mappedData = response.data.map((item, index) => ({
        id: index + 1,
        quo_num: item.quo_num,
        rfq_id: item.rfq_id,
        vendor_id: item.vendor_name,
        referenceNo: item.reference_no,
        referenceDate: item.reference_date,
        quo_date: item.quo_date,
        currency_id: item.currency,
        delivery_terms: item.delivery_terms,
        country_origin_id: item.origin_country,
        country_supply_id: item.supply_country,
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
    } catch (error) {
      console.error('Error fetching timeline:', error);
      // setErrors((prevErrors) => ({
      //   ...prevErrors,
      //   oprData: 'Failed to load timeline'
      // }));
    }
  };
  const handleCreateOpr = () => {
    setSelectedQuotation(null);
    setFormMode('create');
    setShowQuotationForm(true);
  };
  const handleCloseForm = () => {
    setShowQuotationForm(false);
    setSelectedQuotation(null);
    setFormMode('create');
  };



  return (
    <>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {!showQuotationForm ? <span>Quotation list</span> : <span>Create Quotation</span>}

            {!showQuotationForm ? (
              <Button color="primary" className="plus-btn-color" onClick={handleCreateOpr}>
                + Create Quotation
              </Button>
            ) : (
              <Button color="primary" className="plus-btn-color" onClick={handleCloseForm}>
                Back
              </Button>
            )}
           
          </Box>
        }
      >
        {showQuotationForm ? (
          <QuotationForm user={selectedQuotation} formMode={formMode} onClose={handleCloseForm} />
        ) : (
          <div>
            <DataGrid rows={quotationData} columns={TableHeader} pageSize={5} rowsPerPageOptions={[5]} />
          </div>
        )}
      </MainCard>
    </>
  );
}

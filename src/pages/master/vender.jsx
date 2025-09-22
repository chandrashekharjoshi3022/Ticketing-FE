import { Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Icon from '@mdi/react';
import { mdiTagEdit } from '@mdi/js';
import axios from 'axios';
import VenderForm from './venderForm';
import { BASE_URL } from 'AppConstants';

// ==============================|| OpR PAGE ||============================== //

export default function VendorsPages() {
  const [showVenderForm, setShowVenderForm] = useState(false);
  const [selectedVender, setSelectedVender] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [venderData, setVenderData] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getVenderAPI();
  }, []);

  // Define columns
  const headingName = [
    { field: 'vendorName', headerName: 'Vendor Name', width: 150 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'vendorType', headerName: 'Vendor Type', width: 150 },
    { field: 'vendorStatus', headerName: 'Vendor Status', width: 150 },
    { field: 'addressLine1', headerName: 'Current Address', width: 200 },
    { field: 'addressLine2', headerName: 'Permanent Address', width: 200 },
    { field: 'cityId', headerName: 'City ', width: 100 },
    { field: 'countryId', headerName: 'Country', width: 100 },
    { field: 'stateId', headerName: 'State', width: 100 },
    { field: 'postalCode', headerName: 'Postal Code', width: 100 },
    { field: 'contactPerson', headerName: 'Contact Person', width: 150 },
    { field: 'contactPersonPhone', headerName: 'Contact Person Phone', width: 150 },
    { field: 'contactPersonEmail', headerName: 'Contact Person Email', width: 200 },
    { field: 'taxId', headerName: 'Tax ID', width: 150 },
    { field: 'paymentTerms', headerName: 'Payment Terms', width: 150 },
    { field: 'bankName', headerName: 'Bank Name', width: 150 },
    { field: 'bankAccountNumber', headerName: 'Bank Account Number', width: 200 },
    { field: 'bankIfscCode', headerName: 'Bank IFSC Code', width: 150 },
    { field: 'registrationDate', headerName: 'Registration Date', width: 150 },
    { field: 'complianceStatus', headerName: 'Compliance Status', width: 150 },
    { field: 'notes', headerName: 'Notes', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button color="primary" onClick={() => handleEdit(params.row.id)}>
          <Icon path={mdiTagEdit} size={1} />
        </Button>
      )
    }
  ];

  const getVenderAPI = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/vendor`);
      console.log('res', response);
      // Map the data to match DataGrid columns
      const mappedData = response.data.map((item, index) => ({
        id: index + 1,
        vendorName: item.vendor_name,
        addressLine1: item.address_line1,
        addressLine2: item.address_line2,
        cityId: item.city_name,
        countryId: item.country_name,
        stateId: item.state_name,
        postalCode: item.postal_code,
        phoneNumber: item.phone_number,
        email: item.email,
        contactPerson: item.contact_person,
        contactPersonPhone: item.contact_person_phone,
        contactPersonEmail: item.contact_person_email,
        taxId: item.tax_id,
        paymentTerms: item.payment_terms,
        bankName: item.bank_name,
        bankAccountNumber: item.bank_account_number,
        bankIfscCode: item.bank_ifsc_code,
        vendorType: item.vendor_type,
        vendorStatus: item.vendor_status,
        registrationDate: item.registration_date,
        complianceStatus: item.compliance_status,
        notes: item.notes
      }));

      setVenderData(mappedData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        venderData: 'Failed to load timeline'
      }));
    }
  };

  const handleCreateVender = () => {
    setSelectedVender(null);
    setFormMode('create');
    setShowVenderForm(true);
  };

  const handleEdit = (id) => {
    const user = venderData.find((user) => user.id === id);
    setSelectedVender(user);
    setFormMode('edit');
    setShowVenderForm(true);
  };

  const handleCloseForm = () => {
    setShowVenderForm(false);
    setSelectedVender(null);
    setFormMode('create');
  };

  return (
    <>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {!showVenderForm ? <span>Vendor list</span> : <span>Create Vendor</span>}

            {!showVenderForm ? (
              <Button color="primary" className="plus-btn-color" onClick={handleCreateVender}>
                + Create Vendor
              </Button>
            ) : (
              <Button color="primary" className="plus-btn-color" onClick={handleCloseForm}>
                Back
              </Button>
            )}
          </Box>
        }
      >
        {showVenderForm ? (
          <VenderForm user={selectedVender} formMode={formMode} onClose={handleCloseForm} />
        ) : (
          <div>
            <DataGrid rows={venderData} columns={headingName} pageSize={5} rowsPerPageOptions={[5]} />
          </div>
        )}
      </MainCard>
    </>
  );
}

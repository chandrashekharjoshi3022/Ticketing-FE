import { Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { BASE_URL } from 'AppConstants';
import QuotationForm from './quotation-form'; // Adjust the path accordingly

const CreateQuotation = () => {
  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [itemsData, setItemsData] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getItemsData();
  }, []);

  // Define columns
  const columns = [
    { field: 'itemName', headerName: 'Item Name', width: 150 },
    { field: 'itemDescription', headerName: 'Item Description', width: 250 },
    { field: 'reorderLevel', headerName: 'Reorder Level', width: 100 },
    { field: 'unitPrice', headerName: 'Unit Price', width: 80 },
    { field: 'msrp', headerName: 'MSRP', width: 80 },
    { field: 'isDiscontinued', headerName: 'Is Discontinued', width: 120 },
    { field: 'itemImageUrl', headerName: 'Item Image URL', width: 160 },
    { field: 'notes', headerName: 'Notes', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button color="primary" onClick={() => handleEdit(params.row.id)}>
          Add Form
        </Button>
      )
    }
  ];

  const getItemsData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/item`);
      console.log('res', response);
      const mappedData = response.data.map((item, index) => ({
        id: index + 1,
        itemName: item.item_name,
        itemDescription: item.item_description,
        quantityInStock: item.quantity_in_stock,
        quantityOnOrder: item.quantity_on_order,
        reorderLevel: item.reorder_level,
        unitPrice: item.unit_price,
        msrp: item.msrp,
        isDiscontinued: item.is_discontinued,
        itemImageUrl: item.item_image_url,
        weight: item.weight,
        dimensions: item.dimensions,
        notes: item.notes,
        unitOfMeasurement: item.unit_of_measurement_name,
        supplier: item.vendor_name,
        categoryID: item.category_name
      }));

      setItemsData(mappedData);
    } catch (error) {
      console.error('Error fetching items:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        itemsData: 'Failed to load items data'
      }));
    }
  };

  const handleCreateItem = () => {
    setSelectedItem(null);
    setFormMode('create');
    setShowItemForm(true);
  };

  const handleEdit = (id) => {
    const item = itemsData.find((item) => item.id === id);
    setSelectedItem(item);
    setFormMode('edit');
    setShowItemForm(true);
  };

  const handleCloseForm = () => {
    setShowItemForm(false);
    setSelectedItem(null);
    setFormMode('create');
  };

  const handleFormSubmit = () => {
    getItemsData(); // Refresh the items data after form submission
    setShowItemForm(false); // Close the form
  };
  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!showItemForm ? <span>RFQ list</span> : <span>Create Quotation</span>}
          {!showItemForm ? (
            <></>
          ) : (
            <Button color="primary" className="plus-btn-color" onClick={handleCloseForm}>
              Back
            </Button>
          )}
        </Box>
      }
    >
      {showItemForm ? (
        <QuotationForm onClose={handleCloseForm} formMode={formMode} />
      ) : (
        <div>
          <DataGrid rows={itemsData} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
        </div>
      )}
    </MainCard>
  );
};

export default CreateQuotation;

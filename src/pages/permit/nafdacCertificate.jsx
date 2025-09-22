import { Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Icon from '@mdi/react';
import { mdiTagEdit } from '@mdi/js';
import axios from 'axios';
import { BASE_URL } from 'AppConstants';
import NafForm from './nafForm';
import './navdac.css';

const NafdacCertificate = () => {
  const [showNavdacForm, setShowNavdacForm] = useState(false);
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
    { field: 'itemDescription', headerName: 'Item Description', width: 200 },
    { field: 'quantityInStock', headerName: 'Quantity In Stock', width: 150 },
    { field: 'quantityOnOrder', headerName: 'Quantity On Order', width: 150 },
    { field: 'reorderLevel', headerName: 'Reorder Level', width: 150 },
    { field: 'unitPrice', headerName: 'Unit Price', width: 100 },
    { field: 'msrp', headerName: 'MSRP', width: 100 },
    { field: 'isDiscontinued', headerName: 'Is Discontinued', width: 150 },
    { field: 'itemImageUrl', headerName: 'Item Image URL', width: 200 },
    { field: 'weight', headerName: 'Weight', width: 100 },
    { field: 'dimensions', headerName: 'Dimensions', width: 150 },
    { field: 'notes', headerName: 'Notes', width: 200 },
    { field: 'unitOfMeasurement', headerName: 'Unit Of Measurement', width: 150 },
    { field: 'supplier', headerName: 'Supplier', width: 150 },
    { field: 'categoryID', headerName: 'Category ID', width: 100 }
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   width: 150,
    //   renderCell: (params) => (
    //     <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    //       <Icon path={mdiTagEdit} size={1} onClick={() => handleEdit(params.row.id)} style={{ cursor: 'pointer' }} />
    //     </Box>
    //   )
    // }
  ];

  const getItemsData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/item`);
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

  const handleEdit = (id) => {
    const item = itemsData.find((item) => item.id === id);
    setSelectedItem(item);
    setFormMode('edit');
    setShowNavdacForm(true);
  };

  const handleCloseForm = () => {
    setShowNavdacForm(false);
    setSelectedItem(null);
    setFormMode('create');
  };
  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!showNavdacForm ? <span>Nafdac List</span> : <span>Create Nafdac</span>}
          {showNavdacForm && (
            <Button color="primary" className="plus-btn-color" onClick={handleCloseForm}>
              Back
            </Button>
          )}
        </Box>
      }
    >
      {showNavdacForm ? (
        <NafForm item={selectedItem} formMode={formMode} onClose={handleCloseForm} />
      ) : (
        <DataGrid
          rows={itemsData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          onRowClick={(params) => handleEdit(params.row.id)}
        />
      )}
    </MainCard>
  );
};

export default NafdacCertificate;

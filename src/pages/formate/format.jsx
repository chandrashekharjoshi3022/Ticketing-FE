import { Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import FormateForm from './formateForm'; // Import the FormateForm component

const Format = () => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateFormClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{showForm ? 'Create Form' : 'Form Details'}</span>
          {!showForm && (
            <Button color="primary" className="plus-btn-color" onClick={handleCreateFormClick}>
              + Create Form
            </Button>
          )}
        </Box>
      }
    >
      <div>{showForm && <FormateForm onClose={handleFormClose} />}</div>
    </MainCard>
  );
};

export default Format;

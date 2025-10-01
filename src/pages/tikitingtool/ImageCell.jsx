// ImageCell.jsx (your separate file - corrected export)
import React, { useState } from 'react';
import { Box, Modal, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const ImageCell = ({ images = [] }) => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOpen = (index) => {
    setSelectedIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        {images.slice(0, 3).map((img, idx) => (
          <IconButton key={idx} onClick={() => handleOpen(idx)} size="small" sx={{ p: 0.25 }}>
            <Box
              component="img"
              src={img}
              alt={`Image ${idx + 1}`}
              sx={{
                width: 50,
                height: 50,
                objectFit: 'cover',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            />
          </IconButton>
        ))}
        {images.length > 3 && (
          <Typography variant="body2" color="text.secondary">
            +{images.length - 3}
          </Typography>
        )}
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {images.length > 1 && (
              <>
                <IconButton onClick={handlePrev} sx={{ position: 'absolute', left: -60 }}>
                  <ChevronLeft />
                </IconButton>
                <IconButton onClick={handleNext} sx={{ position: 'absolute', right: -60 }}>
                  <ChevronRight />
                </IconButton>
              </>
            )}
            <Box
              component="img"
              src={images[selectedIndex]}
              alt={`Image ${selectedIndex + 1}`}
              sx={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
          </Box>
          {images.length > 1 && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              {selectedIndex + 1} / {images.length}
            </Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ImageCell;

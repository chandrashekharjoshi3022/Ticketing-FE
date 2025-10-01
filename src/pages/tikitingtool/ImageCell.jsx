import React, { useState } from 'react';
import {
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Chip,
  Button,
  Alert
} from '@mui/material';
import { ZoomIn } from '@mui/icons-material';

const buildDataUri = (doc) => {
  if (!doc) return null;
  const raw = String(doc.doc_base64 ?? '');
  if (!raw) return null;
  if (raw.startsWith('data:')) return raw;
  const mime = doc.mime_type || 'application/octet-stream';
  return `data:${mime};base64,${raw}`;
};

const ImageCell = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imageError, setImageError] = useState(false);

  if (!images || images.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" fontStyle="italic">
        No images
      </Typography>
    );
  }

  const visibleImages = images.slice(0, 3);
  const hiddenCount = images.length - visibleImages.length;

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    setOpen(true);
    setImageError(false);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedIndex(null);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const selectedImage = (selectedIndex != null) ? images[selectedIndex] : null;
  const selectedSrc = selectedImage ? buildDataUri(selectedImage) : null;

  return (
    <>
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
        {visibleImages.map((doc, index) => {
          const src = buildDataUri(doc);
          return (
            <Tooltip key={doc.document_id ?? index} title={`View ${doc.doc_name ?? 'file'}`} arrow>
              <Box
                sx={{
                  position: 'relative',
                  cursor: src ? 'pointer' : 'default',
                  '&:hover .image-overlay': {
                    opacity: 1
                  }
                }}
                onClick={() => src && handleImageClick(index)}
              >
                <Box
                  component="img"
                  src={src || ''}
                  alt={doc.doc_name || ''}
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    backgroundColor: '#f5f5f5'
                  }}
                  onError={handleImageError}
                />
                <Box
                  className="image-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    borderRadius: 1,
                  }}
                >
                  <ZoomIn sx={{ color: 'white', fontSize: 16 }} />
                </Box>
              </Box>
            </Tooltip>
          );
        })}

        {hiddenCount > 0 && (
          <Tooltip title={`${hiddenCount} more images`} arrow>
            <Chip
              label={`+${hiddenCount}`}
              size="small"
              variant="outlined"
              sx={{
                height: 24,
                fontSize: '0.7rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                px: 1
              }}
              onClick={() => {
                // open first hidden image (index 3 = visibleImages.length)
                const idx = visibleImages.length;
                if (images[idx]) handleImageClick(idx);
              }}
            />
          </Tooltip>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogContent>
          {selectedImage ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {selectedImage.doc_name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Type: {selectedImage.mime_type || 'unknown'} • Created: {selectedImage.created_on ? new Date(selectedImage.created_on).toLocaleString() : '-'}
              </Typography>

              {imageError || !selectedSrc ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Failed to load image. The file may be corrupted or not an image.
                </Alert>
              ) : (
                <Box
                  component="img"
                  src={selectedSrc}
                  alt={selectedImage.doc_name}
                  onError={handleImageError}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    borderRadius: 1,
                    boxShadow: 3
                  }}
                />
              )}

              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (!selectedSrc) return;
                    // open data uri in new tab
                    const w = window.open();
                    if (w) {
                      w.document.write(`<iframe src="${selectedSrc}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`);
                    } else {
                      // fallback
                      window.open(selectedSrc, '_blank');
                    }
                  }}
                  disabled={imageError || !selectedSrc}
                >
                  Open in New Tab
                </Button>
                <Button variant="contained" onClick={handleClose}>
                  Close
                </Button>
              </Box>

              {images.length > 1 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Image { (selectedIndex != null ? selectedIndex + 1 : '-') } of {images.length}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Typography>No image selected</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCell;

// ImageCell.jsx - Fixed version
import React, { useState } from 'react';
import { Box, Tooltip, IconButton, Dialog, DialogContent, Typography, Chip, Button, Alert, Card, CardContent } from '@mui/material';
import { ZoomIn, Delete, PictureAsPdf, Description, InsertDriveFile } from '@mui/icons-material';
import SubmitButton from 'components/CustomSubmitBtn';
import CancelButton from 'components/CustomCancelButton';

const getFileIcon = (mimeType) => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  return '📎';
};

const getFileTypeIcon = (mimeType) => {
  if (mimeType.startsWith('image/')) return <ZoomIn />;
  if (mimeType === 'application/pdf') return <PictureAsPdf />;
  if (mimeType.includes('word') || mimeType.includes('document')) return <Description />;
  return <InsertDriveFile />;
};

// Fixed function to get image source
const getImageSource = (doc) => {
  if (!doc || !doc.doc_base64) return null;

  const raw = String(doc.doc_base64);

  // If it's already a URL (starts with http), use it directly
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }

  // If it's a data URI, use it directly
  if (raw.startsWith('data:')) {
    return raw;
  }

  // Otherwise, assume it's base64 and create data URI
  const mime = doc.mime_type || 'image/png'; // default to png if mime_type is missing
  return `data:${mime};base64,${raw}`;
};

const ImageCell = ({ images, onDelete, canDelete = false }) => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imageError, setImageError] = useState(false);

  if (!images || images.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" fontStyle="italic">
        No attachments
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

  const handleDelete = (index, event) => {
    event.stopPropagation();
    if (onDelete && canDelete) {
      onDelete(index);
    }
  };

  const selectedImage = selectedIndex != null ? images[selectedIndex] : null;
  const selectedSrc = selectedImage ? getImageSource(selectedImage) : null;
  const isSelectedImage = selectedImage && selectedImage.mime_type && selectedImage.mime_type.startsWith('image/');

  return (
    <>
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
        {visibleImages.map((doc, index) => {
          const src = getImageSource(doc);
          const isImage = doc.mime_type && doc.mime_type.startsWith('image/');

          return (
            <Tooltip key={doc.document_id ?? index} title={`${isImage ? 'View' : 'Download'} ${doc.doc_name ?? 'file'}`} arrow>
              <Box
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover .file-overlay': {
                    opacity: 1
                  }
                }}
                onClick={() => handleImageClick(index)}
              >
                {isImage ? (
                  // Image thumbnail
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
                ) : (
                  // File thumbnail
                  <Card
                    variant="outlined"
                    sx={{
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>{getFileTypeIcon(doc.mime_type)}</CardContent>
                  </Card>
                )}

                <Box
                  className="file-overlay"
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
                    borderRadius: 1
                  }}
                >
                  {isImage ? <ZoomIn sx={{ color: 'white', fontSize: 16 }} /> : getFileTypeIcon(doc.mime_type)}
                </Box>

                {/* Delete button */}
                {canDelete && onDelete && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleDelete(index, e)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'error.main',
                      color: 'white',
                      width: 20,
                      height: 20,
                      '&:hover': {
                        backgroundColor: 'error.dark'
                      }
                    }}
                  >
                    <Delete sx={{ fontSize: 12 }} />
                  </IconButton>
                )}
              </Box>
            </Tooltip>
          );
        })}

        {hiddenCount > 0 && (
          <Tooltip title={`${hiddenCount} more files`} arrow>
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
                Type: {selectedImage.mime_type || 'unknown'} • Created:{' '}
                {selectedImage.created_on ? new Date(selectedImage.created_on).toLocaleString() : '-'}
              </Typography>

              {isSelectedImage ? (
                imageError || !selectedSrc ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load image. The file may be corrupted.
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
                )
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    {getFileIcon(selectedImage.mime_type)} {selectedImage.doc_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    This is a {selectedImage.mime_type || 'file'} document
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                {selectedSrc && (
                  <SubmitButton
                    variant="contained"
                    onClick={() => {
                      if (!selectedSrc) return;
                      const w = window.open();
                      if (w) {
                        if (isSelectedImage) {
                          w.document.write(`
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <title>${selectedImage.doc_name}</title>
                                <style>
                                  body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; }
                                  img { max-width: 100%; max-height: 90vh; object-fit: contain; }
                                </style>
                              </head>
                              <body>
                                <img src="${selectedSrc}" alt="${selectedImage.doc_name}" />
                              </body>
                            </html>
                          `);
                        } else {
                          // For non-image files, trigger download
                          const link = document.createElement('a');
                          link.href = selectedSrc;
                          link.download = selectedImage.doc_name;
                          link.click();
                        }
                      }
                    }}
                    disabled={!selectedSrc}
                  >
                    {isSelectedImage ? 'Open in New Tab' : 'Download File'}
                  </SubmitButton>
                )}
                <CancelButton variant="contained" onClick={handleClose}>
                  Close
                </CancelButton>
              </Box>

              {images.length > 1 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={selectedIndex === 0}
                    onClick={() => setSelectedIndex(selectedIndex - 1)}
                  >
                    Previous
                  </Button>
                  <Typography variant="body2" color="textSecondary">
                    {selectedIndex != null ? selectedIndex + 1 : '-'} of {images.length}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={selectedIndex === images.length - 1}
                    onClick={() => setSelectedIndex(selectedIndex + 1)}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Typography>No file selected</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCell;

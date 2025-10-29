// src/pages/EscalationReport.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Chip
} from '@mui/material';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import FieldPadding from 'components/FieldPadding';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import SubmitButton from 'components/CustomSubmitBtn';
import CustomRefreshBtn from 'components/CustomRefreshBtn';
import LoaderLogo from 'components/LoaderLogo';
import gridStyle from 'utils/gridStyle';
import { Business, ExpandMore } from '@mui/icons-material';
import { format } from 'date-fns';
import API from 'api/axios';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { YesButton, NoButton } from 'components/DialogActionsButton';

const EscalationReport = () => {
  const navigate = useNavigate();
  
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEscalation, setSelectedEscalation] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [escalationToDelete, setEscalationToDelete] = useState(null);

  // Status options for chip colors
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'acknowledged', label: 'Acknowledged', color: 'info' },
    { value: 'resolved', label: 'Resolved', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'error' }
  ];

  // Fetch all escalation reports for admin
  const fetchEscalationReports = async () => {
    try {
      setLoading(true);
      const response = await API.get('/escalation-reports/admin/reports');
      const data = response.data;

      if (data.success) {
        setEscalations(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch reports');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch escalation reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalationReports();
  }, []);

  const handleBackClick = () => navigate(-1);

  // View escalation details
  const viewEscalationDetails = (row) => {
    setSelectedEscalation(row);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = (row) => {
    setEscalationToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!escalationToDelete) return;
    try {
      // Add your delete API call here
      // await API.delete(`/escalations/${escalationToDelete.escalation_id}`);
      await fetchEscalationReports();
      setDeleteDialogOpen(false);
      setEscalationToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEscalationToDelete(null);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  // Get status chip color
  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'default';
  };

  const columns = [
    { 
      field: 'escalation_id', 
      headerName: 'Escalation ID', 
      width: 130,
      renderCell: (params) => `#${params.value}`
    },
    { 
      field: 'client', 
      headerName: 'Client', 
      width: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Business color="primary" fontSize="small" />
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {params.row.ticket?.client?.company_name || 'N/A'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              ID: {params.row.ticket?.client_id}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      field: 'ticket_info', 
      headerName: 'Ticket Info', 
      width: 180,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            Ticket #{params.row.ticket?.ticket_id}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.ticket?.module} - {params.row.ticket?.category}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'subject', 
      headerName: 'Subject', 
      width: 250,
      renderCell: (params) => (
        <Typography sx={{ 
          maxWidth: '240px', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap' 
        }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'escalated_to', 
      headerName: 'Escalated To', 
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {params.row.escalated_to_user_name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.escalated_to_email}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'escalated_to_level', 
      headerName: 'Level', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={`Level ${params.value}`} 
          size="small" 
          color="primary" 
          variant="outlined" 
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getStatusColor(params.value)}
          size="small"
        />
      )
    },
    { 
      field: 'created_on', 
      headerName: 'Created On', 
      width: 180,
      renderCell: (params) => formatDate(params.value)
    },
    { 
      field: 'reminder_count', 
      headerName: 'Reminders', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          variant={params.value > 0 ? "filled" : "outlined"}
          color={params.value > 0 ? "secondary" : "default"}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            color="primary" 
            size="small" 
            onClick={() => viewEscalationDetails(params.row)}
            title="View Details"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton 
            color="primary" 
            size="small" 
            onClick={() => viewEscalationDetails(params.row)}
            title="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            size="small" 
            onClick={() => handleDeleteClick(params.row)}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  const rows = (escalations || []).map((escalation, index) => ({
    id: index + 1,
    ...escalation
  }));

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <LoaderLogo />
        </Box>
      ) : (
        <MainCard
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
              <span>Escalation Reports</span>
              <PlusButton label="Back" onClick={handleBackClick} />
            </Box>
          }
        >
          <Box sx={{ height: '85dvh', overflowY: 'scroll' }}>
            {/* Search and Filter Section - You can add filters here later */}
            <Box p={1}>
              <Box display="flex" gap={2} alignItems="center" mb={2}>
                <FieldPadding 
                  placeholder="Search escalations..." 
                  size="small" 
                  sx={{ width: 300 }}
                />
                <SubmitButton variant="contained" size="small">
                  Search
                </SubmitButton>
                <CustomRefreshBtn onClick={fetchEscalationReports}>
                  Refresh
                </CustomRefreshBtn>
              </Box>
              
              {/* Summary Stats */}
              <Box mb={2}>
                <Typography variant="h6" color="textSecondary">
                  Total Escalations: {escalations.length}
                </Typography>
              </Box>
            </Box>

            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{ ...gridStyle, height: '72vh', mt: 2 }}
              rows={rows}
              columns={columns}
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            />

            {/* Escalation Detail Dialog */}
            <Dialog 
              open={detailDialogOpen} 
              onClose={() => setDetailDialogOpen(false)}
              maxWidth="lg"
              fullWidth
            >
              <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                  <Business color="primary" />
                  <Typography variant="h6">
                    Escalation Details #{selectedEscalation?.escalation_id}
                  </Typography>
                </Box>
              </DialogTitle>
              <DialogContent>
                {selectedEscalation && (
                  <Box>
                    {/* Client Information */}
                    <Typography variant="h6" gutterBottom color="primary">
                      Client Information
                    </Typography>
                    <Box sx={{ mb: 3, p: 2, backgroundColor: 'primary.50', borderRadius: 1 }}>
                      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Client Name
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {selectedEscalation.ticket?.client?.company_name || 'N/A'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Client Email
                          </Typography>
                          <Typography variant="body1">
                            {selectedEscalation.ticket?.client?.email || 'N/A'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Client ID
                          </Typography>
                          <Typography variant="body1">
                            {selectedEscalation.ticket?.client_id || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Basic Escalation Information */}
                    <Typography variant="h6" gutterBottom>
                      Escalation Information
                    </Typography>
                    <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Subject
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedEscalation.subject}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Status
                          </Typography>
                          <Chip 
                            label={selectedEscalation.status} 
                            color={getStatusColor(selectedEscalation.status)}
                            sx={{ mb: 1 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Escalation Level
                          </Typography>
                          <Chip 
                            label={`Level ${selectedEscalation.escalated_to_level}`} 
                            color="primary" 
                            variant="outlined" 
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Escalated To
                          </Typography>
                          <Typography variant="body1">
                            {selectedEscalation.escalated_to_user_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {selectedEscalation.escalated_to_email}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Escalated By
                          </Typography>
                          <Typography variant="body1">
                            {selectedEscalation.escalator?.first_name} {selectedEscalation.escalator?.last_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {selectedEscalation.escalator?.email}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Created On
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(selectedEscalation.created_on)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Reminders Sent
                          </Typography>
                          <Typography variant="body1">
                            {selectedEscalation.reminder_count}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Last Updated
                          </Typography>
                          <Typography variant="body1">
                            {selectedEscalation.updated_on ? formatDate(selectedEscalation.updated_on) : 'Never'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Message */}
                    <Typography variant="h6" gutterBottom>
                      Escalation Message
                    </Typography>
                    <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {selectedEscalation.message}
                      </Typography>
                    </Box>

                    {/* Ticket Information */}
                    <Typography variant="h6" gutterBottom>
                      Ticket Information
                    </Typography>
                    <Box sx={{ mb: 3, p: 2, backgroundColor: 'secondary.50', borderRadius: 1 }}>
                      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Ticket ID
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            #{selectedEscalation.ticket?.ticket_id}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Module
                          </Typography>
                          <Typography variant="body1">
                            {selectedEscalation.ticket?.module || 'N/A'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Category
                          </Typography>
                          <Typography variant="body1">
                            {selectedEscalation.ticket?.category || 'N/A'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Ticket Status
                          </Typography>
                          <Chip 
                            label={selectedEscalation.ticket?.status || 'N/A'} 
                            size="small"
                            color={
                              selectedEscalation.ticket?.status === 'Resolved' ? 'success' :
                              selectedEscalation.ticket?.status === 'Closed' ? 'default' :
                              selectedEscalation.ticket?.status === 'Pending' ? 'warning' : 'primary'
                            }
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Ticket Created
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(selectedEscalation.ticket?.created_at)}
                          </Typography>
                        </Box>
                        <Box gridColumn="span 3">
                          <Typography variant="subtitle2" color="textSecondary">
                            Ticket Description
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {selectedEscalation.ticket?.comment || 'No description available'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* History */}
                    <Accordion defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6">
                          Escalation History ({selectedEscalation.history?.length || 0})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {selectedEscalation.history?.map((historyItem) => (
                          <Box key={historyItem.history_id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                              <Box flex={1}>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                  <Chip 
                                    label={historyItem.action} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined" 
                                  />
                                  <Typography variant="body2" color="textSecondary">
                                    {formatDate(historyItem.created_on)}
                                  </Typography>
                                </Box>
                                {historyItem.notes && (
                                  <Typography variant="body1" sx={{ mb: 1 }}>
                                    {historyItem.notes}
                                  </Typography>
                                )}
                                <Typography variant="caption" color="textSecondary">
                                  By: {historyItem.performer?.first_name} {historyItem.performer?.last_name}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                        {!selectedEscalation.history?.length && (
                          <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                            No history available for this escalation
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <SubmitButton onClick={() => setDetailDialogOpen(false)} variant="contained">
                  Close
                </SubmitButton>
              </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete escalation #{escalationToDelete?.escalation_id}?
                </Typography>
              </DialogContent>
              <DialogActions>
                <NoButton onClick={handleDeleteCancel}>
                  <span>No</span>
                </NoButton>
                <YesButton onClick={handleDeleteConfirm}>
                  <span>Yes</span>
                </YesButton>
              </DialogActions>
            </Dialog>
          </Box>
        </MainCard>
      )}
    </>
  );
};

export default EscalationReport;
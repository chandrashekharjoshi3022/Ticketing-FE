import React, { useState, useEffect } from 'react';
// import axios from 'axios';

import API from '../../api/axios'; // your API wrapper
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
  Divider,
  Tabs,
  Tab,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
  TextField
} from '@mui/material';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import PlusButton from 'components/CustomButton';
import CustomParagraphLight from 'components/CustomParagraphLight';
import gridStyle from 'utils/gridStyle';
import CloseIcon from '@mui/icons-material/Close';
import CustomParagraphDark from 'components/CustomParagraphDark';
import CustomHeading from 'components/CustomHeading';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReplyIcon from '@mui/icons-material/Reply';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate, formatDateTime, formatDateTimeSplit } from 'components/DateFormate';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, fetchTicketDetails, createTicket, replyToTicket, clearTicketDetails } from '../../features/tickets/ticketSlice';
import { selectUserRole, selectCurrentUser, selectIsInitialized } from '../../features/auth/authSlice';
import TicketForm from './TicketForm';
import ImageCell from './ImageCell';
import { toast } from 'react-toastify';

export default function TicketRaise() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    return '📎';
  };

  const {
    tickets,
    ticketDetails,
    isLoading: ticketsLoading,
    error: ticketsError
  } = useSelector(
    (s) =>
      s.tickets || {
        tickets: [],
        ticketDetails: null,
        isLoading: false,
        error: null
      }
  );

  const userRole = useSelector(selectUserRole);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthInitialized = useSelector(selectIsInitialized);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [showTableBodies, setShowTableBodies] = useState({ ticketView: true });
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [status, setStatus] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [assign, setAssign] = useState('');
  const [priority, setPriority] = useState('');
  const [priorities, setPriorities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const isAdmin = userRole === 'admin';
  const isExecutive = userRole === 'executive';
  const userId = currentUser?.id;
  useEffect(() => {
    if (isAuthInitialized && !currentUser) {
      navigate('/login');
    }
  }, [isAuthInitialized, currentUser, navigate]);

  useEffect(() => {
    if (isAuthInitialized && currentUser) {
      console.log(`Fetching tickets for user: ${currentUser.username}, role: ${userRole}`);
      dispatch(fetchTickets());
    }
  }, [dispatch, isAuthInitialized, currentUser, userRole]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const response = await API.get('/auth/executives');
        setExecutives(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchExecutives();
  }, []);

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        setIsLoading(true);
        const response = await API.get('/admin/priorities');

        let prioritiesData = response.data;

        if (Array.isArray(prioritiesData)) {
          setPriorities(prioritiesData);
        } else if (prioritiesData && Array.isArray(prioritiesData.priorities)) {
          setPriorities(prioritiesData.priorities);
        } else if (prioritiesData && Array.isArray(prioritiesData.data)) {
          setPriorities(prioritiesData.data);
        } else {
          console.warn('Unexpected priorities response structure:', prioritiesData);
          setPriorities([]);
        }
      } catch (error) {
        console.error('Error fetching priorities:', error);
        setPriorities([]);
        toast.error('Failed to load priorities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriorities();
  }, []);

  useEffect(() => {
    if (ticketDetails) {
      setPriority(ticketDetails.priority || '');
    }
  }, [ticketDetails]);

  // useEffect(() => {
  //   if (status || priority || assign) {
  //     const assigneeName = executives.find((e) => e.user_id === assign)?.username || '';

  //     let autoMessage = '';

  //     if (status) {
  //       autoMessage += `<strong>${status}</strong> Status`;
  //     }

  //     if (assigneeName) {
  //       autoMessage += ` assigned to <strong>${assigneeName}</strong>`;
  //     }

  //     if (priority) {
  //       autoMessage += ` with <strong>${priority}</strong> priority`;
  //     }

  //     if (autoMessage) {
  //       setReplyMessage(`<p>${autoMessage}</p>`);
  //     }
  //   } else if (!status && !priority && !assign) {
  //     // Clear message if all fields are empty
  //     setReplyMessage('');
  //   }
  // }, [status, priority, assign, executives]);



  const lastAutoMessageRef = React.useRef('');
  
    useEffect(() => {
    const assigneeName = executives.find((e) => e.user_id === assign)?.username || '';
  
    let autoMessage = '';
  
    if (status) {
      autoMessage += `<strong>${status}</strong> Status`;
    }
  
    if (assigneeName) {
      autoMessage += (autoMessage ? ' ' : '') + `assigned to <strong>${assigneeName}</strong>`;
    }
  
    if (priority) {
      autoMessage += (autoMessage ? ' ' : '') + `with <strong>${priority}</strong> priority`;
    }
  
    // wrap only if we have content
    const newAutoHtml = autoMessage ? `<p>${autoMessage}</p>` : '';
  
    if (!newAutoHtml) {
      // If there was a previous auto message appended, remove it from replyMessage.
      if (lastAutoMessageRef.current) {
        setReplyMessage((prev) => {
          if (!prev) return '';
          const idx = prev.indexOf(lastAutoMessageRef.current);
          if (idx !== -1) {
            const updated = prev.slice(0, idx) + prev.slice(idx + lastAutoMessageRef.current.length);
            return updated;
          }
          return prev;
        });
        lastAutoMessageRef.current = '';
      }
      return;
    }
  
    // If we have a new auto message
    setReplyMessage((prev) => {
      const prevText = prev || '';
  
      // if editor empty -> set to new auto
      if (!prevText.trim()) {
        lastAutoMessageRef.current = newAutoHtml;
        return newAutoHtml;
      }
  
      // if we never appended an auto before -> append it
      if (!lastAutoMessageRef.current) {
        lastAutoMessageRef.current = newAutoHtml;
        return prevText + newAutoHtml;
      }
  
      // if we appended before, try to replace only that portion
      if (prevText.includes(lastAutoMessageRef.current)) {
        const replaced = prevText.replace(lastAutoMessageRef.current, newAutoHtml);
        lastAutoMessageRef.current = newAutoHtml;
        return replaced;
      }
  
      // fallback: append if not found
      lastAutoMessageRef.current = newAutoHtml;
      return prevText + newAutoHtml;
    });
  }, [status, priority, assign, executives]);




  if (!isAuthInitialized) {
    return (
      <Box sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={40} />
        <Typography>Loading user information...</Typography>
      </Box>
    );
  }

  if (!currentUser) {
    return null;
  }

  const conversationRows = React.useMemo(() => {
    if (!ticketDetails) return [];
    const initialRow = {
      id: `initial-${ticketDetails.ticket_id ?? 't'}`,
      comments: ticketDetails.comment ?? '',
      created_by: ticketDetails.created_by ?? ticketDetails.creator?.username ?? 'User',
      created_on: ticketDetails.created_on ?? ticketDetails.createdAt ?? '',
      status: ticketDetails.status ?? '',
      allImages: ticketDetails.documents ?? []
    };

    const replyRows = (ticketDetails.replies || []).map((reply, index) => {
      let displayName = 'User';
      if (reply.sender_type === 'system') {
        displayName = 'System';
      } else if (reply.sender?.username) {
        displayName = reply.sender.username;
      } else if (reply.sender_type === 'admin') {
        displayName = 'Admin';
      }

      return {
        id: reply.reply_id ?? `reply-${index}`,
        comments: reply.message ?? reply.comment ?? '',
        created_by: displayName,
        created_on: reply.created_at ?? reply.created_on ?? '',
        status: reply.status ?? '',
        allImages: reply.documents ?? []
      };
    });

    return [initialRow, ...replyRows].map((row, i) => ({ ...row, sr_no: i + 1 }));
  }, [ticketDetails]);

  const handleView = async (row) => {
    console.log('Permission check:', {
      isAdmin,
      rowUserId: row.user_id,
      currentUserId: userId,
      rowCreatedBy: row.created_by,
      row
    });

    setSelectedTicket(row);
    setOpenModal(true);
    setIsLoading(true);
    try {
      await dispatch(fetchTicketDetails(row.id)).unwrap();
    } catch (err) {
      console.error('Failed to load details', err);
      window.alert('Failed to load ticket details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTicket(null);
    setReplyMessage('');
    setStatus('');
    setAssign('');
    setPriority('');
    setAttachedFiles([]);
    dispatch(clearTicketDetails());
    setSuccessMessage('');
  };

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const handleReplySubmit = async () => {
    if (!ticketDetails?.ticket_id) return;
    if (!replyMessage || replyMessage.trim() === '') {
      return window.alert('Please enter a message');
    }

    setIsSubmittingReply(true);

    try {
      const formData = new FormData();
      formData.append('message', replyMessage);

      if (status) {
        formData.append('status', status);
      }

      if (isAdmin && priority) {
        formData.append('priority', priority);
      }

      if (isAdmin && assign) {
        formData.append('assigned_to', assign);
      }

      attachedFiles.forEach((file) => {
        formData.append('files', file);
      });

      await dispatch(
        replyToTicket({
          ticketId: ticketDetails.ticket_id,
          formData: formData
        })
      ).unwrap();

      await dispatch(fetchTicketDetails(ticketDetails.ticket_id)).unwrap();
      await dispatch(fetchTickets()).unwrap();
      setReplyMessage('');
      setStatus('');
      setAssign('');
      setPriority('');
      setAttachedFiles([]);
      setSuccessMessage('Reply sent successfully!');
      toast.success('Reply sent successfully!', { autoClose: 2000 });
    } catch (err) {
      console.error('Reply failed', err);
      window.alert(err?.message || 'Failed to send reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    const existingFiles = attachedFiles || [];
    const uniqueNewFiles = newFiles.filter(
      (newFile) =>
        !existingFiles.some(
          (existingFile) =>
            existingFile.name === newFile.name && existingFile.size === newFile.size && existingFile.lastModified === newFile.lastModified
        )
    );

    if (uniqueNewFiles.length === 0) {
      return;
    }

    const updatedFiles = [...existingFiles, ...uniqueNewFiles];
    setAttachedFiles(updatedFiles);
    e.target.value = '';
  };

  const removeAttachedFile = (index) => {
    setAttachedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      return newFiles;
    });
  };

  const getFilteredTickets = () => {
    if (!tickets) return [];
    let filtered = tickets;
    if (activeTab !== 'All') {
      filtered = filtered.filter((ticket) => ticket.status === activeTab);
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((ticket) => {
        return (
          ticket.ticket_no?.toLowerCase().includes(query) ||
          ticket.module?.toLowerCase().includes(query) ||
          ticket.submodule?.toLowerCase().includes(query) ||
          ticket.category?.toLowerCase().includes(query) ||
          ticket.comments
            ?.replace(/<[^>]*>/g, '')
            .toLowerCase()
            .includes(query) ||
          ticket.created_by?.toLowerCase().includes(query) ||
          ticket.status?.toLowerCase().includes(query) ||
          ticket.priority?.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  };
  const filteredRows = getFilteredTickets();

  const getStatusCounts = () => {
    return {
      All: tickets.length,
      Open: tickets.filter((t) => t.status === 'Open').length,
      Pending: tickets.filter((t) => t.status === 'Pending').length,
      Closed: tickets.filter((t) => t.status === 'Closed').length
    };
  };

  const statusCounts = getStatusCounts();

  const getStatusChip = (status) => {
    const statusConfig = {
      Open: { color: 'success' },
      Pending: { color: 'warning' },
      Closed: { color: 'error' },
      Resolved: { color: 'info' }
    };

    const config = statusConfig[status] || statusConfig.Open;

    return (
      <Chip
        icon={config.icon}
        label={status}
        color={config.color}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 'bold', minWidth: 80 }}
      />
    );
  };

  const renderDateWithSLA = (params, type) => {
    const timeSeconds = type === 'response' ? params.row.response_time_seconds : params.row.resolve_time_seconds;
    const targetMinutes = type === 'response' ? params.row.sla?.response_target_minutes : params.row.sla?.resolve_target_minutes;
    const timestamp = type === 'response' ? params.row.response_at : params.row.resolved_at;

    if (!timeSeconds || !targetMinutes || !timestamp) {
      return (
        <Tooltip title="No SLA data" arrow>
          <Typography variant="body2" color="gray" fontWeight="bold">
            {timestamp ? formatDate(timestamp) : '-'}
          </Typography>
        </Tooltip>
      );
    }

    const timeMinutes = timeSeconds / 60;
    let color = 'gray';
    let status = '-';

    if (timeMinutes <= targetMinutes) {
      color = 'green';
      status = 'Within SLA';
    } else if (timeMinutes <= targetMinutes * 1.1) {
      color = 'orange';
      status = 'Slightly Exceeded';
    } else {
      color = 'red';
      status = 'Significantly Exceeded';
    }

    const dt = formatDateTime(timestamp);

    return (
      <Tooltip title={`SLA Time: ${targetMinutes} min`} arrow>
        <Typography variant="body2" style={{ color }} fontWeight="bold" component="div">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{dt.date}</span>
            <span>
              {dt.time} ({timeMinutes.toFixed(1)} min )
            </span>
          </div>
        </Typography>
      </Tooltip>
    );
  };

  const columns = [
    {
      field: 'ticket_no',
      headerName: 'Ticket No.',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" color="primary" fontWeight="bold" onClick={() => handleView(params.row)} sx={{ cursor: 'pointer' }}>
          <Box color={'navy'}>{params.value}</Box>
        </Typography>
      )
    },
    { field: 'module', headerName: 'Category', width: 120 },
    { field: 'submodule', headerName: 'Sub Category', width: 200 },
    { field: 'category', headerName: 'Issue Type', width: 200 },
    {
      field: 'comments',
      headerName: 'Comments',
      width: 250,
      renderCell: (params) => (
        <div
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            padding: 0
          }}
          dangerouslySetInnerHTML={{ __html: params.value }}
        />
      )
    },
    {
      field: 'created_on',
      headerName: 'Created On',
      width: 150,
      renderCell: (params) => {
        return formatDateTime(params?.value);
      }
    },
    {
      field: 'response_at',
      headerName: 'Response On',
      width: 200,
      renderCell: (params) => renderDateWithSLA(params, 'response')
    },
    {
      field: 'resolved_at',
      headerName: 'Resolved On',
      width: 200,
      renderCell: (params) => renderDateWithSLA(params, 'resolve')
    },
    ...(isAdmin
      ? [
          {
            field: 'created_by',
            headerName: 'Created By',
            width: 120,
            renderCell: (params) => (
              <Typography variant="body2" fontStyle="italic">
                {params.value || 'Unknown'}
              </Typography>
            )
          }
        ]
      : []),
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => getStatusChip(params.value)
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 120
    }
  ];

  const commentColumn = [
    {
      field: 'id',
      headerName: 'Sr. No.',
      width: 70,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'comments',
      headerName: 'Comments',
      width: 300,
      flex: 1,
      renderCell: (params) => (
        <Box
          dangerouslySetInnerHTML={{ __html: params.value }}
          sx={{
            maxHeight: 60,
            overflow: 'hidden',
            '& p': { margin: 0 },
            '& ul, & ol': { margin: 0, paddingLeft: 2 }
          }}
        />
      )
    },
    {
      field: 'allImages',
      headerName: 'Images',
      width: 200,
      renderCell: (params) => <ImageCell images={params.value || []} />
    },
    { field: 'created_by', headerName: 'Created By', width: 120 },
    {
      field: 'created_on',
      headerName: 'Created On',
      width: 150,
      renderCell: (params) => {
        return formatDateTime(params?.value);
      }
    }
  ];

  const dialogStyle = {
    '& .MuiDialog-paper': {
      borderRadius: theme.spacing(2),
      boxShadow: theme.shadows[10],
      minWidth: '800px'
    }
  };

  return (
    <Box style={{ height: '85dvh', overflowY: 'scroll' }}>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h4" fontWeight={600}>
                <PendingActionsIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                {showTicketForm ? ' Raise Ticket ' : '  Ticket View'}
              </Typography>
            </Box>
            <Box>
              {showTicketForm ? (
                <PlusButton label="Back" onClick={() => setShowTicketForm(false)} />
              ) : (
                <PlusButton label="+Raise New Ticket" onClick={() => setShowTicketForm(true)} />
              )}
            </Box>
          </Box>
        }
      >
        <Box sx={{ height: '80dvh', overflowY: 'auto', overflowX: 'hidden' }}>
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {ticketsError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {ticketsError}
            </Alert>
          )}

          {!showTicketForm ? (
            <Box>
              {showTableBodies.ticketView && (
                <>
                  {/* Tabs + Search field container */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1 // spacing below the tabs/search section
                    }}
                  >
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      indicatorColor="primary"
                      textColor="primary"
                      sx={{
                        minHeight: '30px',
                        height: '30px',
                        '& .MuiTabs-flexContainer': {
                          height: '100%',
                          borderBottom: '1px solid gray'
                        },
                        '& .MuiTab-root': {
                          padding: '0px 12px',
                          minHeight: '30px',
                          border: '1px solid #f6c846',
                          color: 'gray',
                          borderTopLeftRadius: '10px',
                          borderTopRightRadius: '10px',
                          marginRight: '1px',
                          backgroundColor: '#f5f5f5',
                          '&.Mui-selected': {
                            color: 'black',
                            backgroundColor: '#f6c846'
                          },
                          '&:hover': {
                            borderColor: '#f6c846'
                          }
                        },
                        '& .MuiTabs-indicator': {
                          backgroundColor: '#f6c846'
                        }
                      }}
                    >
                      <Tab label={`All (${statusCounts.All})`} value="All" />
                      <Tab label={`Open (${statusCounts.Open})`} value="Open" />
                      <Tab label={`Pending (${statusCounts.Pending})`} value="Pending" />
                      <Tab label={`Closed (${statusCounts.Closed})`} value="Closed" />
                    </Tabs>

                    {/* 🔍 Search Field */}
                    <Box>
                      <TextField
                        size="small"
                        placeholder="Search..."
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                          width: 250,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                            height: '32px'
                          }
                        }}
                      />
                    </Box>
                  </Box>
                  <DataGrid
                    getRowHeight={() => 'auto'}
                    sx={{
                      ...gridStyle,
                      height: '80vh',
                      '& .MuiDataGrid-cell p': {
                        margin: 0,
                        padding: 0
                      },
                      '--DataGrid-headersTotalHeight': '0px',
                      '--DataGrid-rowHeight': '40px' // set row height
                    }}
                    stickyHeader={true}
                    rows={filteredRows.map((row, index) => ({ ...row, sr_no: index + 1 }))}
                    columns={[
                      {
                        field: 'sr_no',
                        headerName: 'Sr. No.',
                        width: 70,
                        renderCell: (params) => (
                          <Typography variant="body2" fontWeight="bold">
                            {params.value}
                          </Typography>
                        )
                      },
                      ...columns.filter((col) => col.field !== 'id')
                    ]}
                    loading={ticketsLoading}
                    pageSizeOptions={[10, 25, 50]}
                    autoHeight={false}
                    initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                    slots={{
                      noRowsOverlay: () => (
                        <Box>
                          <Typography variant="body2" sx={{ color: 'red', fontWeight: 500 }}>
                            No Record Found
                          </Typography>
                        </Box>
                      )
                    }}
                  />
                </>
              )}
            </Box>
          ) : (
            <Box>
              <TicketForm onCancel={() => setShowTicketForm(false)} />
            </Box>
          )}

          {/* Ticket Details Modal */}
          <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth sx={dialogStyle}>
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#244b78',
                color: 'white',
                padding: '12px 24px',
                fontWeight: '600'
              }}
            >
              <Box>
                Ticket Details -
                <span style={{ marginLeft: 8, fontFamily: 'monospace' }}>{selectedTicket ? selectedTicket.ticket_no : ''}</span>
                {ticketDetails && (
                  <Chip
                    label={ticketDetails.status}
                    color={ticketDetails.status === 'Open' ? 'success' : ticketDetails.status === 'Closed' ? 'error' : 'warning'}
                    size="small"
                    sx={{ ml: 2, color: 'white', fontWeight: 'bold' }}
                  />
                )}
                {isAdmin && ticketDetails && (
                  <Typography variant="caption" display="block" sx={{ color: 'white', opacity: 0.9, mt: 0.5 }}>
                    Created by: {ticketDetails.created_by || 'Unknown'}
                  </Typography>
                )}
              </Box>
              <IconButton edge="end" color="inherit" onClick={handleCloseModal} sx={{ p: 0.5 }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <CircularProgress />
                </Box>
              ) : ticketDetails ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                      <CustomParagraphDark>Category</CustomParagraphDark>
                      <CustomParagraphLight>{ticketDetails.module}</CustomParagraphLight>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <CustomParagraphDark>Sub Category</CustomParagraphDark>
                      <CustomParagraphLight>{ticketDetails.submodule}</CustomParagraphLight>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <CustomParagraphDark>Issue Type</CustomParagraphDark>
                      <CustomParagraphLight>{ticketDetails.category}</CustomParagraphLight>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <CustomParagraphDark>Created On</CustomParagraphDark>
                      <CustomParagraphLight>
                        {ticketDetails.created_on ? formatDateTimeSplit(ticketDetails.created_on) : '-'}
                      </CustomParagraphLight>
                    </Grid>

                    {/* Priority Display Only */}
                    <Grid item xs={12} md={2}>
                      <CustomParagraphDark>Priority</CustomParagraphDark>
                      <CustomParagraphLight>
                        {ticketDetails?.priority || 'Not set'}
                        {isAdmin && (
                          <Typography variant="caption" display="block" color="textSecondary">
                            {ticketDetails?.is_other_issue ? '' : ''}
                          </Typography>
                        )}
                      </CustomParagraphLight>
                    </Grid>

                    {isAdmin && (
                      <Grid item xs={12} md={2}>
                        <CustomParagraphDark>Created By:</CustomParagraphDark>
                        <CustomParagraphLight>{ticketDetails.created_by || 'Unknown'}</CustomParagraphLight>
                      </Grid>
                    )}

                    <Grid item xs={12} display={'flex'} alignItems={'center'}>
                      <CustomParagraphDark> Comment: </CustomParagraphDark>
                      <Box sx={{ marginLeft: '10px' }} dangerouslySetInnerHTML={{ __html: ticketDetails.comment }} />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 1 }} />
                  {(isExecutive || isAdmin || ticketDetails.user_id === userId) && ticketDetails.status !== 'Closed' && (
                    <>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <CustomHeading>Add Your Comment</CustomHeading>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6} gap={2} mt={1}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                              <FormControl size="small" sx={{ minWidth: '100%' }}>
                                <Select
                                  value={status}
                                  onChange={(e) => setStatus(e.target.value)}
                                  displayEmpty
                                  sx={{
                                    '& .MuiSelect-select': { padding: '6px', fontSize: '11px' },
                                    '& .MuiMenuItem-root': { fontSize: '11px' }
                                  }}
                                >
                                  <MenuItem value="">
                                    <em>Select Status</em>
                                  </MenuItem>

                                  {!isAdmin && !isExecutive && <MenuItem value="Closed">Closed</MenuItem>}

                                  {(isAdmin || isExecutive) && [
                                    <MenuItem key="Open" value="Open">
                                      Open
                                    </MenuItem>,
                                    <MenuItem key="Pending" value="Pending">
                                      Pending
                                    </MenuItem>,
                                    <MenuItem key="Resolved" value="Resolved">
                                      Resolved
                                    </MenuItem>,
                                    <MenuItem key="Closed" value="Closed">
                                      Closed
                                    </MenuItem>
                                  ]}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              {isAdmin && (
                                <FormControl size="small" sx={{ minWidth: '100%' }}>
                                  <Select
                                    value={assign}
                                    displayEmpty
                                    onChange={(e) => setAssign(e.target.value)}
                                    sx={{
                                      '& .MuiSelect-select': { padding: '6px', fontSize: '11px' },
                                      '& .MuiMenuItem-root': { fontSize: '11px' }
                                    }}
                                  >
                                    <MenuItem value="">
                                      <em>Select Assignee</em>
                                    </MenuItem>
                                    {executives.map((executive) => (
                                      <MenuItem key={executive.user_id} value={executive.user_id}>
                                        {executive.username}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            </Grid>
                            <Grid item xs={12} md={2.8}>
                              {isAdmin && ticketDetails?.is_other_issue && (
                                <FormControl size="small" sx={{ minWidth: '100%' }}>
                                  <Select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    displayEmpty
                                    sx={{
                                      '& .MuiSelect-select': { padding: '6px', fontSize: '11px' },
                                      '& .MuiMenuItem-root': { fontSize: '11px' }
                                    }}
                                  >
                                    <MenuItem value="">
                                      <em>Select Priority</em>
                                    </MenuItem>
                                    {priorities.map((p) => (
                                      <MenuItem key={p.priority_id ?? p.id} value={p.name}>
                                        {p.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            </Grid>
                            <Grid item xs={12} md={3.2}>
                              <input
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                style={{ display: 'none' }}
                                id="upload-screenshot"
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                              />
                              <label htmlFor="upload-screenshot">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  component="span"
                                  startIcon={<UploadFileIcon />}
                                  fullWidth
                                  sx={{
                                    borderColor: 'grey.400',
                                    color: 'grey.700',
                                    '&:hover': {
                                      borderColor: 'grey.600',
                                      backgroundColor: 'grey.100'
                                    }
                                  }}
                                >
                                  Upload Files ({attachedFiles.length})
                                </Button>
                              </label>
                            </Grid>
                            <Grid item xs={12}>
                              <ReactQuill
                                value={replyMessage}
                                onChange={setReplyMessage}
                                modules={{
                                  toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']]
                                }}
                                style={{ height: 150, marginBottom: 16 }}
                                placeholder="Type your reply here..."
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          {/* <Box sx={{ backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                              
                            </Box> */}

                          {attachedFiles.length > 0 && (
                            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#fafafa' }}>
                              {/* <Typography variant="subtitle2" gutterBottom>
                                      Files to be attached ({attachedFiles.length}):
                                    </Typography> */}
                              <Grid container spacing={1}>
                                {attachedFiles.map((file, index) => {
                                  const fileUrl = URL.createObjectURL(file);
                                  const isImage = file.type.startsWith('image/');

                                  return (
                                    <Grid item xs={4} key={index}>
                                      <Card variant="outlined" sx={{ position: 'relative' }}>
                                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography variant="body2" sx={{ flexGrow: 1, fontSize: '0.8rem', wordBreak: 'break-word' }}>
                                              {getFileIcon(file.type)} {file.name}
                                            </Typography>
                                            <IconButton
                                              size="small"
                                              onClick={() => removeAttachedFile(index)}
                                              color="error"
                                              sx={{ ml: 0.5 }}
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          </Box>

                                          <Typography variant="caption" color="textSecondary" display="block">
                                            {(file.size / 1024).toFixed(2)} KB • {file.type.split('/')[1] || file.type}
                                          </Typography>

                                          {/* Image preview for image files */}
                                          {isImage && (
                                            <Box sx={{ mt: 1 }}>
                                              <img
                                                src={fileUrl}
                                                alt={file.name}
                                                style={{
                                                  width: '100%',
                                                  height: 90,
                                                  objectFit: 'cover',
                                                  border: '1px solid #e0e0e0',
                                                  borderRadius: 4,
                                                  cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                  const w = window.open();
                                                  if (w) {
                                                    w.document.write(`
                                                    <!DOCTYPE html>
                                                    <html>
                                                      <head>
                                                        <title>${file.name}</title>
                                                        <style>
                                                          body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; }
                                                          img { max-width: 100%; max-height: 90vh; object-fit: contain; }
                                                        </style>
                                                      </head>
                                                      <body>
                                                        <img src="${fileUrl}" alt="${file.name}" />
                                                      </body>
                                                    </html>
                                                  `);
                                                  }
                                                }}
                                              />
                                            </Box>
                                          )}

                                          {/* Preview button for non-image files */}
                                          {!isImage && (
                                            <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                                              <Button
                                                size="small"
                                                variant="outlined"
                                                fullWidth
                                                sx={{ fontSize: '0.7rem' }}
                                                onClick={() => {
                                                  const link = document.createElement('a');
                                                  link.href = fileUrl;
                                                  link.download = file.name;
                                                  link.click();
                                                }}
                                              >
                                                Download
                                              </Button>
                                            </Box>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            </Box>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              gap: 2,
                              mt: 2
                            }}
                          >
                            <Button
                              variant="contained"
                              onClick={() => {
                                setReplyMessage('');
                                setAttachedFiles([]);
                                setStatus('');
                                setAssign('');
                                setPriority('');
                              }}
                              disabled={isSubmittingReply}
                              sx={{
                                backgroundColor: '#cd640d',
                                color: theme.palette.common.white,
                                '&:hover': {
                                  backgroundColor: '#cd640d'
                                },
                                '&:focus': {
                                  outline: 'none'
                                },
                                fontSize: '13px',
                                padding: '2px 7px !important',
                                textTransform: 'none'
                              }}
                            >
                              Clear All
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleReplySubmit}
                              sx={{
                                marginLeft: 1,
                                backgroundColor: '#2c6095',
                                color: theme.palette.common.white,
                                '&:hover': {
                                  backgroundColor: '#244b78'
                                },
                                '&:focus': {
                                  outline: 'none'
                                },
                                fontSize: '13px',
                                padding: '2px 7px !important',
                                textTransform: 'none'
                              }}
                              startIcon={isSubmittingReply ? <CircularProgress size={16} /> : <ReplyIcon />}
                            >
                              {isSubmittingReply ? 'Sending...' : 'Send Reply'}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {/* <Divider sx={{ my: 4 }} /> */}
                  <Box mt={4}>
                    <CustomHeading>Conversation History</CustomHeading>
                  </Box>

                  <DataGrid
                    stickyHeader={true}
                    getRowHeight={() => 'auto'}
                    sx={{ ...gridStyle }}
                    rows={conversationRows}
                    columns={[
                      {
                        field: 'sr_no',
                        headerName: 'Sr. No.',
                        width: 70,
                        renderCell: (params) => (
                          <Typography variant="body2" fontWeight="bold">
                            {params.value}
                          </Typography>
                        )
                      },
                      ...commentColumn.filter((col) => col.field !== 'id')
                    ]}
                    hideFooter
                    disableColumnMenu
                  />
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">No ticket data available</Typography>
                </Box>
              )}
            </DialogContent>
          </Dialog>
        </Box>
      </MainCard>
    </Box>
  );
}

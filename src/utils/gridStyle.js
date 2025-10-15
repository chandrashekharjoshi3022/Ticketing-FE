import { height } from '@mui/system';

const gridStyle = {
  // height:'100%',
  // paddingBottom: '200px',
  '& .MuiDataGrid-cell': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    border: '1px solid rgba(224, 224, 224, 1)',
    display: 'flex',
    alignItems: 'center'
    
  },
  '--DataGrid-headersTotalHeight': '0px',
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#f5f5f5',
    border: '1px solid rgba(224, 224, 224, 1)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '25px !important',
    display: 'flex',
    alignItems: 'center'
  },
  '& .MuiTablePagination-root': {
    overflow: 'hidden'
  },
  '& .MuiDataGrid-cell p': {
    margin: 0,
    padding: 0
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
    '&::-webkit-outer-spin-button': {
      WebkitAppearance: 'none',
      margin: 0
    },
    '&::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0
    },
    '&:focus': {
      wheelBehavior: 'none'
    }
  },
  '& .MuiDataGrid-menuIcon': {
    display: 'none'
  },
  '& .MuiCheckbox-root': {
    width: '18px',
    height: '18px'
  },
  '& .MuiSvgIcon-root': {
    fontSize: '20px'
  },

  '& .MuiDataGrid-checkboxInput': {
    padding: '0px'
  },

  '& .MuiTablePagination-root': {
    overflow: 'hidden'
  },
  '& .MuiDataGrid-footerContainer': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // padding: '0 16px',
    height: '8px',
    borderTop: '1px solid rgba(224, 224, 224, 1)',
    backgroundColor: '#fafbfb'
  },
  '& .MuiDataGrid-selectedRowCount': {
    display: 'none'
  }
};

export default gridStyle;

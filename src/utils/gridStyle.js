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
  '& .css-qzaw2-MuiTablePagination-root': {
    overflow: 'hidden'
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
    display: 'none',
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

  '& .css-qzaw2-MuiTablePagination-root': {
    overflow: 'hidden'
  }
};

export default gridStyle;

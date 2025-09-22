import React, {
  useMemo,
  useState,
  useRef
} from "react";

import {
  Box,
  TextField,
  Typography
} from '@mui/material'


import { AgGridReact } from '@ag-grid-community/react'; // React Grid Logic
import "@ag-grid-community/styles/ag-grid.css"; // Core CSS
import "@ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useMyContext } from 'contexts/RfqItemContex';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
ModuleRegistry.registerModules([ClientSideRowModelModule]);


const OprItemListPage = () => {
  const {
    oprItemlist,
    setSelectedRowsIds
  } = useMyContext();

  const gridApiRef = useRef(null);

  const onFilterTextBoxChanged = () => {
    gridApiRef.current.setQuickFilter(document.getElementById('filter-text-box').value);
  };

  const [rowData, setRowData] = useState(oprItemlist);

  const [colDefs, setColDefs] = useState([
    { field: 'id', headerName: 'Id', filter: true, editable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'item_id', headerName: 'Item Id' },
    { field: 'item_name', headerName: 'Item Name' },
    { field: 'opr_id', headerName: 'Opr Id' },
    { field: 'quantity', headerName: 'Quantity' }
  ]);



  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
    };
  }, []);

  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 15, 20];

  const handleSelectionChanged = (event) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedRowsIds(selectedRows.map(obj => obj.id));
  };



  // Container: Defines the grid's theme & dimensions.
  return (
    <>
      <Box display={'flex'} alignItems={'center'} my={'10px'} mx={'20px'} gap={'10px'}>
        <Typography variant="box1">
          Search:
        </Typography>
        <TextField
          variant="outlined"
          type="text"
          id="filter-text-box"
          placeholder="Type to filter..."
          onInput={onFilterTextBoxChanged}
        ></TextField>
      </Box >

      <div className="ag-theme-quartz" style={{ width: '100%', height: '900px' }}>
        <AgGridReact
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          rowData={rowData}
          columnDefs={colDefs}
          // defaultColDef={defaultColDef}
          rowSelection="multiple"
          onSelectionChanged={handleSelectionChanged}
          onGridReady={params => gridApiRef.current = params.api}
        />

      </div>

    </>
  );
}

export default OprItemListPage;



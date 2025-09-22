// import React, { useState } from 'react';
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import MainCard from 'components/MainCard';
import { AgGridReact } from '@ag-grid-community/react'; // React Grid Logic
import "@ag-grid-community/styles/ag-grid.css"; // Core CSS
import "@ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useMyContext } from 'contexts/RfqItemContex';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
ModuleRegistry.registerModules([ClientSideRowModelModule]);





// Create new GridExample component
const GridExample = () => {
  // Row Data: The data to be displayed.
  const { rfqItemList, oprItemlist, rfqlist, itemCount, setSelectedRowsIds } = useMyContext();



  const [rowData, setRowData] = useState(oprItemlist);


  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    // { field: 'id', headerName: 'Id', filter: true, editable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'id', headerName: 'RFQ Id', filter: true, editable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'vendor_list', headerName: 'Vendor List' },
    { field: 'item_list', headerName: 'Item List' },
    { field: 'created_by', headerName: 'Creadted By' },
    { field: 'created_on', headerName: 'Creadted On' },
    { field: 'status', headerName: 'Status' }
  ]);


  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
    };
  }, []);

  // const defaultColDef = {
  //     flex: 1,
  // }

  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 15, 20];

  const handleSelectionChanged = (event) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedRowsIds(selectedRows.map(obj => obj.id));
    console.log(selectedRows.map(obj => obj.id));
  };



  // Container: Defines the grid's theme & dimensions.
  return (

    <MainCard
      title='RFQ List'>
      <div className="ag-theme-quartz" style={{ width: '100%', height: '800px' }}>
        <AgGridReact
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          rowData={rfqlist}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          onSelectionChanged={handleSelectionChanged}
        />
      </div>
    </MainCard>
  );
}


export default GridExample;

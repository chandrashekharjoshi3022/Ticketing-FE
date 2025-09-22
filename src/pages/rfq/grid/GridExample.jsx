// import React, { useState } from 'react';
import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    StrictMode,
} from "react";
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
    const { rfqItemList, oprItemlist, itemCount, setSelectedRowsIds } = useMyContext();
    console.log({ "upcoming": oprItemlist });
    // const [rowData, setRowData] = useState([
    //     { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    //     { make: "Ford", model: "F-Series", price: 33850, electric: false },
    //     { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    //     { make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
    //     { make: 'Fiat', model: '500', price: 15774, electric: false },
    //     { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    // ]);
    const [rowData, setRowData] = useState(oprItemlist);


    // {id: 2, item_id: 'ITEM2', item_name: 'Product B', opr_id: 'OPR2', quantity: 5}


    // Column Definitions: Defines & controls grid columns.
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
        <div className="ag-theme-quartz" style={{ width: '100%', height: '550px' }}>
            <AgGridReact
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                rowSelection="multiple"
                onSelectionChanged={handleSelectionChanged}
            />
        </div>
    );
}

export default GridExample;

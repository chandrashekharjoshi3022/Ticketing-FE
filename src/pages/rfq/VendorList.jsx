

import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    StrictMode,
    useEffect
} from "react";
import { AgGridReact } from '@ag-grid-community/react'; // React Grid Logic
import "@ag-grid-community/styles/ag-grid.css"; // Core CSS
import "@ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useMyContext } from 'contexts/RfqItemContex';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
ModuleRegistry.registerModules([ClientSideRowModelModule]);





const VendorList = ({ setSelectedVendor }) => {
    const {
        rfqItemList,
        oprItemlist,
        itemCount,
        setSelectedRowsIds,
        vendorList,
        vendorListByIds
    } = useMyContext();

    const [rowData, setRowData] = useState();

    useEffect(() => {
        // item = rfqItemList.map(item => item.item_id);
        if (rfqItemList) {
            let itemids = rfqItemList.map(item => item.item_id);
            setRowData(vendorListByIds(itemids))
        }

    }, [rfqItemList]);


    
    //table column definition
    const [colDefs, setColDefs] = useState([
        { field: 'vendor_id', headerName: 'Vendor ID', filter: true, editable: true, checkboxSelection: true, headerCheckboxSelection: true },
        { field: 'vendor_name', headerName: 'Vendor Name' },
        { field: 'items', headerName: 'ItemList' },
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

    const onSelectionChanged = (event) => {
        const selectedRows = event.api.getSelectedRows();
        setSelectedVendor(selectedRows);
    };



    // const onSelectionChanged = useCallback((event) => {
    //     // window.alert("Hello")
    //     const selectedRows = event.api.getSelectedRows();
    //     setVendorList(selectedRows);
    //     console.log(selectedRows);
    // }, [setVendorList]);


    return (
        <div className="ag-theme-quartz" style={{ width: '100%', height: '450px' }}>
            <AgGridReact
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                rowSelection="multiple"
                onSelectionChanged={onSelectionChanged}
            />
        </div>
    );
}




export default VendorList;

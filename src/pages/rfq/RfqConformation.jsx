import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    StrictMode,
    useEffect,
} from "react";


import { AgGridReact } from '@ag-grid-community/react'; // React Grid Logic
import "@ag-grid-community/styles/ag-grid.css"; // Core CSS
import "@ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useMyContext } from 'contexts/RfqItemContex';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
import MainCard from 'components/MainCard';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button } from '@mui/material'
import VendorList from "./VendorList";
import { isArray } from "lodash";


const CustomButtonComponent = ({ id, deleteItem }) => {
    return (
        <IconButton aria-label="delete" onClick={() => deleteItem(id)}>
            <DeleteIcon color="primary" />
        </IconButton>
    );
};



const RfqItemList = () => {
    //import rfq context
    const {
        setSelectedRowsIds,
        setVendorList,
        vendorList,
        rfqItemList,
        removeFromRfq, submitRfq,
        setRfqItemList
    } = useMyContext();



    const [selectedVendor, setSelectedVendor] = useState([])

    const [rfqitem, setRftItem] = useState()

    const [colDefs, setColDefs] = useState([
        { field: 'id', headerName: 'Id', filter: true, editable: true, },
        { field: 'item_id', headerName: 'Item Id' },
        { field: 'item_name', headerName: 'Item Name' },
        { field: 'opr_id', headerName: 'Opr Id' },
        { field: 'quantity', headerName: 'Quantity' },
        { field: 'button', headerName: 'Actions', cellRenderer: (params) => <CustomButtonComponent id={params.data.id} deleteItem={removeItem} />, flex: 1 },
    ]);


    useEffect(() => {
        setRftItem(
            {
                id: 'RFQ001',
                vendor_list: [
                    ...selectedVendor
                ],
                item_list: [
                    { item_id: 'ITEM001', item_name: 'Item 1' },
                    { item_id: 'ITEM002', item_name: 'Item 2' },
                ],
                created_by: 'User 1',
                created_on: '2024-01-01',
                status: 'Active',
            })

    }, [selectedVendor])


    const removeItem = (id) => {
        if (isArray(id)) {
            removeFromRfq(id);
        }
        else {
            const confirm = window.confirm(`Deleting item with ID: ${id}`);
            if (confirm) {
                removeFromRfq([id]);
            }
        }

    }


    const handleSubmit = () => {
        // const ids = rfqItemList.map(item => item.id)
        // console.log(ids)
        submitRfq(rfqitem);
        setRfqItemList([])
    }


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


    return (
        <>
            <MainCard
                title='Item List to Add RFQ'>
                <div className="ag-theme-quartz" style={{ width: '100%', height: '350px' }}>
                    <AgGridReact
                        pagination={pagination}
                        paginationPageSize={paginationPageSize}
                        paginationPageSizeSelector={paginationPageSizeSelector}
                        rowData={rfqItemList}
                        columnDefs={colDefs}
                        defaultColDef={defaultColDef}
                    />
                </div>
            </MainCard>
            <br></br>

            {/* Dispaly vendor list */}
            <MainCard
                title='Select Vendor'>
                <VendorList setSelectedVendor={setSelectedVendor} />
            </MainCard >

            <Box display='flex' justifyContent='flex-end' mx={'20px'}>
                <Box display='flex' flexDirection={'row'} gap={'10px'} my={'10px'}>
                    <Button variant="outlined" color="error">Cancle</Button>
                    <Button variant="contained" onClick={() => handleSubmit()}>Submit</Button>
                </Box>
            </Box>

        </>
    );
}



export default RfqItemList;





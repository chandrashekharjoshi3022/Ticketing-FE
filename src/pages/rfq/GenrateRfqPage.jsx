import React from 'react'
import OprItemList from './OprItemList'
import GenerateRfqConformation from './RfqConformation'
import { useMyContext } from 'contexts/RfqItemContex'
import MainCard from 'components/MainCard';
// import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { DataGrid } from '@mui/x-data-grid';
// import { Button } from '@mui/material' 
import GridExample from './grid/GridExample'





import {
    Box,
    Button,
    Paper,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
    TableHead,
    IconButton
} from '@mui/material';


const GenrateRfqPage = () => {

    const { itemCount, addToRfq, setSelectedRowsIds, selectedRowsIDS } = useMyContext();

    const [showRfqConfrm, setShwoRfqConfrm] = React.useState(false)
    const [showItemForm, setShowItemForm] = React.useState();

    const itemCount2 = 10;

    const handleGenrateRfq = () => {
        setSelectedRowsIds([])
        addToRfq(selectedRowsIDS)
        setShwoRfqConfrm(true)
    }

    const handleCloseForm = () => {
        setShwoRfqConfrm(false)
    }


    return (
        <>
            <MainCard
                title={
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                        {!showRfqConfrm ? <span>RFQ Management</span> : <span>Genrate RFQ</span>}

                        {!showRfqConfrm ? (
                            // onClick={handleCreateItem}
                            <Box sx={{ mx: '10px', my: '12px' }}>
                                <Badge badgeContent={itemCount} color="error">
                                    <Button color="primary" className="plus-btn-color" onClick={handleGenrateRfq} >
                                        Genrate RFQ
                                    </Button>
                                </Badge>
                            </Box>
                        ) : (
                            <Box sx={{ mx: '10px', my: '12px' }}>
                                <Button variant='outlined' className="plus-btn-color" onClick={handleCloseForm}>
                                    Back
                                </Button>
                            </Box>
                        )}
                    </Box>
                }
            >
                {
                    showRfqConfrm ? <GenerateRfqConformation /> : <OprItemList />
                }

            </MainCard>
        </>
    )
}
export default GenrateRfqPage




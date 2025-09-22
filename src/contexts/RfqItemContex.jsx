import React, { createContext, useContext, useState, useEffect } from 'react';

const MyContext = createContext({});

//item data
const initialItemList = [
    {
        "id": 1,
        "item_id": "ITEM1",
        "item_name": "Product A",
        "opr_id": "OPR1",
        "quantity": 10,
        "status": "Active"
    },
    {
        "id": 2,
        "item_id": "ITEM2",
        "item_name": "Product B",
        "opr_id": "OPR2",
        "quantity": 5,
        "status": "Active"
    },
    {
        "id": 3,
        "item_id": "ITEM3",
        "item_name": "Product C",
        "opr_id": "OPR3",
        "quantity": 7,
        "status": "Active"
    },
    {
        "id": 4,
        "item_id": "ITEM4",
        "item_name": "Product D",
        "opr_id": "OPR1",
        "quantity": 3,
        "status": "Active"
    },
    {
        "id": 5,
        "item_id": "ITEM5",
        "item_name": "Product E",
        "opr_id": "OPR4",
        "quantity": 15,
        "status": "Active"
    },
    {
        "id": 6,
        "item_id": "ITEM6",
        "item_name": "Product F",
        "opr_id": "OPR2",
        "quantity": 2,
        "status": "Active"
    },
    {
        "id": 7,
        "item_id": "ITEM7",
        "item_name": "Product G",
        "opr_id": "OPR5",
        "quantity": 9,
        "status": "Active"
    },
    {
        "id": 8,
        "item_id": "ITEM8",
        "item_name": "Product H",
        "opr_id": "OPR3",
        "quantity": 1,
        "status": "Active"
    },
    {
        "id": 9,
        "item_id": "ITEM9",
        "item_name": "Product I",
        "opr_id": "OPR1",
        "quantity": 8,
        "status": "Active"
    },
    {
        "id": 10,
        "item_id": "ITEM10",
        "item_name": "Product J",
        "opr_id": "OPR4",
        "quantity": 4,
        "status": "Active"
    },
    {
        "id": 11,
        "item_id": "ITEM1",
        "item_name": "Product A (again)",
        "opr_id": "OPR5",
        "quantity": 12,
        "status": "Active"
    },
    {
        "id": 12,
        "item_id": "ITEM2",
        "item_name": "Product B (again)",
        "opr_id": "OPR3",
        "quantity": 6,
        "status": "Active"
    },
    {
        "id": 13,
        "item_id": "ITEM6",
        "item_name": "Product F (again)",
        "opr_id": "OPR1",
        "quantity": 11,
        "status": "Active"
    },
    {
        "id": 14,
        "item_id": "ITEM9",
        "item_name": "Product I (again)",
        "opr_id": "OPR2",
        "quantity": 14,
        "status": "Active"
    },
    {
        "id": 15,
        "item_id": "ITEM3",
        "item_name": "Product C (again)",
        "opr_id": "OPR4",
        "quantity": 13,
        "status": "Active"
    }
]

//vendor data
const vedndorList =
    [
        {
            "vendor_id": "VEN001",
            "vendor_name": "Acme Supplies",
            "items": ["ITEM1", "ITEM2", "ITEM3"]
        },
        {
            "vendor_id": "VEN002",
            "vendor_name": "Global Distributors",
            "items": ["ITEM4", "ITEM5", "ITEM6"]
        },
        {
            "vendor_id": "VEN003",
            "vendor_name": "Reliable Solutions",
            "items": ["ITEM7", "ITEM8", "ITEM9"]
        },
        {
            "vendor_id": "VEN004",
            "vendor_name": "Superior Partners",
            "items": ["ITEM10", "ITEM1", "ITEM2"]
        },
        {
            "vendor_id": "VEN005",
            "vendor_name": "Trusted Inc.",
            "items": ["ITEM3", "ITEM4", "ITEM5"]
        },
        {
            "vendor_id": "VEN006",
            "vendor_name": "Acme Distributors",
            "items": ["ITEM6", "ITEM7", "ITEM8"]
        },
        {
            "vendor_id": "VEN007",
            "vendor_name": "Global Solutions",
            "items": ["ITEM9", "ITEM10", "ITEM1"]
        },
        {
            "vendor_id": "VEN008",
            "vendor_name": "Reliable Partners",
            "items": ["ITEM2", "ITEM3", "ITEM4"]
        },
        {
            "vendor_id": "VEN009",
            "vendor_name": "Superior Inc.",
            "items": ["ITEM5", "ITEM6", "ITEM7"]
        },
        {
            "vendor_id": "VEN010",
            "vendor_name": "Trusted Supplies",
            "items": ["ITEM8", "ITEM9", "ITEM10"]
        },
        {
            "vendor_id": "VEN011",
            "vendor_name": "Acme Solutions",
            "items": ["ITEM1", "ITEM2", "ITEM3"]
        },
        {
            "vendor_id": "VEN012",
            "vendor_name": "Global Partners",
            "items": ["ITEM4", "ITEM5", "ITEM6"]
        },
        {
            "vendor_id": "VEN013",
            "vendor_name": "Reliable Inc.",
            "items": ["ITEM7", "ITEM8", "ITEM9"]
        },
        {
            "vendor_id": "VEN014",
            "vendor_name": "Superior Supplies",
            "items": ["ITEM10", "ITEM1", "ITEM2"]
        },
        {
            "vendor_id": "VEN015",
            "vendor_name": "Trusted Distributors",
            "items": ["ITEM3", "ITEM4", "ITEM5"]
        }
    ]

//rfq list
const initialRfqList = [
    {
        id: 'RFQ001',
        vendor_list: [
            { vendor_id: 'VEN001', vendor_name: 'Acme Supplies' },
            { vendor_id: 'VEN002', vendor_name: 'Global Distributors' },
        ],
        item_list: [
            { item_id: 'ITEM001', item_name: 'Item 1' },
            { item_id: 'ITEM002', item_name: 'Item 2' },
        ],
        created_by: 'User 1',
        created_on: '2024-01-01',
        status: 'Pending',
    },
    {
        id: 'RFQ002',
        vendor_list: [
            { vendor_id: 'VEN003', vendor_name: 'Reliable Solutions' },
            { vendor_id: 'VEN004', vendor_name: 'Superior Partners' },
        ],
        item_list: [
            { item_id: 'ITEM003', item_name: 'Item 3' },
            { item_id: 'ITEM004', item_name: 'Item 4' },
        ],
        created_by: 'User 2',
        created_on: '2024-02-01',
        status: 'Approved',
    },
    {
        id: 'RFQ003',
        vendor_list: [
            { vendor_id: 'VEN005', vendor_name: 'Trusted Inc.' },
            { vendor_id: 'VEN006', vendor_name: 'Acme Distributors' },
        ],
        item_list: [
            { item_id: 'ITEM005', item_name: 'Item 5' },
            { item_id: 'ITEM006', item_name: 'Item 6' },
        ],
        created_by: 'User 3',
        created_on: '2024-03-01',
        status: 'Rejected',
    },
    {
        id: 'RFQ004',
        vendor_list: [
            { vendor_id: 'VEN007', vendor_name: 'Global Solutions' },
            { vendor_id: 'VEN008', vendor_name: 'Reliable Partners' },
        ],
        item_list: [
            { item_id: 'ITEM007', item_name: 'Item 7' },
            { item_id: 'ITEM008', item_name: 'Item 8' },
        ],
        created_by: 'User 4',
        created_on: '2024-04-01',
        status: 'Pending',
    },
]

//Check vendor with item list
const MathcVendorWithItemlist = (vendortItemlist, rfqitemlist) => {
    return rfqitemlist.every((el) => {
        return vendortItemlist.includes(el)
    })
}


//return vendor list by item list
const vendorListByIds = (id) => {
    let selectedVendList;
    if (id.length > 0) {
        selectedVendList = vedndorList.filter(item => MathcVendorWithItemlist(item.items, id))
        return selectedVendList;
    }
    selectedVendList = []
    return selectedVendList;

}


const removeItemsById = (items, idsToRemove) => {
    console.log(idsToRemove);
    console.log(items)
    return items.filter(item => !idsToRemove.includes(item.id));
};


const extractItemsById = (items, idsToExtract) => {
    return items.filter(item => idsToExtract.includes(item.id));
};

const MyContextProvider = ({ children }) => {
    const [vendorList, setVendorList] = useState(vedndorList);

    const [rfqItemList, setRfqItemList] = useState([]);

    const [oprItemlist, setOprItemlist] = useState(initialItemList);

    const [selectedRowsIDS, setSelectedRowsIds] = useState([]);

    const [rfqlist, setRfqlist] = useState([])

    let itemCount = selectedRowsIDS.length;

    // const [itemCount, setItemCount] = useState(itemCount2)
    const updateData = (newData) => setSomeData(newData);
    // this function will move item from oprlist to rfqlist

    const addToRfq = (ids) => {
        const itemsToAdd = extractItemsById(oprItemlist, ids);
        setRfqItemList(prevRfqItemList => [...prevRfqItemList, ...itemsToAdd]);
        console.log(rfqItemList);
        setOprItemlist(prevOprItemlist => removeItemsById(prevOprItemlist, ids));
        itemCount = '';
    };



    // this function will move item from rfqlist to oprlist 
    const removeFromRfq = (ids) => {
        const itemsToAdd = extractItemsById(rfqItemList, ids);
        setOprItemlist(prevOprItemlist => [...prevOprItemlist, ...itemsToAdd]);
        setRfqItemList(prevRfqItemList => removeItemsById(prevRfqItemList, ids));
    };

    const moveRfqToRfqList = (ids) => {
        const itemsToAdd = extractItemsById(rfqItemList, ids);
        setRfqItemList(prevRfqItemList => removeItemsById(prevRfqItemList, ids));
    };

    // const submitRfq = (newdata) => {
    //     console.log({ "before": rfqlist })
    //     console.log({ "newdata": newdata });
    //     setRfqlist(item => [...item, newdata])
    //     console.log({ "after": rfqlist })
    // }


    const submitRfq = (newdata) => {
        console.log({ "newdata": newdata });
        setRfqlist(item => [...item, newdata]);
        setRfqItemList();
    }



    const contextValue = {
        oprItemlist,
        rfqItemList,
        itemCount,
        selectedRowsIDS,
        vendorList,
        rfqlist,
        submitRfq,
        addToRfq,
        removeFromRfq,
        setSelectedRowsIds,
        vendorListByIds,
        moveRfqToRfqList,
        setRfqItemList
    };


    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );

};


// Create the consumer hook
const useMyContext = () => {
    return useContext(MyContext);
};



export { MyContextProvider, useMyContext };




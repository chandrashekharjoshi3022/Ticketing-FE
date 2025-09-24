// material-ui
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //


// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTickets } from "../../features/tickets/ticketSlice";



export default function SamplePage() {


  //   const dispatch = useDispatch();
  // const { list } = useSelector((s) => s.tickets);

  // useEffect(() => {
  //   dispatch(fetchTickets());
  // }, [dispatch]);


  return (
    <MainCard title="Dashboard">
      <Typography variant="body1">
        Do you Know? Able is used by more than 2.4K+ Customers worldwide. This new v9 version is the major release of Able Pro Dashboard
        Template with having brand new modern User Interface.
      </Typography>
    </MainCard>


    // <div>
    //   <h2>My Tickets</h2>
    //   <ul>
    //     {list.map((t) => (
    //       <li key={t.ticket_id} style={{border:'1px solid red'}}> {t.ticket_id} {t.module} - {t.sub_module} - {t.category} - {t.status} - {t.comment}</li>
    //     ))}
    //   </ul>
    // </div>
  );
}

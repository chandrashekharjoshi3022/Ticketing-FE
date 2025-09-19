import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => dispatch(logout())}>Logout</button>
      <br />
      <Link to="/items">Manage Items</Link>
    </div>
  );
}

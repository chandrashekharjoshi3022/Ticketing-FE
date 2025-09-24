import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { APP_DEFAULT_PATH } from "config";

export default function GuestGuard({ children }) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(location?.state?.from || APP_DEFAULT_PATH, {
        state: { from: "" },
        replace: true,
      });
    }
  }, [user, navigate, location]);

  return children;
}

GuestGuard.propTypes = { children: PropTypes.any };

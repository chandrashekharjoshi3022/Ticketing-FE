import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";

// material-ui
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";

// third-party
import * as Yup from "yup";
import { Formik } from "formik";

// project-imports
import IconButton from "components/@extended/IconButton";
import AnimateButton from "components/@extended/AnimateButton";

// assets
import { Eye, EyeSlash } from "iconsax-react";

// ============================|| REDUX LOGIN WITH OLD UI ||============================ //

export default function Login({ forgot }) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Formik
      initialValues={{ email: "", password: "", submit: null }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        dispatch(login(values));
        setSubmitting(false);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-login">Email Address</InputLabel>
                <OutlinedInput
                  id="email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-login">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-login"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <Eye /> : <EyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Link
                  variant="h6"
                  component={RouterLink}
                  to={forgot || "/forgot-password"}
                  color="text.primary"
                >
                  Forgot Password?
                </Link>
              </Stack>
            </Grid>

            {isError && (
              <Grid item xs={12}>
                <FormHelperText error>{message}</FormHelperText>
              </Grid>
            )}

            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting || isLoading}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

Login.propTypes = { forgot: PropTypes.string };

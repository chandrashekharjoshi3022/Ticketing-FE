import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';

// material-ui
import {
  Grid,
  Button,
  Stack,
  Link,
  InputLabel,
  Typography,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  Box,
  Paper,
  Container
} from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { height, width } from '@mui/system';
import { color } from 'framer-motion';

// custom CSS
const loginStyles = {
  root: {
    background: 'linear-gradient(90deg, rgba(33, 33, 204, 1) 35%, rgba(0, 170, 255, 1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    overflowX: 'hidden', // hides left/right overflow
    overflowY: 'hidden',
    height: '100vh'
  },
  container: {
    maxWidth: { xs: 400, sm: 500 },
    width: '100%'
  },
  paper: {
    padding: { xs: 3, sm: 4 },
    borderRadius: 4,
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  header: {
    textAlign: 'center',
    marginBottom: 4
  },
  title: {
    background: 'linear-gradient(90deg, rgba(33, 33, 204, 1) 35%, rgba(0, 170, 255, 1) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 700,
    fontSize: { xs: '2rem', sm: '2rem' },
    marginBottom: 1
  },
  inputLabel: {
    fontWeight: 600,
    marginBottom: 1,
    color: 'text.primary'
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.8)',
      height: '2.4375em !important',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.9)'
      },
      '&.Mui-focused': {
        background: 'rgba(255, 255, 255, 1)',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
      },
      '& .MuiOutlinedInput-input': {
        height: '2.4375em !important' // Set height as requested
      }
    }
  },
  loginButton: {
    background: 'linear-gradient(90deg, rgba(33, 33, 204, 1) 35%, rgba(0, 170, 255, 1) 100%)',
    borderRadius: 2,
    padding: '10px 0',
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    color: '#fff !important',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
    },
    '&:disabled': {
      background: 'linear-gradient(135deg, #cccccc 0%, #999999 100%)'
    }
  },
  forgotLink: {
    textDecoration: 'none',
    fontWeight: 600,
    color: '#667eea',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#764ba2',
      textDecoration: 'underline'
    }
  },
  iconButton: {
    color: '#667eea',
    '&:hover': {
      background: 'rgba(102, 126, 234, 0.1)'
    }
  },
  statusMessage: {
    textAlign: 'center',
    padding: 2,
    borderRadius: 2,
    marginBottom: 2
  },
  successMessage: {
    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  errorMessage: {
    background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  processingMessage: {
    background: 'linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)',
    color: '#0c5460',
    border: '1px solid #bee5eb'
  }
};

// ============================|| CUSTOM DESIGNED LOGIN PAGE ||============================ //

export default function Login({ forgot }) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box sx={loginStyles.root}>
      {/* Decorative Elements */}
      <Box sx={loginStyles.decorativeElement} />
      <Box sx={loginStyles.decorativeElement2} />

      <Container component="main" sx={loginStyles.container}>
        <Paper elevation={0} sx={loginStyles.paper}>
          {/* Header Section */}
          <Box sx={loginStyles.header}>
            <Typography variant="h1" sx={loginStyles.title}>
              Login Here
            </Typography>
          </Box>

          <Formik
            initialValues={{ email: '', password: '', submit: null }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={async (values, { setSubmitting }) => {
              dispatch(login(values));
              setSubmitting(false);
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Status Messages */}
                  {isError && (
                    <Grid item xs={12}>
                      <Box sx={{ ...loginStyles.statusMessage, ...loginStyles.errorMessage }}>
                        <Typography variant="body2">{message}</Typography>
                      </Box>
                    </Grid>
                  )}

                  {isLoading && (
                    <Grid item xs={12}>
                      <Box sx={{ ...loginStyles.statusMessage, ...loginStyles.processingMessage }}>
                        <Typography variant="body2">Logging in...</Typography>
                      </Box>
                    </Grid>
                  )}

                  {/* Email Field */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-login" sx={loginStyles.inputLabel}>
                        Email Address
                      </InputLabel>
                      <OutlinedInput
                        id="email-login"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        fullWidth
                        error={Boolean(touched.email && errors.email)}
                        sx={loginStyles.textField}
                      />
                    </Stack>
                    {touched.email && errors.email && (
                      <FormHelperText error sx={{ mt: 1 }}>
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Password Field */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-login" sx={loginStyles.inputLabel}>
                        Password
                      </InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="password-login"
                        type={showPassword ? 'text' : 'password'}
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
                              sx={loginStyles.iconButton}
                            >
                              {showPassword ? <Eye /> : <EyeSlash />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="Enter your password"
                        sx={loginStyles.textField}
                      />
                    </Stack>
                    {touched.password && errors.password && (
                      <FormHelperText error sx={{ mt: 1 }}>
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Forgot Password Link */}
                  {/* <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center">
                      <Link variant="body1" component={RouterLink} to={forgot || '/forgot-password'} sx={loginStyles.forgotLink}>
                        Forgot your password?
                      </Link>
                    </Stack>
                  </Grid> */}

                  {/* Login Button */}
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting || isLoading}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        sx={loginStyles.loginButton}
                      >
                        {isLoading ? <Box component="span">Signing In...</Box> : <Box component="span">Sign In</Box>}
                      </Button>
                    </AnimateButton>
                  </Grid>

                  {/* Additional Links */}
                  {/* <Grid item xs={12}>
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Don't have an account?
                      </Typography>
                      <Link component={RouterLink} to="/register" sx={loginStyles.forgotLink} variant="body2">
                        Sign up
                      </Link>
                    </Stack>
                  </Grid> */}
                </Grid>
              </form>
            )}
          </Formik>
        </Paper>
      </Container>
    </Box>
  );
}

Login.propTypes = { forgot: PropTypes.string };

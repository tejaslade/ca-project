import { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Google from "assets/images/icons/social-google.svg";

import axios from "apis/axios";

import useAuth from "hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "context/AuthProvider";

// ============================|| FIREBASE - LOGIN ||============================ //
const LOGIN_URL = "/auth/local?populate=*";

const FirebaseLogin = ({ ...others }) => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);

  const googleHandler = async () => {
    console.error("Login");
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // useEffect(() => {
  //   if (!location) {
  //     return;
  //   }
  //   const { search } = location;
  //   axios({
  //     method: "GET",
  //     url: `https://b051-203-194-107-68.in.ngrok.io/api/auth/google/callback?${search}`,
  //   })
  //     .then((res) => res.data)
  //     .then((data) => setAuth(data)).then(
  //       navigate
  //     );
  // }, [location]);

  useEffect(() => {
    // if (!location) {
    //   return;
    // }
    const { search } = location;
    try {
      axios
        .get(
          `https://aqueous-headland-76339.herokuapp.com/api/auth/google/callback?${search}`
        )
        .then((response) => {
          console.log("helo");
          console.log(response);
          console.log(response?.data);
          console.log(response?.data?.jwt);
          // const email = values.email;
          // const password = values.password;

          // const accessToken = response?.data?.jwt;
          const user = response?.data?.user;
          const jwt = response?.data?.jwt;
          console.log(user);
          setAuth({ user, jwt });
          localStorage.setItem("token", jwt);
          localStorage.setItem("user", user.id);
          localStorage.setItem("username", user.username);
          localStorage.setItem("userblock", user.userBlocked);
          localStorage.setItem("roles", user.roles);

          navigate(from, { replace: true });
          // if (scriptedRef.current) {
          //   setStatus({ success: true });
          //   setSubmitting(false);
          // }
        });
    } catch (err) {
      console.error(err);
    }
  }, [location]);
  // onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
  //   try {
  //     const response = await axios.post(LOGIN_URL, {
  //       identifier: values.email,
  //       password: values.password,
  //     });
  //     console.log(response?.data);
  //     console.log(response?.data?.jwt);
  //     // const email = values.email;
  //     // const password = values.password;

  //     // const accessToken = response?.data?.jwt;
  //     const user = response?.data?.user;
  //     const jwt = response?.data?.jwt;
  //     console.log(user);
  //     setAuth({ user, jwt });
  //     localStorage.setItem("token", jwt);
  //     localStorage.setItem("user", user.id);
  //     localStorage.setItem("username", user.username);
  //     localStorage.setItem("userblock", user.userBlocked);
  //     localStorage.setItem("roles", user.roles);

  //     navigate(from, { replace: true });
  //     if (scriptedRef.current) {
  //       setStatus({ success: true });
  //       setSubmitting(false);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     if (scriptedRef.current) {
  //       setStatus({ success: false });
  //       setErrors({ submit: err.message });
  //       setSubmitting(false);
  //     }
  //   }
  // }}

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              onClick={() =>
                (window.location =
                  "https://aqueous-headland-76339.herokuapp.com/api/connect/google")
              }
              size="large"
              variant="outlined"
              sx={{
                color: "grey.700",
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100],
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img
                  src={Google}
                  alt="google"
                  width={16}
                  height={16}
                  style={{ marginRight: matchDownSM ? 8 : 16 }}
                />
              </Box>
              Sign in with Google
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

            <Button
              variant="outlined"
              sx={{
                cursor: "unset",
                m: 2,
                py: 0.5,
                px: 7,
                borderColor: `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]}!important`,
                fontWeight: 500,
                borderRadius: `${customization.borderRadius}px`,
              }}
              disableRipple
              disabled
            >
              OR
            </Button>

            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Sign in with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setLoading(true);
            const response = await axios.post(LOGIN_URL, {
              identifier: values.email,
              password: values.password,
            });
            console.log(response?.data);
            console.log(response?.data?.jwt);
            // const email = values.email;
            // const password = values.password;

            // const accessToken = response?.data?.jwt;
            const user = response?.data?.user;
            const jwt = response?.data?.jwt;
            console.log(user);
            setAuth({ user, jwt });
            localStorage.setItem("token", jwt);
            localStorage.setItem("user", user.id);
            localStorage.setItem("username", user.username);
            localStorage.setItem("userblock", user.userBlocked);
            localStorage.setItem("roles", user.roles);

            navigate(from, { replace: true });
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
            setLoading(false);
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-login">
                Email Address / Username
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-login"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
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
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    name="checked"
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Typography
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: "none", cursor: "pointer" }}
              >
                {/* Forgot Password? */}
              </Typography>
            </Stack>

            {errors.submit && setLoading(false)}

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>
                  {errors.submit == "Request failed with status code 400"
                    ? "Your Account is Invalid."
                    : ""}
                </FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={loading}
                >
                  {!loading && "Sign in"}
                  {loading && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        position: "relative",
                        size: 20,
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;

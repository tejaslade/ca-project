import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useMediaQuery,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import logo from "assets/logo/final_logo.png";
// project imports
import useScriptRef from "hooks/useScriptRef";
import Google from "assets/images/icons/social-google.svg";
import AnimateButton from "ui-component/extended/AnimateButton";
import { strengthColor, strengthIndicator } from "utils/password-strength";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "apis/axios";
import { gql, useQuery } from "@apollo/client";
import AuthContext from "context/AuthProvider";

// ===========================|| FIREBASE - REGISTER ||=========================== //

const AdminUsers = gql`
  query AlUsersAdmin {
    usersPermissionsUsers(
      filters: { roles: { eq: "admin" } }
      pagination: {}
      sort: []
    ) {
      data {
        id
        attributes {
          username
          roles
        }
      }
    }
  }
`;
const REGISTER_URL = "/auth/local/register";

const FirebaseRegister = ({ ...others }) => {
  const { setAuth } = useContext(AuthContext);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const adminNames = useQuery(AdminUsers);

  const endpoints = adminNames?.data?.usersPermissionsUsers?.data?.map(
    (item) =>
      `https://api.ravenhub.io/company/GacyNrIsB3/subscribers/${item?.attributes?.username}/events/erSvF9PKUz`
  );
  const navigate = useNavigate();

  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const customization = useSelector((state) => state.customization);
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const googleHandler = async () => {
    console.error("Register");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword("123456");
  }, []);

  /* 
   The "data" key is optional within each notification
   object in the notifications array below.
*/
  const NotificationHandle = () => {
    try {
      axios
        .all(
          endpoints.map((endpoint) =>
            axios.post(
              endpoint,
              {
                message: `New user is Created !`,
              },
              { priority: "Critical" },
              {
                headers: { "Content-type": "application/json" },
              }
            )
          )
        )
        .then((data) => console.log(data));
    } catch (error) {
      console.log(error);
    }
  };

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
              Sign Up with Google
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ alignItems: "center", display: "flex" }}>
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
              Sign up with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          user: "",
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          user: Yup.string().max(255).required("Username is required"),
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const response = await axios.post(REGISTER_URL, {
              username: values.user,
              email: values.email,
              password: values.password,
            });

            // if (response?.data?.user) {
            //   NotificationHandle();
            // }
            navigate("/login");
            console.log("Success");

            console.log(response.data.user);
            console.log(response.data.jwt);

            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
              navigate("login");
              console.log("Success");
            }
            values = {};
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              if (err.response?.status === 400) {
                setErrors({ submit: "Username or Email is already taken." });
                setSubmitting(false);
              } else {
                setErrors({ submit: "Registeration Failed" });
                setSubmitting(false);
              }
            }
          } finally {
            navigate("/login");
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
              <InputLabel htmlFor="outlined-adornment-email-register">
                Username
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="text"
                value={values.user}
                name="user"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.user && errors.user && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text--register"
                >
                  {errors.user}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-register">
                Email Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text--register"
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
              <InputLabel htmlFor="outlined-adornment-password-register">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                label="Password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
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
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-register"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box
                        style={{ backgroundColor: level?.color }}
                        sx={{ width: 85, height: 8, borderRadius: "7px" }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}

            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(event) => setChecked(event.target.checked)}
                      name="checked"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="subtitle1">
                      Agree with &nbsp;
                      <Typography variant="subtitle1" component={Link} to="#">
                        Terms & Condition.
                      </Typography>
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
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
                >
                  Sign up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseRegister;

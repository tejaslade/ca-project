import { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { gql, useMutation } from "@apollo/client";

const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $id: ID!
    $first_name: String
    $last_name: String
    $phone_no: String
  ) {
    updateUsersPermissionsUser(
      id: $id
      data: {
        first_name: $first_name
        last_name: $last_name
        phone_no: $phone_no
      }
    ) {
      data {
        id
        attributes {
          username
          email
          first_name
          last_name
        }
      }
    }
  }
`;

export const AccountProfileDetails = (props) => {
  const [alert, setAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const { user } = props;
  const [updateProfile, { error }] = useMutation(UPDATE_PROFILE);

  const [values, setValues] = useState({
    first_name: `${user?.first_name}`,
    last_name: `${user?.last_name}`,
    email: `${user?.email}`,
    phone_no: `${user?.phone_no}`,
  });

  useEffect(
    () =>
      setValues({
        first_name: `${user?.first_name}`,
        last_name: `${user?.last_name}`,
        email: `${user?.email}`,
        phone_no: `${user?.phone_no}`,
      }),
    [user]
  );

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const edit = () => {
    updateProfile({
      variables: {
        id: parseInt(localStorage.getItem("user")),
        first_name: values.first_name,
        last_name: values.last_name,
        phone_no: values.phone_no,
      },
    });
    if (error) {
      setErrorAlert(true);
    } else {
      setAlert(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submmitted");
  };

  console.log("values:", values);

  return (
    <form autoComplete="off" noValidate {...props} onSubmit={handleSubmit}>
      <Card>
        {alert && (
          <Alert severity="success" onClose={() => setAlert(false)}>
            <AlertTitle>Success</AlertTitle>
            This is a success alert — <strong>check it out!</strong>
          </Alert>
        )}
        {errorAlert && (
          <Alert severity="error" onClose={() => setErrorAlert(false)}>
            <AlertTitle>Error</AlertTitle>
            This is a success alert — <strong>check it out!</strong>
          </Alert>
        )}
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="first_name"
                onChange={handleChange}
                required
                value={values.first_name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                name="last_name"
                onChange={handleChange}
                required
                value={values.last_name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                disabled
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_no"
                onChange={handleChange}
                type="number"
                value={values.phone_no}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button color="primary" onClick={edit} variant="contained">
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

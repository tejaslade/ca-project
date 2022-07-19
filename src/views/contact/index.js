// material-ui
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import pdf_image from "../../assets/images/pdf_image.png";

// project imports
import MainCard from "ui-component/cards/MainCard";
import axios from "axios";
import { Link } from "react-router-dom";

// ==============================|| SAMPLE PAGE ||============================== //

let date = new Date().toISOString();

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

const CreateContact = gql`
  mutation Contact(
    $user: ID
    $full_name: String
    $phone_no: String
    $description: String
  ) {
    createContact(
      data: {
        users_permissions_user: $user
        full_name: $full_name
        phone_no: $phone_no
        description: $description
        publishedAt: "2022-04-24T10:46:49.209Z"
      }
    ) {
      data {
        id
      }
    }
  }
`;

const Contact = () => {
  const adminNames = useQuery(AdminUsers);

  const endpoints = adminNames?.data?.usersPermissionsUsers?.data?.map(
    (item) =>
      `https://api.ravenhub.io/company/GacyNrIsB3/subscribers/${item?.attributes?.username}/events/erSvF9PKUz`
  );

  const [Contact, { data, loading, error }] = useMutation(CreateContact);
  const [open, setOpen] = useState(true);

  const [values, setValues] = useState({
    full_name: "",
    phone_no: "",
    description: "",
    users_permissions_user: localStorage.getItem("user"),
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const NotificationHandle = () => {
    try {
      axios
        .all(
          endpoints.map((endpoint) =>
            axios.post(
              endpoint,
              {
                message: `New Contact Form Created by ${localStorage.getItem(
                  "username"
                )} `,
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

  const handleSubmit = (e) => {
    Contact({
      variables: {
        full_name: values.full_name,
        phone_no: values.phone_no,
        description: values.description,
        user: values.users_permissions_user,
        publishedAt: new Date().toISOString(),
      },
    }).then(NotificationHandle());
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      console.log("Submmitted");
    }
  };

  return (
    <MainCard title="Contact Us">
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {!data ? (
        <Card>
          <CardContent>
            <form>
              <Grid container spacing={3} direction="column">
                <Grid xs={12} sm={6} md={8} item>
                  <TextField
                    label="Username"
                    placeholder="Enter Your Service"
                    variant="outlined"
                    value={localStorage.getItem("username")}
                    fullWidth
                    disabled
                    //   style={{ padding: "5rem" }}
                  />
                </Grid>

                <Grid xs={12} sm={6} md={8} item>
                  <TextField
                    label="Full Name"
                    placeholder="Enter your name"
                    variant="outlined"
                    name="full_name"
                    fullWidth
                    onChange={handleChange}
                    value={values.full_name}

                    //   style={{ padding: "5rem" }}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={8} item>
                  <TextField
                    label="phone number."
                    placeholder="enter your phone number"
                    variant="outlined"
                    name="phone_no"
                    onChange={handleChange}
                    value={values.phone_no}
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField
                    label="Description"
                    placeholder="Enter your description"
                    variant="outlined"
                    fullWidth
                    multiline
                    name="description"
                    onChange={handleChange}
                    value={values.description}
                    rows={4}
                  />
                </Grid>

                <Grid xs={12} sm={6} item>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    color="primary"
                    size="large"
                  >
                    Contact Us{" "}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Grid
              container
              gap={3}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "3px solid black",
                padding: "2rem",
                borderRadius: "10px",
              }}
            >
              <Grid xs={12} sm={6} md={8} item>
                <h1>Your form was </h1>
                <h1>Submitted</h1>
                <p>
                  Wait for the response of this Submission our Employeer get
                  back to you very soon.
                </p>
              </Grid>
              <Grid xs={12} sm={6} md={8} item>
                <img src={pdf_image} height="150px" alt="" />
              </Grid>
              <Grid xs={12} sm={6} md={8} item>
                <Link to="/">
                  <Button variant="contained" size="large">
                    Home
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </MainCard>
  );
};

export default Contact;

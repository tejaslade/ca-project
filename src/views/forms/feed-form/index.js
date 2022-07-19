// material-ui
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

// project imports
import MainCard from "ui-component/cards/MainCard";
import pdf_image from "../../../assets/images/pdf_image.png";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import axios from "axios";
import { AllFeedBills } from "views/queries/NormalQueries/dailyQueries";

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

const CreateFeed = gql`
  mutation createFeed(
    $phone_no: String
    $description: String
    $user: ID
    $service: ID
  ) {
    createFeedForm(
      data: {
        phone_no: $phone_no
        description: $description
        users_permissions_user: $user
        service: $service
        publishedAt: "2022-04-24T10:46:49.209Z"
      }
    ) {
      data {
        id
        attributes {
          phone_no
          description
        }
      }
    }
  }
`;

const FeedForm = () => {
  const adminNames = useQuery(AdminUsers);

  const endpoints = adminNames?.data?.usersPermissionsUsers?.data?.map(
    (item) =>
      `https://api.ravenhub.io/company/GacyNrIsB3/subscribers/${item?.attributes?.username}/events/erSvF9PKUz`
  );

  // const endpoints = data?.data?.usersPermissionsUsers?.data?.map(
  //   (userAdmin) =>
  //     `https://api.ravenhub.io/company/GacyNrIsB3/subscribers/${userAdmin.attributes.username}/events/d5DTdchBuS`
  // );
  // console.log(endpoints);
  let state_data = useLocation();

  const [createFeed, { data, error, loading }] = useMutation(CreateFeed);

  const [values, setValues] = useState({
    phone_no: "",
    description: "",
    users_permissions_user: localStorage.getItem("user"),
    service: state_data?.state?.service_id,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createFeed({
      variables: {
        phone_no: values.phone_no,
        description: values.description,
        user: values.users_permissions_user,
        service: values.service,
      },
      refetchQueries: [{ query: AllFeedBills }],
    }).then(NotificationHandle());
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      console.log("Submmitted");
    }
  };

  const NotificationHandle = () => {
    try {
      axios
        .all(
          endpoints.map((endpoint) =>
            axios.post(
              endpoint,
              {
                message: `New Feed Form Created by ${localStorage.getItem(
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

  const [open, setOpen] = useState(true);

  return (
    <MainCard title="Feed Form Page">
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
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} direction="column">
                <Grid xs={12} sm={6} md={8} item>
                  <TextField
                    label="Username"
                    placeholder="Enter Your Service"
                    variant="outlined"
                    value={localStorage.getItem("username")}
                    fullWidth
                    hidden
                    disabled
                    //   style={{ padding: "5rem" }}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={8} item>
                  <TextField
                    label="Service Name"
                    placeholder="Enter Your Service"
                    variant="outlined"
                    value={state_data?.state?.service_name}
                    fullWidth
                    required
                    disabled
                    //   style={{ padding: "5rem" }}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={8} item>
                  <TextField
                    label="Phone_no"
                    placeholder="Enter Your phone number"
                    variant="outlined"
                    name="phone_no"
                    onChange={handleChange}
                    value={values.phone_no}
                    fullWidth
                    autoFocus

                    //   style={{ padding: "5rem" }}
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField
                    label="Description"
                    placeholder="Enter Your Service"
                    variant="outlined"
                    name="description"
                    onChange={handleChange}
                    value={values.description}
                    fullWidth
                    multiline
                    autoFocus
                    rows={4}
                  />
                </Grid>

                <Grid xs={12} sm={6} item>
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    size="large"
                  >
                    Submit{" "}
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
                  but for this service you need some document and if you want
                  then download below Pdf file.
                </p>
              </Grid>
              <Grid xs={12} sm={6} md={8} item>
                <img src={pdf_image} height="150px" alt="" />
              </Grid>
              <Grid xs={12} sm={6} md={8} item>
                <Button
                  variant="contained"
                  href={state_data?.state?.service_pdf_url}
                  size="large"
                  download
                >
                  Download Pdf
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </MainCard>
  );
};

export default FeedForm;

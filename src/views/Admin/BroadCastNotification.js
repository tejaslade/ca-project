// material-ui
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import pdf_image from "../../assets/images/pdf_image.png";

// project imports
import MainCard from "ui-component/cards/MainCard";

import axios from "axios";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

// ==============================|| SAMPLE PAGE ||============================== //

const AdminUsers = gql`
  query AlUsersAdmin {
    usersPermissionsUsers(
      filters: { roles: { eq: "authenticated" } }
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
const SamplePage = () => {
  const [message, setMessage] = useState("");
  const [send, setSend] = useState(false);
  const adminNames = useQuery(AdminUsers);

  const endpoints = adminNames?.data?.usersPermissionsUsers?.data?.map(
    (item) =>
      `https://api.ravenhub.io/company/GacyNrIsB3/subscribers/${item?.attributes?.username}/events/erSvF9PKUz`
  );

  const NotificationHandle = () => {
    try {
      axios
        .all(
          endpoints.map((endpoint) =>
            axios.post(
              endpoint,
              {
                message: `${message}`,
              },
              { priority: "Critical" },
              {
                headers: { "Content-type": "application/json" },
              }
            )
          )
        )
        .then(setMessage(""), setSend(true));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MainCard title="BroadCast Messages">
      {!send ? (
        <Card>
          <CardContent>
            <form>
              <Grid container spacing={3} direction="column">
                <Grid xs={12} sm={6} item>
                  <TextField
                    label="BroadCast Message"
                    placeholder="Enter your Message"
                    variant="outlined"
                    fullWidth
                    multiline
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    name="description"
                    rows={4}
                  />
                </Grid>

                <Grid xs={12} sm={6} item>
                  <Button
                    variant="contained"
                    onClick={NotificationHandle}
                    color="primary"
                    size="large"
                  >
                    BroadCast{" "}
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
                <h1>Your Message Was BroadCasting </h1>
                <p>
                  This message is seen all the members of the application.
                  except admins
                </p>
              </Grid>
              <Grid xs={12} sm={6} md={8} item>
                <img src={pdf_image} height="150px" alt="" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </MainCard>
  );
};

export default SamplePage;

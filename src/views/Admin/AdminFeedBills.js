import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import MainCard from "ui-component/cards/MainCard";

const AdminFeedBills = ({ data }) => {
  const date = new Date(data?.attributes?.createdAt).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  return (
    <MainCard title="Detail View">
      <Card>
        <CardContent>
          <form>
            <Grid container spacing={3} direction="column">
              <Grid xs={12} sm={6} md={8} item>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  value={`${data?.attributes?.users_permissions_user?.data?.attributes?.first_name} ${data?.attributes?.users_permissions_user?.data?.attributes?.last_name}`}
                  disabled
                />
              </Grid>
              <Grid xs={12} sm={6} md={8} item>
                <TextField
                  label="Service Name"
                  placeholder={
                    data?.attributes?.service?.data?.attributes?.service_name
                  }
                  variant="outlined"
                  fullWidth
                  value={
                    data?.attributes?.service?.data?.attributes?.service_name
                  }
                  disabled
                />
              </Grid>
              <Grid xs={12} sm={6} item>
                <TextField
                  label="Description"
                  value={data?.attributes?.description}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  disabled
                />
              </Grid>
              <Grid xs={12} sm={6} md={8} item>
                <TextField
                  label="Service Name"
                  placeholder={data?.attributes?.phone_no}
                  variant="outlined"
                  fullWidth
                  value={data?.attributes?.phone_no}
                  disabled
                />
              </Grid>
              <Grid xs={12} sm={6} md={8} item>
                <h3>{date.toString()}</h3>
              </Grid>

              {/* <Grid xs={12} sm={6} item>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  size="large"
                >
                  Submit{" "}
                </Button>
              </Grid> */}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </MainCard>
  );
};

export default AdminFeedBills;

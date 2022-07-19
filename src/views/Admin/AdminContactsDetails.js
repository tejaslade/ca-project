import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useGridStrategyProcessing } from "@mui/x-data-grid/hooks/core/strategyProcessing";
import React from "react";
import MainCard from "ui-component/cards/MainCard";

const AdminContactsDetails = ({ data }) => {
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
                  value={data?.attributes?.full_name}
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
                  label="Phone No."
                  placeholder={data?.attributes?.phone_no}
                  variant="outlined"
                  fullWidth
                  value={data?.attributes?.phone_no}
                  disabled
                />
              </Grid>
              <Grid xs={12} sm={6} md={8} item>
                <h3>{new Date(data?.attributes?.createdAt).toDateString()}</h3>
              </Grid>
              <Grid
                xs={12}
                sm={6}
                item
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",

                  padding: "2rem",
                  borderRadius: "10px",
                }}
              ></Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </MainCard>
  );
};

export default AdminContactsDetails;

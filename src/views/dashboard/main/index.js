import { useEffect, useState } from "react";

// material-ui
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import SkeletonEarningCard from "ui-component/cards/Skeleton/EarningCard";

// project imports
import EarningCard from "./EarningCard";

import TotalOrderLineChartCard from "./TotalOrderLineChartCard";
import TotalIncomeDarkCard from "./TotalIncomeDarkCard";
import TotalIncomeLightCard from "./TotalIncomeLightCard";

import { gridSpacing } from "store/constant";
// import MainLayout from "layout/MainLayout";

import useAxios from "../../../hooks/useAxios";
import axios from "../../../apis/axios";

import blockuser from "../../../assets/block.webp";
import { gql, useQuery } from "@apollo/client";
import MainCard from "ui-component/cards/MainCard";
import PopularCard from "./PopularCard";
import BajajAreaChartCard from "./BajajAreaChartCard";
import { Link } from "react-router-dom";
import EarningCardCategory from "./EarningCardCategory";
import { DashboardFeedformQuery } from "views/queries/dashboardQueries/dashboardQuery";
import BlockedUser from "views/BlockedUser/BlockedUser";
import { Modal } from "react-images";
import { Box } from "@mui/system";
// ==============================|| MAIN DASHBOARD ||============================== //

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AccountUser = gql`
  query MeUser($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          userBlocked
        }
      }
    }
  }
`;

const Dashboard = () => {
  const { data } = useQuery(AccountUser, {
    variables: {
      id: localStorage.getItem("user"),
    },
  });

  const AllServices = useQuery(DashboardFeedformQuery);

  const [open, setOpen] = useState(
    data?.usersPermissionsUser?.data?.attributes?.userBlocked
  );

  console.log(data?.usersPermissionsUser?.data?.attributes?.userBlocked);

  useEffect(
    () => setOpen(data?.usersPermissionsUser?.data?.attributes?.userBlocked),
    [data]
  );

  return (
    <>
      {localStorage.getItem("roles") === "admin" ? (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item>
                <Link
                  to={{
                    pathname: "/admin/allusers",
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <TotalIncomeDarkCard title="Users" />
                </Link>
              </Grid>
              <Grid item>
                <Link
                  to={{
                    pathname: "/admin/allbills",
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <TotalIncomeDarkCard
                    title="Image"
                    // subtitle="All Image Bills"
                  />
                </Link>
              </Grid>
              <Grid item>
                <Link
                  to={{
                    pathname: "/admin/allfeedbills",
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <TotalIncomeDarkCard title="Feed" />
                </Link>
              </Grid>
              <Grid item>
                <Link
                  to={{
                    pathname: "/admin/contacts",
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <TotalIncomeDarkCard
                    title="Contacts"
                    // subtitle="All Contacts"
                  />
                </Link>
              </Grid>
              {/* <p className="errMsg"> Error</p> */}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            {open && <BlockedUser />}

            <Grid container spacing={gridSpacing}>
              {AllServices?.loading && (
                <>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <SkeletonEarningCard />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <SkeletonEarningCard />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <SkeletonEarningCard />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <SkeletonEarningCard />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <SkeletonEarningCard />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <SkeletonEarningCard />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <SkeletonEarningCard />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <SkeletonEarningCard />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <SkeletonEarningCard />
                  </Grid>
                </>
              )}
              {!AllServices?.loading && AllServices?.error && (
                <p className="errMsg"> Something Went Wrong... ! </p>
              )}
              <Grid item lg={4} md={6} sm={6} xs={6}>
                <EarningCardCategory
                  isLoading={AllServices?.loading}
                  Category="Accounting"
                  url="/category/accounting"
                />
              </Grid>
              <Grid item lg={4} md={6} sm={6} xs={6}>
                <EarningCardCategory
                  isLoading={AllServices?.loading}
                  Category="Audit"
                  url="/category/audit"
                />
              </Grid>
              <Grid item lg={4} md={6} sm={6} xs={6}>
                <EarningCardCategory
                  isLoading={AllServices?.loading}
                  Category="Registration"
                  url="/category/registration"
                />
              </Grid>
              {!AllServices?.loading &&
                !AllServices?.error &&
                AllServices?.data &&
                AllServices?.data?.services?.data?.map((service) => (
                  <Grid item lg={4} md={6} sm={6} xs={6} key={service.id}>
                    <EarningCard
                      isLoading={AllServices?.loading}
                      service={service}
                    />
                  </Grid>
                ))}
              {!AllServices?.loading &&
                !AllServices?.error &&
                !AllServices?.data && <p>No Services Available</p>}
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Dashboard;

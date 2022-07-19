import { useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import React from "react";
import { gridSpacing } from "store/constant";
import EarningCard from "views/dashboard/main/EarningCard";
import { DashboardAuditQuery } from "views/queries/dashboardQueries/dashboardQuery";
import SkeletonEarningCard from "ui-component/cards/Skeleton/EarningCard";

const Audit = () => {
  const { loading, error, data } = useQuery(DashboardAuditQuery);
  console.log(data);
  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            {loading && (
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
            {!loading && error && (
              <p className="errMsg"> Something Went Wrong...!</p>
            )}
            {!loading &&
              !error &&
              data &&
              data?.services?.data?.map((service) => (
                <Grid item lg={4} md={6} sm={6} xs={6} key={service.id}>
                  <EarningCard isLoading={loading} service={service} />
                </Grid>
              ))}
            {!loading && !error && !data && <p>No Services Available</p>}
            {/* <p className="errMsg"> Error</p> */}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Audit;

import { useEffect } from "react";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Card, Grid, Typography } from "@mui/material";

// third-party
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";
import PersonIcon from "@mui/icons-material/Person";
// project imports
import chartData from "./chart-data/bajaj-area-chart";

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

const BajajAreaChartCard = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const { navType } = customization;

  const orangeDark = theme.palette.secondary[800];

  useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      colors: [orangeDark],
      tooltip: {
        theme: "light",
      },
    };
    ApexCharts.exec(`support-chart`, "updateOptions", newSupportChart);
  }, [navType, orangeDark]);

  return (
    <Card
      sx={{ bgcolor: "secondary.light" }}
      style={{
        border: "3px solid #616161",
      }}
    >
      <Grid container sx={{ p: 2, pb: 0, color: "#fff" }}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography
                variant="subtitle1"
                sx={{ color: theme.palette.secondary.dark }}
              >
                All Users
              </Typography>
            </Grid>
            <Grid
              item
              style={{
                display: "flex",
                alignItems: "center",
                gap : "5px"
              }}
            >
              <PersonIcon color="error" />
              <Typography variant="h4" sx={{ color: theme.palette.grey[800] }}>
                100
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.grey[800] }}
          >
            10% Profit
          </Typography>
        </Grid>
      </Grid>
      <Chart {...chartData} />
    </Card>
  );
};

export default BajajAreaChartCard;

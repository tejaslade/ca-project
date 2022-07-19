// material-ui
// import { Typography } from "@mui/material";

// project imports
import MainCard from "ui-component/cards/MainCard";

import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

import axios from "apis/axios";
import useAxiosFunction from "hooks/useAxiosFunction";
import { Avatar, AvatarGroup, Grid, Typography } from "@mui/material";
// import { useDemoData } from "@mui/x-data-grid-generator";
// import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { HistoryOutlined } from "@mui/icons-material";
import BurstModeIcon from "@mui/icons-material/BurstMode";

import { gridSpacing } from "store/constant";
import TotalIncomeDarkCard from "views/dashboard/main/TotalIncomeDarkCard";
import TotalIncomeLightCard from "views/dashboard/main/TotalIncomeLightCard";
import { boolean } from "yup";
import Image from "./image/Image";
import Feed from "./Feed/Feed";
import { styled } from "@mui/material/styles";

import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
// ==============================|| History PAGE ||============================== //

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const History = () => {
  const [image, setImage] = useState(true);
  const [feed, setFeed] = useState(true);

  const onImageHandler = (boolean) => {
    setImage(boolean);
  };

  const onFeedHandler = (boolean) => {
    setFeed(boolean);
  };

  const [alignment, setAlignment] = useState("left");
  const [formats, setFormats] = useState(() => ["italic"]);

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <>
      <Grid container spacing={gridSpacing} style={{ paddingBottom: "1rem" }}>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              border: (theme) => `1px solid ${theme.palette.divider}`,
              alignItems: "flex-start",
            }}
          >
            <StyledToggleButtonGroup
              spacing={gridSpacing}
              // size="large"
              value={alignment}
              exclusive
              onChange={handleAlignment}
              aria-label="text alignment"
              color="primary"
              style={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <ToggleButton value="left" aria-label="left aligned">
                Image
              </ToggleButton>
              <ToggleButton value="center" aria-label="centered">
                Feed
              </ToggleButton>
            </StyledToggleButtonGroup>
          </Paper>
        </Grid>
      </Grid>

      {alignment === "left" ? (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            {image && <Image />}
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            {feed && <Feed />}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default History;

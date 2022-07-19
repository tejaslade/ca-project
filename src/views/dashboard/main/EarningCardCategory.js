import PropTypes from "prop-types";
import { useState } from "react";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

// project imports
import MainCard from "ui-component/cards/MainCard";
import SkeletonEarningCard from "ui-component/cards/Skeleton/EarningCard";

// assets
import EarningIcon from "assets/images/icons/earning.svg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import GetAppTwoToneIcon from "@mui/icons-material/GetAppOutlined";
import FileCopyTwoToneIcon from "@mui/icons-material/FileCopyOutlined";
import PictureAsPdfTwoToneIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ArchiveTwoToneIcon from "@mui/icons-material/ArchiveOutlined";
import { Link } from "react-router-dom";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: "#fff",
  // backgroundColor: theme.palette.primary.dark,
  //   color: '#fff',
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: "50%",
    top: -85,
    right: -95,
    [theme.breakpoints.down("sm")]: {
      top: -105,
      right: -140,
    },
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: "50%",
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down("sm")]: {
      top: -155,
      right: -70,
    },
  },
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCardCategory = ({ isLoading, Category, url }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Link
            to={{
              pathname: `${url}`,
            }}
            // state={{
            //   service_name: service?.attributes?.service_name,
            //   service_id: service?.id,
            //   service_pdf_url:
            //     service?.attributes?.pdf?.data?.attributes?.url,
            // }}
            style={{ textDecoration: "none" }}
          >
            <Box sx={{ p: 1.25 }}>
              <Link to="/service_form"></Link>
              <Grid container direction="column">
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      <Typography
                        sx={{
                          fontSize: "2.125rem",
                          fontWeight: 500,
                          mr: 1,
                          mt: 1.75,
                          mb: 0.75,
                        }}
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 500,
                          maxHeight: "50px",
                          minHeight: "50px",
                          position: "relative",
                          zIndex: 1,
                          color: "white",
                        }}
                      >
                        {Category}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between">
                  <Grid item sx={{ mb: 1.25 }}>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: theme.palette.primary[200],
                      }}
                    >
                      Category
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Link>
        </CardWrapper>
      )}
    </>
  );
};

EarningCardCategory.propTypes = {
  isLoading: PropTypes.bool,
};

export default EarningCardCategory;

import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MainCard from "ui-component/cards/MainCard";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { gql, useMutation, useQuery } from "@apollo/client";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Backdrop,
  Chip,
  CircularProgress,
  DialogContent,
  Grid,
  Slide,
  Typography,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

import DialogTitle from "@mui/material/DialogTitle";
import TotalIncomeDarkCard from "../dashboard/main/TotalIncomeDarkCard";
import { Modal } from "react-images";
import { Link } from "react-router-dom";
import { AllServiceQueries } from "views/queries/dashboardQueries/dashboardQuery";
import CustomNoRowsOverlay from "ui-component/NoRowsOverlay/NoRowsOverlay";

// const ConfirmedForm = gql`
//   mutation ConfirmedFeed($id: ID!, $confirmed: Boolean) {
//     updateFeedForm(id: $id, data: { confirmed: $confirmed }) {
//       data {
//         id
//         attributes {
//           confirmed
//         }
//       }
//     }
//   }
// `;

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

const UserConfirmed = gql`
  mutation updateProfile($id: ID!, $userBlocked: Boolean) {
    updateUsersPermissionsUser(id: $id, data: { userBlocked: $userBlocked }) {
      data {
        id
        attributes {
          username
          email
          first_name
          last_name
        }
      }
    }
  }
`;

const AllUsers = gql`
  query AllUsers($searchItem: String) {
    usersPermissionsUsers(
      filters: {
        roles: { eq: "authenticated" }
        or: [
          { username: { contains: $searchItem } }
          { email: { contains: $searchItem } }
          { first_name: { contains: $searchItem } }
          { last_name: { contains: $searchItem } }
        ]
      }
      pagination: { limit: 10000 }
      sort: []
    ) {
      data {
        id
        attributes {
          username
          email
          first_name
          last_name
          phone_no
          userBlocked
          createdAt
          avatar {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

// function escapeRegExp(value) {
//   return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// }

function QuickSearchToolbar(props) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: "auto",
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          "& .MuiSvgIcon-root": {
            mr: 0.5,
          },
          "& .MuiInput-underline:before": {
            borderBottom: 1,
            borderColor: "divider",
          },
        }}
      />
    </Box>
  );
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AllUser = () => {
  const [selectedName, setSelectedName] = useState("");
  const [UpdateUser] = useMutation(UserConfirmed);
  const [open, setOpen] = useState(false);

  const AllServices = useQuery(AllServiceQueries);

  const handleClickOpen = (username) => {
    setSelectedName(username);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "user",
      headerName: "User",
      width: 100,
      renderCell: (params) => <Avatar alt="Remy Sharp" src={params.row.user} />,
    },
    {
      field: "username",
      headerName: "Username",
      width: 200,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "phone_no",
      headerName: "Phone Number",
      type: "number",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      type: "number",
      width: 200,
    },
    {
      field: "stutus",
      headerName: "Status",
      width: 200,
      align: "center",

      renderCell: (params) => (
        <strong>
          {!params.row.status ? (
            <Chip label="Unblock" color="success" size="small" />
          ) : (
            <Chip label="Blocked" color="error" size="small" />
          )}
        </strong>
      ),
    },
    {
      field: "confirmed",
      headerName: "Confirmed",
      align: "center",
      width: 100,

      renderCell: (params) => (
        <strong>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              UpdateUser({
                variables: {
                  id: params.row.realid,
                  userBlocked: !params.row.status,
                },
              });
            }}
            style={{ marginLeft: 16 }}
          >
            {params.row.status ? "Unblocked" : "Bloacked"}
          </Button>
        </strong>
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 200,

      renderCell: (params) => (
        <strong>
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => handleClickOpen(params.row.username)}
            color="success"
          >
            Image Bills
          </Button>
          {/* <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => handleClickOpen(params.row.username)}
            color="error"
          >
            <DeleteIcon />
          </Button> */}
        </strong>
      ),
    },
  ];

  const { data, error, loading, refetch } = useQuery(AllUsers);
  console.log("All users :", data);
  console.log("Error : ", error);

  const trim = data?.usersPermissionsUsers?.data?.map((user, index) => {
    return {
      id: index + 1,
      user: `https://aqueous-headland-76339.herokuapp.com${user?.attributes?.avatar?.data?.attributes?.url}`,

      firstName: user?.attributes?.first_name,
      lastName: user?.attributes?.last_name,
      email: user?.attributes?.email,
      username: user?.attributes?.username,

      phone_no: user?.attributes?.phone_no,
      createdAt: user?.attributes?.createdAt,
      status: user?.attributes?.userBlocked,
      realid: user?.id,
    };
  });

  const [rows, setRows] = useState(trim);

  const [searched, setSearched] = useState("");

  return (
    <>
      <MainCard title="Your Submissions">
        <Dialog
          fullWidth={true}
          maxWidth={"lg"}
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <DialogContent>
            <MainCard title="Categories">
              <MainCard title="Accounting" style={{ marginBottom: "1rem" }}>
                <Grid container spacing={2}>
                  {AllServices?.data?.services?.data
                    ?.filter(
                      (service) =>
                        service.attributes.service_cateogory === "Accounting"
                    )
                    .map((item) => (
                      <Grid item>
                        <Link
                          to={{
                            pathname: "/admin/allEditbills",
                          }}
                          state={{
                            service_name: item?.attributes?.service_name,
                            user_name: selectedName,
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          <TotalIncomeDarkCard
                            title={item?.attributes?.service_name}
                          />
                        </Link>
                      </Grid>
                    ))}
                </Grid>
              </MainCard>

              <MainCard title="Audit" style={{ marginBottom: "1rem" }}>
                <Grid container spacing={2}>
                  {AllServices?.data?.services?.data
                    ?.filter(
                      (service) =>
                        service.attributes.service_cateogory === "Audit"
                    )
                    .map((item) => (
                      <Grid item>
                        <Link
                          to={{
                            pathname: "/admin/allEditbills",
                          }}
                          state={{
                            service_name: item?.attributes?.service_name,
                            user_name: selectedName,
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          <TotalIncomeDarkCard
                            title={item?.attributes?.service_name}
                          />
                        </Link>
                      </Grid>
                    ))}
                </Grid>
              </MainCard>
              <MainCard title="Registration" style={{ marginBottom: "1rem" }}>
                <Grid container spacing={2}>
                  {AllServices?.data?.services?.data
                    ?.filter(
                      (service) =>
                        service.attributes.service_cateogory === "Registration"
                    )
                    .map((item) => (
                      <Grid item>
                        <Link
                          to={{
                            pathname: "/admin/allEditbills",
                          }}
                          state={{
                            service_name: item?.attributes?.service_name,
                            user_name: selectedName,
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          <TotalIncomeDarkCard
                            title={item?.attributes?.service_name}
                          />
                        </Link>
                      </Grid>
                    ))}
                </Grid>
              </MainCard>
              <MainCard title="Feedform" style={{ marginBottom: "1rem" }}>
                <Grid container spacing={2}>
                  {AllServices?.data?.services?.data
                    ?.filter(
                      (service) =>
                        service.attributes.service_cateogory === "Feedform"
                    )
                    .map((item) => (
                      <Grid item>
                        <Link
                          to={{
                            pathname: "/admin/allEditbills",
                          }}
                          state={{
                            service_name: item?.attributes?.service_name,
                            user_name: selectedName,
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          <TotalIncomeDarkCard
                            title={item?.attributes?.service_name}
                          />
                        </Link>
                      </Grid>
                    ))}
                </Grid>
              </MainCard>
            </MainCard>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              cancel
            </Button>
          </DialogActions>
        </Dialog>

        <div style={{ height: 800, width: "100%" }}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            style={{
              marginBottom: "1rem",
            }}
          >
            <Grid item>
              <TextField
                value={searched}
                onChange={(e) => setSearched(e.target.value)}
                size="small"
                id="outlined-basic"
                label="Search"
                variant="outlined"
                width="40%"
              />
            </Grid>
            <Grid item>
              <Button
                onClick={() => refetch({ searchItem: searched })}
                variant="contained"
              >
                Search
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  refetch({ searchItem: "" });
                  setSearched("");
                }}
                variant="contained"
              >
                Reset
              </Button>
            </Grid>
          </Grid>

          {loading && <LinearProgress />}
          <DataGrid
            rows={trim}
            columns={columns}
            components={{
              Toolbar: GridToolbar,
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
            disableSelectionOnClick
          />
        </div>
      </MainCard>
    </>
  );
};

export default AllUser;

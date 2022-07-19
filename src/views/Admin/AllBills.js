import { gql, useMutation, useQuery } from "@apollo/client";
import { Close, Delete, Visibility } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  Fab,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconDatabaseExport } from "@tabler/icons";
import React, { useState } from "react";
import { useLocation } from "react-router";
import MainCard from "ui-component/cards/MainCard";
import CustomNoRowsOverlay from "ui-component/NoRowsOverlay/NoRowsOverlay";
import AdminImageBills from "./AdminImageBills";
import { darken, lighten } from "@mui/material/styles";

const getBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

const DeleteImage = gql`
  mutation DeleteImage($id: ID!) {
    deleteImage(id: $id) {
      data {
        id
      }
    }
  }
`;

const ConfirmedImage = gql`
  mutation ConfirmedImage($id: ID!, $confirmed: Boolean) {
    updateImage(id: $id, data: { confirmed: $confirmed }) {
      data {
        id
        attributes {
          confirmed
        }
      }
    }
  }
`;

const AllImageBills = gql`
  query AllBills($searchItem: String) {
    images(
      pagination: { limit: 100000 }
      sort: ["createdAt:DESC", "updatedAt:DESC"]
      filters: {
        or: [
          { service: { service_name: { contains: $searchItem } } }
          { users_permissions_user: { username: { contains: $searchItem } } }
          { users_permissions_user: { first_name: { contains: $searchItem } } }
          { users_permissions_user: { last_name: { contains: $searchItem } } }
          { description: { contains: $searchItem } }
        ]
      }
    ) {
      data {
        id
        attributes {
          description
          createdAt
          confirmed
          images {
            data {
              id
              attributes {
                url
                caption

                alternativeText
              }
            }
          }
          users_permissions_user {
            data {
              id
              attributes {
                username
                first_name
                last_name
              }
            }
          }

          service {
            data {
              attributes {
                service_name
              }
            }
          }
        }
      }
    }
  }
`;

// const rows = [
//   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
//   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
//   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
//   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
//   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
//   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
//   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
//   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
//   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
// ];

const AllBills = () => {
  let state_data = useLocation();
  console.log(state_data);
  const [updateImage] = useMutation(ConfirmedImage);
  const [deleteImage] = useMutation(DeleteImage);
  const [singleServiceId, setSingleServiceId] = useState();

  const [edit, setEdit] = useState(false);

  const { loading, error, data, refetch } = useQuery(AllImageBills);

  const [searched, setSearched] = useState("");
  const [deleteId, setDeleteId] = useState();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editFunction = (id) => {
    setEdit(true);
    setSingleServiceId(id);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "users",
      headerName: "Username",
      width: 200,
    },
    {
      field: "Images",
      headerName: "Images",
      width: 100,
      renderCell: (params) => (
        <AvatarGroup total={params.row.images}></AvatarGroup>
      ),
    },

    {
      field: "description",
      headerName: "Description",
      width: 200,
    },
    {
      field: "service",
      headerName: "Service",
      width: 200,
    },

    {
      field: "createdAt",
      headerName: "Created At",
      type: "number",
      width: 200,
      renderCell: (params) => (
        <strong>{new Date(params.row.createdAt).toDateString()}</strong>
      ),
    },
    {
      field: "stutus",
      headerName: "Status",
      width: 200,
      align: "center",

      renderCell: (params) => (
        <strong>
          {params.row.status ? (
            <Chip label="confirmed" color="success" size="small" />
          ) : (
            <Chip label="pending" color="error" size="small" />
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
            style={{ marginLeft: 16 }}
            onClick={() => {
              updateImage({
                variables: {
                  id: params.row.realid,
                  confirmed: !params.row.status,
                },
              });
            }}
          >
            {!params.row.status ? "Confirmed" : "pending"}
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
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => editFunction(params.row.id)}
          >
            <Visibility />
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleClickOpen(params.row.realid)}
            style={{ marginLeft: 16 }}
          >
            <Delete />
          </Button>
        </strong>
      ),
    },
  ];

  const trim = data?.images?.data?.map((item, index) => {
    return {
      id: index + 1,
      users:
        item?.attributes?.users_permissions_user?.data?.attributes?.username,
      images: item?.attributes?.images?.data?.length,
      description: item?.attributes?.description,
      service: item?.attributes?.service?.data?.attributes?.service_name,
      createdAt: item?.attributes?.createdAt,
      status: item?.attributes?.confirmed,
      realid: item?.id,
    };
  });

  return (
    <MainCard title="All Bills">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            padding: "2rem",
          }}
        >
          <Typography variant="h4">
            Are you sure you want to delete this entry ?{" "}
          </Typography>
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            cancel
          </Button>
          <Button
            onClick={() => {
              deleteImage({
                variables: {
                  id: deleteId,
                },
              })
                .then(setOpen(false))
                .then(refetch(""));
            }}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {edit && (
        <Grid
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <Fab color="error" aria-label="add" onClick={() => setEdit(false)}>
            <Close />
          </Fab>
        </Grid>
      )}
      {!edit && (
        <div
          style={{ height: 800, width: "100%" }}
          sx={{
            height: 400,
            width: "100%",
            "& .super-app-theme--Open": {
              bgcolor: (theme) =>
                getBackgroundColor(theme.palette.info.main, theme.palette.mode),
              "&:hover": {
                bgcolor: (theme) =>
                  getHoverBackgroundColor(
                    theme.palette.info.main,
                    theme.palette.mode
                  ),
              },
            },
            "& .super-app-theme--Filled": {
              bgcolor: (theme) =>
                getBackgroundColor(
                  theme.palette.success.main,
                  theme.palette.mode
                ),
              "&:hover": {
                bgcolor: (theme) =>
                  getHoverBackgroundColor(
                    theme.palette.success.main,
                    theme.palette.mode
                  ),
              },
            },
            "& .super-app-theme--PartiallyFilled": {
              bgcolor: (theme) =>
                getBackgroundColor(
                  theme.palette.warning.main,
                  theme.palette.mode
                ),
              "&:hover": {
                bgcolor: (theme) =>
                  getHoverBackgroundColor(
                    theme.palette.warning.main,
                    theme.palette.mode
                  ),
              },
            },
            "& .super-app-theme--Rejected": {
              bgcolor: (theme) =>
                getBackgroundColor(
                  theme.palette.error.main,
                  theme.palette.mode
                ),
              "&:hover": {
                bgcolor: (theme) =>
                  getHoverBackgroundColor(
                    theme.palette.error.main,
                    theme.palette.mode
                  ),
              },
            },
          }}
        >
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
            initialState={
              state_data.state?.service_name &&
              state_data.state?.user_name && {
                filter: {
                  filterModel: {
                    items: [
                      {
                        id: 1,
                        columnField: "users",
                        operatorValue: "contains",
                        value: `${state_data.state.user_name}`,
                      },
                      {
                        id: 2,
                        columnField: "description",
                        operatorValue: "contains",
                        value: "h",
                      },
                    ],
                  },
                },
              }
            }
            rows={trim}
            columns={columns}
            getRowClassName={"super-app-theme--Filled"}
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar,
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
          />
        </div>
      )}

      {edit && (
        <AdminImageBills data={data?.images?.data[singleServiceId - 1]} />
      )}
    </MainCard>
  );
};

export default AllBills;

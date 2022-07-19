import { gql, useMutation, useQuery } from "@apollo/client";
import { Close, Delete, Visibility } from "@mui/icons-material";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  Fab,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import CustomNoRowsOverlay from "ui-component/NoRowsOverlay/NoRowsOverlay";
import AdminFeedBills from "../../Admin/AdminFeedBills";

const DeleteFeedForm = gql`
  mutation DeleteFeed($id: ID!) {
    deleteFeedForm(id: $id) {
      data {
        id
        attributes {
          description
        }
      }
    }
  }
`;

const ConfirmedForm = gql`
  mutation ConfirmedFeed($id: ID!, $confirmed: Boolean) {
    updateFeedForm(id: $id, data: { confirmed: $confirmed }) {
      data {
        id
        attributes {
          confirmed
        }
      }
    }
  }
`;

const AllFeedBills = gql`
  query FeedList($username: String) {
    feedForms(
      filters: { users_permissions_user: { username: { eq: $username } } }
      pagination: {}
      sort: []
      publicationState: LIVE
    ) {
      data {
        id
        attributes {
          phone_no
          description
          confirmed
          service {
            data {
              attributes {
                service_name
              }
            }
          }
          users_permissions_user {
            data {
              attributes {
                username
                first_name
                last_name
              }
            }
          }
          createdAt
        }
      }
    }
  }
`;

const Feed = () => {
  const [ConfirmedFeed] = useMutation(ConfirmedForm);
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = useState();

  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [deleteFeedForm, { loader }] = useMutation(DeleteFeedForm);
  const [singleServiceId, setSingleServiceId] = useState();
  const [edit, setEdit] = useState(false);
  const { loading, error, data, refetch } = useQuery(AllFeedBills, {
    variables: {
      username: localStorage.getItem("username"),
    },
  });
  console.log("All Feed bills : ", data);

  const editFunction = (id) => {
    setEdit(true);
    setSingleServiceId(id);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "users",
      headerName: "Username",
      width: 150,
    },
    {
      field: "service_name",
      headerName: "Services",
      width: 150,
    },

    {
      field: "phone_no",
      headerName: "Phone No.",
      width: 120,
    },

    {
      field: "createdAt",
      headerName: "Created At",
      type: "number",
      width: 200,
      valueGetter: (params) => new Date(params.row.createdAt),
    },
    {
      field: "stutus",
      headerName: "Status",
      width: 120,
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
    // {
    //   field: "confirmed",
    //   headerName: "Confirmed",
    //   align: "center",
    //   width: 100,

    //   renderCell: (params) => (
    //     <strong>
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         size="small"
    //         onClick={() => {
    //           ConfirmedFeed({
    //             variables: {
    //               id: params.row.realid,
    //               confirmed: !params.row.status,
    //             },
    //           });
    //         }}
    //         style={{ marginLeft: 16 }}
    //       >
    //         {!params.row.status ? "Confirmed" : "pending"}
    //       </Button>
    //     </strong>
    //   ),
    // },
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

  const trim = data?.feedForms?.data?.map((item, index) => {
    return {
      id: index + 1,

      users:
        item?.attributes?.users_permissions_user?.data?.attributes?.username,
      service_name: item?.attributes?.service?.data?.attributes?.service_name,
      phone_no: item?.attributes?.phone_no,
      description: item?.attributes?.description,
      createdAt: item?.attributes?.createdAt,
      status: item?.attributes?.confirmed,
      realid: item?.id,
    };
  });

  return (
    <MainCard title="All Feed Bills">
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
              deleteFeedForm({
                variables: {
                  id: deleteId,
                },
              })
                .then(refetch())
                .then(setOpen(false));
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
        <div style={{ height: 800, width: "100%" }}>
          {loading && <LinearProgress />}
          <DataGrid
            rows={trim}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar,
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
          />
        </div>
      )}

      {edit && (
        <AdminFeedBills data={data?.feedForms?.data[singleServiceId - 1]} />
      )}

      {edit && <Button onClick={() => setEdit(false)}>Edit Close</Button>}
    </MainCard>
  );
};

export default Feed;

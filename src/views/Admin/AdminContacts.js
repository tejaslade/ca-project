import { gql, useMutation, useQuery } from "@apollo/client";
import { Close, Delete, Visibility } from "@mui/icons-material";
import {
  AvatarGroup,
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
import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import CustomNoRowsOverlay from "ui-component/NoRowsOverlay/NoRowsOverlay";
import AdminContactsDetails from "./AdminContactsDetails";
import AdminImageBills from "./AdminImageBills";

const DeleteContactForm = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      data {
        id
      }
    }
  }
`;

const ConfirmedContact = gql`
  mutation UpdateContact($id: ID!, $confirmed: Boolean) {
    updateContact(id: $id, data: { confirmed: $confirmed }) {
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
  query AllContact($searchItem: String) {
    contacts(
      pagination: { limit: 100000 }
      sort: ["createdAt:DESC", "updatedAt:DESC"]
      filters: {
        or: [
          { full_name: { contains: $searchItem } }
          { description: { contains: $searchItem } }
          { description: { contains: $searchItem } }
          { users_permissions_user: { username: { contains: $searchItem } } }
        ]
      }
    ) {
      data {
        id
        attributes {
          full_name
          phone_no
          description
          createdAt
          confirmed
          users_permissions_user {
            data {
              attributes {
                username
              }
            }
          }
        }
      }
    }
  }
`;

const AdminContacts = () => {
  const [UpdateContact] = useMutation(ConfirmedContact);
  const [DeleteContact] = useMutation(DeleteContactForm);
  const [singleServiceId, setSingleServiceId] = useState();
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = useState();
  const [searched, setSearched] = useState("");

  const [edit, setEdit] = useState(false);
  const { loading, error, data, refetch } = useQuery(AllImageBills);

  const editFunction = (id) => {
    setEdit(true);
    setSingleServiceId(id);
  };

  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "users",
      headerName: "Username",
      width: 120,
    },
    {
      field: "full_name",
      headerName: "Full name",

      width: 160,
    },

    {
      field: "description",
      headerName: "Description",
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
            onClick={() => {
              UpdateContact({
                variables: {
                  id: params.row.realid,
                  confirmed: !params.row.status,
                },
              });
            }}
            style={{ marginLeft: 16 }}
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

  const trim = data?.contacts?.data?.map((item, index) => {
    return {
      id: index + 1,
      users:
        item?.attributes?.users_permissions_user?.data?.attributes?.username,
      phone_no: item?.attributes?.phone_no,
      full_name: item?.attributes?.full_name,
      description: item?.attributes?.description,
      createdAt: item?.attributes?.createdAt,
      status: item?.attributes?.confirmed,
      realid: item?.id,
    };
  });

  return (
    <MainCard title="All Contact Submissions">
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
              DeleteContact({
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
            pageSize={10}
            rowsPerPageOptions={[5]}
            components={{
              Toolbar: GridToolbar,
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
            disableSelectionOnClick
          />
        </div>
      )}

      {edit && (
        <AdminContactsDetails
          data={data?.contacts?.data[singleServiceId - 1]}
        />
      )}
    </MainCard>
  );
};

export default AdminContacts;

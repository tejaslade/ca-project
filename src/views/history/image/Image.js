import { gql, useQuery, useMutation } from "@apollo/client";
import { Close, Delete, Visibility } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
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
import { IconDatabaseExport } from "@tabler/icons";
import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import CustomNoRowsOverlay from "ui-component/NoRowsOverlay/NoRowsOverlay";
import { AllImageBills } from "views/queries/NormalQueries/dailyQueries";
import AdminImageBills from "../../Admin/AdminImageBills";
import ImageDetails from "./ImageDetails";

const username = localStorage.getItem("username");

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

const Image = (props) => {
  const [updateImage] = useMutation(ConfirmedImage);

  const [deleteId, setDeleteId] = useState();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [singleServiceId, setSingleServiceId] = useState();

  const [edit, setEdit] = useState(false);
  const { loading, error, data, refetch } = useQuery(AllImageBills, {
    variables: {
      username: localStorage.getItem("username"),
    },
  });

  const [deleteImage] = useMutation(DeleteImage, {
    refetchQueries: [{ query: AllImageBills }],
  });
  const editFunction = (id) => {
    setEdit(true);
    setSingleServiceId(id);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "users",
      headerName: "Username",
      width: 120,
    },
    {
      field: "Images",
      headerName: "Images",
      width: 70,
      renderCell: (params) => (
        <AvatarGroup total={params.row.images}></AvatarGroup>
      ),
    },

    // {
    //   field: "description",
    //   headerName: "Description",
    //   width: 120,
    // },

    {
      field: "createdAt",
      headerName: "Created At",
      type: "number",
      width: 200,
      // sortComparator: (v1, v2) => v1.name.localeCompare(v2.name),
      valueGetter: (params) => new Date(params.row.createdAt),

      // renderCell: (params) => (
      //   <strong>{new Date(params.row.createdAt).toDateString()}</strong>
      // ),
    },
    {
      field: "stutus",
      headerName: "Status",
      width: 120,
      align: "center",
      sortComparator: (v1, v2) => v1.name.localeCompare(v2.name),

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
    //         style={{ marginLeft: 16 }}
    //         onClick={() => {
    //           updateImage({
    //             variables: {
    //               id: params.row.realid,
    //               confirmed: !params.row.status,
    //             },
    //           });
    //         }}
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

  const trim = data?.images?.data?.map((item, index) => {
    return {
      id: index + 1,
      users:
        item?.attributes?.users_permissions_user?.data?.attributes?.username,
      images: item.attributes.images.data.length,
      description: item?.attributes?.description,
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
                refetchQueries: [
                  {
                    query: AllImageBills,
                  },
                ],
              })
                .then(refetch(""))
                .then(handleClose);
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
        <ImageDetails
          data={data?.images?.data[singleServiceId - 1]}
          refetch={refetch}
          allData={data}
        />
      )}
      {edit && <Button onClick={() => setEdit(false)}>Edit Close</Button>}
    </MainCard>
  );
};

export default Image;

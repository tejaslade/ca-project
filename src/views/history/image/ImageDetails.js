import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Alert,
  Chip,
  CardMedia,
} from "@mui/material";
import React, { useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient } from "apollo-client";
import MainCard from "ui-component/cards/MainCard";
import { gql, useMutation } from "@apollo/client";
import { ApolloProvider, Mutation } from "react-apollo";
import CloseIcon from "@mui/icons-material/Close";
import { AllImageBills } from "views/queries/NormalQueries/dailyQueries";
import { SRLWrapper } from "simple-react-lightbox";

const DeleteImage = gql`
  mutation deleteUpload($id: ID!) {
    deleteUploadFile(id: $id) {
      data {
        id
      }
    }
  }
`;

// all

const UPLOAD_FILE = gql`
  mutation SingleImageUpload(
    $refId: ID
    $ref: String
    $field: String
    $file: Upload!
  ) {
    upload(refId: $refId, ref: $ref, field: $field, file: $file) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

const apolloCache = new InMemoryCache();

const uploadLink = createUploadLink({
  uri: "https://aqueous-headland-76339.herokuapp.com/graphql", // Apollo Server is served from port 4000
  headers: {
    "keep-alive": "true",
  },
});

const client = new ApolloClient({
  cache: apolloCache,
  link: uploadLink,
});

const ImageDetails = ({ data, allData, refetch }) => {
  const [deleteImageDone, setDeleteImageDone] = useState(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [deleteUpload, { Imagedata, error, loading }] = useMutation(
    DeleteImage,
    {
      refetchQueries: [{ query: AllImageBills }],
    }
  );
  const [preview, setPreview] = useState(false);
  console.log(allData);

  const ImageData = data?.attributes?.images?.data.map((item) => {
    return {
      img: item?.attributes?.url,
      title: item?.attributes?.url,
      id: item?.id,
      caption: item?.attributes?.caption,
    };
  });

  console.log(ImageData);

  // const onDeleteHandle = (id) => {
  //   console.log(allData);

  // };

  const [deleteId, setDeleteId] = useState();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };
  const [imageShow, setImageShow] = useState(false);

  const onClickImageShow = () => {
    setImageShow((prevState) => !prevState);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const images = ImageData.map((item) => {
    return { url: item.img };
  });
  return (
    <MainCard title="View Image Bills">
      <Card>
        <CardContent>
          <form>
            <Grid container spacing={3} direction="column">
              <Grid
                xs={8}
                sm={6}
                md={8}
                style={{
                  padding: "10px 10px",
                }}
                item
              >
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  value={`${data?.attributes?.users_permissions_user?.data?.attributes?.first_name} ${data?.attributes?.users_permissions_user?.data?.attributes?.last_name}`}
                  disabled
                />
              </Grid>
              <Grid
                xs={12}
                sm={6}
                md={8}
                style={{
                  padding: "10px 10px",
                }}
                item
              >
                <TextField
                  label="Service Name"
                  placeholder={
                    data?.attributes?.service?.data?.attributes?.service_name
                  }
                  variant="outlined"
                  fullWidth
                  value={
                    data?.attributes?.service?.data?.attributes?.service_name
                  }
                  disabled
                />
              </Grid>
              <Grid
                xs={12}
                sm={6}
                style={{
                  padding: "10px 10px",
                }}
                item
              >
                <TextField
                  label="Description"
                  value={data?.attributes?.description}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  disabled
                />
              </Grid>
              <Grid
                xs={12}
                sm={6}
                style={{
                  padding: "10px 10px",
                }}
                item
              >
                <ApolloProvider client={client}>
                  <Mutation mutation={UPLOAD_FILE}>
                    {(SingleImageUpload, { loading }) => {
                      console.log(data);
                      return (
                        <>
                          {!imageUploadSuccess ? (
                            <input
                              name={"document"}
                              type={"file"}
                              onChange={({ target: { files } }) => {
                                const file = files[0];
                                file &&
                                  SingleImageUpload({
                                    variables: {
                                      refId: data?.id,
                                      ref: "api::image.image",
                                      field: "images",
                                      file: file,
                                    },
                                    refetchQueries: [{ query: AllImageBills }],
                                  }).then(
                                    setImageUploadSuccess(true),
                                    refetch("")
                                  );
                              }}
                            />
                          ) : (
                            <>
                              {loading && <p>Loading.....</p>}
                              <Alert variant="outlined" severity="success">
                                Your Image is Successfully created now please
                                refresh this page for updated content.
                              </Alert>
                            </>
                          )}
                        </>
                      );
                    }}
                  </Mutation>
                </ApolloProvider>
              </Grid>
              {deleteImageDone && (
                <Alert
                  variant="outlined"
                  severity="info"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setDeleteImageDone(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  Your Image is Deleted please refresh the app !
                </Alert>
              )}
              <br />
              <MainCard title="Images" sx={8} border={false}>
                <Grid
                  xs={8}
                  sm={6}
                  item
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",

                    // padding: "2rem",
                    borderRadius: "10px",
                  }}
                >
                  {/* Images */}

                  {imageShow && (
                    <Lightbox onClose={onClickImageShow} images={images} />
                  )}

                  <Grid
                    container
                    spacing={2}
                    justifyContent="flex-start"
                    // alignItems="center"
                  >
                    {ImageData?.map((item) => (
                      <Grid item>
                        <Card
                          sx={{ maxWidth: 345, width: "279px" }}
                          style={{
                            backgroundColor: "Highlight",
                          }}
                        >
                          <CardMedia
                            actionPosition="left"
                            onClick={handleClickOpen}
                            component="img"
                            height="194"
                            image={item?.img}
                            alt="Image not found"
                            style={{
                              marginBottom: "0.4rem",
                            }}
                          />

                          <Grid
                            container
                            direction="row"
                            spacing={1}
                            justifyContent="space-between"
                            alignItems="baseline"
                            style={{
                              marginBottom: "0.5rem",
                            }}
                          >
                            <Grid
                              container
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                              alignItems="baseline"
                              style={{
                                marginBottom: "0.5rem",
                              }}
                            >
                              {item?.caption && (
                                <Grid item>
                                  {/* <Chip label={item?.caption} color="secondary" /> */}
                                  {/* <Chip label={item?.caption} color="secondary" /> */}
                                  <p
                                    style={{
                                      paddingLeft: "30px",
                                    }}
                                  >
                                    {item?.caption}
                                  </p>
                                  <br />
                                </Grid>
                              )}
                            </Grid>

                            <Grid
                              item
                              style={{
                                paddingTop: 0,
                                paddingLeft: 1,
                              }}
                            >
                              <Button
                                style={{
                                  marginLeft: "19px",
                                }}
                                variant="contained"
                                color="error"
                                onClick={onClickImageShow}
                              >
                                view
                              </Button>
                            </Grid>
                            {console.log(item?.caption)}

                            <Grid
                              item
                              style={{
                                paddingTop: 0,
                                paddingLeft: 0,
                              }}
                            >
                              <Button
                                style={{
                                  marginLeft: 0,
                                  marginTop: 0,
                                  marginRight: "10px",
                                }}
                                variant="contained"
                                onClick={() => {
                                  deleteUpload({
                                    variables: {
                                      id: item?.id,
                                    },
                                  }).then(setDeleteImageDone(true));
                                }}
                                color="error"
                              >
                                Delete
                              </Button>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </MainCard>

              {/* <Grid xs={12} sm={6} item>
                {preview && (
                  <Lightbox
                    images={ImageData}
                    onClose={() => setPreview(false)}
                  />
                )}
              </Grid> */}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </MainCard>
  );
};

export default ImageDetails;

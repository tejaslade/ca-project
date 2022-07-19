import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
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

const ImageDetails = ({ data, allData }) => {
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [deleteUpload, { Imagedata, error, loading }] =
    useMutation(DeleteImage);

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const [preview, setPreview] = useState(false);
  console.log(allData);

  const ImageData = data?.attributes?.images?.data.map((item) => {
    console.log(
      `https://aqueous-headland-76339.herokuapp.com${item?.attributes?.url}`
    );

    return {
      src: `https://aqueous-headland-76339.herokuapp.com${item?.attributes?.url}`,
      title: item?.attributes?.url,
      width: 4,
      height: 3,
      id: item?.id,
    };
  });

  // const onDeleteHandle = (id) => {
  //   console.log(allData);

  // };

  return (
    <MainCard title="View Image Bills">
      <Card>
        <CardContent>
          <form>
            <Grid container spacing={3} direction="column">
              <Grid xs={12} sm={6} md={8} item>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  value={`${data?.attributes?.users_permissions_user?.data?.attributes?.first_name} ${data?.attributes?.users_permissions_user?.data?.attributes?.last_name}`}
                  disabled
                />
              </Grid>
              <Grid xs={12} sm={6} md={8} item>
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
              <Grid xs={12} sm={6} item>
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

              <Grid xs={12} sm={6} item>
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
                                  }).then(setImageUploadSuccess(true));
                              }}
                            />
                          ) : (
                            <>
                              {loading && <p>Loading.....</p>}
                              <Alert variant="outlined" severity="success">
                                Your Image is Successfully created now please
                                refresh this page for update content.
                              </Alert>
                            </>
                          )}
                        </>
                      );
                    }}
                  </Mutation>
                </ApolloProvider>
              </Grid>
              <Grid
                xs={12}
                sm={6}
                item
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",

                  padding: "2rem",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <Gallery photos={ImageData} onClick={openLightbox} />
                  <ModalGateway>
                    {viewerIsOpen ? (
                      <Modal onClose={closeLightbox}>
                        <Carousel
                          currentIndex={currentImage}
                          views={ImageData.map((x) => ({
                            ...x,
                            srcset: x.srcSet,
                            caption: x.title,
                          }))}
                        />
                      </Modal>
                    ) : null}
                  </ModalGateway>
                </div>

                {/* image */}
              </Grid>
              <Grid xs={12} sm={6} item>
                {preview && (
                  <Lightbox
                    images={ImageData}
                    onClose={() => setPreview(false)}
                  />
                )}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </MainCard>
  );
};

export default ImageDetails;

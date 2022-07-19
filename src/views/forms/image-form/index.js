// material-ui
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Backdrop,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, Mutation } from "react-apollo";
import { useLocation } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Alert from "@mui/material/Alert";
// project imports
import MainCard from "ui-component/cards/MainCard";
import { DropzoneArea, DropzoneDialog } from "material-ui-dropzone";
import { useState, useEffect } from "react";
import useAxiosFunction from "hooks/useAxiosFunction";
import axios from "apis/axios";
import { InMemoryCache } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

// ==============================|| Image Form PAGE ||============================== //

const AdminUsers = gql`
  query AlUsersAdmin {
    usersPermissionsUsers(
      filters: { roles: { eq: "admin" } }
      pagination: {}
      sort: []
    ) {
      data {
        id
        attributes {
          username
          roles
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) =>
  createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210,
    },
  })
);

const ImageFormSubmit = gql`
  mutation createImage(
    $id: ID!
    $user: ID!
    $service_id: ID!
    $description: String
  ) {
    updateImage(
      id: $id
      data: {
        users_permissions_user: $user
        service: $service_id
        description: $description
      }
    ) {
      data {
        id
        attributes {
          description
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

const GetImageId = gql`
  query getimageid {
    images {
      data {
        id
      }
    }
  }
`;

const PostImageId = gql`
  mutation createImage {
    createImage(data: {}) {
      data {
        id
      }
    }
  }
`;

const AddOtherFieldEntry = gql`
  mutation AddOtherEntry(
    $id: ID!
    $description: String
    $user: ID
    $service: ID
  ) {
    updateImage(
      id: $id
      data: {
        description: $description
        service: $service
        users_permissions_user: $user
        publishedAt: "2022-04-24T10:46:49.209Z"
      }
    ) {
      data {
        id

        attributes {
          description
          createdAt
        }
      }
    }
  }
`;

const MultipleImage = gql`
  mutation MultipleImageUpload(
    $refId: ID!
    $ref: String
    $field: String
    $files: [Upload]!
  ) {
    multipleUpload(refId: $refId, ref: $ref, field: $field, files: $files) {
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

const ServiceImage = () => {
  const adminNames = useQuery(AdminUsers);
  const [backdropLoader, setBackdropLoader] = useState(false);

  const endpoints = adminNames?.data?.usersPermissionsUsers?.data?.map(
    (item) =>
      `https://api.ravenhub.io/company/GacyNrIsB3/subscribers/${item?.attributes?.username}/events/erSvF9PKUz`
  );
  const navigate = useNavigate();
  const [createImage, { data, error, loading }] = useMutation(PostImageId);
  const [updateImage, { data2, error2, loading2 }] =
    useMutation(AddOtherFieldEntry);
  const [id, setId] = useState();
  const [imageFiles, setImageFiles] = useState();
  useEffect(() => setId(data?.createImage?.data?.id), [data]);
  let imageid;

  console.log("id", id);
  console.log(data);
  // const { data, error, loading } = useQuery(GetImageId);
  // const [id, setId] = useState();
  // useEffect(
  //   () =>
  //     setId(parseInt(data?.images?.data[data?.images?.data?.length - 1].id)),

  //   console.log(id),
  //   [data]
  // );

  // useEffect(() => (
  //   setId(...(data?.images?.data.slice(-1))),
  //   setId(parseInt(id?.id)),
  //   console.log(id)
  // ),[data])

  let state_data = useLocation();

  // styles
  const classes = useStyles();

  // useState
  const [open, setOpen] = useState(false);

  const [userid, setUserId] = useState();
  const [desc, setDesc] = useState("");
  const [serviceId, setServiceId] = useState(state_data?.state?.service_id);

  const [values, setValues] = useState({
    description: "",
    users_permissions_user: localStorage.getItem("user"),
    service: state_data?.state?.service_id,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const NotificationHandle = () => {
    try {
      axios
        .all(
          endpoints.map((endpoint) =>
            axios.post(
              endpoint,
              {
                message: `New Image Bills Created by ${localStorage.getItem(
                  "username"
                )} `,
              },
              { priority: "Critical" },
              {
                headers: { "Content-type": "application/json" },
              }
            )
          )
        )
        .then((data) => console.log(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainCard title="Service Image Form">
      <Card>
        {backdropLoader && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        <CardContent>
          <ApolloProvider client={client}>
            <Mutation mutation={MultipleImage}>
              {(MultipleImageUpload, { data, loading }) => {
                return (
                  <form>
                    <Grid container spacing={3} direction="column">
                      <Grid xs={12} sm={6} md={8} item>
                        <TextField
                          label="Service Name"
                          placeholder="Enter Your Service"
                          variant="outlined"
                          fullWidth
                          value={state_data?.state?.service_name}
                          required
                          disabled
                          //   style={{ padding: "5rem" }}
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={8} item>
                        <TextField
                          label="username"
                          placeholder="Enter Your Username"
                          variant="outlined"
                          fullWidth
                          value={localStorage.getItem("username")}
                          required
                          disabled
                          //   style={{ padding: "5rem" }}
                        />
                      </Grid>
                      <Grid xs={12} sm={6} item>
                        <TextField
                          label="Description"
                          placeholder="Enter Your description"
                          name="description"
                          onChange={handleChange}
                          value={values.description}
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={4}
                        />
                      </Grid>
                      <Grid xs={12} sm={6} item>
                        {!imageFiles ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpen(true)}
                            style={{
                              width: "100%",
                              padding: "2rem 0",
                              border: "3px dashed #9e9e9e",
                              backgroundColor: "#fafafa",
                              color: "black",
                              borderRadius: "10px",
                            }}
                          >
                            <AddAPhotoIcon sx={{ fontSize: 40 }} />
                          </Button>
                        ) : (
                          <Alert variant="outlined" severity="success">
                            Our Image Is Selected Please Enter Other Details and
                            Click Submit Button!
                          </Alert>
                        )}

                        {open && (
                          <DropzoneDialog
                            acceptedFiles={["image/*"]}
                            cancelButtonText={"cancel"}
                            submitButtonText={"submit"}
                            filesLimit={50}
                            maxFileSize={50000000}
                            open={open}
                            onClose={() => setOpen(false)}
                            onSave={(files) => {
                              const file = files;
                              setImageFiles(file);

                              file &&
                                createImage({
                                  variables: {},
                                }).then(
                                  (imageid = data?.createImage?.data?.id),
                                  console.log(imageid),
                                  setOpen(false)
                                );
                            }}
                            showPreviews={true}
                            showFileNamesInPreview={true}
                          />
                        )}
                      </Grid>
                      <Grid xs={12} sm={6} item>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => {
                            setBackdropLoader(true);
                            updateImage({
                              variables: {
                                id: id,
                                description: values.description,
                                user: values.users_permissions_user,
                                service: values.service,
                              },
                            });
                            MultipleImageUpload({
                              variables: {
                                refId: id,
                                ref: "api::image.image",
                                field: "images",
                                files: imageFiles,
                              },
                            }).then(
                              setBackdropLoader(false),
                              navigate("/"),
                              NotificationHandle()
                            );
                          }}
                        >
                          Submit{" "}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                );
              }}
            </Mutation>
          </ApolloProvider>
        </CardContent>
      </Card>
    </MainCard>
  );
};

export default ServiceImage;

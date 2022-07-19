import { gql, useMutation } from "@apollo/client";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Input,
  Typography,
} from "@mui/material";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, Mutation } from "react-apollo";

import { styled } from "@mui/material/styles";
import { useState } from "react";
import axios from "axios";
const user = {
  avatar: "/static/images/avatars/avatar_6.png",
  city: "Los Angeles",
  country: "USA",
  jobTitle: "Senior Developer",
  name: "Katarina Smith",
  timezone: "GTM-7",
};

const UPLOAD_FILE = gql`
  mutation AvatarEdit($id: ID!, $avatarId: ID!) {
    updateUsersPermissionsUser(id: $id, data: { avatar: $avatarId }) {
      data {
        id
        attributes {
          username
          avatar {
            data {
              id
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

export const AccountProfile = (props) => {
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [AvatarEdit, { data, loading, error }] = useMutation(UPLOAD_FILE);
  const profile_photo = props.user?.avatar?.data?.attributes?.url;
  if (profile_photo == "undefined") {
    profile_photo = user.avatar;
  }

  const [files, setFiles] = useState();
  const uploadImage = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("files", files[0]);

    axios
      .post("https://aqueous-headland-76339.herokuapp.com/api/upload", formData)
      .then((response) => {
        const imageId = response.data[0].id;
        console.log(imageId);
        AvatarEdit({
          variables: {
            id: localStorage.getItem("user"),
            avatarId: imageId,
          },
        }).then(console.log(error));
        // graphql
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={profile_photo}
            sx={{
              height: 64,
              mb: 2,
              width: 64,
            }}
          />
          <Typography color="textPrimary" gutterBottom variant="h5">
            {props?.user?.username}
          </Typography>
          {/* <Typography color="textSecondary" variant="body2">
            {`${user.city} ${user.country}`}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {user.timezone}
          </Typography> */}
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Grid xs={12} item>
          <form onSubmit={uploadImage}>
            <label>Select Image File:</label>
            <br />
            <input type="file" onChange={(e) => setFiles(e.target.files)} />
            {/* <input type="submit" name="submit" value="Upload" /> */}
            <Button
              style={{
                margin: "0.5rem",
              }}
              size="small"
              type="submit"
              name="submit"
              value="Upload"
              variant="contained"
            >
              Upload
            </Button>
          </form>
        </Grid>
        {/* <Button color="primary" fullWidth size="large" variant="contained">
          Upload picture
        </Button> */}
      </CardActions>
    </Card>
  );
};

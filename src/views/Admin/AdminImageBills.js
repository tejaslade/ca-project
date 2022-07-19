import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Paper,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import SendIcon from "@mui/icons-material/Send";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@emotion/react";

import SimpleReactLightbox from "simple-react-lightbox";
import { SRLWrapper } from "simple-react-lightbox";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import { autoPlay } from "react-swipeable-views-utils";

import MainCard from "ui-component/cards/MainCard";
import { useMutation, useQuery } from "@apollo/client";
// import { addRemarkImage, getImageRemark, imageCheckbox } from "queries/query";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Box } from "@mui/system";
import { Modal } from "react-images";
import {
  addRemarkImage,
  getImageRemark,
  imageCheckbox,
} from "views/queries/query";
import axios from "apis/axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const captionOne = (
  <div className="SRLCustomCaption myCustomCaptionOne">
    She found herself in a <span className="SRLCustomCaption">forest...</span>
  </div>
);
const captionTwo = (
  <div className="SRLCustomCaption myCustomCaptionTwo">
    ...lost and wandering she had to
    <span className="SRLCustomCaption">make a choice...</span>
  </div>
);

const captionThree = (
  <a
    href="http://www.simple-react-lightbox.dev"
    target="__blank"
    className="SRLCustomCaption myCustomButton"
  >
    Help her make a choice
  </a>
);

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

// Create an array with the custom captions that you want to use
const customCaptions = [
  { id: 0, caption: captionOne },
  { id: 1, caption: captionTwo },
  { id: 2, caption: captionThree },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  height: 800,
  borderRadius: "10px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AdminImageBills = ({ data }) => {
  const [CreateImageRemark, CreateImageRemarkAfterValue] =
    useMutation(addRemarkImage);

  const theme = useTheme();

  const [imageId, setImageId] = useState();

  const [open, setOpen] = useState(false);

  const handleClickOpen = (id) => {
    console.log(id);
    setOpen(true);
    setImageId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const [ImageCheckbox, ImageCheckboxReturnValue] = useMutation(imageCheckbox);
  const ImageQuery = useQuery(getImageRemark);
  console.log(ImageQuery?.data);
  // const [preview, setPreview] = useState(false);

  const [checkbox, setCheckbox] = useState(false);
  const [remark, setRemark] = useState("");
  console.log(data);

  const NotificationHandle = () => {
    let endpoint = `https://api.ravenhub.io/company/GacyNrIsB3/subscribers/${data?.attributes?.users_permissions_user?.data?.attributes?.username}/events/erSvF9PKUz`;
    try {
      axios.post(
        endpoint,
        {
          message: `Some Correction in your sending bills plase check the following bills and remove bill and upload it again.`,
        },
        { priority: "Critical" },
        {
          headers: { "Content-type": "application/json" },
        }
      );
    } catch (error) {
      console.log(error);
    }
    // try {

    //   // axios
    //   //   .all(
    //   //     endpoints.map((endpoint) =>
    //   //       axios.post(
    //   //         endpoint,
    //   //         {
    //   //           message: `New Image Bills Created by ${localStorage.getItem(
    //   //             "username"
    //   //           )} `,
    //   //         },
    //   //         { priority: "Critical" },
    //   //         {
    //   //           headers: { "Content-type": "application/json" },
    //   //         }
    //   //       )
    //   //     )
    //   //   )
    //   //   .then((data) => console.log(data));
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const ImageData = data?.attributes?.images?.data.map((item) => {
    console.log(
      `https://aqueous-headland-76339.herokuapp.com${item?.attributes?.url}`
    );
    if (item?.attributes?.alternativeText == true) {
      setCheckbox(true);
    }

    // console.log(data?.attributes?.users_permissions_user?.data?.)

    return {
      id: item?.id,

      status: item?.attributes?.alternativeText,
      caption: item?.attributes?.caption,
      remark: item?.attributes?.caption,
      url: item?.attributes?.url,
      title: item?.attributes?.url,
    };
  });

  useEffect(() => {
    setImageId(ImageData[0]);
  }, []);

  console.log(imageId);
  console.log(imageId?.url);

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = ImageData.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <MainCard title="View Image Bills">
      <Card>
        <form>
          <Grid container spacing={3} direction="column">
            <Grid
              xs={12}
              sm={6}
              md={8}
              item
              style={{
                marginTop: "1rem",
              }}
            >
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
            <Grid
              xs={12}
              sm={6}
              md={8}
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
              {/* Images */}

              <MainCard title="View Image Bills">
                <Grid
                  container
                  spacing={2}
                  justifyContent="flex-start"
                  alignItems="baseline"
                >
                  {ImageData?.map((item) => (
                    <Grid item>
                      <Card
                        sx={{ maxWidth: 345 }}
                        style={{
                          backgroundColor: "Highlight",
                        }}
                      >
                        <CardMedia
                          actionPosition="left"
                          onClick={handleClickOpen}
                          component="img"
                          height="194"
                          image={item?.url}
                          alt="Paella dish"
                          style={{
                            marginBottom: "1rem",
                          }}
                        />

                        <Grid
                          container
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                          alignItems="center"
                          style={{
                            marginBottom: "0.5rem",
                            minWidth: "348px",
                          }}
                        >
                          <Grid item>
                            <Checkbox
                              color="secondary"
                              // defaultChecked

                              checked={
                                item?.status === "false" ||
                                item?.status === null
                                  ? false
                                  : true
                              }
                              // checked={"false"}
                              inputProps={{ "aria-label": "controlled" }}
                              onChange={
                                (e) =>
                                  ImageCheckbox({
                                    variables: {
                                      id: item?.id,
                                      alternate_text:
                                        e.target.checked.toString(),
                                    },
                                  }).then(console.log("checked"))
                                // setCheckbox(e.target.checked))
                              }
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
                            />
                            {/* <h1>{item?.status}</h1>
                              <h1>{item?.caption}</h1> */}
                          </Grid>
                          <Grid item xs={8}>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={imageOptions}
                              onChange={(event, newValue) => {
                                setRemark(newValue);
                              }}
                              inputValue={remark?.label}
                              renderInput={(params) => (
                                <TextField
                                  size="small"
                                  {...params}
                                  label="Remarks"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item>
                            <IconButton
                              color="primary"
                              aria-label="add to shopping cart"
                              onClick={() => {
                                CreateImageRemark({
                                  variables: {
                                    id: item?.id,
                                    caption: remark?.label,
                                  },
                                  refetchQueries: [{ query: ImageQuery }],
                                }).then(
                                  NotificationHandle(),
                                  ImageQuery.refetch(),
                                  console.log("Successfully remark mutate")
                                );
                              }}
                            >
                              <SendIcon fontSize="large" />
                            </IconButton>
                          </Grid>
                          {item?.caption && (
                            <Grid
                              container
                              justifyContent="center"
                              style={{
                                margin: "1rem",
                              }}
                            >
                              <Grid item>
                                <Chip label={item?.caption} color="secondary" />
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                        {/* <Grid container xs={8}>
                            <Autocomplete
                              disablePortal
                              onChange={(event, value) =>
                                setRemark({
                                  id: item?.id,
                                  caption: value.label,
                                })
                              }
                              id="combo-box-demo"
                              options={imageOptions}
                              renderInput={(params) => (
                                <>
                                  <Grid
                                    container
                                    spacing={2}
                                    direction="row"

                                    // justifyContent="space-between"
                                  >
                                    <Grid item>
                                      <TextField
                                        size="small"
                                        {...params}
                                        sx={{ width: 250 }}
                                        style={{
                                          paddingRight: "2rem",
                                        }}
                                        // value={item?.caption}
                                        // onChange={(e) => setRemark(e.target.value)}
                                        label="Remarks"
                                      />
                                    </Grid>
                                    <Grid item>
                                      <span>
                                        <Button
                                          variant="contained"
                                          onClick={() =>
                                            // CreateImageRemark({
                                            //   variables: {
                                            //     id: parseInt(item?.id),
                                            //     caption: remark?.label,
                                            //   },
                                            // }).then(
                                            //   console.log("done", item?.id)
                                            // )
                                            console.log(remark)
                                          }
                                        >
                                          Send
                                        </Button>
                                      </span>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                            />
                          </Grid> */}
                        {/* <Grid item>
                              <IconButton
                                color="primary"
                                aria-label="add to shopping cart"
                                onClick={() =>
                                  CreateImageRemark({
                                    variables: {
                                      id: parseInt(item?.id),
                                      caption: remark?.label,
                                    },
                                  }).then(console.log("done", item?.id))
                                }
                              >
                                <SendIcon fontSize="large" />
                              </IconButton>
                            </Grid> */}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </MainCard>
            </Grid>
          </Grid>
        </form>
      </Card>
      <Dialog
        fullWidth={true}
        maxWidth={"xl"}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Box>
            <AutoPlaySwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={activeStep}
              onChangeIndex={handleStepChange}
              autoplay={false}
            >
              {ImageData?.map((step, index) => (
                <div key={step.label}>
                  {Math.abs(activeStep - index) <= 2 ? (
                    <>
                      {/* <Box
                          component="img"
                          sx={{
                            height: 255,
                            display: "block",
                            maxWidth: 400,
                            overflow: "hidden",
                            width: "100%",
                          }}
                          src={step?.url}
                          alt={step?.title}
                        /> */}
                      <MainCard title="Image Preview">
                        <MobileStepper
                          steps={maxSteps}
                          position="static"
                          activeStep={activeStep}
                          nextButton={
                            <Button
                              size="small"
                              onClick={handleNext}
                              disabled={activeStep === maxSteps - 1}
                            >
                              Next
                              {theme.direction === "rtl" ? (
                                <KeyboardArrowLeft />
                              ) : (
                                <KeyboardArrowRight />
                              )}
                            </Button>
                          }
                          backButton={
                            <Button
                              size="small"
                              onClick={handleBack}
                              disabled={activeStep === 0}
                            >
                              {theme.direction === "rtl" ? (
                                <KeyboardArrowRight />
                              ) : (
                                <KeyboardArrowLeft />
                              )}
                              Back
                            </Button>
                          }
                        />
                        <Divider
                          style={{
                            color: "#2196f3",
                          }}
                        />
                        <TransformWrapper>
                          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                            <React.Fragment>
                              <div className="tools">
                                <Grid
                                  container
                                  spacing={1}
                                  direction="row"
                                  style={{
                                    margin: "0.5rem",
                                  }}
                                  // justifyContent="center"
                                  // alignItems="center"
                                >
                                  {/* <Grid item>
                        <Button onClick={() => zoomIn()} variant="contained">
                          Zoom In
                        </Button>
                      </Grid> */}
                                  <Grid item>
                                    <Button
                                      onClick={() => zoomIn()}
                                      variant="contained"
                                    >
                                      Zoom In
                                    </Button>
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      onClick={() => zoomOut()}
                                      variant="contained"
                                    >
                                      Zoom Out
                                    </Button>
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      onClick={() => resetTransform()}
                                      variant="contained"
                                    >
                                      Clear
                                    </Button>
                                  </Grid>
                                </Grid>
                              </div>

                              <Grid
                                // margin="2rem 0"
                                alignItems="center"
                                justifyContent="center"
                                style={{ minHeight: "10rem" }}
                              >
                                <TransformComponent
                                  style={{
                                    width: "100%",
                                    justifyContent: "center",
                                  }}
                                >
                                  <img
                                    style={{
                                      backgroundColor: "white",
                                      borderRadius: "10px",
                                      // margin: "0  10rem",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      width: "100%",
                                      resizeMode: "contain",

                                      margin: "2rem  2rem",
                                    }}
                                    src={step?.url}
                                    alt="test"
                                  />
                                </TransformComponent>
                                <Grid
                                  container
                                  direction="row"
                                  spacing={1}
                                  justifyContent="center"
                                  alignItems="center"
                                  style={{
                                    marginTop: "1rem",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <Grid item>
                                    <Checkbox
                                      color="secondary"
                                      // defaultChecked
                                      checked={
                                        step?.status === "false" ||
                                        step?.status === null
                                          ? false
                                          : true
                                      }
                                      onChange={
                                        (e) =>
                                          ImageCheckbox({
                                            variables: {
                                              id: step?.id,
                                              alternate_text:
                                                e.target.checked.toString(),
                                            },
                                          }).then(console.log("checked"))
                                        // setCheckbox(e.target.checked))
                                      }
                                      sx={{
                                        "& .MuiSvgIcon-root": {
                                          fontSize: 30,
                                        },
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={8}>
                                    <Autocomplete
                                      disablePortal
                                      id="combo-box-demo"
                                      options={imageOptions}
                                      onChange={(event, newValue) => {
                                        setRemark(newValue);
                                      }}
                                      inputValue={remark?.label}
                                      renderInput={(params) => (
                                        <TextField
                                          size="small"
                                          {...params}
                                          label="Remarks"
                                        />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <IconButton
                                      color="primary"
                                      aria-label="add to shopping cart"
                                      onClick={() => {
                                        CreateImageRemark({
                                          variables: {
                                            id: step?.id,
                                            caption: remark.label,
                                          },
                                        }).then(
                                          console.log(
                                            "Successfully remark mutate"
                                          )
                                        );
                                      }}
                                    >
                                      <SendIcon fontSize="large" />
                                    </IconButton>
                                  </Grid>
                                  {step?.caption && (
                                    <Grid
                                      container
                                      justifyContent="center"
                                      style={{
                                        margin: "1rem",
                                      }}
                                    >
                                      <Grid item>
                                        <Chip
                                          label={step?.caption}
                                          color="secondary"
                                        />
                                      </Grid>
                                    </Grid>
                                  )}
                                </Grid>

                                {/* <Grid item>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          "& > :not(style)": {
                            m: 1,
                            height: "10rem",
                            width: "10rem",
                          },
                        }}
                      >
                        <Paper elevation={3}>Hello</Paper>
                      </Box>
                    </Grid> */}
                              </Grid>
                            </React.Fragment>
                          )}
                        </TransformWrapper>
                      </MainCard>
                    </>
                  ) : null}
                </div>
              ))}
            </AutoPlaySwipeableViews>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

const imageOptions = [
  {
    label: "Tax amount not correct",
  },
  {
    label: "Kindly check Delete it and upload it again.",
  },
  {
    label: "Advisable to deduct TDS on this transaction.",
  },
  {
    label: "Image not clear.",
  },
  {
    label: " Kindly retake and upload it again.",
  },
];

export default AdminImageBills;

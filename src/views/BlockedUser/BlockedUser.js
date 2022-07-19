import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import blockuser from "../../assets/block.webp";

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

const BlockedUser = () => {
  return (
    <Dialog
      open={true}
      // onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{
          paddingTop: "2rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          paddingBottom: "1rem",
          alignContent: "center",
        }}
      >
        <Typography variant="h4">Welcome to Our Application.</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid>
          <img
            style={{
              alignItems: "center",
              maxWidth: "100%",
              height: "auto",
              borderRadius: "0.5rem",
            }}
            src={blockuser}
            alt="blockUser"
          />
        </Grid>
        <Typography
          variant="h4"
          style={{
            paddingTop: "1rem",
            paddingBottom: "1rem",
          }}
        >
          Initially All the Accounts Are block because of these you have to
          contact CA munimji Employee.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default BlockedUser;

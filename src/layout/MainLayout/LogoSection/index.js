import { Link } from "react-router-dom";

// material-ui
import { ButtonBase } from "@mui/material";

// project imports
import config from "config";
// import Logo from 'ui-component/Logo';
import Logo from "assets/logo/final_logo.png";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
  <ButtonBase disableRipple component={Link} to={config.defaultPath}>
    <img src={Logo} alt="log not found" srcset="" height="50px" />
    <h2
      style={{
        color: "black",
        padding: "0  1rem",
      }}
    >
      {"  "}
      MUNIMJI{" "}
    </h2>
  </ButtonBase>
);

export default LogoSection;

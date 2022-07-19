// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import menuItem from "menu-items";

import dashboard from "../../../../menu-items/dashboard";
import pages from "../../../../menu-items/pages";
import useAuth from "hooks/useAuth";
import { useContext } from "react";
import AuthContext from "context/AuthProvider";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const menuItem = {
    items: [localStorage.getItem("roles") === "admin" ? pages : dashboard],
  };
  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case "group":
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;

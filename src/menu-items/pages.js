// assets
import { IconKey } from "@tabler/icons";
import {
  IconDashboard,
  IconUsers,
  IconReceipt,
  IconFileInvoice,
  IconCreditCard,
  IconNotification,
  IconLayoutCards
} from "@tabler/icons";

// constant
const icons = {
  IconDashboard,
  IconUsers,
  IconReceipt,
  IconFileInvoice,
  IconCreditCard,
  IconNotification,
  IconLayoutCards
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: "admin",
  title: "Admin",
  type: "group",
  children: [
    {
      id: "Dashboard",
      title: "Dashboard",
      type: "item",
      url: "/",
      icon: icons.IconLayoutCards,
      breadcrumbs: false,
    },
    {
      id: "allusers",
      title: "All User ",
      type: "item",
      url: "/admin/allusers",
      icon: icons.IconUsers,
      breadcrumbs: false,
    },
    {
      id: "allbills",
      title: "All Image Bills",
      type: "item",
      url: "/admin/allbills",
      icon: icons.IconReceipt,
      breadcrumbs: false,
    },
    {
      id: "allfeedbills",
      title: "All Feed Bills ",
      type: "item",
      url: "/admin/allfeedbills",
      icon: icons.IconFileInvoice,
      breadcrumbs: false,
    },
    {
      id: "allcontacts",
      title: "All Contact Forms",
      type: "item",
      url: "/admin/contacts",
      icon: icons.IconCreditCard,
      breadcrumbs: false,
    },

    {
      id: "Notification",
      title: "BroadCast Notification",
      type: "item",
      url: "/admin/notification",
      icon: icons.IconNotification,
      breadcrumbs: false,
    },
  ],
};

export default pages;

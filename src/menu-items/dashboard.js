// assets
import {
  IconDashboard,
  IconHome2,
  IconUser,
  IconCreditCard,
  IconEdit,
  IconSpeakerphone,
} from "@tabler/icons";

// constant
const icons = {
  IconDashboard,
  IconHome2,
  IconUser,
  IconCreditCard,
  IconEdit,
  IconSpeakerphone,
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "Dashboard",
      title: "Dashboard",
      type: "item",
      url: "/",
      icon: icons.IconHome2,
      breadcrumbs: true,
    },

    {
      id: "accounts",
      title: "Accounts",
      type: "item",
      url: "/accounts",
      icon: icons.IconUser,
      breadcrumbs: false,
    },
    {
      id: "history",
      title: "History",
      type: "item",
      url: "/service/history",
      icon: icons.IconEdit,
      breadcrumbs: false,
    },
    {
      id: "Contact",
      title: "Contact",
      type: "item",
      url: "/contact",
      icon: icons.IconCreditCard,
      breadcrumbs: false,
    },
    {
      id: "faq",
      title: "FAQ",
      type: "item",
      url: "/faq",
      icon: icons.IconSpeakerphone,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;

import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";

// dashboard routing

const Dashboard = Loadable(lazy(() => import("views/dashboard/main")));
const DashboardDefault = Loadable(
  lazy(() => import("views/dashboard/Default"))
);
const ImageForm = Loadable(lazy(() => import("views/forms/image-form")));
const FeedForm = Loadable(lazy(() => import("views/forms/feed-form/")));
const Account = Loadable(lazy(() => import("views/Accounts")));
const Contact = Loadable(lazy(() => import("views/contact")));
const History = Loadable(lazy(() => import("views/history")));
const Notification = Loadable(lazy(() => import("views/notifications")));

// utilities routing
const UtilsTypography = Loadable(
  lazy(() => import("views/utilities/Typography"))
);
const UtilsColor = Loadable(lazy(() => import("views/utilities/Color")));
const UtilsShadow = Loadable(lazy(() => import("views/utilities/Shadow")));
const UtilsMaterialIcons = Loadable(
  lazy(() => import("views/utilities/MaterialIcons"))
);
const UtilsTablerIcons = Loadable(
  lazy(() => import("views/utilities/TablerIcons"))
);

// sample page routing
const SamplePage = Loadable(lazy(() => import("views/sample-page")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    //  Todo Dashboard main routes
    {
      path: "/",
      element: <Dashboard />,
      
    },
    {
      path: "/service/image-form",
      element: <ImageForm />,
    },
    {
      path: "/service/feed-form",
      element: <FeedForm />,
    },
    {
      path: "/accounts",
      element: <Account />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path: "/service/history",
      element: <History />,
    },
    {
      path: "/service/notifications",
      element: <Notification />,
    },

    // ! Todo Default routes
    {
      path: "/dashboard/default",
      element: <DashboardDefault />,
    },
    {
      path: "/utils/util-typography",
      element: <UtilsTypography />,
    },
    {
      path: "/utils/util-color",
      element: <UtilsColor />,
    },
    {
      path: "/utils/util-shadow",
      element: <UtilsShadow />,
    },
    {
      path: "/icons/tabler-icons",
      element: <UtilsTablerIcons />,
    },
    {
      path: "/icons/material-icons",
      element: <UtilsMaterialIcons />,
    },
    {
      path: "/sample-page",
      element: <SamplePage />,
    },
  ],
};

export default MainRoutes;

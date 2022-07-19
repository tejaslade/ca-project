import { Routes, Route } from "react-router-dom";

// routes
import MinimalLayout from "layout/MinimalLayout";
import { useState } from "react";
import MainLayout from "layout/MainLayout";
import Dashboard from "views/dashboard/main";
import ImageForm from "views/forms/image-form";
import FeedForm from "views/forms/feed-form";
import Accounts from "views/Accounts";
import Contact from "views/contact";
import History from "views/history";

import Notification from "views/notifications";
import AuthLogin3 from "views/pages/authentication/authentication3/Login3";
import AuthRegister3 from "views/pages/authentication/authentication3/Register3";
import { AuthProvider } from "context/AuthProvider";
import RequireAuth from "./RequireAuth";
import AllUser from "views/Admin/AllUser";
import AllBills from "views/Admin/AllBills";
import AllFeed from "views/Admin/AllFeed";
import AdminImageBills from "views/Admin/AdminImageBills";
import AdminFeedBills from "views/Admin/AdminFeedBills";
import AdminContacts from "views/Admin/AdminContacts";
import BlockedUser from "views/BlockedUser/BlockedUser";
import Accounting from "views/dashboard/category/accounting";
import Audit from "views/dashboard/category/audit";
import Registration from "views/dashboard/category/registration";
import AllEditBills from "views/Admin/AllEditBills";
import BroadCastNotification from "views/Admin/BroadCastNotification";
import NotFoundPage from "views/404/NotFoundPage";
import FrequentlyAskedQuestion from "views/FAQ";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthProvider>
      <Routes>
        {/* private routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/service/image-form" element={<ImageForm />} />
            <Route path="/service/feed-form" element={<FeedForm />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/service/history" element={<History />} />

            <Route path="/service/notifications" element={<Notification />} />
            <Route path="/admin/allusers" element={<AllUser />} />
            <Route path="/admin/allbills" element={<AllBills />} />
            <Route path="/admin/allEditbills" element={<AllEditBills />} />
            <Route path="/admin/allfeedbills" element={<AllFeed />} />

            <Route path="/admin/image/bills" element={<AdminImageBills />} />
            <Route path="/admin/feedd/bills" element={<AdminFeedBills />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
            <Route
              path="/admin/notification"
              element={<BroadCastNotification />}
            />
            <Route path="/category/accounting" element={<Accounting />} />
            <Route path="/category/audit" element={<Audit />} />
            <Route path="/category/registration" element={<Registration />} />
            <Route path="/faq" element={<FrequentlyAskedQuestion />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* public routes */}
        <Route path="/" element={<MinimalLayout />}>
          <Route path="/user/blocked" element={<BlockedUser />} />
          <Route path="/login" element={<AuthLogin3 />} />
          <Route path="/register" element={<AuthRegister3 />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

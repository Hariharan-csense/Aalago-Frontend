import { Route, Routes } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminRoute from "./AdminRoute";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminDestinationsPage from "./pages/AdminDestinationsPage";
import AdminPropertiesPage from "./pages/AdminPropertiesPage";
import AdminBlogPage from "./pages/AdminBlogPage";
import AdminContentPage from "./pages/AdminContentPage";
import AdminEnquiriesPage from "./pages/AdminEnquiriesPage";
import AdminMembershipPage from "./pages/AdminMembershipPage";
import AdminSubscribersPage from "./pages/AdminSubscribersPage";

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="destinations" element={<AdminDestinationsPage />} />
          <Route path="properties" element={<AdminPropertiesPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="memberships" element={<AdminMembershipPage />} />
          <Route path="enquiries" element={<AdminEnquiriesPage />} />
          <Route path="subscribers" element={<AdminSubscribersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

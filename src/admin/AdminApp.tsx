import { Route, Routes } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminRoute from "./AdminRoute";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminDestinationsPage from "./pages/AdminDestinationsPage";
import AdminPropertiesPage from "./pages/AdminPropertiesPage";
import AdminBlogPage from "./pages/AdminBlogPage";
import AdminContentPage from "./pages/AdminContentPage";

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
        </Route>
      </Route>
    </Routes>
  );
}

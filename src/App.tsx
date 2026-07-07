import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./admin/AuthContext";
import AdminApp from "./admin/AdminApp";
import PublicLayout from "./components/layout/PublicLayout";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </AuthProvider>
  );
}

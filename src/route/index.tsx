import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import ExtractDataRoutes from "./extract";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        {/* <Route path="/login" element={<Login />} />
        {AISandboxRoutes} */}

        {/* Redirect root (pointing to /admin to avoid infinite loop) */}
        <Route path="/" element={<Navigate to="/admin" />} />

        {/* Protected Admin Routes */}
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        > */}

        <Route path="/admin" element={<Layout />}>
          {/* Nested routes can go here */}
          {ExtractDataRoutes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

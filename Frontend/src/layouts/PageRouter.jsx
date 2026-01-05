import Account from "@/pages/Account";
import Analytics from "@/pages/Analytics";
import Login from "@/pages/Login";
import Machines from "@/pages/Machines";
import Modules from "@/pages/Modules";
import { Routes, Route, Navigate } from "react-router-dom";
import Admins from "@/pages/Admins";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function PageRouter() {
  return (
    <Routes>
      <Route path="*" element={<h1>404 Not Found</h1>} />
      <Route path="/" element={<Navigate replace to={"/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admins"
        element={
          <ProtectedRoute>
            <Admins />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/machines"
        element={
          <ProtectedRoute>
            <Machines />
          </ProtectedRoute>
        }
      />
      <Route
        path="/machines/:user_id"
        element={
          <ProtectedRoute>
            <Modules />
          </ProtectedRoute>
        }
      />
      <Route
        path="/machines/:user_id/:module_id"
        element={
          <ProtectedRoute>
            <Machines />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default PageRouter;

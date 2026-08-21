import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

//get context info here
import { AuthProvider } from "./context/AuthContext";

//Unauthorised page styling 
import "./styles/Unauthorized.css";

//get pages here (for all)
import Login from "./pages/Login";

import Register from "./pages/Register";

//change password (for all)
import ChangePassword from "./pages/ChangePassword";

//commone navbar for all 
import Navbar from "./components/Navbar";



//admin pages and admin functionality here
import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminUsers from "./pages/admin/AdminUsers";

import AdminUserDetails from "./pages/admin/AdminUserDetails";

import CreateUser from "./pages/admin/CreateUser";

import AdminStores from "./pages/admin/AdminStores";

import CreateStore from "./pages/admin/CreateStore";


import OwnerDashboard from "./pages/owner/OwnerDashboard";


import Stores from "./pages/user/Stores";

import StoreDetails from "./pages/user/StoreDetails";

import RateStore from "./pages/user/RateStore";

//get the protected route to verify from here
import ProtectedRoute from "./routes/ProtectedRoute";

const Unauthorized = () => (
    <div className="unauthorized-page">
        <div className="unauthorized-card">
            <h1>403</h1>

            <p>You do not have permission to access this page.</p>
        </div>
    </div>
);

const App = () => {

  return (

    <BrowserRouter>

      <AuthProvider>

        <Navbar />

        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>

            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/admin/users" element={<AdminUsers />} />

            <Route path="/admin/users/:userId" element={<AdminUserDetails />} />

            <Route path="/admin/users/create" element={<CreateUser />} />

            <Route path="/admin/stores" element={<AdminStores />} />

            <Route path="/admin/stores/create" element={<CreateStore />} />

          </Route>

          <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>

            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>

            <Route path="/stores" element={<Stores />} />

            <Route path="/stores/:storeId" element={<StoreDetails />} />

            <Route path="/stores/:storeId/rate" element={<RateStore />} />

          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin", "owner", "user"]} />}>

            <Route path="/change-password" element={<ChangePassword />} />

          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
};

export default App;
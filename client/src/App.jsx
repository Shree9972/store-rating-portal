import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

//get context info here
import { AuthProvider } from "./context/AuthContext";

//get pages here
import Login from "./pages/Login";
import Register from "./pages/Register";

//get the protected route to verify from here
import ProtectedRoute from "./routes/ProtectedRoute";

const Unauthorized = () => (

  <div>
    <h1>403</h1>
    <p>You do not have permission to access this page.</p>
  </div>

);

const App = () => {

  return (

    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
            <Route path="/owner/dashboard" element={<div>Owner Dashboard</div>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>

            <Route  path="/stores" element={<div>Store Listing</div>} />

          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
};

export default App;
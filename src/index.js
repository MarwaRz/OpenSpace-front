import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import Index from "views/Index.js";
import NotFound from "views/examples/NotFound";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Login from "views/examples/Login";
import Expired from "views/examples/Expired";
import PrivateRoute from "views/examples/PrivateRoute"; 

const root = ReactDOM.createRoot(document.getElementById("root"));

const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

root.render(
  <BrowserRouter>
    <Routes>


      <Route path="login" element={<Login />} />

      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/admin/*" element={<AdminLayout />} />
      </Route>

      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="plateau/:plateauId" element={<Index />} />
      <Route path="/expired" element={<Expired />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

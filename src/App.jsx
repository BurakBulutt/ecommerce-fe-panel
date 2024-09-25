import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-dropdown/style.css';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />}/>
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;

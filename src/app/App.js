"use client";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./auth/login";
import RegisterPage from "./auth/register";
import UdatedStorePage from "./dashboard/updateStore"; 
import ListStoresPage from "./dashboard/liststores"; 
import StoreInfor from "./dashboard/StoreInfo"; 
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Header */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/liststores" element={<ListStoresPage />} />
        <Route path="/updatedStore" element={<UdatedStorePage />} />
        <Route path="/storeInfor" element={<StoreInfor />} />
      </Routes>
      <Footer /> {/* Footer */}
    </BrowserRouter>
  );
}

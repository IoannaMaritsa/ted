// src/App.js
import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute.js';

import HomePage from "./pages/HomePage.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import ForgotPass from "./pages/ForgotPass.js";
import Epag_Home from "./pages/Epag_Home.js";
import Epag_article from "./pages/Epag_article.js";
import Epag_job_ad from "./pages/Epag_job_ad.js";
import Epag_messages from "./pages/Epag_messages.js";
import Epag_network from "./pages/Epag_network.js";
import Epag_network_profile from "./pages/Epag_network_profile.js";
import Epag_notifications from "./pages/Epag_notifications.js";
import Epag_pinformation from "./pages/Epag_pinformation.js";
import Epag_profile from "./pages/Epag_profile.js";
import Epag_settings from "./pages/Epag_settings.js";
import Diax_Home from "./pages/Diax_Home.js";
import About from "./pages/About.js";
import Communication from "./pages/Communication.js";
import CooPolicy from "./pages/CooPolicy.js";
import FAQ from "./pages/FAQ.js";
import Help from "./pages/Help.js";
import Help_em from "./pages/Help_employer.js";
import Pripolicy from "./pages/Pripolicy.js";
import Terms from "./pages/Terms.js";
import Admin_user from "./pages/Admin_user.js";
import { ContextProvider } from './context/appContext.js';

export default function App() {
  return (
    <ContextProvider>
      <div className="App">
        <BrowserRouter>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot_password" element={<ForgotPass />} />
            <Route path="/admin" element={<Diax_Home />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/community_policies" element={<CooPolicy />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/help_center" element={<Help />} />
            <Route path="/help_center_for_employers" element={<Help_em />} />
            <Route path="/privacy_policy" element={<Pripolicy />} />
            <Route path="/terms_and_conditions" element={<Terms />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin_user" element={<Admin_user />} />

            {/* Protected Routes */}
            <Route path="/epaggelmatias_homepage" element={<ProtectedRoute element={Epag_Home} />} />
            <Route path="/user_profile" element={<ProtectedRoute element={Epag_network_profile} />} />
            <Route path="/epaggelmatias_article/:id" element={<ProtectedRoute element={Epag_article} />} />
            <Route path="/epaggelmatias_aggelies" element={<ProtectedRoute element={Epag_job_ad} />} />
            <Route path="/epaggelmatias_aggelies/user_profile" element={<ProtectedRoute element={Epag_network_profile} />} />
            <Route path="/epaggelmatias_messages" element={<ProtectedRoute element={Epag_messages} />} />
            <Route path="/epaggelmatias_network" element={<ProtectedRoute element={Epag_network} />} />
            <Route path="/epaggelmatias_network/user_profile" element={<ProtectedRoute element={Epag_network_profile} />} />
            <Route path="/epaggelmatias_notifications" element={<ProtectedRoute element={Epag_notifications} />} />
            <Route path="/epaggelmatias_notifications/user_profile" element={<ProtectedRoute element={Epag_network_profile} />} />
            <Route path="/epaggelmatias_notifications/epaggelmatias_article/:id" element={<ProtectedRoute element={Epag_article} />} />
            <Route path="/epaggelmatias_personal_info" element={<ProtectedRoute element={Epag_pinformation} />} />
            <Route path="/epaggelmatias_profile" element={<ProtectedRoute element={Epag_profile} />} />
            <Route path="/epaggelmatias_settings" element={<ProtectedRoute element={Epag_settings} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ContextProvider>
  );
}

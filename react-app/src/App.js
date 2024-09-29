import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute.js';

import HomePage from "./pages/HomePage.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Epag_Home from "./pages/Epag_Home.js";
import Epag_article from "./pages/Epag_article.js";
import Epag_job_ad from "./pages/Epag_job_ad.js";
import Epag_messages from "./pages/Epag_messages.js";
import Epag_network from "./pages/Epag_network.js";
import Epag_network_profile from "./pages/Epag_network_profile.js";
import Epag_notifications from "./pages/Epag_notifications.js";
import Epag_pinformation from "./pages/Epag_pinformation.js";
import Epag_settings from "./pages/Epag_settings.js";
import Diax_Home from "./pages/Diax_Home.js";
import About from "./pages/About.js";
import Communication from "./pages/Communication.js";
import CooPolicy from "./pages/CooPolicy.js";
import FAQ from "./pages/FAQ.js";
import Help from "./pages/Help.js";
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
            <Route path="/communication" element={<Communication />} />
            <Route path="/community_policies" element={<CooPolicy />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/help_center" element={<Help />} />
            <Route path="/privacy_policy" element={<Pripolicy />} />
            <Route path="/terms_and_conditions" element={<Terms />} />
            <Route path="/about" element={<About />} />

            {/* Protected Routes */}
            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute element={Diax_Home} requiredRole="admin" />}/>
            <Route path="/admin_user" element={<ProtectedRoute element={Admin_user} requiredRole="admin" />}/>

            {/* User */}
            <Route path="/epaggelmatias_homepage" element={<ProtectedRoute element={Epag_Home} requiredRole="user" />} />
            <Route path="/user_profile" element={<ProtectedRoute element={Epag_network_profile} requiredRole="user"/>} />
            <Route path="/epaggelmatias_article/:id" element={<ProtectedRoute element={Epag_article} requiredRole="user"/>} />
            <Route path="/epaggelmatias_aggelies" element={<ProtectedRoute element={Epag_job_ad} requiredRole="user"/>} />
            <Route path="/epaggelmatias_aggelies/user_profile" element={<ProtectedRoute element={Epag_network_profile} requiredRole="user"/>} />
            <Route path="/epaggelmatias_messages" element={<ProtectedRoute element={Epag_messages} requiredRole="user"/>} />
            <Route path="/epaggelmatias_network" element={<ProtectedRoute element={Epag_network}requiredRole="user" />} />
            <Route path="/epaggelmatias_network/user_profile" element={<ProtectedRoute element={Epag_network_profile} requiredRole="user"/>} />
            <Route path="/epaggelmatias_notifications" element={<ProtectedRoute element={Epag_notifications} requiredRole="user"/>} />
            <Route path="/epaggelmatias_notifications/user_profile" element={<ProtectedRoute element={Epag_network_profile} requiredRole="user"/>} />
            <Route path="/epaggelmatias_notifications/epaggelmatias_article/:id" element={<ProtectedRoute element={Epag_article} requiredRole="user"/>} />
            <Route path="/epaggelmatias_personal_info" element={<ProtectedRoute element={Epag_pinformation} requiredRole="user"/>} />
            <Route path="/epaggelmatias_settings" element={<ProtectedRoute element={Epag_settings} requiredRole="user"/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </ContextProvider>
  );
}

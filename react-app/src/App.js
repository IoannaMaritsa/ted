import './App.css';
import React from "react"
import {BrowserRouter} from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage.js";
import Diax_Home from "./pages/Diax_Home.js";

export default function App() {
  return(
    <div className="App"> 
    <BrowserRouter>
    <Routes>
      <Route path="/" element = {<HomePage />} /> 
      <Route path="/admin" element = {<Diax_Home />} /> 
    </Routes>
    </BrowserRouter>
    </div>
  )
}

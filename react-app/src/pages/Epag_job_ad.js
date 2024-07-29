import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Breadcrumbs from "../components/Breadcrumbs";
import '../css/home-page.css';

export default function Epag_job_ad() {
  return(
    <div>
      <Header variant="professional" />
      <Breadcrumbs />
      <div className="main">
        
      </div>
      <MainBottom />
      <Footer />
    </div>
  )
}

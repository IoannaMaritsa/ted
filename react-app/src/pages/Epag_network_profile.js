import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Breadcrumbs from "../components/Breadcrumbs";
import '../css/epag-network.css';
import { useState, useMemo } from 'react';


export default function Epag_network_profile() {
    return(
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
        </div>
    );
}
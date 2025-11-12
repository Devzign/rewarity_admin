import React from "react";
import { Link } from "react-router-dom";
import HeaderMobile from "../../layouts/HeaderMobile";
import Footer from "../../layouts/Footer";

export default function Colors() {
  return (
    <React.Fragment>
      <HeaderMobile />
      <div className="main p-4 p-lg-5">
        <ol className="breadcrumb fs-sm mb-2">
          <li className="breadcrumb-item"><Link to="#">Admin</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Colors</li>
        </ol>
        <h2 className="main-title">Colors</h2>
        <p className="text-secondary">Manage available color options.</p>
      </div>
      <Footer />
    </React.Fragment>
  );
}


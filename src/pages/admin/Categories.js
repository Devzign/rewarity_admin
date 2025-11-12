import React from "react";
import { Link } from "react-router-dom";
import HeaderMobile from "../../layouts/HeaderMobile";
import Footer from "../../layouts/Footer";

export default function Categories() {
  return (
    <React.Fragment>
      <HeaderMobile />
      <div className="main p-4 p-lg-5">
        <ol className="breadcrumb fs-sm mb-2">
          <li className="breadcrumb-item"><Link to="#">Admin</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Categories</li>
        </ol>
        <h2 className="main-title">Categories</h2>
        <p className="text-secondary">Organize your products into categories.</p>
      </div>
      <Footer />
    </React.Fragment>
  );
}


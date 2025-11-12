import React from "react";
import { Link } from "react-router-dom";
import HeaderMobile from "../../layouts/HeaderMobile";
import Footer from "../../layouts/Footer";

export default function Orders() {
  return (
    <React.Fragment>
      <HeaderMobile />
      <div className="main p-4 p-lg-5">
        <ol className="breadcrumb fs-sm mb-2">
          <li className="breadcrumb-item"><Link to="#">Admin</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Orders & Purchases</li>
        </ol>
        <h2 className="main-title">Orders & Purchases</h2>
        <p className="text-secondary">Track orders and purchases here.</p>
      </div>
      <Footer />
    </React.Fragment>
  );
}


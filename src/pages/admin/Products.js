import React from "react";
import { Link } from "react-router-dom";
import HeaderMobile from "../../layouts/HeaderMobile";
import Footer from "../../layouts/Footer";

export default function Products() {
  return (
    <React.Fragment>
      <HeaderMobile />
      <div className="main p-4 p-lg-5">
        <ol className="breadcrumb fs-sm mb-2">
          <li className="breadcrumb-item"><Link to="#">Admin</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Products</li>
        </ol>
        <div className="d-flex align-items-center gap-2 mb-2">
          <i className="ri-shopping-bag-line" style={{ fontSize: 24 }}></i>
          <h2 className="main-title mb-0">Products</h2>
        </div>
        <p className="text-secondary">Create, edit, and manage products.</p>
      </div>
      <Footer />
    </React.Fragment>
  );
}

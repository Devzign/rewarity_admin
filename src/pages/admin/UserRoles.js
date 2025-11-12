import React from "react";
import { Link } from "react-router-dom";
import HeaderMobile from "../../layouts/HeaderMobile";
import Footer from "../../layouts/Footer";

export default function UserRoles() {
  return (
    <React.Fragment>
      <HeaderMobile />
      <div className="main p-4 p-lg-5">
        <ol className="breadcrumb fs-sm mb-2">
          <li className="breadcrumb-item"><Link to="#">Admin</Link></li>
          <li className="breadcrumb-item active" aria-current="page">User Roles</li>
        </ol>
        <h2 className="main-title">User Roles</h2>
        <p className="text-secondary">Define and manage user roles and permissions.</p>
      </div>
      <Footer />
    </React.Fragment>
  );
}


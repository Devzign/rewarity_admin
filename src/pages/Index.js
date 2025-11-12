import React from "react";
import { Link } from "react-router-dom";
import Footer from "../layouts/Footer";

export default function Index() {
  return (
    <React.Fragment>
      <div className="main p-0">
        <div className="p-5 p-lg-6 text-center bg-success bg-gradient text-white rounded-4 mx-3 mx-lg-5 mt-4">
          <h1 className="mb-2">Rewarity</h1>
          <p className="mb-4 lead">Loyalty & Rewards Platform for Distributors and Dealers. Run geo‑fenced schemes, track purchases, and reward automatically.</p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="#features" className="btn btn-outline-light">Explore Features</Link>
            <Link to="/pages/signin" className="btn btn-light text-success">Admin Login</Link>
          </div>
        </div>

        <div id="features" className="row g-3 p-4 p-lg-5">
          <div className="col-sm-6 col-lg-3">
            <Link to="/dashboard/analytics" className="card card-one h-100 text-decoration-none">
              <div className="card-body d-flex align-items-center">
                <i className="ri-bar-chart-2-line fs-3 me-3"></i>
                <div>
                  <h6 className="mb-1">Website Analytics</h6>
                  <span className="text-muted">View traffic and conversions</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-sm-6 col-lg-3">
            <Link to="/apps/calendar" className="card card-one h-100 text-decoration-none">
              <div className="card-body d-flex align-items-center">
                <i className="ri-calendar-event-line fs-3 me-3"></i>
                <div>
                  <h6 className="mb-1">Calendar</h6>
                  <span className="text-muted">Manage events and tasks</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-sm-6 col-lg-3">
            <Link to="/apps/email" className="card card-one h-100 text-decoration-none">
              <div className="card-body d-flex align-items-center">
                <i className="ri-mail-line fs-3 me-3"></i>
                <div>
                  <h6 className="mb-1">Email</h6>
                  <span className="text-muted">Check your inbox</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-sm-6 col-lg-3">
            <Link to="/pages/settings" className="card card-one h-100 text-decoration-none">
              <div className="card-body d-flex align-items-center">
                <i className="ri-settings-3-line fs-3 me-3"></i>
                <div>
                  <h6 className="mb-1">Settings</h6>
                  <span className="text-muted">Update preferences</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HeaderMobile from "../../layouts/HeaderMobile";
import Footer from "../../layouts/Footer";
import { listUsers, assignManager, getSubordinates, mapDealerDistributor, mapDistributorSalesman, mapDealerSalesman } from "../../services/users";

export default function UserMapping() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dealerId, setDealerId] = useState("");
  const [distributorId, setDistributorId] = useState("");
  const [salesmanId, setSalesmanId] = useState("");

  const [managerOfId, setManagerOfId] = useState("");
  const [managerId, setManagerId] = useState("");

  const [subsUserId, setSubsUserId] = useState("");
  const [subordinates, setSubordinates] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  function normalizeList(data) {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    if (data?.results && Array.isArray(data.results)) return data.results;
    return [];
  }

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await listUsers({ page: 1, limit: 200 });
      const list = normalizeList(data);
      setUsers(list);
    } catch (e) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  function getType(u) {
    const t = (u.userType && (u.userType.name || u.userType.title)) || u.typeName || u.type || u.role || '';
    return String(t);
  }
  const dealers = useMemo(() => users.filter(u => getType(u) === 'Dealer'), [users]);
  const distributors = useMemo(() => users.filter(u => getType(u) === 'Distributor'), [users]);
  const salesmen = useMemo(() => users.filter(u => {
    const t = getType(u);
    return t === 'Salesman' || t.toLowerCase() === 'salesman';
  }), [users]);

  function resetAlerts() { setError(""); setSuccess(""); }

  async function doMapDealerDistributor() {
    resetAlerts();
    try {
      if (!dealerId || !distributorId) throw new Error('Select dealer and distributor');
      await mapDealerDistributor({ dealerId, distributorId });
      setSuccess('Mapped Dealer to Distributor');
    } catch (e) {
      setError(e.message || 'Failed to map dealer to distributor');
    }
  }

  async function doMapDistributorSalesman() {
    resetAlerts();
    try {
      if (!distributorId || !salesmanId) throw new Error('Select distributor and salesman');
      await mapDistributorSalesman({ distributorId, salesmanId });
      setSuccess('Mapped Salesman to Distributor');
    } catch (e) {
      setError(e.message || 'Failed to map salesman to distributor');
    }
  }

  async function doMapDealerSalesman() {
    resetAlerts();
    try {
      if (!dealerId || !salesmanId) throw new Error('Select dealer and salesman');
      await mapDealerSalesman({ dealerId, salesmanId });
      setSuccess('Mapped Salesman to Dealer');
    } catch (e) {
      setError(e.message || 'Failed to map salesman to dealer');
    }
  }

  async function doAssignManager(clear = false) {
    resetAlerts();
    try {
      if (!managerOfId) throw new Error('Select user to assign manager to');
      await assignManager(managerOfId, clear ? null : managerId);
      setSuccess(clear ? 'Cleared manager' : 'Assigned manager');
    } catch (e) {
      setError(e.message || 'Failed to assign/clear manager');
    }
  }

  async function doLoadSubordinates() {
    setLoadingSubs(true);
    resetAlerts();
    try {
      if (!subsUserId) throw new Error('Select a user');
      const data = await getSubordinates(subsUserId);
      setSubordinates(normalizeList(data));
    } catch (e) {
      setError(e.message || 'Failed to load subordinates');
    } finally {
      setLoadingSubs(false);
    }
  }

  function renderUserOption(u) {
    const id = u._id || u.id;
    const name = u.userName || u.name || u.email || id;
    const type = getType(u);
    return <option key={id} value={id}>{name} {type ? `(${type})` : ''}</option>
  }

  return (
    <React.Fragment>
      <HeaderMobile />
      <div className="main p-4 p-lg-5">
        <ol className="breadcrumb fs-sm mb-2">
          <li className="breadcrumb-item"><Link to="#">Admin</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Map Users</li>
        </ol>
        <h2 className="main-title">Map Users</h2>
        <p className="text-secondary">Assign relationships between Dealers, Distributors and Salesmen; manage managers and view subordinates.</p>

        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="ri-error-warning-line me-2"></i>
            <div>{error}</div>
          </div>
        )}
        {success && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <i className="ri-checkbox-circle-line me-2"></i>
            <div>{success}</div>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Select Users</h6>
            {loading && <span className="text-muted">Loading users...</span>}
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Dealer</label>
                <select className="form-select" value={dealerId} onChange={(e) => setDealerId(e.target.value)} disabled={loading}>
                  <option value="">Select Dealer</option>
                  {dealers.map(renderUserOption)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Distributor</label>
                <select className="form-select" value={distributorId} onChange={(e) => setDistributorId(e.target.value)} disabled={loading}>
                  <option value="">Select Distributor</option>
                  {distributors.map(renderUserOption)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Salesman</label>
                <select className="form-select" value={salesmanId} onChange={(e) => setSalesmanId(e.target.value)} disabled={loading}>
                  <option value="">Select Salesman</option>
                  {salesmen.map(renderUserOption)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-header"><h6 className="mb-0">Dealer → Distributor</h6></div>
              <div className="card-body d-grid gap-2">
                <button className="btn btn-primary" onClick={doMapDealerDistributor} disabled={!dealerId || !distributorId}>Map Dealer to Distributor</button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-header"><h6 className="mb-0">Salesman → Distributor</h6></div>
              <div className="card-body d-grid gap-2">
                <button className="btn btn-primary" onClick={doMapDistributorSalesman} disabled={!salesmanId || !distributorId}>Map Salesman to Distributor</button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-header"><h6 className="mb-0">Salesman → Dealer</h6></div>
              <div className="card-body d-grid gap-2">
                <button className="btn btn-primary" onClick={doMapDealerSalesman} disabled={!salesmanId || !dealerId}>Map Salesman to Dealer</button>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header"><h6 className="mb-0">Assign Manager</h6></div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">User</label>
                    <select className="form-select" value={managerOfId} onChange={(e) => setManagerOfId(e.target.value)} disabled={loading}>
                      <option value="">Select user</option>
                      {users.map(renderUserOption)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Manager</label>
                    <select className="form-select" value={managerId} onChange={(e) => setManagerId(e.target.value)} disabled={loading}>
                      <option value="">Select manager</option>
                      {users.map(renderUserOption)}
                    </select>
                  </div>
                  <div className="col-12 d-flex gap-2 justify-content-end">
                    <button className="btn btn-secondary" onClick={() => doAssignManager(true)} disabled={!managerOfId}>Clear Manager</button>
                    <button className="btn btn-primary" onClick={() => doAssignManager(false)} disabled={!managerOfId || !managerId}>Assign Manager</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">View Subordinates</h6>
                {loadingSubs && <span className="text-muted">Loading...</span>}
              </div>
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-md-8">
                    <label className="form-label">User</label>
                    <select className="form-select" value={subsUserId} onChange={(e) => setSubsUserId(e.target.value)} disabled={loading}>
                      <option value="">Select user</option>
                      {users.map(renderUserOption)}
                    </select>
                  </div>
                  <div className="col-md-4 d-grid">
                    <button className="btn btn-outline-primary" onClick={doLoadSubordinates} disabled={!subsUserId}>Load</button>
                  </div>
                </div>

                <div className="table-responsive mt-3">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subordinates.length === 0 && (
                        <tr><td colSpan="4" className="text-center p-3 text-muted">No subordinates</td></tr>
                      )}
                      {subordinates.map((u, i) => (
                        <tr key={(u._id || u.id || i)}>
                          <td>{i + 1}</td>
                          <td>{u.userName || u.name || '-'}</td>
                          <td>{u.email || '-'}</td>
                          <td>{(u.userType && (u.userType.name || u.userType.title)) || u.typeName || u.type || u.role || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </React.Fragment>
  );
}

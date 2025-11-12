import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderMobile from "../../layouts/HeaderMobile";
import Footer from "../../layouts/Footer";
import { getUserTypes } from "../../services/userTypes";
import { createUser, listUsers } from "../../services/users";

export default function UserManagement() {
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    userName: "",
    primaryMobile: "",
    typeName: "",
    email: "",
    address1: "",
    address2: "",
    cityName: "",
  });

  // Listing state
  const [users, setUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  function setField(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function loadTypes() {
    setLoadingTypes(true);
    setError("");
    try {
      const data = await getUserTypes();
      const list = Array.isArray(data) ? data : data?.data || [];
      setTypes(list);
      // Default selection
      if (list.length && !form.typeName) {
        const firstName = (list[0].name || list[0].title || list[0].type || "");
        if (firstName) setField('typeName', firstName);
      }
    } catch (e) {
      setError(e.message || "Failed to load user types");
    } finally {
      setLoadingTypes(false);
    }
  }

  useEffect(() => { loadTypes(); /* eslint-disable-next-line */ }, []);

  function normalizeListPayload(data) {
    // Accept various shapes from backend
    const items = Array.isArray(data)
      ? data
      : data?.data || data?.items || data?.results || [];
    const t = data?.total || data?.count || data?.totalCount || (Array.isArray(items) ? items.length : 0);
    const p = data?.page || page;
    const l = data?.limit || limit;
    return { items: Array.isArray(items) ? items : [], total: Number(t) || 0, page: Number(p) || page, limit: Number(l) || limit };
  }

  async function loadUsersList(next = { page, limit, search }) {
    setLoadingList(true);
    setError("");
    try {
      const params = { page: next.page, limit: next.limit };
      if (next.search) params.search = next.search;
      const data = await listUsers(params);
      const { items, total: t, page: p, limit: l } = normalizeListPayload(data);
      setUsers(items);
      setTotal(t);
      setPage(p);
      setLimit(l);
    } catch (e) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadUsersList({ page, limit, search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const payload = { ...form };
      await createUser(payload);
      setSuccess("User created successfully");
      setForm({ userName: "", primaryMobile: "", typeName: "", email: "", address1: "", address2: "", cityName: "" });
      // Retain selection list
    } catch (e) {
      setError(e.message || "Failed to create user");
    }
  }

  return (
    <React.Fragment>
      <HeaderMobile />
      <div className="main p-4 p-lg-5">
        <ol className="breadcrumb fs-sm mb-2">
          <li className="breadcrumb-item"><Link to="#">Admin</Link></li>
          <li className="breadcrumb-item active" aria-current="page">User Management</li>
        </ol>
        <h2 className="main-title">User Management</h2>
        <p className="text-secondary">Create users and manage assignments.</p>

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
          <div className="card-header"><h6 className="mb-0">Create User</h6></div>
          <div className="card-body">
            <form className="row g-3" onSubmit={handleCreate}>
              <div className="col-md-4">
                <label className="form-label">User Name</label>
                <input className="form-control" value={form.userName} onChange={(e) => setField('userName', e.target.value)} placeholder="Full name" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Primary Mobile</label>
                <input className="form-control" value={form.primaryMobile} onChange={(e) => setField('primaryMobile', e.target.value)} placeholder="e.g., 9876543210" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="email@example.com" />
              </div>

              <div className="col-md-4">
                <label className="form-label">User Type</label>
                <select className="form-select" value={form.typeName} onChange={(e) => setField('typeName', e.target.value)} disabled={loadingTypes || types.length === 0} required>
                  {loadingTypes && <option>Loading...</option>}
                  {!loadingTypes && types.length === 0 && <option value="">No types available</option>}
                  {!loadingTypes && types.map((t) => {
                    const id = t._id || t.id;
                    const name = t.name || t.title || t.type || '';
                    return <option key={id || name} value={name}>{name}</option>
                  })}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Address 1</label>
                <input className="form-control" value={form.address1} onChange={(e) => setField('address1', e.target.value)} placeholder="Address line 1" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Address 2</label>
                <input className="form-control" value={form.address2} onChange={(e) => setField('address2', e.target.value)} placeholder="Address line 2" />
              </div>

              <div className="col-md-4">
                <label className="form-label">City</label>
                <input className="form-control" value={form.cityName} onChange={(e) => setField('cityName', e.target.value)} placeholder="City name" />
              </div>

              <div className="col-md-12 d-flex justify-content-end">
                <button className="btn btn-primary" type="submit" disabled={!form.userName || !form.primaryMobile || !form.typeName}>Create User</button>
              </div>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <h6 className="mb-0">Users</h6>
            <form className="d-flex gap-2" onSubmit={(e) => { e.preventDefault(); setPage(1); loadUsersList({ page: 1, limit, search }); }}>
              <input
                className="form-control"
                placeholder="Search by name, email, mobile"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: 260 }}
              />
              <button className="btn btn-outline-primary" type="submit" disabled={loadingList}>Search</button>
            </form>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style={{width: '60px'}}>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingList && (
                    <tr><td colSpan="5" className="p-4 text-center text-muted">Loading...</td></tr>
                  )}
                  {!loadingList && users.length === 0 && (
                    <tr><td colSpan="5" className="p-4 text-center text-muted">No users found</td></tr>
                  )}
                  {!loadingList && users.map((u, i) => (
                    <tr key={u._id || u.id || i}>
                      <td>{(page - 1) * limit + i + 1}</td>
                      <td>{u.userName || u.name || '-'}</td>
                      <td>{u.email || '-'}</td>
                      <td>{u.primaryMobile || u.mobile || '-'}</td>
                      <td>{(u.userType && (u.userType.name || u.userType.title)) || u.typeName || u.type || u.role || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted">Rows per page</span>
              <select className="form-select" style={{ width: 90 }} value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
                {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">{total ? `Total: ${total}` : ''}</span>
              <div className="btn-group">
                <button className="btn btn-outline-secondary" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>Prev</button>
                <button className="btn btn-outline-secondary" onClick={() => setPage(page + 1)} disabled={total ? (page >= Math.ceil(total / limit)) : (users.length < limit)}>Next</button>
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </React.Fragment>
  );
}

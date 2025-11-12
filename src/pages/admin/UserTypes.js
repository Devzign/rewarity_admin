import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderMobile from "../../layouts/HeaderMobile";
import Footer from "../../layouts/Footer";
import { getUserTypes, createUserType, updateUserType, deleteUserType } from "../../services/userTypes";

export default function UserTypes() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getUserTypes();
      setTypes(Array.isArray(data) ? data : data?.data || []);
    } catch (e) {
      setError(e.message || "Failed to load user types");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const payload = { name: newName };
      if (newDesc) payload.description = newDesc;
      await createUserType(payload);
      setNewName("");
      setNewDesc("");
      setSuccess("User type created");
      load();
    } catch (e) {
      setError(e.message || "Failed to create user type");
    }
  }

  function startEdit(t) {
    setEditingId(t._id || t.id);
    setEditName(t.name || t.title || t.type || "");
    setEditDesc(t.description || t.desc || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditDesc("");
  }

  async function saveEdit(id) {
    setError("");
    setSuccess("");
    try {
      const payload = { name: editName };
      if (editDesc) payload.description = editDesc;
      await updateUserType(id, payload);
      setSuccess("User type updated");
      cancelEdit();
      load();
    } catch (e) {
      setError(e.message || "Failed to update user type");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user type?")) return;
    setError("");
    setSuccess("");
    try {
      await deleteUserType(id);
      setSuccess("User type deleted");
      load();
    } catch (e) {
      setError(e.message || "Failed to delete user type");
    }
  }

  return (
    <React.Fragment>
      <HeaderMobile />
      <div className="main p-4 p-lg-5">
        <ol className="breadcrumb fs-sm mb-2">
          <li className="breadcrumb-item"><Link to="#">Admin</Link></li>
          <li className="breadcrumb-item active" aria-current="page">User Types</li>
        </ol>
        <h2 className="main-title">User Types</h2>
        <p className="text-secondary">List, create, update and delete user types.</p>

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
          <div className="card-header"><h6 className="mb-0">Create User Type</h6></div>
          <div className="card-body">
            <form className="row g-3" onSubmit={handleCreate}>
              <div className="col-md-4">
                <label className="form-label">Name</label>
                <input className="form-control" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g., Admin, Vendor" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Description (optional)</label>
                <input className="form-control" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Short description" />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button className="btn btn-primary w-100" type="submit" disabled={!newName}>Add</button>
              </div>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Existing User Types</h6>
            {loading && <span className="text-muted">Loading...</span>}
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style={{width: '38px'}}>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th style={{width: '220px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {types.length === 0 && !loading && (
                    <tr><td colSpan="4" className="text-center p-4 text-muted">No user types found</td></tr>
                  )}
                  {types.map((t, i) => {
                    const id = t._id || t.id;
                    const name = t.name || t.title || t.type || '';
                    const desc = t.description || t.desc || '';
                    const isEdit = editingId === id;
                    return (
                      <tr key={id || i}>
                        <td>{i + 1}</td>
                        <td>
                          {isEdit ? (
                            <input className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} />
                          ) : (
                            <span>{name}</span>
                          )}
                        </td>
                        <td>
                          {isEdit ? (
                            <input className="form-control" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                          ) : (
                            <span className="text-muted">{desc}</span>
                          )}
                        </td>
                        <td className="d-flex gap-2">
                          {isEdit ? (
                            <>
                              <button className="btn btn-success btn-sm" onClick={() => saveEdit(id)} disabled={!editName}>Save</button>
                              <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button className="btn btn-outline-primary btn-sm" onClick={() => startEdit({ ...t, id })}>Edit</button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(id)}>Delete</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
}


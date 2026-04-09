import React, { useEffect, useState } from 'react';
import { dishTypesAPI } from '../api';
import Modal from '../components/Modal';

const PRESETS = ['Biscuits', 'Braai', 'Bread', 'Cakes', 'Curries', 'Desserts', 'Pasta', 'Pizza'];

export default function DishTypesPage() {
  const [types, setTypes] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => dishTypesAPI.getAll().then((r) => { setTypes(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setName(''); setError(''); setModal(true); };
  const openEdit = (t) => { setEditing(t); setName(t.name); setError(''); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) await dishTypesAPI.update(editing.id, { name });
      else await dishTypesAPI.create({ name });
      setModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dish type?')) return;
    await dishTypesAPI.remove(id);
    load();
  };

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Dish Types</h2>
          <p className="page-subtitle">Manage dish categories</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Type</button>
      </div>

      {types.length === 0 ? (
        <div className="empty-state">
          <span>🗂️</span>
          <p>No dish types yet.</p>
          <div className="preset-list">
            <p className="preset-hint">Quick add presets:</p>
            {PRESETS.map((p) => (
              <button key={p} className="btn btn-sm btn-outline" onClick={async () => {
                await dishTypesAPI.create({ name: p }); load();
              }}>{p}</button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Dishes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {types.map((t, i) => (
                  <tr key={t.id}>
                    <td>{i + 1}</td>
                    <td><strong>{t.name}</strong></td>
                    <td><span className="badge">{t.dishes?.length || 0} dishes</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-sm btn-outline" onClick={() => openEdit(t)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Dish Type' : 'Add Dish Type'}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus placeholder="e.g. Pizza" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

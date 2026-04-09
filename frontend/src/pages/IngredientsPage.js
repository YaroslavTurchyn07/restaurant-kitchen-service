import React, { useEffect, useState } from 'react';
import { ingredientsAPI } from '../api';
import Modal from '../components/Modal';

const UNITS = ['kg', 'g', 'l', 'ml', 'pcs', 'tbsp', 'tsp', 'cup'];
const EMPTY = { name: '', unit: 'pcs' };

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => ingredientsAPI.getAll().then((r) => { setIngredients(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit = (i) => { setEditing(i); setForm({ name: i.name, unit: i.unit }); setError(''); setModal(true); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) await ingredientsAPI.update(editing.id, form);
      else await ingredientsAPI.create(form);
      setModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ingredient?')) return;
    await ingredientsAPI.remove(id);
    load();
  };

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Ingredients</h2>
          <p className="page-subtitle">{ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Ingredient</button>
      </div>

      <div className="search-bar">
        <input
          placeholder="Search ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>🥕</span>
          <p>{search ? 'No ingredients found.' : 'No ingredients yet. Add your first!'}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ing, i) => (
                <tr key={ing.id}>
                  <td>{i + 1}</td>
                  <td><strong>{ing.name}</strong></td>
                  <td><span className="badge badge--unit">{ing.unit}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(ing)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ing.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Ingredient' : 'Add Ingredient'}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required autoFocus placeholder="e.g. Flour" />
          </div>
          <div className="form-group">
            <label>Unit *</label>
            <select name="unit" value={form.unit} onChange={handleChange}>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
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

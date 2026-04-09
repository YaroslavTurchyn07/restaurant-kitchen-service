import React, { useEffect, useState } from 'react';
import { dishesAPI, dishTypesAPI, cooksAPI, ingredientsAPI } from '../api';
import Modal from '../components/Modal';

const EMPTY = { name: '', description: '', price: '', dish_type_id: '', cook_ids: [], ingredient_ids: [] };

export default function DishesPage() {
  const [dishes, setDishes] = useState([]);
  const [dishTypes, setDishTypes] = useState([]);
  const [cooks, setCooks] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [d, dt, c, ing] = await Promise.all([
      dishesAPI.getAll(), dishTypesAPI.getAll(), cooksAPI.getAll(), ingredientsAPI.getAll(),
    ]);
    setDishes(d.data);
    setDishTypes(dt.data);
    setCooks(c.data);
    setIngredients(ing.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit = (dish) => {
    setEditing(dish);
    setForm({
      name: dish.name,
      description: dish.description || '',
      price: dish.price,
      dish_type_id: dish.dish_type_id || '',
      cook_ids: dish.cooks?.map((c) => c.id) || [],
      ingredient_ids: dish.ingredients?.map((i) => i.id) || [],
    });
    setError('');
    setModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleMulti = (field, id) => {
    const list = form[field];
    setForm({ ...form, [field]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, price: parseFloat(form.price), dish_type_id: parseInt(form.dish_type_id) };
      if (editing) await dishesAPI.update(editing.id, payload);
      else await dishesAPI.create(payload);
      setModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dish?')) return;
    await dishesAPI.remove(id);
    load();
  };

  if (loading) return <div className="page-loading">Loading dishes...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Dishes</h2>
          <p className="page-subtitle">{dishes.length} dish{dishes.length !== 1 ? 'es' : ''} on the menu</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Dish</button>
      </div>

      {dishes.length === 0 ? (
        <div className="empty-state">
          <span>🍽️</span>
          <p>No dishes yet. Add your first dish!</p>
        </div>
      ) : (
        <div className="cards-grid">
          {dishes.map((dish) => (
            <div key={dish.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{dish.name}</h3>
                <span className="badge">{dish.dishType?.name || 'No type'}</span>
              </div>
              {dish.description && <p className="card-desc">{dish.description}</p>}
              <p className="card-price">${Number(dish.price).toFixed(2)}</p>
              {dish.cooks?.length > 0 && (
                <div className="card-meta">
                  <span className="meta-label">Cooks:</span>
                  {dish.cooks.map((c) => (
                    <span key={c.id} className="chip">{c.first_name} {c.last_name}</span>
                  ))}
                </div>
              )}
              {dish.ingredients?.length > 0 && (
                <div className="card-meta">
                  <span className="meta-label">Ingredients:</span>
                  {dish.ingredients.map((i) => (
                    <span key={i.id} className="chip chip--green">{i.name}</span>
                  ))}
                </div>
              )}
              <div className="card-actions">
                <button className="btn btn-sm btn-outline" onClick={() => openEdit(dish)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dish.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Dish' : 'Add Dish'}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Dish Type *</label>
              <select name="dish_type_id" value={form.dish_type_id} onChange={handleChange} required>
                <option value="">Select type...</option>
                {dishTypes.map((dt) => <option key={dt.id} value={dt.id}>{dt.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Cooks</label>
            <div className="checkbox-list">
              {cooks.map((c) => (
                <label key={c.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={form.cook_ids.includes(c.id)}
                    onChange={() => toggleMulti('cook_ids', c.id)}
                  />
                  {c.first_name} {c.last_name} (@{c.username})
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Ingredients</label>
            <div className="checkbox-list">
              {ingredients.map((i) => (
                <label key={i.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={form.ingredient_ids.includes(i.id)}
                    onChange={() => toggleMulti('ingredient_ids', i.id)}
                  />
                  {i.name} ({i.unit})
                </label>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Create Dish'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

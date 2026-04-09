import React, { useEffect, useState } from 'react';
import { cooksAPI } from '../api';
import { useAuth } from '../context/AuthContext';

export default function CooksPage() {
  const { cook: me } = useAuth();
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => cooksAPI.getAll().then((r) => { setCooks(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  if (loading) return <div className="page-loading">Loading cooks...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Kitchen Team</h2>
          <p className="page-subtitle">{cooks.length} cook{cooks.length !== 1 ? 's' : ''} in the team</p>
        </div>
      </div>

      {cooks.length === 0 ? (
        <div className="empty-state">
          <span>👨‍🍳</span>
          <p>No cooks registered yet.</p>
        </div>
      ) : (
        <div className="cards-grid cards-grid--3">
          {cooks.map((c) => (
            <div key={c.id} className={`card cook-card ${c.id === me?.id ? 'cook-card--me' : ''}`}>
              <div className="cook-avatar">
                {c.first_name?.[0]}{c.last_name?.[0]}
              </div>
              <h3 className="cook-name">{c.first_name} {c.last_name}</h3>
              <p className="cook-username">@{c.username}</p>
              <p className="cook-email">{c.email}</p>
              <div className="cook-exp">
                <span className="badge badge--exp">{c.years_of_experience} yr{c.years_of_experience !== 1 ? 's' : ''} exp.</span>
                {c.id === me?.id && <span className="badge badge--me">You</span>}
              </div>
              {c.dishes?.length > 0 && (
                <div className="cook-dishes">
                  <p className="meta-label">Assigned dishes:</p>
                  {c.dishes.map((d) => (
                    <span key={d.id} className="chip">{d.name}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

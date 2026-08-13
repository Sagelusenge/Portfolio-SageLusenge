import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, LogOut, Mail, MessageSquare, RefreshCw, Reply, Trash2 } from 'lucide-react';
import { Page, Eyebrow } from '../components/Page';

const labels = { new: 'Nouveau', read: 'Lu', replied: 'Répondu', archived: 'Archivé' };

export default function Admin() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem('portfolio_session');

  async function api(path, options = {}) {
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers } });
    if (response.status === 401) { sessionStorage.removeItem('portfolio_session'); navigate('/connexion'); throw new Error('Session expirée.'); }
    if (!response.ok) throw new Error('Une opération a échoué.');
    return response.status === 204 ? null : response.json();
  }
  async function load() {
    setLoading(true);
    try { const data = await api(`/api/admin/messages${filter === 'all' ? '' : `?status=${filter}`}`); setMessages(data.messages); }
    finally { setLoading(false); }
  }
  useEffect(() => { if (!token) navigate('/connexion'); else load(); }, [filter]);
  async function changeStatus(id, status) { await api(`/api/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); setMessages(items => items.map(item => item.id === id ? { ...item, status } : item)); }
  async function remove(id) { if (!window.confirm('Supprimer définitivement ce message ?')) return; await api(`/api/admin/messages/${id}`, { method: 'DELETE' }); setMessages(items => items.filter(item => item.id !== id)); }
  function logout() { sessionStorage.removeItem('portfolio_session'); navigate('/connexion'); }

  return <Page><section className="admin-page section-wrap">
    <header className="admin-head"><div><Eyebrow>Espace administrateur</Eyebrow><h1>Messages reçus</h1><p>Consulte et organise les demandes envoyées depuis ton portfolio.</p></div><button className="button ghost" onClick={logout}><LogOut /> Déconnexion</button></header>
    <div className="admin-stats"><div><MessageSquare /><span><b>{messages.length}</b>message{messages.length !== 1 ? 's' : ''}</span></div><div><Mail /><span><b>{messages.filter(m => m.status === 'new').length}</b>nouveau{messages.filter(m => m.status === 'new').length !== 1 ? 'x' : ''}</span></div></div>
    <div className="admin-toolbar"><div>{['all', 'new', 'read', 'replied', 'archived'].map(item => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item === 'all' ? 'Tous' : labels[item]}</button>)}</div><button className="icon-button" onClick={load} aria-label="Actualiser"><RefreshCw /></button></div>
    {loading ? <div className="admin-empty">Chargement des messages…</div> : messages.length === 0 ? <div className="admin-empty"><MessageSquare /><h2>Aucun message ici.</h2><p>Les nouveaux messages apparaîtront automatiquement dans cet espace.</p></div> : <div className="message-list">{messages.map(item => <article className={`message-card ${item.status}`} key={item.id}><div className="message-top"><div className="sender-avatar">{item.name.charAt(0).toUpperCase()}</div><div><h2>{item.subject}</h2><p>{item.name} · <a href={`mailto:${item.email}`}>{item.email}</a></p></div><span className="status-pill">{labels[item.status]}</span></div><p className="message-body">{item.message}</p><footer><time>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(item.created_at))}</time><div>{item.status === 'new' && <button onClick={() => changeStatus(item.id, 'read')}>Marquer lu</button>}<a href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`} onClick={() => changeStatus(item.id, 'replied')}><Reply /> Répondre</a><button onClick={() => changeStatus(item.id, 'archived')}><Archive /> Archiver</button><button className="danger" onClick={() => remove(item.id)}><Trash2 /> Supprimer</button></div></footer></article>)}</div>}
  </section></Page>;
}

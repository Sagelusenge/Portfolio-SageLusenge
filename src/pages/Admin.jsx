import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, Check, Clock3, Inbox, LayoutDashboard, LogOut, Mail, Menu, MessageCircleHeart, Reply, Star, Trash2, X } from 'lucide-react';

const messageLabels = { new: 'Nouveau', read: 'Lu', replied: 'Répondu', archived: 'Archivé' };

export default function Admin() {
  const navigate = useNavigate();
  const [view, setView] = useState('dashboard');
  const [messages, setMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebar, setSidebar] = useState(false);
  const token = sessionStorage.getItem('portfolio_session');

  async function api(path, options = {}) {
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers } });
    if (response.status === 401) { sessionStorage.removeItem('portfolio_session'); navigate('/connexion'); throw new Error('Session expirée.'); }
    if (!response.ok) throw new Error('Une opération a échoué.');
    return response.status === 204 ? null : response.json();
  }
  async function load() {
    setLoading(true);
    try { const [messageData, feedbackData] = await Promise.all([api('/api/admin/messages'), api('/api/admin/feedbacks')]); setMessages(messageData.messages); setFeedbacks(feedbackData.feedbacks); }
    finally { setLoading(false); }
  }
  useEffect(() => { if (!token) navigate('/connexion'); else load(); }, []);
  const stats = useMemo(() => ({ messages: messages.length, newMessages: messages.filter(m => m.status === 'new').length, feedbacks: feedbacks.length, pending: feedbacks.filter(f => f.status === 'pending').length }), [messages, feedbacks]);
  async function messageStatus(id, status) { await api(`/api/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); setMessages(items => items.map(item => item.id === id ? { ...item, status } : item)); }
  async function feedbackStatus(id, status) { await api(`/api/admin/feedbacks/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); setFeedbacks(items => items.map(item => item.id === id ? { ...item, status } : item)); }
  async function remove(type, id) { if (!window.confirm('Supprimer définitivement cet élément ?')) return; await api(`/api/admin/${type}/${id}`, { method: 'DELETE' }); type === 'messages' ? setMessages(items => items.filter(i => i.id !== id)) : setFeedbacks(items => items.filter(i => i.id !== id)); }
  function select(next) { setView(next); setSidebar(false); }
  function logout() { sessionStorage.removeItem('portfolio_session'); navigate('/connexion'); }

  return <div className="admin-shell">
    <aside className={`admin-sidebar ${sidebar ? 'open' : ''}`}><div className="admin-brand"><span>SL</span><div><b>Sage Lusenge</b><small>Portfolio Admin</small></div><button onClick={() => setSidebar(false)}><X /></button></div><nav>
      <button className={view === 'dashboard' ? 'active' : ''} onClick={() => select('dashboard')}><LayoutDashboard /> Tableau de bord</button>
      <button className={view === 'messages' ? 'active' : ''} onClick={() => select('messages')}><Mail /> Messages {stats.newMessages > 0 && <em>{stats.newMessages}</em>}</button>
      <button className={view === 'feedbacks' ? 'active' : ''} onClick={() => select('feedbacks')}><MessageCircleHeart /> Feedbacks {stats.pending > 0 && <em>{stats.pending}</em>}</button>
    </nav><div className="sidebar-bottom"><a href="/" target="_blank">Voir le portfolio ↗</a><button onClick={logout}><LogOut /> Déconnexion</button></div></aside>
    {sidebar && <button className="sidebar-overlay" onClick={() => setSidebar(false)} aria-label="Fermer le menu" />}
    <main className="admin-main"><header className="admin-topbar"><button className="admin-menu" onClick={() => setSidebar(true)}><Menu /></button><div><span>Espace administrateur</span><h1>{view === 'dashboard' ? 'Tableau de bord' : view === 'messages' ? 'Messages' : 'Feedbacks'}</h1></div><div className="admin-profile"><span>SL</span><div><b>Sage Lusenge</b><small>Administrateur</small></div></div></header>
      <div className="admin-content">{loading ? <div className="admin-loader"><i /><p>Chargement de ton espace…</p></div> : <>
        {view === 'dashboard' && <Dashboard stats={stats} messages={messages} feedbacks={feedbacks} onNavigate={select} />}
        {view === 'messages' && <Messages messages={messages} changeStatus={messageStatus} remove={remove} />}
        {view === 'feedbacks' && <Feedbacks feedbacks={feedbacks} changeStatus={feedbackStatus} remove={remove} />}
      </>}</div>
    </main>
  </div>;
}

function Dashboard({ stats, messages, feedbacks, onNavigate }) {
  const cards = [[Mail, 'Messages', stats.messages, `${stats.newMessages} nouveau(x)`, 'cyan'], [MessageCircleHeart, 'Feedbacks', stats.feedbacks, `${stats.pending} en attente`, 'violet'], [Check, 'Avis publiés', feedbacks.filter(f => f.status === 'approved').length, 'Visibles sur le site', 'green']];
  return <><section className="dashboard-welcome"><div><span>Vue d’ensemble</span><h2>Bonjour Sage, voici ce qui se passe.</h2><p>Gère les échanges et la réputation de ton portfolio depuis un seul endroit.</p></div><i /></section><section className="dashboard-stats">{cards.map(([Icon,label,value,note,tone]) => <article className={tone} key={label}><div><Icon /></div><span>{label}</span><b>{value}</b><small>{note}</small></article>)}</section><section className="dashboard-grid"><div className="admin-panel"><header><div><h3>Messages récents</h3><p>Les dernières prises de contact</p></div><button onClick={() => onNavigate('messages')}>Tout voir →</button></header>{messages.slice(0,4).map(m => <div className="recent-row" key={m.id}><span>{m.name.charAt(0)}</span><div><b>{m.subject}</b><small>{m.name} · {formatDate(m.created_at)}</small></div><em className={m.status}>{messageLabels[m.status]}</em></div>)}{messages.length === 0 && <Empty text="Aucun message reçu." />}</div><div className="admin-panel"><header><div><h3>Feedbacks récents</h3><p>Ce que les gens pensent</p></div><button onClick={() => onNavigate('feedbacks')}>Tout voir →</button></header>{feedbacks.slice(0,4).map(f => <div className="recent-row" key={f.id}><span>{f.name.charAt(0)}</span><div><b>{f.name}</b><small>{'★'.repeat(f.rating)} · {formatDate(f.created_at)}</small></div><em className={f.status}>{f.status}</em></div>)}{feedbacks.length === 0 && <Empty text="Aucun feedback reçu." />}</div></section></>;
}

function Messages({ messages, changeStatus, remove }) { return <section className="admin-panel content-panel"><header><div><h3>Boîte de réception</h3><p>{messages.length} message{messages.length !== 1 ? 's' : ''} au total</p></div></header>{messages.length === 0 ? <Empty text="Aucun message pour le moment." /> : <div className="admin-items">{messages.map(m => <article className={`admin-item ${m.status}`} key={m.id}><div className="item-head"><span>{m.name.charAt(0)}</span><div><h3>{m.subject}</h3><p>{m.name} · <a href={`mailto:${m.email}`}>{m.email}</a></p></div><em>{messageLabels[m.status]}</em></div><p className="item-body">{m.message}</p><footer><time>{formatDate(m.created_at)}</time><div>{m.status === 'new' && <button onClick={() => changeStatus(m.id, 'read')}><Check /> Marquer lu</button>}<a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} onClick={() => changeStatus(m.id, 'replied')}><Reply /> Répondre</a><button onClick={() => changeStatus(m.id, 'archived')}><Archive /> Archiver</button><button className="danger" onClick={() => remove('messages', m.id)}><Trash2 /></button></div></footer></article>)}</div>}</section>; }

function Feedbacks({ feedbacks, changeStatus, remove }) { return <section className="admin-panel content-panel"><header><div><h3>Avis reçus</h3><p>Valide les retours avant leur publication</p></div></header>{feedbacks.length === 0 ? <Empty text="Aucun feedback pour le moment." /> : <div className="admin-items">{feedbacks.map(f => <article className={`admin-item feedback ${f.status}`} key={f.id}><div className="item-head"><span>{f.name.charAt(0)}</span><div><h3>{f.name}</h3><p>{f.role || 'Visiteur'} · {f.email}</p></div><em>{f.status}</em></div><div className="admin-rating">{[1,2,3,4,5].map(v => <Star key={v} className={v <= f.rating ? 'active' : ''} />)}</div><p className="item-body">“{f.message}”</p><footer><time>{formatDate(f.created_at)}</time><div>{f.status !== 'approved' && <button className="approve" onClick={() => changeStatus(f.id, 'approved')}><Check /> Publier</button>}{f.status !== 'rejected' && <button onClick={() => changeStatus(f.id, 'rejected')}><X /> Refuser</button>}<button className="danger" onClick={() => remove('feedbacks', f.id)}><Trash2 /></button></div></footer></article>)}</div>}</section>; }
function Empty({ text }) { return <div className="admin-empty"><Inbox /><p>{text}</p></div>; }
function formatDate(value) { return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, BarChart3, Check, Eye, FolderKanban, Inbox, LayoutDashboard, LogOut, Mail, Menu, MessageCircleHeart, Plus, Reply, Star, Trash2, X } from 'lucide-react';

const messageLabels = { new: 'Nouveau', read: 'Lu', replied: 'Répondu', archived: 'Archivé' };
const emptyProject = { title: '', category: '', description: '', stack: '', href: '', image_url: '', tone: 'cyan', published: true };

export default function Admin() {
  const navigate = useNavigate();
  const [view, setView] = useState('dashboard');
  const [messages, setMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [viewStats, setViewStats] = useState({ total: 0, today: 0, week: 0, daily: [] });
  const [loading, setLoading] = useState(true);
  const [sidebar, setSidebar] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const token = sessionStorage.getItem('portfolio_session');

  async function api(path, options = {}) {
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers } });
    if (response.status === 401) { sessionStorage.removeItem('portfolio_session'); navigate('/connexion'); throw new Error('Session expirée.'); }
    const data = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(data?.message || 'Une opération a échoué.');
    return data;
  }
  async function load() {
    setLoading(true);
    try {
      const [messageData, feedbackData, projectData, statsData] = await Promise.all([api('/api/admin/messages'), api('/api/admin/feedbacks'), api('/api/admin/projects'), api('/api/admin/stats')]);
      setMessages(messageData.messages); setFeedbacks(feedbackData.feedbacks); setProjects(projectData.projects); setViewStats(statsData.views);
    } finally { setLoading(false); }
  }
  useEffect(() => { if (!token) navigate('/connexion'); else load(); }, []);
  const stats = useMemo(() => ({ messages: messages.length, newMessages: messages.filter(m => m.status === 'new').length, feedbacks: feedbacks.length, pending: feedbacks.filter(f => f.status === 'pending').length, projects: projects.filter(p => p.published).length }), [messages, feedbacks, projects]);
  async function messageStatus(id, status) { await api(`/api/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); setMessages(items => items.map(item => item.id === id ? { ...item, status } : item)); }
  async function feedbackStatus(id, status) { await api(`/api/admin/feedbacks/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); setFeedbacks(items => items.map(item => item.id === id ? { ...item, status } : item)); }
  async function remove(type, id) { if (!window.confirm('Supprimer définitivement cet élément ?')) return; await api(`/api/admin/${type}/${id}`, { method: 'DELETE' }); if (type === 'messages') setMessages(items => items.filter(i => i.id !== id)); else if (type === 'feedbacks') setFeedbacks(items => items.filter(i => i.id !== id)); else setProjects(items => items.filter(i => i.id !== id)); }
  function select(next) { setView(next); setSidebar(false); }
  function logout() { sessionStorage.removeItem('portfolio_session'); navigate('/connexion'); }
  const titles = { dashboard: 'Tableau de bord', messages: 'Messages', feedbacks: 'Feedbacks', projects: 'Réalisations' };

  return <div className="admin-shell">
    <aside className={`admin-sidebar ${sidebar ? 'open' : ''}`}><div className="admin-brand"><span>SL</span><div><b>Sage Lusenge</b><small>Portfolio Admin</small></div><button onClick={() => setSidebar(false)}><X /></button></div><nav>
      <button className={view === 'dashboard' ? 'active' : ''} onClick={() => select('dashboard')}><LayoutDashboard /> Tableau de bord</button>
      <button className={view === 'messages' ? 'active' : ''} onClick={() => select('messages')}><Mail /> Messages {stats.newMessages > 0 && <em>{stats.newMessages}</em>}</button>
      <button className={view === 'feedbacks' ? 'active' : ''} onClick={() => select('feedbacks')}><MessageCircleHeart /> Feedbacks {stats.pending > 0 && <em>{stats.pending}</em>}</button>
      <button className={view === 'projects' ? 'active' : ''} onClick={() => select('projects')}><FolderKanban /> Réalisations</button>
    </nav><div className="sidebar-bottom"><a href="/" target="_blank">Voir le portfolio ↗</a><button onClick={() => setLogoutOpen(true)}><LogOut /> Déconnexion</button></div></aside>
    {sidebar && <button className="sidebar-overlay" onClick={() => setSidebar(false)} aria-label="Fermer le menu" />}
    <main className="admin-main"><header className="admin-topbar"><button className="admin-menu" onClick={() => setSidebar(true)}><Menu /></button><div><span>Espace administrateur</span><h1>{titles[view]}</h1></div><div className="admin-profile"><span>SL</span><div><b>Sage Lusenge</b><small>Administrateur</small></div></div></header>
      <div className="admin-content">{loading ? <div className="admin-loader"><i /><p>Chargement de ton espace…</p></div> : <>
        {view === 'dashboard' && <Dashboard stats={stats} views={viewStats} messages={messages} feedbacks={feedbacks} onNavigate={select} />}
        {view === 'messages' && <Messages messages={messages} changeStatus={messageStatus} remove={remove} />}
        {view === 'feedbacks' && <Feedbacks feedbacks={feedbacks} changeStatus={feedbackStatus} remove={remove} />}
        {view === 'projects' && <ProjectsAdmin projects={projects} setProjects={setProjects} api={api} remove={remove} />}
      </>}</div>
    </main>
    {logoutOpen && <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title"><div><span><LogOut /></span><h2 id="logout-title">Confirmer la déconnexion</h2><p>Êtes-vous sûr de vouloir quitter votre espace administrateur ?</p><footer><button onClick={() => setLogoutOpen(false)}>Annuler</button><button className="confirm-danger" onClick={logout}>Oui, me déconnecter</button></footer></div></div>}
  </div>;
}

function Dashboard({ stats, views, messages, feedbacks, onNavigate }) {
  const maxViews = Math.max(1, ...views.daily.map(day => Number(day.views)));
  const cards = [[Eye, 'Vues totales', views.total, `${views.today} aujourd’hui`, 'cyan'], [Mail, 'Messages', stats.messages, `${stats.newMessages} nouveau(x)`, 'blue'], [MessageCircleHeart, 'Feedbacks', stats.feedbacks, `${stats.pending} en attente`, 'violet'], [FolderKanban, 'Réalisations', stats.projects, 'Projets publiés', 'green']];
  return <><section className="dashboard-welcome"><div><span>Vue d’ensemble</span><h2>Bonjour Sage, voici ce qui se passe.</h2><p>Gère ton audience, tes échanges et tes réalisations depuis un seul endroit.</p></div><i /></section><section className="dashboard-stats four">{cards.map(([Icon,label,value,note,tone]) => <article className={tone} key={label}><div><Icon /></div><span>{label}</span><b>{value}</b><small>{note}</small></article>)}</section><section className="views-panel admin-panel"><header><div><h3>Audience des 7 derniers jours</h3><p>{views.week} visite{views.week !== 1 ? 's' : ''} cette semaine</p></div><BarChart3 /></header><div className="views-chart">{views.daily.length ? views.daily.map(day => <div key={day.date}><span style={{ height: `${Math.max(10, Number(day.views) / maxViews * 100)}%` }}><em>{day.views}</em></span><small>{new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(new Date(day.date))}</small></div>) : <Empty text="Les premières visites apparaîtront ici." />}</div></section><section className="dashboard-grid"><div className="admin-panel"><header><div><h3>Messages récents</h3><p>Les dernières prises de contact</p></div><button onClick={() => onNavigate('messages')}>Tout voir →</button></header>{messages.slice(0,4).map(m => <div className="recent-row" key={m.id}><span>{m.name.charAt(0)}</span><div><b>{m.subject}</b><small>{m.name} · {formatDate(m.created_at)}</small></div><em className={m.status}>{messageLabels[m.status]}</em></div>)}{messages.length === 0 && <Empty text="Aucun message reçu." />}</div><div className="admin-panel"><header><div><h3>Feedbacks récents</h3><p>Ce que les gens pensent</p></div><button onClick={() => onNavigate('feedbacks')}>Tout voir →</button></header>{feedbacks.slice(0,4).map(f => <div className="recent-row" key={f.id}><span>{f.name.charAt(0)}</span><div><b>{f.name}</b><small>{'★'.repeat(f.rating)} · {formatDate(f.created_at)}</small></div><em className={f.status}>{f.status}</em></div>)}{feedbacks.length === 0 && <Empty text="Aucun feedback reçu." />}</div></section></>;
}

function ProjectsAdmin({ projects, setProjects, api, remove }) {
  const [form, setForm] = useState(emptyProject);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  function start(project) { setEditing(project?.id || null); setForm(project ? { ...project, stack: project.stack.join(', '), image_url: project.image || '' } : emptyProject); setOpen(true); setStatus(''); }
  async function submit(event) { event.preventDefault(); setStatus('Enregistrement…'); const payload = { ...form, stack: form.stack.split(',').map(s => s.trim()).filter(Boolean) }; try { await api(editing ? `/api/admin/projects/${editing}` : '/api/admin/projects', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(payload) }); const data = await api('/api/admin/projects'); setProjects(data.projects); setOpen(false); } catch (error) { setStatus(error.message); } }
  async function toggle(project) { const payload = { ...project, image_url: project.image || '', published: !project.published }; delete payload.image; delete payload.id; delete payload.created_at; await api(`/api/admin/projects/${project.id}`, { method: 'PATCH', body: JSON.stringify(payload) }); setProjects(items => items.map(item => item.id === project.id ? { ...item, published: !item.published } : item)); }
  return <section className="admin-panel content-panel projects-admin"><header><div><h3>Mes réalisations dynamiques</h3><p>Chaque projet publié apparaît immédiatement sur la page Réalisations</p></div><button className="admin-add" onClick={() => start()}><Plus /> Ajouter</button></header>{projects.length === 0 ? <Empty text="Aucune réalisation dynamique. Ajoute ton prochain projet." /> : <div className="admin-project-list">{projects.map(project => <article key={project.id}>{project.image ? <img src={project.image} alt="" /> : <div className="project-placeholder"><FolderKanban /></div>}<div><span>{project.category}</span><h3>{project.title}</h3><p>{project.stack.join(' · ')}</p></div><em className={project.published ? 'published' : ''}>{project.published ? 'Publié' : 'Brouillon'}</em><footer><button onClick={() => toggle(project)}>{project.published ? 'Masquer' : 'Publier'}</button><button onClick={() => start(project)}>Modifier</button><button className="danger" onClick={() => remove('projects', project.id)}><Trash2 /></button></footer></article>)}</div>}
    {open && <div className="project-modal"><form onSubmit={submit}><header><div><h2>{editing ? 'Modifier la réalisation' : 'Nouvelle réalisation'}</h2><p>Renseigne les informations qui seront visibles publiquement.</p></div><button type="button" onClick={() => setOpen(false)}><X /></button></header><div className="form-grid"><label>Titre<input required value={form.title} onChange={e => setForm({...form,title:e.target.value})} /></label><label>Catégorie<input required value={form.category} onChange={e => setForm({...form,category:e.target.value})} /></label></div><label>Description<textarea required minLength="10" rows="4" value={form.description} onChange={e => setForm({...form,description:e.target.value})} /></label><label>Technologies, séparées par des virgules<input required value={form.stack} onChange={e => setForm({...form,stack:e.target.value})} placeholder="React, Express, MySQL" /></label><div className="form-grid"><label>Lien du projet<input type="url" required value={form.href} onChange={e => setForm({...form,href:e.target.value})} /></label><label>URL de l’image<input type="url" value={form.image_url} onChange={e => setForm({...form,image_url:e.target.value})} /></label></div><div className="form-grid"><label>Couleur<select value={form.tone} onChange={e => setForm({...form,tone:e.target.value})}><option value="cyan">Cyan</option><option value="violet">Violet</option><option value="blue">Bleu</option><option value="indigo">Indigo</option></select></label><label className="publish-check"><input type="checkbox" checked={form.published} onChange={e => setForm({...form,published:e.target.checked})} /> Publier immédiatement</label></div>{status && <p className="form-status">{status}</p>}<footer><button type="button" onClick={() => setOpen(false)}>Annuler</button><button className="save-project">Enregistrer</button></footer></form></div>}
  </section>;
}

function Messages({ messages, changeStatus, remove }) { return <section className="admin-panel content-panel"><header><div><h3>Boîte de réception</h3><p>{messages.length} message{messages.length !== 1 ? 's' : ''} au total</p></div></header>{messages.length === 0 ? <Empty text="Aucun message pour le moment." /> : <div className="admin-items">{messages.map(m => <article className={`admin-item ${m.status}`} key={m.id}><div className="item-head"><span>{m.name.charAt(0)}</span><div><h3>{m.subject}</h3><p>{m.name} · <a href={`mailto:${m.email}`}>{m.email}</a></p></div><em>{messageLabels[m.status]}</em></div><p className="item-body">{m.message}</p><footer><time>{formatDate(m.created_at)}</time><div>{m.status === 'new' && <button onClick={() => changeStatus(m.id, 'read')}><Check /> Marquer lu</button>}<a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} onClick={() => changeStatus(m.id, 'replied')}><Reply /> Répondre</a><button onClick={() => changeStatus(m.id, 'archived')}><Archive /> Archiver</button><button className="danger" onClick={() => remove('messages', m.id)}><Trash2 /></button></div></footer></article>)}</div>}</section>; }
function Feedbacks({ feedbacks, changeStatus, remove }) { return <section className="admin-panel content-panel"><header><div><h3>Avis reçus</h3><p>Valide les retours avant leur publication</p></div></header>{feedbacks.length === 0 ? <Empty text="Aucun feedback pour le moment." /> : <div className="admin-items">{feedbacks.map(f => <article className={`admin-item feedback ${f.status}`} key={f.id}><div className="item-head"><span>{f.name.charAt(0)}</span><div><h3>{f.name}</h3><p>{f.role || 'Visiteur'} · {f.email}</p></div><em>{f.status}</em></div><div className="admin-rating">{[1,2,3,4,5].map(v => <Star key={v} className={v <= f.rating ? 'active' : ''} />)}</div><p className="item-body">“{f.message}”</p><footer><time>{formatDate(f.created_at)}</time><div>{f.status !== 'approved' && <button className="approve" onClick={() => changeStatus(f.id, 'approved')}><Check /> Publier</button>}{f.status !== 'rejected' && <button onClick={() => changeStatus(f.id, 'rejected')}><X /> Refuser</button>}<button className="danger" onClick={() => remove('feedbacks', f.id)}><Trash2 /></button></div></footer></article>)}</div>}</section>; }
function Empty({ text }) { return <div className="admin-empty"><Inbox /><p>{text}</p></div>; }
function formatDate(value) { return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }

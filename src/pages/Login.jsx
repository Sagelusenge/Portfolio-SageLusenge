import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from 'lucide-react';
import { Page, Eyebrow } from '../components/Page';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false); const [loading, setLoading] = useState(false); const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault(); setLoading(true); setMessage('');
    const body = Object.fromEntries(new FormData(event.currentTarget));
    try { const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); sessionStorage.setItem('portfolio_session', data.token); navigate('/admin'); }
    catch (error) { setMessage(error.message || 'Connexion impossible.'); } finally { setLoading(false); }
  }
  return <Page className="login-page"><section className="login-wrap section-wrap"><div className="login-aside"><Eyebrow>Espace privé</Eyebrow><h1>Bon retour,<br /><span>Sage.</span></h1><p>Accède à l’espace d’administration sécurisé de ton portfolio.</p><div className="security-card"><LockKeyhole /><span><b>Connexion sécurisée</b>Mot de passe chiffré et session limitée dans le temps.</span></div></div><form className="login-form" onSubmit={submit}><div className="form-head"><span>SL</span><h2>Se connecter</h2><p>Entre tes identifiants administrateur.</p></div><label>Adresse email<div className="input-icon"><Mail /><input name="email" type="email" autoComplete="email" required placeholder="admin@exemple.com" /></div></label><label>Mot de passe<div className="input-icon"><LockKeyhole /><input name="password" type={show ? 'text' : 'password'} minLength="8" autoComplete="current-password" required placeholder="••••••••" /><button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{show ? <EyeOff /> : <Eye />}</button></div></label>{message && <p className="form-status" role="status">{message}</p>}<button className="button primary" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'} <LogIn /></button><small>Cet espace est réservé à l’administrateur du portfolio.</small></form></section></Page>;
}

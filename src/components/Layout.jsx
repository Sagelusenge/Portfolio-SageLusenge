import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Github, Linkedin, Menu, X } from 'lucide-react';

const links = [
  ['/', 'Accueil'],
  ['/a-propos', 'À propos'],
  ['/realisations', 'Réalisations'],
  ['/contact', 'Contact'],
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <header className="navbar">
        <Link to="/" className="brand" aria-label="Sage Lusenge — Accueil">
          <span className="brand-mark">SL</span>
          <span>SAGE <b>LUSENGE</b></span>
        </Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Navigation principale">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
          <NavLink to="/connexion" className="login-link">Se connecter <span>↗</span></NavLink>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-main">
          <div>
            <Link to="/" className="brand"><span className="brand-mark">SL</span><span>SAGE <b>LUSENGE</b></span></Link>
            <p>Je transforme des idées utiles en expériences numériques solides et mémorables.</p>
          </div>
          <div className="footer-nav">
            <span>Navigation</span>
            {links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          </div>
          <div className="footer-nav">
            <span>Me retrouver</span>
            <a href="https://github.com/Sagelusenge" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Sage Lusenge</span><span>Conçu avec précision en RDC.</span></div>
      </footer>
    </div>
  );
}

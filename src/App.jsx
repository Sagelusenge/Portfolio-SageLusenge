import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Feedback from './pages/Feedback';

export default function App() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith('/admin') || location.pathname === '/connexion') return;
    if (!sessionStorage.getItem('portfolio_view_counted')) {
      sessionStorage.setItem('portfolio_view_counted', '1');
      fetch('/api/views', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: location.pathname }) }).catch(() => sessionStorage.removeItem('portfolio_view_counted'));
    }
  }, [location.pathname]);
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/realisations" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/avis" element={<Feedback />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

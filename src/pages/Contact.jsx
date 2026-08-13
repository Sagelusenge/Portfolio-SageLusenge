import { useState } from 'react';
import { Github, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Page, Eyebrow } from '../components/Page';

export default function Contact() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault(); setLoading(true); setStatus({ type: '', message: '' });
    const body = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      event.currentTarget.reset(); setStatus({ type: 'success', message: data.message });
    } catch (error) { setStatus({ type: 'error', message: error.message || 'Impossible d’envoyer le message.' }); }
    finally { setLoading(false); }
  }
  return <Page>
    <section className="contact-page section-wrap">
      <div className="contact-copy"><Eyebrow>Prendre contact</Eyebrow><h1>Parlons de ce que nous pouvons <span>construire ensemble.</span></h1><p>Tu as un projet, une opportunité ou simplement une question ? Écris-moi. Je te répondrai avec plaisir.</p><div className="contact-details"><div><MapPin /><span><b>Localisation</b>Goma, République démocratique du Congo</span></div><a href="mailto:sagelusenge@gmail.com"><Mail /><span><b>Email</b>sagelusenge@gmail.com</span></a><a href="tel:+243980208012"><Phone /><span><b>Téléphone</b>+243 980 208 012</span></a><a href="https://github.com/Sagelusenge" target="_blank" rel="noreferrer"><Github /><span><b>GitHub</b>@Sagelusenge</span></a></div></div>
      <form className="contact-form" onSubmit={submit}><div className="form-head"><span>01</span><h2>Dis-moi tout.</h2></div><div className="form-grid"><label>Nom complet<input name="name" required minLength="2" placeholder="Ton nom" /></label><label>Adresse email<input name="email" type="email" required placeholder="nom@exemple.com" /></label></div><label>Sujet<input name="subject" required minLength="3" placeholder="De quoi allons-nous parler ?" /></label><label>Message<textarea name="message" required minLength="10" rows="6" placeholder="Décris ton projet, ton objectif ou ta question..." /></label>{status.message && <p className={`form-status ${status.type}`} role="status">{status.message}</p>}<button className="button primary" disabled={loading}>{loading ? 'Envoi en cours…' : 'Envoyer le message'} <Send /></button></form>
    </section>
  </Page>;
}

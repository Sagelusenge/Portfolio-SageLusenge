import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Code2, HeartHandshake, Layers3 } from 'lucide-react';
import { Page, Eyebrow, SectionTitle } from '../components/Page';
import { skills } from '../data/site';

export default function About() {
  return <Page>
    <section className="page-hero section-wrap"><Eyebrow>À propos de moi</Eyebrow><h1>Développer avec rigueur.<br /><span>Créer avec intention.</span></h1><p>Je suis Sage Lusenge, développeur full-stack basé en République démocratique du Congo. J’aime transformer les problèmes complexes en produits numériques simples à utiliser.</p></section>
    <section className="section-wrap about-story">
      <div className="about-portrait"><div className="portrait-frame"><img src="/portrait-sage.jpeg" alt="Sage Lusenge" /></div><span className="signature">Sage <b>Lusenge</b></span></div>
      <div className="story-copy"><Eyebrow>Mon parcours</Eyebrow><h2>Une curiosité qui devient des solutions.</h2><p>Mon travail se situe au croisement de la technologie, du produit et de l’expérience utilisateur. Je ne me limite pas à écrire du code : je cherche à comprendre ce que la solution doit réellement changer pour celles et ceux qui l’utiliseront.</p><p>Avec React, Express.js et MySQL, je construis des applications complètes — de l’interface à la base de données — avec une attention particulière à la clarté, la performance et l’évolution future.</p><div className="story-note"><BrainCircuit /><span><b>Ma philosophie</b>Une bonne technologie doit se faire oublier pour laisser la valeur du produit prendre toute la place.</span></div></div>
    </section>
    <section className="section-wrap values-section"><SectionTitle eyebrow="Ce qui me guide" title="Mes principes de travail." /><div className="values-grid">{[
      [Code2, 'Qualité', 'Un code lisible, structuré et pensé pour durer.'],
      [Layers3, 'Simplicité', 'Des parcours directs, sans complexité inutile.'],
      [HeartHandshake, 'Collaboration', 'Écouter, expliquer et construire ensemble.'],
    ].map(([Icon, title, text]) => <div className="value-card" key={title}><Icon /><h3>{title}</h3><p>{text}</p></div>)}</div></section>
    <section className="section-wrap toolkit"><SectionTitle eyebrow="Compétences" title="Ma boîte à outils." /><div className="toolkit-grid">{skills.map(({ name, level, icon: Icon }) => <div className="tool-card" key={name}><Icon /><span><b>{name}</b><em>{level}%</em></span><i><b style={{ width: `${level}%` }} /></i></div>)}</div></section>
    <section className="cta section-wrap"><div><Eyebrow>Travaillons ensemble</Eyebrow><h2>Une idée mérite une belle exécution.</h2></div><Link className="button primary" to="/contact">Me contacter <ArrowRight /></Link></section>
  </Page>;
}

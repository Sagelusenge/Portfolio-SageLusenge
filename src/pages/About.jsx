import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Code2, Database, FileSpreadsheet, HeartHandshake, Layers3, Map, PenTool } from 'lucide-react';
import { Page, Eyebrow, SectionTitle } from '../components/Page';
import { skills } from '../data/site';
import { certifications, education, experiences } from '../data/site';

export default function About() {
  return <Page>
    <section className="page-hero section-wrap"><Eyebrow>À propos de moi</Eyebrow><h1>Développer avec rigueur.<br /><span>Créer avec intention.</span></h1><p>Je suis Kitsa Lusenge Sage, développeur backend et concepteur de solutions basé à Goma. Je transforme les besoins des organisations et de la population en produits numériques simples, fiables et utiles.</p></section>
    <section className="section-wrap about-story">
      <div className="about-portrait"><div className="portrait-frame"><img src="/portrait-sage.jpeg" alt="Sage Lusenge" /></div><span className="signature">Sage <b>Lusenge</b></span></div>
      <div className="story-copy"><Eyebrow>Mon parcours</Eyebrow><h2>Une curiosité qui devient des solutions.</h2><p>Diplômé en Informatique de Gestion à l’ISIG avec grande distinction, mon travail se situe au croisement de la technologie, du produit et de l’expérience utilisateur. Je ne me limite pas à écrire du code : je cherche à comprendre ce que la solution doit réellement changer pour celles et ceux qui l’utiliseront.</p><p>Avec Node.js, Express, MySQL et React, je construis des applications complètes — de l’interface à l’architecture des données — tout en m’appuyant sur mes expériences en support informatique, réseaux, design et communication digitale.</p><div className="story-note"><BrainCircuit /><span><b>Mon objectif</b>Créer des solutions innovantes pour les entreprises et la population, continuer à apprendre et contribuer à l’innovation technologique de ma société.</span></div></div>
    </section>
    <section className="section-wrap resume-section"><SectionTitle eyebrow="Expérience professionnelle" title="Apprendre sur le terrain. Créer de la valeur." /><div className="timeline">{experiences.map(item => <article className="timeline-item" key={item.company}><div className="timeline-date">{item.period}</div><div><span>{item.location}</span><h3>{item.company}</h3><h4>{item.role}</h4><p>{item.description}</p></div></article>)}</div></section>
    <section className="section-wrap education-section"><div><SectionTitle eyebrow="Études" title="Un parcours orienté informatique." /><div className="education-list">{education.map(item => <article key={item.school}><span>{item.period}</span><div><h3>{item.title}</h3><h4>{item.school}</h4><p>{item.detail}</p></div></article>)}</div></div><div><SectionTitle eyebrow="Formations" title="Toujours en apprentissage." /><div className="cert-list">{certifications.map(item => <article key={item.title}><span>{item.year}</span><div><h3>{item.title}</h3><p>{item.provider}</p></div></article>)}</div><div className="language-card"><span>Langues</span><p><b>Français</b> Très bien</p><p><b>Swahili</b> Très bien</p><p><b>Anglais</b> Bien</p><p><b>Kinande</b> Bien</p></div></div></section>
    <section className="section-wrap values-section"><SectionTitle eyebrow="Ce qui me guide" title="Mes principes de travail." /><div className="values-grid">{[
      [Code2, 'Qualité', 'Un code lisible, structuré et pensé pour durer.'],
      [Layers3, 'Simplicité', 'Des parcours directs, sans complexité inutile.'],
      [HeartHandshake, 'Collaboration', 'Écouter, expliquer et construire ensemble.'],
    ].map(([Icon, title, text]) => <div className="value-card" key={title}><Icon /><h3>{title}</h3><p>{text}</p></div>)}</div></section>
    <section className="section-wrap toolkit"><SectionTitle eyebrow="Compétences" title="Ma boîte à outils." /><div className="toolkit-grid">{skills.map(({ name, level, icon: Icon }) => <div className="tool-card" key={name}><Icon /><span><b>{name}</b><em>{level}%</em></span><i><b style={{ width: `${level}%` }} /></i></div>)}</div><div className="software-strip"><span>Autres outils</span>{[[FileSpreadsheet,'Microsoft Office'],[Map,'QGIS'],[PenTool,'Adobe Illustrator'],[Code2,'VS Code'],[Database,'Collecte de données']].map(([Icon,label]) => <b key={label}><Icon />{label}</b>)}</div></section>
    <section className="cta section-wrap"><div><Eyebrow>Travaillons ensemble</Eyebrow><h2>Une idée mérite une belle exécution.</h2></div><Link className="button primary" to="/contact">Me contacter <ArrowRight /></Link></section>
  </Page>;
}

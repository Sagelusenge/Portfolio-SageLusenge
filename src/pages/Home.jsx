import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Code2, Database, Github, MapPin, Server, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Page, Eyebrow, SectionTitle } from '../components/Page';
import ProjectCard from '../components/ProjectCard';
import { projects, skills } from '../data/site';

const reveal = { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 } };

export default function Home() {
  return <Page>
    <section className="hero section-wrap">
      <div className="hero-grid" aria-hidden="true" />
      <motion.div className="hero-copy" variants={reveal} initial="initial" animate="animate" transition={{ duration: .6 }}>
        <Eyebrow>Bonjour, je suis Sage Lusenge</Eyebrow>
        <h1>Je conçois des produits web <span>qui font avancer.</span></h1>
        <p className="hero-lead">Développeur backend et concepteur de solutions, je crée des applications SaaS autour de Node.js, Express et MySQL, avec des interfaces React rapides et soignées.</p>
        <div className="hero-actions"><Link className="button primary" to="/realisations">Découvrir mes projets <ArrowRight /></Link><a className="button ghost" href="https://github.com/Sagelusenge" target="_blank" rel="noreferrer"><Github /> Voir mon GitHub</a></div>
        <div className="hero-meta"><span><MapPin /> République démocratique du Congo</span><span><i /> Disponible pour collaborer</span></div>
      </motion.div>
      <motion.div className="portrait-stage" initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .1 }}>
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="portrait-ring"><img src="/portrait-sage.jpeg" alt="Portrait professionnel de Sage Lusenge" /></div>
        <div className="floating-card code-card"><Code2 /><span><b>Front-end</b>Interfaces vivantes</span></div>
        <div className="floating-card server-card"><Server /><span><b>Back-end</b>Logique robuste</span></div>
        <div className="floating-card db-card"><Database /><span><b>Data</b>MySQL structuré</span></div>
      </motion.div>
    </section>

    <section className="trust-strip"><span>STACK PRINCIPALE</span>{[
      ['React','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'],
      ['Node.js','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'],
      ['Express','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg'],
      ['MySQL','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'],
      ['Git','https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'],
    ].map(([name, icon]) => <b key={name}><img src={icon} alt="" />{name}</b>)}</section>

    <section className="section-wrap section-block">
      <SectionTitle eyebrow="Travaux sélectionnés" title="Des projets pensés pour le réel." text="Des plateformes métier aux expériences communautaires, je construis des solutions utiles, maintenables et centrées sur leurs utilisateurs." />
      <div className="project-grid home-projects">{projects.slice(0, 3).map((project, i) => <ProjectCard key={project.title} project={project} index={i} />)}</div>
      <div className="center-action"><Link className="text-link" to="/realisations">Voir toutes mes réalisations <ArrowRight /></Link></div>
    </section>

    <section className="section-wrap expertise-section">
      <div className="expertise-copy"><SectionTitle eyebrow="Mon expertise" title="De l’idée à la mise en ligne." text="Je rassemble design d’interface, développement et logique métier dans un processus cohérent." /><Link className="button ghost" to="/a-propos">En savoir plus <ArrowRight /></Link></div>
      <div className="skills-panel">{skills.map(({ name, level, icon: Icon }, i) => <motion.div className="skill-row" key={name} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }}><Icon /><div><span><b>{name}</b><em>{level}%</em></span><i><b style={{ width: `${level}%` }} /></i></div></motion.div>)}</div>
    </section>

    <section className="section-wrap process-section">
      <SectionTitle eyebrow="Ma méthode" title="Clair. Collaboratif. Mesurable." align="center" />
      <div className="process-grid">{[
        ['01', 'Comprendre', 'Identifier le besoin, les utilisateurs et la vraie valeur à créer.'],
        ['02', 'Concevoir', 'Transformer les idées en parcours simples et interfaces cohérentes.'],
        ['03', 'Développer', 'Construire une solution rapide, sécurisée et maintenable.'],
        ['04', 'Améliorer', 'Tester, mesurer puis peaufiner ce qui compte vraiment.'],
      ].map(([n, t, p]) => <div className="process-card" key={n}><span>{n}</span><CheckCircle2 /><h3>{t}</h3><p>{p}</p></div>)}</div>
    </section>

    <section className="cta section-wrap"><div><Eyebrow>Un projet en tête ?</Eyebrow><h2>Créons quelque chose de remarquable.</h2><p>Parlons de ton idée, de ton objectif et de la meilleure façon de le concrétiser.</p></div><Link className="button primary" to="/contact">Démarrer une discussion <Sparkles /></Link></section>
    <section className="feedback-invite section-wrap"><div><Eyebrow>Ton avis compte</Eyebrow><h2>Tu connais mon travail ? Partage ton expérience.</h2></div><Link className="button ghost" to="/avis">Donner un feedback <ArrowRight /></Link></section>
  </Page>;
}

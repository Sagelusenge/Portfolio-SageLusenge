import { Github } from 'lucide-react';
import { Page, Eyebrow } from '../components/Page';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/site';

export default function Projects() {
  return <Page>
    <section className="page-hero section-wrap"><Eyebrow>Mes réalisations</Eyebrow><h1>Des produits utiles.<br /><span>Du code qui a du sens.</span></h1><p>Une sélection de projets où j’ai transformé des besoins métier en expériences numériques concrètes.</p></section>
    <section className="section-wrap projects-page-grid">{projects.map((project, i) => <ProjectCard key={project.title} project={project} index={i} />)}</section>
    <section className="github-banner section-wrap"><div><Github /><span><b>Le code raconte aussi une histoire.</b><p>Explore mes dépôts, mes expérimentations et les projets en cours.</p></span></div><a className="button ghost" href="https://github.com/Sagelusenge" target="_blank" rel="noreferrer">Voir mon profil GitHub ↗</a></section>
  </Page>;
}

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Github } from 'lucide-react';
import { Page, Eyebrow } from '../components/Page';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/site';

export default function Projects() {
  const [remoteProjects, setRemoteProjects] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => { fetch('/api/projects').then(r => r.json()).then(data => setRemoteProjects(data.projects || [])).catch(() => {}); }, []);
  const allProjects = useMemo(() => [...projects, ...remoteProjects.map((project, index) => ({ ...project, number: String(projects.length + index + 1).padStart(2, '0'), live: !project.href.includes('github.com') }))], [remoteProjects]);
  const pageCount = Math.max(1, Math.ceil(allProjects.length / 6));
  const visibleProjects = allProjects.slice((page - 1) * 6, page * 6);
  function go(next) { setPage(next); window.scrollTo({ top: 280, behavior: 'smooth' }); }
  return <Page>
    <section className="page-hero section-wrap"><Eyebrow>Mes réalisations</Eyebrow><h1>Des produits utiles.<br /><span>Du code qui a du sens.</span></h1><p>Une sélection de projets où j’ai transformé des besoins métier en expériences numériques concrètes.</p></section>
    <section className="section-wrap projects-page-grid">{visibleProjects.map((project, i) => <ProjectCard key={`${project.id || 'static'}-${project.title}`} project={project} index={i} />)}</section>
    {pageCount > 1 && <nav className="pagination section-wrap" aria-label="Pagination des réalisations"><button disabled={page === 1} onClick={() => go(page - 1)}><ChevronLeft /> Précédent</button><div>{Array.from({ length: pageCount }, (_, index) => <button className={page === index + 1 ? 'active' : ''} onClick={() => go(index + 1)} key={index + 1}>{index + 1}</button>)}</div><button disabled={page === pageCount} onClick={() => go(page + 1)}>Suivant <ChevronRight /></button></nav>}
    <section className="github-banner section-wrap"><div><Github /><span><b>Le code raconte aussi une histoire.</b><p>Explore mes dépôts, mes expérimentations et les projets en cours.</p></span></div><a className="button ghost" href="https://github.com/Sagelusenge" target="_blank" rel="noreferrer">Voir mon profil GitHub ↗</a></section>
  </Page>;
}

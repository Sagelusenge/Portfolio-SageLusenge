import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.a className={`project-card ${project.tone}`} href={project.href} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }}>
      <div className="project-visual">
        <span className="project-number">{project.number}</span>
        <div className="interface-mock" aria-hidden="true"><i /><i /><i /><b /><b /></div>
        <span className="project-arrow"><ArrowUpRight /></span>
      </div>
      <div className="project-copy"><span>{project.category}</span><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{project.stack.map(item => <em key={item}>{item}</em>)}</div></div>
    </motion.a>
  );
}

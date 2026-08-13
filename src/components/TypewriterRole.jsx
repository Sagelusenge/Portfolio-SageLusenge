import { useEffect, useState } from 'react';

const roles = [
  'Développeur Backend',
  'Concepteur de bases de données',
  'Développeur Node.js',
  "Développeur d'applications Web",
  'Concepteur de solutions SaaS',
  'IT & Support Technique',
];

export default function TypewriterRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setText(roles[0]); return undefined; }
    const target = roles[roleIndex];
    let delay = deleting ? 48 : 82;
    if (!deleting && text === target) delay = 1800;
    if (deleting && text === '') delay = 260;
    const timer = window.setTimeout(() => {
      if (!deleting && text === target) setDeleting(true);
      else if (deleting && text === '') { setDeleting(false); setRoleIndex(index => (index + 1) % roles.length); }
      else setText(deleting ? target.slice(0, Math.max(0, text.length - 1)) : target.slice(0, text.length + 1));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [text, deleting, roleIndex]);

  return <span className="typewriter-role" aria-live="polite"><span>{text}</span><i aria-hidden="true">|</i></span>;
}

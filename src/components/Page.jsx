import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function Page({ children, className = '' }) {
  const pageRef = useRef(null);
  useEffect(() => {
    const elements = pageRef.current?.querySelectorAll('section');
    if (!elements) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), { threshold: .1, rootMargin: '0px 0px -45px' });
    elements.forEach((element, index) => { element.classList.add('scroll-reveal'); element.style.setProperty('--reveal-delay', `${Math.min(index * 35, 140)}ms`); observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  return (
    <motion.div ref={pageRef} className={`page ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}>
      <div className="magic-field" aria-hidden="true"><i /><i /><i /><span /><span /><span /></div>
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }) {
  return <div className="eyebrow"><span />{children}</div>;
}

export function SectionTitle({ eyebrow, title, text, align = 'left' }) {
  return <div className={`section-title ${align}`}><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

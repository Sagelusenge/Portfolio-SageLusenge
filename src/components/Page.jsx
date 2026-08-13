import { motion } from 'framer-motion';

export function Page({ children, className = '' }) {
  return (
    <motion.div className={`page ${className}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .42 }}>
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

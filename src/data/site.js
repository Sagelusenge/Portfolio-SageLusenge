import { Boxes, Code2, Database, Globe2, ServerCog, Smartphone } from 'lucide-react';

export const skills = [
  { name: 'React', level: 90, icon: Code2 },
  { name: 'Express.js', level: 86, icon: ServerCog },
  { name: 'MySQL', level: 84, icon: Database },
  { name: 'Node.js', level: 88, icon: Boxes },
  { name: 'API REST', level: 87, icon: Globe2 },
  { name: 'Responsive UI', level: 85, icon: Smartphone },
];

export const projects = [
  {
    title: 'LWASIVA_NET',
    category: 'Plateforme métier',
    description: 'Plateforme complète d’un fournisseur Internet local à Goma : devis, clients, contrats, abonnements, équipements, paiements et support.',
    stack: ['React', 'Express', 'MySQL'],
    href: 'https://lwasivanet.onrender.com/',
    image: '/projects/lwasiva.png',
    live: true,
    tone: 'cyan',
    number: '01',
  },
  {
    title: 'CampusHub',
    category: 'Expérience campus',
    description: 'Une plateforme numérique pensée pour centraliser les services, échanges et informations de la vie universitaire.',
    stack: ['JavaScript', 'Node.js', 'UX'],
    href: 'https://13-63-171-109.nip.io/',
    image: '/projects/campushub.png',
    live: true,
    tone: 'violet',
    number: '02',
  },
  {
    title: 'Quincaillerie Centrale',
    category: 'Gestion commerciale',
    description: 'Application de gestion conçue pour simplifier les produits, ventes, stocks et opérations quotidiennes.',
    stack: ['JavaScript', 'Express', 'SQL'],
    href: 'https://13.61.230.65/',
    image: '/projects/quincaillerie.png',
    live: true,
    tone: 'blue',
    number: '03',
  },
  {
    title: 'Gestion des clients',
    category: 'CRM sur mesure',
    description: 'Un système structuré pour enregistrer, retrouver et suivre efficacement les informations clients.',
    stack: ['Node.js', 'MySQL', 'REST'],
    href: 'https://github.com/Sagelusenge/Developpement-d-un-systeme-de-Gestion-des-clients',
    tone: 'indigo',
    number: '04',
  },
  {
    title: 'KBS Immobilier',
    category: 'Exercice Express.js',
    description: 'Une plateforme de gestion immobilière développée pour pratiquer une architecture Express complète et des parcours métier concrets.',
    stack: ['Express', 'Node.js', 'MySQL'],
    href: 'https://exercice-expressjs.onrender.com/',
    image: '/projects/express-api.png',
    live: true,
    tone: 'cyan',
    number: '05',
  },
  {
    title: 'Gestion des contacts',
    category: 'Application web',
    description: 'Une application claire pour créer, organiser et retrouver rapidement des contacts et leurs informations essentielles.',
    stack: ['JavaScript', 'Express', 'SQL'],
    href: 'https://github.com/Sagelusenge/Gestion-des-contacts',
    tone: 'violet',
    number: '06',
  },
];

export const experiences = [
  {
    period: '2026 — Aujourd’hui',
    company: 'LWASIVA_NET',
    location: 'Goma',
    role: 'Manager de l’entreprise & concepteur de la plateforme',
    description: 'En tant que manager de LWASIVA_NET, je pilote les activités d’un fournisseur Internet local à Goma, de la relation client au suivi opérationnel. J’ai également conçu la plateforme métier qui centralise les abonnés, devis, contrats, installations, équipements, facturation, paiements et demandes de support afin d’améliorer la qualité du service et la prise de décision.',
  },
  {
    period: 'Mars — Avril 2026',
    company: 'Secrétariat Général CBCA',
    location: 'Goma',
    role: 'Stagiaire — Communication & digitalisation',
    description: 'Maintenance informatique, mise en place et gestion de réseaux, communication et digitalisation des processus internes.',
  },
  {
    period: 'Août 2024',
    company: 'Coopec Bonne Moisson',
    location: 'Goma',
    role: 'Stagiaire — Service clientèle & ITC',
    description: 'Accompagnement de la clientèle et suivi des opérations financières afin de contribuer à la réduction des erreurs et des pertes.',
  },
  {
    period: 'Janvier — Mars 2023',
    company: 'Learning for Humanity',
    location: 'Goma',
    role: 'Consultant informatique',
    description: 'Assistance informatique, support technique et maintenance des équipements au service des activités éducatives de l’organisation.',
  },
  {
    period: 'Août — Septembre 2022',
    company: 'Uhuru Design',
    location: 'Goma',
    role: 'Stagiaire — Design',
    description: 'Conception de supports visuels, communication graphique et développement d’une approche créative adaptée aux besoins clients.',
  },
];

export const education = [
  { period: '2023 — 2026', school: 'ISIG — Goma', title: 'BAC+3 en Informatique de Gestion', detail: 'Diplôme obtenu avec mention grande distinction.' },
  { period: '2017 — 2023', school: 'Institut Majengo — Goma', title: 'Diplôme d’État', detail: 'Études secondaires achevées avec mention satisfaction.' },
  { period: '2011 — 2017', school: 'E.P. Majengo — Goma', title: 'Certificat de fin d’études primaires', detail: 'Certificat obtenu avec mention distinction.' },
];

export const certifications = [
  { year: '2026', title: 'MySQL', provider: 'Udemy — En ligne' },
  { year: '2024', title: 'Cartographie avec QGIS', provider: 'GET UP — Goma' },
  { year: '2023', title: 'Conduite automobile', provider: 'Virunga Auto — Goma' },
];

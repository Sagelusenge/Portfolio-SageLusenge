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
    title: 'LusNet',
    category: 'Plateforme métier',
    description: 'Gestion complète d’un fournisseur Internet : clients, contrats, abonnements, équipements, paiements et support.',
    stack: ['React', 'Express', 'MySQL'],
    href: 'https://github.com/Sagelusenge/LusNet',
    tone: 'cyan',
    number: '01',
  },
  {
    title: 'CampusHub',
    category: 'Expérience campus',
    description: 'Une plateforme numérique pensée pour centraliser les services, échanges et informations de la vie universitaire.',
    stack: ['JavaScript', 'Node.js', 'UX'],
    href: 'https://github.com/Sagelusenge/CampusHub',
    tone: 'violet',
    number: '02',
  },
  {
    title: 'Quincaillerie Centrale',
    category: 'Gestion commerciale',
    description: 'Application de gestion conçue pour simplifier les produits, ventes, stocks et opérations quotidiennes.',
    stack: ['JavaScript', 'Express', 'SQL'],
    href: 'https://github.com/Sagelusenge/Quincallerie-Centrale-App',
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
];

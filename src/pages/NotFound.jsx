import { Link } from 'react-router-dom';
import { Page } from '../components/Page';
export default function NotFound() { return <Page><section className="not-found section-wrap"><span>404</span><h1>Cette page s’est perdue dans le réseau.</h1><Link className="button primary" to="/">Retour à l’accueil</Link></section></Page>; }

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export default function InstallPwa() {
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    const handler = (event) => { event.preventDefault(); setPrompt(event); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!prompt) return null;
  async function install() {
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  }
  return <button className="install-pwa" onClick={install}><Download /> Installer l’application</button>;
}

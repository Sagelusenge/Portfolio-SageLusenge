import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Download,
  FileText,
  Image as ImageIcon,
  Search,
} from "lucide-react";
import { Page, Eyebrow } from "../components/Page";
import { apiUrl } from "../lib/api";

const filters = ["Toutes", "Cours", "Certification", "Document", "Image", "Autre"];

function resourceDetails(resource) {
  if (resource.mime_type === "application/pdf")
    return { Icon: BookOpen, label: "PDF", action: "Ouvrir" };
  if (resource.mime_type.startsWith("image/"))
    return { Icon: ImageIcon, label: "Image", action: "Voir" };
  if (resource.mime_type.includes("word"))
    return { Icon: FileText, label: "Word", action: "Télécharger" };
  return { Icon: FileText, label: "Document", action: "Télécharger" };
}

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState("Toutes");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl("/api/resources"))
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setResources(data.resources || []);
      })
      .catch((requestError) =>
        setError(requestError.message || "Impossible de charger les ressources."),
      )
      .finally(() => setLoading(false));
  }, []);

  const visibleResources = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    return resources.filter((resource) => {
      const matchesCategory = filter === "Toutes" || resource.category === filter;
      const matchesQuery =
        !normalizedQuery ||
        `${resource.title} ${resource.description || ""} ${resource.file_name}`
          .toLocaleLowerCase("fr")
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [filter, query, resources]);

  return (
    <Page>
      <section className="page-hero resources-hero section-wrap">
        <Eyebrow>Bibliothèque numérique</Eyebrow>
        <h1>
          Des ressources pour
          <br />
          <span>apprendre et progresser.</span>
        </h1>
        <p>
          Retrouve mes cours, certifications, documents et supports visuels,
          accessibles depuis un seul espace.
        </p>
      </section>

      <section className="resources-library section-wrap">
        <div className="resources-toolbar">
          <div className="resource-filters" aria-label="Filtrer les ressources">
            {filters.map((item) => (
              <button
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="resource-search">
            <Search />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher une ressource"
              aria-label="Rechercher une ressource"
            />
          </label>
        </div>

        {loading ? (
          <div className="resources-state">Chargement des ressources…</div>
        ) : error ? (
          <div className="resources-state error">{error}</div>
        ) : visibleResources.length === 0 ? (
          <div className="resources-state">
            <Award />
            <h2>Aucune ressource disponible pour le moment.</h2>
          </div>
        ) : (
          <div className="resources-grid">
            {visibleResources.map((resource) => {
              const { Icon, label, action } = resourceDetails(resource);
              const fileUrl = apiUrl(resource.file_url);
              return (
                <article className="resource-card" key={resource.id}>
                  <div className="resource-preview">
                    {resource.mime_type.startsWith("image/") ? (
                      <img src={fileUrl} alt="" loading="lazy" />
                    ) : (
                      <Icon />
                    )}
                    <span>{label}</span>
                  </div>
                  <div className="resource-copy">
                    <span>{resource.category}</span>
                    <h2>{resource.title}</h2>
                    {resource.description && <p>{resource.description}</p>}
                    <small>
                      {formatFileSize(resource.file_size)} · {formatDate(resource.created_at)}
                    </small>
                  </div>
                  <a href={fileUrl} target="_blank" rel="noreferrer">
                    <Download /> {action}
                  </a>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </Page>
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

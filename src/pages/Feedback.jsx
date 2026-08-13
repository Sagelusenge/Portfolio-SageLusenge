import { useEffect, useState } from "react";
import { MessageCircleHeart, Send, Star } from "lucide-react";
import { Page, Eyebrow } from "../components/Page";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState("");
  useEffect(() => {
    fetch("/api/feedbacks")
      .then((r) => r.json())
      .then((data) => setFeedbacks(data.feedbacks || []))
      .catch(() => {});
  }, []);
  async function submit(event) {
    event.preventDefault();
    setStatus("Envoi en cours…");
    const form = event.currentTarget;
    const body = { ...Object.fromEntries(new FormData(form)), rating };
    try {
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      form.reset();
      setRating(5);
      setStatus(data.message);
    } catch (error) {
      setStatus(error.message || "Impossible d’envoyer cet avis.");
    }
  }
  return (
    <Page>
      <section className="page-hero feedback-hero section-wrap">
        <Eyebrow>Feedback</Eyebrow>
        <h1>
          Les belles collaborations
          <br />
          <span>méritent d’être racontées.</span>
        </h1>
        <p>
          Ton retour m’aide à progresser et permet aux futurs collaborateurs de
          mieux comprendre ma manière de travailler.
        </p>
      </section>
      <section className="feedback-layout section-wrap">
        <form className="feedback-form" onSubmit={submit}>
          <div className="form-head">
            <MessageCircleHeart />
            <h2>Partager ton expérience</h2>
            <p>Ton avis sera vérifié avant d’être publié.</p>
          </div>
          <div className="form-grid">
            <label>
              Nom complet
              <input name="name" required minLength="2" placeholder="Ton nom" />
            </label>
            <label>
              Rôle ou organisation
              <input name="role" placeholder="Ex. Client, collègue…" />
            </label>
          </div>
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="nom@exemple.com"
            />
          </label>
          <label>
            Note
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  type="button"
                  className={value <= rating ? "active" : ""}
                  onClick={() => setRating(value)}
                  key={value}
                  aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                >
                  <Star />
                </button>
              ))}
            </div>
          </label>
          <label>
            Ton feedback
            <textarea
              name="message"
              required
              minLength="10"
              rows="6"
              placeholder="Parle de notre collaboration, du résultat ou de ce que tu as apprécié…"
            />
          </label>
          {status && <p className="form-status">{status}</p>}
          <button className="button primary">
            Envoyer mon avis <Send />
          </button>
        </form>
        <div className="feedback-wall">
          <Eyebrow>Avis publiés</Eyebrow>
          {feedbacks.length === 0 ? (
            <div className="feedback-empty">
              <MessageCircleHeart />
              <h2>Le premier avis peut être le tien.</h2>
              <p>Les retours validés apparaîtront dans cet espace.</p>
            </div>
          ) : (
            feedbacks.map((item) => (
              <article className="public-feedback" key={item.id}>
                <div className="feedback-stars">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <Star
                      key={v}
                      className={v <= item.rating ? "active" : ""}
                    />
                  ))}
                </div>
                <blockquote>“{item.message}”</blockquote>
                <footer>
                  <span>{item.name.charAt(0).toUpperCase()}</span>
                  <div>
                    <b>{item.name}</b>
                    <small>{item.role || "Collaborateur"}</small>
                  </div>
                </footer>
              </article>
            ))
          )}
        </div>
      </section>
    </Page>
  );
}


import { useEffect, useState } from "react";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

type FaqEntry = {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export default function FaqAdminPanel() {
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  const fetchFaqs = async () => {
    const res = await fetch(`${API_URL}/faqs`);
    const data = await res.json();
    setFaqs(data);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/faqs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, is_active: true }),
    });

    if (res.ok) {
      setForm({ question: "", answer: "" });
      fetchFaqs();
    }
  };

  const toggleStatus = async (id: number, current: boolean) => {
    await fetch(`${API_URL}/faqs?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    fetchFaqs();
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  const visibleFaqs = filteredFaqs.slice(0, visibleCount);

  return (
    <section className="faq-admin-panel">
      <h2 className="faq-admin-title">🔧 Gérer la FAQ</h2>

      <form onSubmit={handleSubmit} className="faq-admin-form">
        <input
          type="text"
          name="question"
          value={form.question}
          onChange={handleChange}
          placeholder="Nouvelle question"
          className="faq-input"
          required
        />
        <textarea
          name="answer"
          value={form.answer}
          onChange={handleChange}
          placeholder="Réponse associée"
          className="faq-textarea"
          required
        />
        <button type="submit" className="faq-button">Ajouter à la FAQ</button>
      </form>

      <input
        type="text"
        placeholder="🔍 Rechercher dans la FAQ"
        className="faq-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="faq-list-admin">
        {visibleFaqs.map((faq) => (
          <li key={faq.id} className="faq-item-admin">
            <div className="faq-item-content">
              <div>
                <p className="faq-question">{faq.question}</p>
                <p className="faq-answer">{faq.answer}</p>
              </div>
              <button
                onClick={() => toggleStatus(faq.id, faq.is_active)}
                className={`faq-toggle-button ${faq.is_active ? 'active' : 'inactive'}`}
              >
                {faq.is_active ? "Désactiver" : "Activer"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {visibleCount < filteredFaqs.length && (
        <button className="faq-button" onClick={() => setVisibleCount((v) => v + 5)}>
          Afficher plus
        </button>
      )}
    </section>
  );
}

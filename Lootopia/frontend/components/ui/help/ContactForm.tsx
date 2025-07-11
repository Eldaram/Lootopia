import { useState } from "react";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function ContactForm() {
  const [form, setForm] = useState({ email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch(`${API_URL}/helps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ email: "", subject: "", message: "" });
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <section>
      <h2>📩 Poser une question</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Votre email"
          required
          className="contact-input" 
        />
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Sujet"
          className="contact-input" 
          required
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Votre question ou signalement"
          className="contact-textarea" 
          required
        />
        <button
          type="submit"
          className="contact-button"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Envoi..." : "Envoyer"}
        </button>
        {status === "success" && <p>Message envoyé ✅</p>}
        {status === "error" && <p>Erreur lors de l’envoi ❌</p>}
      </form>
    </section>
  );
}

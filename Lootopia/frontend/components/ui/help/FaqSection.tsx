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

export default function FaqSection() {
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/faqs`)
      .then(res => res.json())
      .then(data => setFaqs(data));
  }, []);

  return (
    <section className="faq-section">
      <h2 className="faq-title">❓ FAQ</h2>
      <ul className="faq-list">
        {faqs.map((faq) => (
          <li className="faq-item">
            <details className="faq-details">
              <summary className="faq-summary">{faq.question}</summary>
              <p className="faq-answer">{faq.answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

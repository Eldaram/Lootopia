import { useEffect, useState } from "react";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

type HelpRequest = {
  id: number;
  email: string | null;
  user_id: number | null;
  subject: string;
  message: string;
  response: string | null;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
  responded_by: number | null;
};

interface ResponseFormProps {
  id: number;
  onSubmit: (id: number, response: string) => void;
}

export default function AdminHelpPanel() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [showResolved, setShowResolved] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    fetch(`${API_URL}/helps`)
      .then(res => res.json())
      .then(data => setRequests(data));
  }, []);

  const handleResponse = async (id: number, response: string) => {
    await fetch(`${API_URL}/helps?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response, responded_by: 1 }),
    });

    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, response, is_resolved: true } : req
      )
    );
  };

  const filteredRequests = requests
    .filter((r) => showResolved ? true : !r.is_resolved)
    .slice(0, visibleCount);

  return (
    <section>
      <h2>🛠️ Questions utilisateurs</h2>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <label>
          <input
            type="checkbox"
            checked={showResolved}
            onChange={() => setShowResolved(!showResolved)}
          /> Voir aussi les résolues
        </label>
      </div>

      <ul>
        {filteredRequests.map((req) => (
          <li key={req.id} className="help-card">
            <p className="help-meta">📧 {req.email || "Utilisateur connecté"}</p>
            <p className="help-subject">{req.subject}</p>
            <p className="help-message">{req.message}</p>

            {req.response ? (
              <div>
                <p>Réponse : {req.response}</p>
              </div>
            ) : (
              <ResponseForm id={req.id} onSubmit={handleResponse} />
            )}
          </li>
        ))}
      </ul>

      {visibleCount < requests.length && (
        <button className="faq-button" onClick={() => setVisibleCount(v => v + 5)}>
          Afficher plus
        </button>
      )}
    </section>
  );
}

function ResponseForm({ id, onSubmit }: ResponseFormProps) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(id, value);
      }}
    >
      <textarea
        className="help-response"
        placeholder="Votre réponse..."
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setValue(e.target.value)
        }
      />
      <button type="submit" className="help-respond-button">
        Répondre
      </button>
    </form>
  );
}
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { View } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { Colors } from '@/constants/Colors';

const API_URL = Constants.expoConfig?.extra?.API_URL;

const rarityOptions = [
  { value: 1, label: 'Commun', color: '#A0A0A0' },
  { value: 2, label: 'Moyen', color: '#4CAF50' },
  { value: 3, label: 'Rare', color: '#2196F3' },
  { value: 4, label: 'Ultra Rare', color: '#9C27B0' },
];

const RecompenseFormScreen = () => {
  const { theme } = useTheme();
  const themeColors = Colors[theme]; 
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const collectionIdParam = Array.isArray(params.collection_id)
    ? parseInt(params.collection_id[0])
    : parseInt(params.collection_id || '0');

  const isEditMode = id && id !== 'index';

  const [form, setForm] = useState({
    title: '',
    type: null as number | null,
    theme_id: 1,
    rarity: null as number | null,
    illustration_id: 1,
    collection_id: collectionIdParam || null,
    usage: null as number | null,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isEditMode) {
      const fetchArtifact = async () => {
        try {
          const res = await fetch(`${API_URL}/artifacts?id=${id}`);
          if (!res.ok) throw new Error('Récompense introuvable');
          const data = await res.json();
          setForm({
            title: data.title || '',
            type: data.type,
            theme_id: data.theme_id || 1,
            rarity: data.rarity,
            illustration_id: data.illustration_id || 1,
            collection_id: data.collection_id || collectionIdParam || null,
            usage: data.usage,
          });
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchArtifact();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'type' || name === 'usage' ? (value === '' ? null : parseInt(value)) : value,
    }));
  };

  const handleRaritySelect = (value: number) => {
    setForm((prev) => ({ ...prev, rarity: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    if (!form.title.trim()) {
      setError('Le titre est requis.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        ...form,
        admin_id: 1,
        theme_id: 1,
        illustration_id: 1,
        collection_id: form.collection_id,
      };

      const response = await fetch(`${API_URL}/artifacts${isEditMode ? `?id=${id}` : ''}`, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      const result = await response.json();
      setSuccess(`✅ Récompense ${isEditMode ? 'modifiée' : 'créée'} avec succès.`);

      if (!isEditMode) {
        setForm({
          title: '',
          type: null,
          theme_id: 1,
          rarity: null,
          illustration_id: 1,
          collection_id: collectionIdParam || null,
          usage: null,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="loading-text">Chargement...</p>;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
    <div className="centered-page">
      <div className="form-box">
        <h1 className="form-title">{isEditMode ? '✏️ Modifier la récompense' : '🎁 Créer une récompense'}</h1>
        <p className="form-subtitle">{isEditMode ? 'Modifiez les informations de la récompense' : 'Définissez les détails de la récompense'}</p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="form-content">
          <label className="form-label">🏷️ Titre *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Titre de la récompense"
            required
          />

          <label className="form-label">🧬 Type</label>
          <input
            name="type"
            type="number"
            value={form.type ?? ''}
            onChange={handleChange}
            className="form-input"
            placeholder="Entrez un type (nombre)"
          />

          <label className="form-label">⭐ Rareté</label>
          <div className="rarity-selector">
            {rarityOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleRaritySelect(opt.value)}
                style={{
                  backgroundColor: form.rarity === opt.value ? opt.color : 'white',
                  color: form.rarity === opt.value ? 'black' : opt.color,
                  border: `1px solid ${opt.color}`,
                  borderRadius: '8px',
                  marginRight: '8px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label className="form-label">🖼️ Illustration</label>
          <select name="illustration_id" value={form.illustration_id} disabled className="form-select">
            <option value={1}>Illustration #1</option>
          </select>

          <label className="form-label">🎨 Thème</label>
          <select name="theme_id" value={form.theme_id} disabled className="form-select">
            <option value={1}>Thème #1</option>
          </select>

          <label className="form-label">🧪 Usage</label>
          <input
            name="usage"
            type="number"
            value={form.usage ?? ''}
            onChange={handleChange}
            className="form-input"
            placeholder="Valeur de usage (optionnel)"
          />

          <div className="form-actions">
            <button type="button" onClick={() => router.back()} className="btn-cancel">↩️ Annuler</button>
            <button type="submit" disabled={saving} className="btn-save">
              {saving ? '⏳ En cours...' : isEditMode ? '💾 Enregistrer' : '✅ Créer la récompense'}
            </button>
          </div>
        </form>
      </div>
      </div>
      </View>
  );
};

export default RecompenseFormScreen;

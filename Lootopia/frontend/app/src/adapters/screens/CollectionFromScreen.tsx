import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from 'expo-constants';
import { View } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { Colors } from '@/constants/Colors';

const API_URL = Constants.expoConfig?.extra?.API_URL;

const CollectionFormScreen = () => {
  const { id } = useLocalSearchParams();
  const stringId = Array.isArray(id) ? id[0] : id;
  const isCreateMode = !stringId || stringId === 'index';
  const router = useRouter();

  const [name, setName] = useState('');
  const [type, setType] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isCreateMode);
  const { theme } = useTheme();
  const themeColors = Colors[theme]; 

  useEffect(() => {
    if (!isCreateMode && stringId) {
      const fetchCollection = async () => {
        try {
          const response = await fetch(`${API_URL}/collections?id=${stringId}`);
          if (!response.ok) throw new Error('Collection introuvable');
          const data = await response.json();
          setName(data.name);
          setType(data.type);
        } catch (err: any) {
          setError(err.message || 'Erreur lors du chargement');
        } finally {
          setLoading(false);
        }
      };
      fetchCollection();
    } else {
      setLoading(false);
    }
  }, [stringId, isCreateMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Le nom de la collection est requis.');
      return;
    }

    setSaving(true);
    try {
      const body = JSON.stringify({ name, type, admin_id: 1 });

      const response = await fetch(
        `${API_URL}/collections${isCreateMode ? '' : `?id=${stringId}`}`,
        {
          method: isCreateMode ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      const result = await response.json();
      setSuccess(`✅ Collection "${result.name}" ${isCreateMode ? 'créée' : 'modifiée'} avec succès.`);

      if (isCreateMode) {
        setName('');
        setType(1);
        setTimeout(() => router.push('/organiser'), 1500);
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
        <h1 className="form-title">
          {isCreateMode ? '📁 Créer une nouvelle collection' : '✏️ Modifier la collection'}
        </h1>
        <p className="form-subtitle">
          {isCreateMode ? 'Définissez le nom et le type' : 'Modifiez les informations existantes'}
        </p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="form-content">
          <label htmlFor="name" className="form-label">📛 Nom *</label>
          <input
            id="name"
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la collection"
            required
          />

          <label htmlFor="type" className="form-label">🔐 Type</label>
          <select
            id="type"
            className="form-select"
            value={type}
            onChange={(e) => setType(Number(e.target.value))}
          >
            <option value={1}>🌐 Publique</option>
            <option value={2}>🔒 Privée</option>
            <option value={3}>💎 Premium</option>
            <option value={4}>🤝 Collaborative</option>
          </select>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => router.back()}>
              ↩️ Annuler
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving
                ? isCreateMode
                  ? '⏳ Création...'
                  : '⏳ Sauvegarde...'
                : isCreateMode
                  ? '✅ Créer'
                  : '📁 Enregistrer'}
            </button>
          </div>
        </form>
      </div>
      </div>
      </View>
  );
};

export default CollectionFormScreen;

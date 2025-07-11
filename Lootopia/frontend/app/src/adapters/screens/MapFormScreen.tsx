import React, { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import dynamic from 'next/dynamic';
import { View } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { Colors } from '@/constants/Colors';

const API_URL = Constants.expoConfig?.extra?.API_URL;
const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
  loading: () => <p>Chargement de la carte...</p>,
});

const MapFormScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const stringId = Array.isArray(id) ? id[0] : id;
  const isEditMode = stringId && stringId != 'index';
  const { theme } = useTheme();
  const themeColors = Colors[theme]; 

  const [form, setForm] = useState({
    name: '',
    skin: 1,
    zone: '',
    description: '',
    latitude: 48.8566,
    longitude: 2.3522,
    radius: 1,
    dimensionUnit: 'kilometre',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true); // pour fetch lors de l'édition

  const skinIcons: Record<number, string> = {
    1: '🗺️ Classique',
    2: '🌍 Globe',
    3: '🧭 Boussole',
    4: '📍 Flèche',
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchMap = async () => {
        try {
          const res = await fetch(`${API_URL}/maps?id=${id}`);
          if (!res.ok) throw new Error('Carte introuvable');
          const data = await res.json();

          setForm({
            name: data.name,
            skin: data.skin,
            zone: data.zone,
            description: data.description,
            latitude: data.location?.coordinates?.[1] ?? 48.8566,
            longitude: data.location?.coordinates?.[0] ?? 2.3522,
            radius: parseFloat(data.scale) || 1, // ex: "1 km"
            dimensionUnit: 'kilometre',
          });
        } catch (err: any) {
          setError(err.message || 'Erreur lors du chargement');
        } finally {
          setLoading(false);
        }
      };
      fetchMap();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'skin' ? parseInt(value) : value,
    }));
  };

  const handleNumberInput = (field: 'radius', action: 'increment' | 'decrement', step = 1) => {
    setForm(prev => {
      let newValue = Number(prev[field]) || 0;
      if (action === 'increment') newValue += step;
      if (action === 'decrement') newValue -= step;
      if (newValue < 1) newValue = 1;
      return { ...prev, [field]: newValue };
    });
  };

  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`, {
        headers: { 'User-Agent': 'MyApp/1.0 (https://myapp.example)' }
      });
      if (!response.ok) throw new Error('Erreur géocodage');
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setForm(prev => ({ ...prev, latitude: parseFloat(lat), longitude: parseFloat(lon) }));
      } else {
        setError('Adresse non trouvée.');
      }
    } catch (err: any) {
      console.error('Geocoding error:', err);
      setError('Erreur lors du géocodage de l’adresse.');
    }
  };

  const handleMapChange = (lat: number, lng: number, radius: number) => {
    setForm(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      radius,
    }));
  };

  const dynamicMapMemo = useMemo(() => (
    <DynamicMap
      latitude={form.latitude}
      longitude={form.longitude}
      radius={form.radius}
      unit="km"
      onChange={handleMapChange}
    />
  ), [form.latitude, form.longitude, form.radius]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    if (!form.name.trim()) {
      setError('Le nom de la carte est requis.');
      setSaving(false);
      return;
    }

    try {
      const { name, skin, zone, description, latitude, longitude, radius } = form;
      const bodyData = {
        name,
        skin,
        zone,
        description,
        latitude,
        longitude,
        radius,
        scale: `${radius} km`,
        partner_id: 1,
      };

      const response = await fetch(`${API_URL}/maps${isEditMode ? `?id=${id}` : ''}`, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      const result = await response.json();
      setSuccess(`✅ Carte "${result.name}" ${isEditMode ? 'modifiée' : 'créée'} avec succès.`);
      if (!isEditMode) {
        setForm({
          name: '',
          skin: 1,
          zone: '',
          description: '',
          latitude: 48.8566,
          longitude: 2.3522,
          radius: 1,
          dimensionUnit: 'kilometre',
        });
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
        <h1 className="form-title">{isEditMode ? '✏️ Modifier la carte' : '🗺️ Créer une nouvelle carte'}</h1>
        <p className="form-subtitle">{isEditMode ? 'Modifiez les informations' : 'Définissez les informations de la carte'}</p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="form-content">
          <label className="form-label">📛 Nom *</label>
          <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Nom de la carte" required />

          <label className="form-label">🎨 Skin</label>
          <select name="skin" value={form.skin} onChange={handleChange} className="form-select">
            <option value={1}>🗺️ Classique</option>
            <option value={2}>🌍 Globe</option>
            <option value={3}>🧭 Boussole</option>
            <option value={4}>📍 Flèche</option>
          </select>
          <div className="form-label">Aperçu skin : <span>{skinIcons[form.skin]}</span></div>

          <label className="form-label">🌐 Zone</label>
          <input
            name="zone"
            value={form.zone}
            onChange={handleChange}
            onBlur={() => geocodeAddress(form.zone)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                geocodeAddress(form.zone);
              }
            }}
            className="form-input"
            placeholder="Ex: Paris, Île-de-France"
          />

          <label className="form-label">📝 Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="form-input" rows={4} placeholder="Décrivez brièvement la carte..." />

          <div className="map-container">{dynamicMapMemo}</div>

          <div className="hunt-form-field">
            <label className="hunt-form-label">📏 Dimensions</label>
            <div className="number-input-container">
              <div className="number-input-group">
                <button type="button" onClick={() => handleNumberInput('radius', 'decrement')} className="number-input-btn">−</button>
                <input
                  type="number"
                  value={form.radius}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setForm(prev => ({ ...prev, radius: isNaN(val) ? 1 : (val < 1 ? 1 : val) }));
                  }}
                  className="number-input"
                  min="1"
                />
                <button type="button" onClick={() => handleNumberInput('radius', 'increment')} className="number-input-btn">+</button>
              </div>
              Kilomètre(s)
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => router.back()} className="btn-cancel">↩️ Annuler</button>
            <button type="submit" disabled={saving} className="btn-save">
              {saving ? '⏳ En cours...' : isEditMode ? '💾 Enregistrer' : '✅ Créer la carte'}
            </button>
          </div>
        </form>
      </div>
      </div>
      </View>
  );
};

export default MapFormScreen;

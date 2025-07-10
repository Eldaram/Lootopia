import React, { useEffect, useMemo, useState } from 'react';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import dynamic from 'next/dynamic';
import { View } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { Colors } from '@/constants/Colors';

const API_URL = Constants.expoConfig?.extra?.API_URL;
console.log(API_URL);

// Types
interface HuntData {
  title: string;
  description: string;
  world: number;
  duration: number;
  durationUnit: string;
  mode: number;
  max_participants: number;
  unlimited_participants: boolean;
  chat_enabled: boolean;
  map_id: number;
  participation_fee: number;
  currency: string;
  search_delay: number;
  search_delay_unit: string;
  max_winner: number;
  winner_price: number | null;
  winner_price_title?: string;
}

interface StepData {
  id?: number | string;
  title: string;
  location: string;
  dimensions: number;
  dimensionUnit: string;
  visibility: number;
  type: string;
  content: string;
  reward_collection: string;
  reward_item: string;
  latitude?: number;
  longitude?: number;
  partner_id?: number;
  hunt_id?: number;
  order_index?: number;
  status?: number;
}

interface ErrorObject {
  [key: string]: string | undefined;
}

const HuntFormPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [huntId, setHuntId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [maps, setMaps] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [errors, setErrors] = useState<ErrorObject>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
    ssr: false,
    loading: () => <p>Chargement de la carte...</p>,
  });
  const [readOnly, setReadOnly] = useState(false);
  const { theme } = useTheme();
  const themeColors = Colors[theme]; 
  const [artifactSearch, setArtifactSearch] = useState('');
  const [artifactSuggestions, setArtifactSuggestions] = useState<any[]>([]);



  const [huntData, setHuntData] = useState<HuntData>({
    title: '',
    description: '',
    world: 1,
    duration: 1,
    durationUnit: 'heure',
    mode: 1,
    max_participants: 10,
    unlimited_participants: false,
    chat_enabled: true,
    map_id: 1,
    participation_fee: 0,
    currency: 'EUR',
    search_delay: 1,
    search_delay_unit: 'minutes',
    max_winner: 1,
    winner_price: null,
    winner_price_title: '',
  });

  const [steps, setSteps] = useState<StepData[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | string | null>(null);
  const [showAddStep, setShowAddStep] = useState<boolean>(false);
  const [newStep, setNewStep] = useState<StepData>({
    title: '',
    location: '',
    dimensions: 1,
    dimensionUnit: 'kilometre',
    visibility: 1,
    type: 'qr_code',
    content: '',
    reward_collection: '',
    reward_item: ''
  });

  const [editingStepId, setEditingStepId] = useState<string | number | null>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      setIsEdit(true);
      setHuntId(String(id));
      loadHuntData(String(id));
    } else {
      setIsEdit(false);
    }
  
    loadMaps();
    loadCollections();
  }, [id]);

  const [artifacts, setArtifacts] = useState<any[]>([]);

  useEffect(() => {
    const fetchArtifacts = async () => {
      if (!newStep.reward_collection) {
        setArtifacts([]);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/artifacts`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Erreur de récupération des artefacts');

        const allArtifacts = await response.json();
        const filtered = allArtifacts.filter((a: any) => a.collection_id === parseInt(newStep.reward_collection));
        setArtifacts(filtered);
      } catch (error) {
        console.error('Erreur chargement artifacts:', error);
        setArtifacts([]);
      }
    };

    fetchArtifacts();
  }, [newStep.reward_collection]);  

  const handleNumberInput = (
    field: keyof HuntData,
    operation: 'increment' | 'decrement',
    min = 0,
    max = 999
  ) => {
    setHuntData((prev: HuntData) => {
      const currentValue = prev[field] as number;
      let newValue = currentValue;

      if (operation === 'increment' && currentValue < max) {
        newValue = currentValue + 1;
      } else if (operation === 'decrement' && currentValue > min) {
        newValue = currentValue - 1;
      }

      return { ...prev, [field]: newValue };
    });

    if (errors[field]) {
      setErrors((prev: ErrorObject) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStepNumberInput = (
    field: keyof StepData,
    operation: 'increment' | 'decrement',
    min = 0,
    max = 999
  ) => {
    setNewStep((prev: StepData) => {
      const currentValue = Number(prev[field]);
      let newValue = currentValue;

      if (operation === 'increment' && currentValue < max) {
        newValue = currentValue + 1;
      } else if (operation === 'decrement' && currentValue > min) {
        newValue = currentValue - 1;
      }

      return { ...prev, [field]: newValue };
    });
  };

  const handleInputChange = (field: keyof HuntData, value: any) => {
    setHuntData((prev: HuntData) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: ErrorObject) => ({ ...prev, [field]: undefined }));
    }
  };

  const convertDurationToDate = (duration: number, unit: string): Date => {
    const now = new Date();
    let milliseconds = 0;
    switch (unit) {
      case 'heure': milliseconds = duration * 60 * 60 * 1000; break;
      case 'semaine': milliseconds = duration * 7 * 24 * 60 * 60 * 1000; break;
      case 'mois': milliseconds = duration * 30 * 24 * 60 * 60 * 1000; break;
      case 'annee': milliseconds = duration * 365 * 24 * 60 * 60 * 1000; break;
      case 'infini': return new Date(2099, 11, 31);
      default: milliseconds = duration * 60 * 60 * 1000;
    }
    return new Date(now.getTime() + milliseconds);
  };

  const convertSearchDelayToTime = (delay: number, unit: string): string => {
    let totalSeconds = 0;
    switch (unit) {
      case 'secondes': totalSeconds = delay; break;
      case 'minutes': totalSeconds = delay * 60; break;
      case 'heures': totalSeconds = delay * 3600; break;
      default: totalSeconds = delay * 60;
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const loadHuntData = async (id: string) => {
    setLoading(true);
    setErrors({});
    try {
      const response = await fetch(`${API_URL}/hunts?id=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      const hunt = Array.isArray(data) && data.length > 0 ? data[0] : data;
  
      setHuntData((prev: HuntData) => ({
        ...prev,
        ...hunt,
        duration: 1,
        durationUnit: 'heure'
      }));
  
      // ✅ on met la page en lecture seule si statut = 4 (clôturé)
      if (hunt.status === 4) {
        setReadOnly(true);
      }
  
      await loadSteps(id);
    } catch (error: unknown) {
      console.error('Erreur lors du chargement:', error);
      setErrors({ global: `Erreur lors du chargement: ${(error as Error).message}` });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = (fieldName?: keyof HuntData | keyof StepData) =>
    readOnly || (fieldName ? !!errors[fieldName] : false);
  

  const loadMaps = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/maps?partner_id=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setMaps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des cartes:', error);
      setMaps([]);
    }
  };

  const loadCollections = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/collections?admin_id=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setCollections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des collections:', error);
      setCollections([]);
    }
  };

  const loadSteps = async (huntId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/caches?hunt_id=${huntId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setSteps(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length > 0) {
        const firstStep = data[0];
        setNewStep((prev) => ({
          ...prev,
          latitude: firstStep.latitude ?? 48.8566,
          longitude: firstStep.longitude ?? 2.3522
        }));
      }
    } catch (error) {
      console.error('Erreur étapes:', error);
      setSteps([]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};
    
    if (!huntData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (huntData.title.length > 100) {
      newErrors.title = 'Le titre ne peut pas dépasser 100 caractères';
    }
    
    if (huntData.description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
    }
    
    if (huntData.duration < 1) {
      newErrors.duration = 'La durée doit être d\'au moins 1';
    }
    
    if (huntData.max_participants < 1 && !huntData.unlimited_participants) {
      newErrors.max_participants = 'Le nombre de participants doit être d\'au moins 1';
    }
    
    if (huntData.participation_fee < 0) {
      newErrors.participation_fee = 'Les frais ne peuvent pas être négatifs';
    }
    
    if (huntData.search_delay < 1) {
      newErrors.search_delay = 'Le délai de recherche doit être d\'au moins 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSecretCode = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
  
    let code = '';
    for (let i = 0; i < 3; i++) {
      code += letters[Math.floor(Math.random() * letters.length)];
    }
    for (let i = 0; i < 2; i++) {
      code += numbers[Math.floor(Math.random() * numbers.length)];
    }
  
    return code;
  };
  

  const handleSaveHunt = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      // Préparer les données pour l'API selon le schéma Yup
      const apiData = {
        title: huntData.title.trim(),
        description: huntData.description.trim(),
        world: huntData.world,
        duration: convertDurationToDate(huntData.duration, huntData.durationUnit),
        mode: huntData.mode,
        max_participants: huntData.unlimited_participants ? 999999 : huntData.max_participants,
        chat_enabled: huntData.chat_enabled,
        map_id: huntData.map_id,
        participation_fee: huntData.participation_fee,
        search_delay: convertSearchDelayToTime(huntData.search_delay, huntData.search_delay_unit),
        partner_id: 1, // ID du partenaire connecté - à adapter selon votre authentification
        status: 1,
        max_winner: huntData.max_winner,
        winner_price: huntData.winner_price,
      };
      
      const url = isEdit ? `${API_URL}/hunts?id=${huntId}` : `${API_URL}/hunts`;
      const method = isEdit ? 'PUT' : 'POST';
      if (huntData.mode === 0) {
        (apiData as any).code_secret = generateSecretCode();
      }
      
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json' 
        },
        credentials: 'include',
        body: JSON.stringify(apiData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();

      const savedHuntId = result.id; // récupère l'ID renvoyé

      if (!isEdit) {
        for (let [index, step] of steps.entries()) {

          const stepData = {
            ...step,
            title: step.title.trim(),
            location: step.location.trim(),
            hunt_id: savedHuntId,
            order_index: index,
            status: 1,
            latitude: newStep.latitude!,
            longitude: newStep.longitude!,
            visibility: step.visibility
          };
          

          await fetch(`${API_URL}/caches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(stepData)
          });
        }
      }

      
      setSuccessMessage(isEdit ? 'Chasse modifiée avec succès' : 'Chasse créée avec succès');
      
      // Rediriger après un délai pour montrer le message de succès
      setTimeout(() => {
        router.push('/organiser');
      }, 2000);
      
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Erreur sauvegarde:', err);
      setErrors({ global: `Erreur lors de la sauvegarde: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleAddStep = (): void => {
    if (!newStep.title.trim()) {
      setErrors({ stepTitle: 'Le titre de l\'étape est requis' });
      return;
    }

    const localStep = {
      ...newStep,
      id: `temp-${Date.now()}`, // ID temporaire unique
      latitude: newStep.latitude!,
      longitude: newStep.longitude!,
      partner_id: 1,
    };

    setSteps(prev => [...prev, localStep]);
    setNewStep({
      title: '',
      location: '',
      dimensions: 1,
      dimensionUnit: 'kilometre',
      visibility: 1,
      type: 'qr_code',
      content: '',
      reward_collection: '',
      reward_item: ''
    });
    setShowAddStep(false);
    setErrors(prev => ({ ...prev, stepTitle: undefined }));
  };

  

  const handleDeleteStep = async (stepId: number): Promise<void> => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette étape ?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/caches?id=${stepId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }
      
      setSteps(prev => prev.filter(step => step.id !== stepId));
    } catch (error) {
      console.error('Erreur suppression étape:', error);
      alert('Erreur lors de la suppression de l\'étape');
    }
  };

  const getStepTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      qr_code: '📱 QR Code',
      image: '🖼️ Image',
      texte: '📝 Texte',
      cache_finale: '🏆 Cache Finale',
      geolocation: '📍 Géolocalisation',
      puzzle: '🧩 Puzzle'
    };
    return types[type] || type;
  };

  const handleEditStep = (stepId: number | string | undefined): void => {
    if (stepId === undefined) return; // sécurité
    const stepToEdit = steps.find((s) => s.id === stepId);
    if (!stepToEdit) return;

    setNewStep({
      ...stepToEdit,
      latitude: stepToEdit.latitude ?? 48.8566,
      longitude: stepToEdit.longitude ?? 2.3522,
      reward_collection: stepToEdit.reward_collection || '',
      reward_item: stepToEdit.reward_item || '',
    });
    setEditingStepId(stepId);
    setShowAddStep(true);
  };

  const handleSaveStep = async (): Promise<void> => {
    if (!newStep.title.trim()) {
      setErrors({ stepTitle: 'Le titre de l\'étape est requis' });
      return;
    }

    const stepPayload = {
      ...newStep,
      title: newStep.title.trim(),
      location: newStep.location.trim(),
      latitude: newStep.latitude!,
      longitude: newStep.longitude!,
      partner_id: 1,
      visibility: newStep.visibility,
    };

    const isTemporaryStep =
      editingStepId !== null &&
      typeof editingStepId === 'string' &&
      editingStepId.startsWith('temp-');

    // Cas modification
    if (editingStepId !== null) {
      if (!isTemporaryStep) {
        // Modifier une étape existante dans la base
        try {
          const response = await fetch(`${API_URL}/caches?id=${editingStepId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(stepPayload),
          });

          if (!response.ok) throw new Error('Erreur mise à jour');
        } catch (error) {
          console.error('Erreur mise à jour étape:', error);
          alert('Erreur lors de la modification');
          return;
        }
      }

      // Met à jour l’étape localement (temporaire ou réelle)
      setSteps((prev) =>
        prev.map((s) => s.id === editingStepId ? { ...s, ...stepPayload } : s)
      );
    } else {
      // Nouvelle étape
      const localStep = {
        ...stepPayload,
        id: `temp-${Date.now()}`, // ID temporaire unique
      };
      setSteps((prev) => [...prev, localStep]);
    }

    // Reset du formulaire
    setNewStep({
      title: '',
      location: '',
      dimensions: 1,
      dimensionUnit: 'kilometre',
      visibility: 1,
      type: 'qr_code',
      content: '',
      reward_collection: '',
      reward_item: '',
    });
    setEditingStepId(null);
    setShowAddStep(false);
    setErrors((prev) => ({ ...prev, stepTitle: undefined }));
  };


  const moveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    setSteps(newSteps);
  };

  const moveStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    setSteps(newSteps);
  };


  const dynamicMapMemo = useMemo(() => (
    <DynamicMap
      latitude={newStep.latitude || 48.8566}
      longitude={newStep.longitude || 2.3522}
      radius={newStep.dimensions}
      unit="km"
      onChange={(lat, lng, radius, unit) =>
        setNewStep(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          dimensions: radius,
          dimensionUnit: 'kilometre',
        }))
      }
    />
  ), [newStep.latitude, newStep.longitude, newStep.dimensions]);

  const handleSaveDraftHunt = async (): Promise<void> => {
    if (!validateForm()) return;
  
    setSaving(true);
    setErrors({});
    setSuccessMessage('');
  
    try {
      const apiData = {
        title: huntData.title.trim(),
        description: huntData.description.trim(),
        world: huntData.world,
        duration: convertDurationToDate(huntData.duration, huntData.durationUnit),
        mode: huntData.mode,
        max_participants: huntData.unlimited_participants ? 999999 : huntData.max_participants,
        chat_enabled: huntData.chat_enabled,
        map_id: huntData.map_id,
        participation_fee: huntData.participation_fee,
        search_delay: convertSearchDelayToTime(huntData.search_delay, huntData.search_delay_unit),
        partner_id: 1,
        status: 3,
        max_winner: huntData.max_winner,
        winner_price: huntData.winner_price,

      };
  
      const url = isEdit ? `${API_URL}/hunts?id=${huntId}` : `${API_URL}/hunts`;
      const method = isEdit ? 'PUT' : 'POST';
      if (huntData.mode === 0) {
        (apiData as any).code_secret = generateSecretCode();
      }
      
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(apiData)
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }
  
      const result = await response.json();
  
      setSuccessMessage('Chasse enregistrée en tant que brouillon');
  
      // Redirection si besoin
      setTimeout(() => {
        router.push('/organiser');
      }, 2000);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Erreur brouillon:', err);
      setErrors({ global: `Erreur brouillon: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };
  


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
    <div className="hunt-form-container">
      <div className="hunt-form-wrapper" style={{color: themeColors.text}}>
        {/* Header */}
        <div className="hunt-form-header">
          <h1 className="hunt-form-title" >
            {isEdit ? '✏️ Modifier la chasse' : '🆕 Créer une nouvelle chasse'}
          </h1>
          <p className="hunt-form-subtitle">
            Configurez les paramètres et les étapes de votre chasse au trésor
          </p>
          
          {/* Messages d'erreur et de succès */}
          {errors.global && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              {errors.global}
            </div>
          )}
          
          {successMessage && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              {successMessage}
            </div>
          )}
        </div>

        <div className="hunt-form-grid">
          {/* Colonne 1: Informations */}
          <div className="hunt-form-card">
            <h2 className="hunt-form-card-title">
              📋 Informations générales
            </h2>

            <div className="hunt-form-fields">
              {/* Titre */}
              <div className="hunt-form-field">
                <label className="hunt-form-label">
                  Titre *
                </label>
                <input
                  type="text"
                  value={huntData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`hunt-form-input ${errors.title ? 'input-error' : ''}`}
                  placeholder="Nom de votre chasse"
                  maxLength={100}
                  disabled={readOnly}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
                <small className="input-helper">
                  {huntData.title.length}/100 caractères
                </small>
              </div>

              {/* Description */}
              <div className="hunt-form-field">
                <label className="hunt-form-label">
                  Description
                </label>
                <textarea
                  value={huntData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`hunt-form-textarea ${errors.description ? 'input-error' : ''}`}
                  placeholder="Description de votre chasse"
                  maxLength={500}
                  disabled={readOnly}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
                <small className="input-helper">
                  {huntData.description.length}/500 caractères
                </small>
              </div>

              {/* Monde */}
              <div className="hunt-form-field">
                <label className="hunt-form-label">
                  🌍 Monde
                </label>
                <select
                  value={huntData.world}
                  onChange={(e) => handleInputChange('world', parseInt(e.target.value))}
                  className="hunt-form-select"
                  disabled={readOnly}
                >
                  <option value={1}>🥽 VR (Réalité Virtuelle)</option>
                  <option value={2}>🗺️ Carte (Monde Réel)</option>
                </select>
              </div>

              {/* Durée */}
              <div className="hunt-form-field">
                <label className="hunt-form-label">
                  ⏰ Durée
                </label>
                <div className="number-input-container">
                  <div className="number-input-group">
                    <button
                      onClick={() => handleNumberInput('duration', 'decrement', 1)}
                      className="number-input-btn"
                      type="button"
                      disabled={readOnly}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={huntData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                      className={`number-input ${errors.duration ? 'input-error' : ''}`}
                      min="1"
                      disabled={readOnly}
                    />
                    <button
                      onClick={() => handleNumberInput('duration', 'increment')}
                      className="number-input-btn"
                      type="button"
                      disabled={readOnly}
                    >
                      +
                    </button>
                  </div>
                  <select
                    value={huntData.durationUnit}
                    onChange={(e) => handleInputChange('durationUnit', e.target.value)}
                    className="hunt-form-select"
                    disabled={readOnly}
                  >
                    <option value="heure">Heure(s)</option>
                    <option value="semaine">Semaine(s)</option>
                    <option value="mois">Mois</option>
                    <option value="annee">Année(s)</option>
                    <option value="infini">♾️ Infini</option>
                  </select>
                </div>
                {errors.duration && <span className="error-message">{errors.duration}</span>}
              </div>

              {/* Mode */}
              <div className="hunt-form-field">
                <label className="hunt-form-label">
                  🔒 Mode
                </label>
                <select
                  value={huntData.mode}
                  onChange={(e) => handleInputChange('mode', parseInt(e.target.value))}
                  className="hunt-form-select"
                  disabled={readOnly}
                >
                  <option value={1}>🌐 Public</option>
                  <option value={0}>🔐 Privé</option>
                </select>
              </div>

              {/* Maximum de participants */}
              <div className="hunt-form-field">
                <label className="hunt-form-label">
                  👥 Maximum de participants
                </label>
                <div className="number-input-container">
                  <div className="number-input-group">
                    <button
                      onClick={() => handleNumberInput('max_participants', 'decrement', 1)}
                      disabled={huntData.unlimited_participants || readOnly}
                      className="number-input-btn"
                      type="button"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={huntData.unlimited_participants ? '∞' : huntData.max_participants}
                      onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value) || 1)}
                      disabled={huntData.unlimited_participants || readOnly}
                      className={`number-input ${errors.max_participants ? 'input-error' : ''}`}
                      min="1"
                    />
                    <button
                      onClick={() => handleNumberInput('max_participants', 'increment')}
                      disabled={huntData.unlimited_participants || readOnly}
                      className="number-input-btn"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleInputChange('unlimited_participants', !huntData.unlimited_participants)}
                    className={`toggle-btn ${huntData.unlimited_participants ? 'active' : 'inactive'}`}
                    type="button"
                    disabled={readOnly}
                  >
                    ♾️ Illimité
                  </button>
                </div>
                {errors.max_participants && <span className="error-message">{errors.max_participants}</span>}
              </div>

              {/* Chat */}
              <div className="hunt-form-field">
                <label className="hunt-form-label">
                  💬 Chat
                </label>
                <div className="toggle-group">
                  <button
                    onClick={() => handleInputChange('chat_enabled', true)}
                    className={`toggle-btn ${huntData.chat_enabled ? 'success' : 'inactive'}`}
                    type="button"
                    disabled={readOnly}
                  >
                    ✅ Activé
                  </button>
                  <button
                    onClick={() => handleInputChange('chat_enabled', false)}
                    className={`toggle-btn ${!huntData.chat_enabled ? 'error' : 'inactive'}`}
                    type="button"
                    disabled={readOnly}
                  >
                    ❌ Désactivé
                  </button>
                </div>
              </div>

              {/* Carte */}
              <div className="hunt-form-field">
                <label className="hunt-form-label">
                  🗺️ Carte
                </label>
                <select
                  value={huntData.map_id}
                  onChange={(e) => handleInputChange('map_id', parseInt(e.target.value))}
                  className="hunt-form-select"
                  disabled={readOnly}
                >
                  {maps.length > 0 ? (
                    maps.map(map => (
                      <option key={map.id} value={map.id}>
                        {map.name} - {map.zone}
                      </option>
                    ))
                  ) : (
                    <option value={1}>Carte par défaut</option>
                  )}
                </select>
              </div>

              {/* Frais de participation */}
              <div className="hunt-form-field">
                <label className="hunt-form-label">
                  💰 Frais de participation
                </label>
                <div className="number-input-container">
                  <div className="number-input-group">
                    <button
                      onClick={() => handleNumberInput('participation_fee', 'decrement', 0)}
                      className="number-input-btn"
                      type="button"
                      disabled={readOnly}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={huntData.participation_fee}
                      onChange={(e) => handleInputChange('participation_fee', parseFloat(e.target.value) || 0)}
                      className={`number-input ${errors.participation_fee ? 'input-error' : ''}`}
                      min="0"
                      step="0.01"
                      disabled={readOnly}
                    />
                    <button
                      onClick={() => handleNumberInput('participation_fee', 'increment')}
                      className="number-input-btn"
                      type="button"
                      disabled={readOnly}
                    >
                      +
                    </button>
                  </div>
                  <select
                    value={huntData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="hunt-form-select"
                    disabled={readOnly}
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CHF">CHF</option>
                  </select>
                </div>
                {errors.participation_fee && <span className="error-message">{errors.participation_fee}</span>}
              </div>

              {/* Délais de recherche */}
              <div className="hunt-form-field">
                <label className="hunt-form-label">
                  ⏱️ Délai de recherche
                </label>
                <div className="number-input-container">
                  <div className="number-input-group">
                    <button
                      onClick={() => handleNumberInput('search_delay', 'decrement', 1)}
                      className="number-input-btn"
                      type="button"
                      disabled={readOnly}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={huntData.search_delay}
                      onChange={(e) => handleInputChange('search_delay', parseInt(e.target.value) || 1)}
                      className={`number-input ${errors.search_delay ? 'input-error' : ''}`}
                      min="1"
                      disabled={readOnly}
                    />
                    <button
                      onClick={() => handleNumberInput('search_delay', 'increment')}
                      className="number-input-btn"
                      type="button"
                      disabled={readOnly}
                    >
                      +
                    </button>
                  </div>
                  <select
                    value={huntData.search_delay_unit}
                    onChange={(e) => handleInputChange('search_delay_unit', e.target.value)}
                    className="hunt-form-select"
                    disabled={readOnly}
                  >
                    <option value="secondes">Secondes</option>
                    <option value="minutes">Minutes</option>
                    <option value="heures">Heures</option>
                  </select>
                </div>
                {errors.search_delay && <span className="error-message">{errors.search_delay}</span>}
                </div>
                
                {/* Nombre max de gagnants */}
                <div className="hunt-form-field">
                  <label className="hunt-form-label">🏆 Nombre maximum de gagnants</label>
                  <div className="number-input-group">
                    <button
                      onClick={() => handleNumberInput('max_winner', 'decrement', 1)}
                      className="number-input-btn"
                      type="button"
                      disabled={readOnly}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={huntData.max_winner}
                      onChange={(e) => handleInputChange('max_winner', parseInt(e.target.value) || 1)}
                      className={`number-input ${errors.max_winner ? 'input-error' : ''}`}
                      min="1"
                      disabled={readOnly}
                    />
                    <button
                      onClick={() => handleNumberInput('max_winner', 'increment')}
                      className="number-input-btn"
                      type="button"
                      disabled={readOnly}
                    >
                      +
                    </button>
                  </div>
                  {errors.max_winner && <span className="error-message">{errors.max_winner}</span>}
                </div>

                {/* Récompense du gagnant */}
                <div className="hunt-form-field">
                  <label className="hunt-form-label">🎖️ Récompense du gagnant</label>
                  <input
                    type="text"
                    className="hunt-form-input"
                    placeholder="Rechercher une récompense"
                    value={artifactSearch}
                    onChange={async (e) => {
                      const query = e.target.value;
                      setArtifactSearch(query);
                      if (query.length > 1) {
                        try {
                          const res = await fetch(`${API_URL}/artifacts?admin_id=1`, {
                            credentials: 'include'
                          });
                          const allArtifacts = await res.json();
                          const suggestions = allArtifacts.filter((a: any) =>
                            a.title.toLowerCase().includes(query.toLowerCase())
                          );
                          setArtifactSuggestions(suggestions);
                        } catch (err) {
                          console.error('Erreur recherche artifacts', err);
                          setArtifactSuggestions([]);
                        }
                      } else {
                        setArtifactSuggestions([]);
                      }
                    }}
                    disabled={readOnly}
                  />
                  {/* Suggestions */}
                  {artifactSuggestions.length > 0 && (
                    <ul className="dropdown-suggestions">
                      {artifactSuggestions.map((a) => (
                        <li
                          key={a.id}
                          onClick={() => {
                            setHuntData((prev) => ({
                              ...prev,
                              winner_price: a.id,
                              winner_price_title: a.title,
                            }));
                            setArtifactSearch('');
                            setArtifactSuggestions([]);
                          }}
                        >
                          {a.title}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Affichage sélectionnée */}
                  {huntData.winner_price && (
                    <div className="selected-artifact">
                      ✅ {huntData.winner_price_title || 'Artefact sélectionné'}
                      <button
                        onClick={() =>
                          setHuntData((prev) => ({
                            ...prev,
                            winner_price: null,
                            winner_price_title: '',
                          }))
                        }
                        type="button"
                        className="clear-artifact-btn"
                        disabled={readOnly}
                      >
                        ❌ Supprimer
                      </button>
                    </div>
                  )}
                </div>

              {/* Photo de couverture */}
              <div className="hunt-form-field">
                <label className="hunt-form-label">
                  📸 Photo de couverture
                </label>
                <div className="file-upload-area">
                  <div className="file-upload-icon">📁</div>
                  <p className="file-upload-text">
                    Cliquez pour uploader ou glissez-déposez
                  </p>
                  <p className="file-upload-subtext">PNG, JPG jusqu'à 10MB</p>
                    <p className="file-upload-success">
                      ✅ Fichier sélectionné: 
                    </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-upload-input"
                    id="cover-image-input"
                    disabled={readOnly}
                  />
                  <label
                    htmlFor="cover-image-input"
                    className="file-upload-btn"
                  >
                    📂 Choisir un fichier
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne 2: Étapes */}
          <div className="steps-section">
            <h2 className="hunt-form-card-title">
              📍 Étapes de la chasse ({steps.length})
            </h2>

            <div className="steps-list">
              {/* Étapes existantes */}
              {steps.map((step, index) => (
                <div key={step.id} className="step-card">
                  <div
                    className="step-header"
                    onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id ?? null)}
                  >
                    <div className="step-header-content">
                      <div className="step-controls">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveStepUp(index);
                          }}
                          title="Déplacer vers le haut"
                          className="step-btn"
                          disabled={index === 0 || readOnly}
                        >
                          ⬆️
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveStepDown(index);
                          }}
                          title="Déplacer vers le bas"
                          className="step-btn"
                          disabled={index === steps.length - 1 || readOnly}
                        >
                          ⬇️
                        </button>
                      </div>

                      <div className="step-main-info">
                        <h3 className="step-title">
                          Étape {index + 1}: {step.title || 'Sans titre'}
                        </h3>
                        <p className="step-type">
                          {getStepTypeLabel(step.type)}
                        </p>
                      </div>
                    </div>

                    <div className="step-header-actions">
                      {!readOnly && (<button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStep(step.id);
                        }}
                        className="step-btn"
                        type="button"
                        title="Modifier cette étape"
                      >
                        ✏️
                      </button>
                      )}
                      {readOnly && (<button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStep(step.id);
                        }}
                        className="step-btn"
                        type="button"
                        title="Voir cette étape"
                      >
                        👁️
                      </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStep(step.id);
                        }}
                        className="step-btn"
                        type="button"
                        title="Supprimer cette étape"
                        disabled={readOnly}
                      >
                        🗑️
                      </button>
                      <span className="step-expand-icon">
                        {expandedStep === step.id ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>
                  
                  {expandedStep === step.id && (
                    <div className="step-content">
                      <div className="step-details">
                        <div className="step-details-grid">
                          <div className="step-detail-item">
                            <span className="step-detail-label">📍 Lieu:</span>
                            <p className="step-detail-value">{step.location || 'Non défini'}</p>
                          </div>
                          <div className="step-detail-item">
                            <span className="step-detail-label">📏 Dimensions:</span>
                            <p className="step-detail-value">{step.dimensions} {step.dimensionUnit}</p>
                          </div>
                          <div className="step-detail-item">
                            <span className="step-detail-label">👁️ Visibilité:</span>
                            <p className="step-detail-value">
                              {step.visibility == 1 ? '✅ Visible' : '❌ Cachée'}
                            </p>
                          </div>
                          <div className="step-detail-item">
                            <span className="step-detail-label">🎯 Type:</span>
                            <p className="step-detail-value">{getStepTypeLabel(step.type)}</p>
                          </div>
                          {step.content && (
                            <div className="step-detail-item step-detail-full">
                              <span className="step-detail-label">📝 Contenu:</span>
                              <p className="step-detail-value">{step.content}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Bouton Ajouter une étape */}
              {!showAddStep && (
                <button
                  onClick={() => setShowAddStep(true)}
                  className="add-step-btn"
                  type="button"
                  disabled={readOnly}
                >
                  <span className="add-step-icon">➕</span>
                  <span>Ajouter une étape</span>
                </button>
              )}

              {/* Formulaire d'ajout d'étape */}
              {showAddStep && (
                <div className="new-step-form">
                  <h3 className="new-step-title">🆕 Nouvelle étape</h3>
                  
                  <div className="new-step-fields">
                    {/* Titre */}
                    <div className="hunt-form-field">
                      <label className="hunt-form-label">
                        Titre *
                      </label>
                      <input
                        type="text"
                        value={newStep.title}
                        onChange={(e) => setNewStep(prev => ({ ...prev, title: e.target.value }))}
                        className={`hunt-form-input ${errors.stepTitle ? 'input-error' : ''}`}
                        placeholder="Titre de l'étape"
                        disabled={readOnly}
                      />
                      {errors.stepTitle && <span className="error-message">{errors.stepTitle}</span>}
                    </div>

                    {/* Lieu */}
                    <div className="map-container">
                      {dynamicMapMemo}
                    </div>

                    {/* Dimensions */}
                    <div className="hunt-form-field">
                      <label className="hunt-form-label">
                        📏 Dimensions
                      </label>
                      <div className="number-input-container">
                        <div className="number-input-group">
                          <button
                            onClick={() => handleStepNumberInput('dimensions', 'decrement', 1)}
                            className="number-input-btn"
                            type="button"
                            disabled={readOnly}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={newStep.dimensions}
                            onChange={(e) => {
                              const numericValue = Number(e.target.value);
                              setNewStep(prev => ({
                                ...prev,
                                dimensions: isNaN(numericValue) ? 1 : numericValue
                              }));
                            }}
                            className="number-input"
                            min="1"
                            disabled={readOnly}
                          />
                          <button
                            onClick={() => handleStepNumberInput('dimensions', 'increment')}
                            className="number-input-btn"
                            type="button"
                            disabled={readOnly}
                          >
                            +
                          </button>
                        </div>
                        <select
                          value={newStep.dimensionUnit}
                          onChange={(e) => setNewStep(prev => ({ ...prev, dimensionUnit: e.target.value }))}
                          className="hunt-form-select"
                          disabled={readOnly}
                        >
                          <option value="kilometre">Kilomètre(s)</option>
                        </select>
                      </div>
                    </div>

                    {/* Visibilité */}
                    <div className="hunt-form-field">
                      <label className="hunt-form-label">
                        👁️ Visibilité
                      </label>
                      <div className="visibility-toggle">
                      <button
                        onClick={() => setNewStep(prev => ({ ...prev, visibility: 1 }))}
                        className={`visibility-btn ${newStep.visibility === 1 ? 'toggle-btn success' : 'toggle-btn inactive'}`}
                          type="button"
                          disabled={readOnly}
                      >
                        👁️ Visible
                      </button>
                      <button
                        onClick={() => setNewStep(prev => ({ ...prev, visibility: 2 }))}
                        className={`visibility-btn ${newStep.visibility === 2 ? 'toggle-btn error' : 'toggle-btn inactive'}`}
                          type="button"
                          disabled={readOnly}
                      >
                        🚫 Cachée
                      </button>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="hunt-form-field">
                      <label className="hunt-form-label">
                        🎯 Type d'étape
                      </label>
                      <select
                        value={newStep.type}
                        onChange={(e) => setNewStep(prev => ({ ...prev, type: e.target.value }))}
                        className="hunt-form-select"
                        disabled={readOnly}
                      >
                        <option value="qr_code">📱 QR Code</option>
                        <option value="image">🖼️ Image</option>
                        <option value="texte">📝 Texte</option>
                        <option value="cache_finale">🏆 Cache Finale</option>
                        <option value="geolocation">📍 Géolocalisation</option>
                        <option value="puzzle">🧩 Puzzle</option>
                      </select>
                    </div>

                    {/* Contenu selon le type */}
                    <div className="hunt-form-field">
                      <label className="hunt-form-label">
                        📝 Contenu
                      </label>
                      {newStep.type === 'image' ? (
                        <div className="image-upload-area">
                          <div className="image-upload-icon">🖼️</div>
                          <p className="image-upload-text">Upload une image</p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setNewStep(prev => ({ ...prev, content: file.name }));
                              }
                            }}
                            className="file-upload-input" 
                            id="step-image-input"
                            disabled={readOnly}
                          />
                          <label
                            htmlFor="step-image-input"
                            className="image-upload-btn"
                          >
                            🖼️ Choisir une image
                          </label>
                        </div>
                      ) : (
                        <textarea
                          value={newStep.content}
                          onChange={(e) => setNewStep(prev => ({ ...prev, content: e.target.value }))}
                          rows={3}
                          className="hunt-form-textarea"
                          placeholder={
                            newStep.type === 'qr_code' ? 'Contenu du QR Code' :
                            newStep.type === 'texte' ? 'Texte à afficher' :
                            newStep.type === 'puzzle' ? 'Énigme ou puzzle' :
                            'Contenu de l\'étape'
                          }
                          disabled={readOnly}
                        />
                      )}
                    </div>

                    {/* Récompenses */}
                    <div className="hunt-form-field">
                      <label className="hunt-form-label">
                        🎁 Récompense
                      </label>
                      <div className="reward-grid">
                        <select
                          value={newStep.reward_collection}
                          onChange={(e) => setNewStep(prev => ({ ...prev, reward_collection: e.target.value, reward_item: '' }))}
                          className="hunt-form-select"
                          disabled={readOnly}
                        >
                          <option value="">Choisir collection</option>
                          {collections.map(collection => (
                            <option key={collection.id} value={collection.id}>
                              {collection.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={newStep.reward_item}
                          onChange={(e) => setNewStep(prev => ({ ...prev, reward_item: e.target.value }))}
                          disabled={!newStep.reward_collection ||readOnly}
                          className="hunt-form-select"
                        >
                          <option value="">Choisir récompense</option>
                          {artifacts.map(artifact => (
                            <option key={artifact.id} value={artifact.id}>
                              {artifact.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="step-actions">
                      {readOnly && (<button
                        onClick={handleSaveStep}
                        className="step-action-btn step-action-primary"
                        type="button"
                      >
                        {editingStepId !== null ? '💾 Enregistrer les modifications' : '✅ Ajouter l\'étape'}
                      </button>
                      )}
                      <button
                        onClick={() => {
                          setShowAddStep(false);
                          setEditingStepId(null);
                          setErrors(prev => ({ ...prev, stepTitle: undefined }));
                        }}
                        className="step-action-btn step-action-secondary"
                        type="button"
                      >
                        ❌ Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Boutons de sauvegarde */}
        <div className="form-actions">
          <button
            onClick={() => router.push('/organiser')}
            className="form-btn form-btn-cancel"
            type="button"
          >
            ↩️ Annuler
          </button>
          {!readOnly && (
            <>
              <button
                onClick={handleSaveDraftHunt}
                disabled={saving || loading}
                className="form-btn form-btn-draft"
                type="button"
              >
                {saving ? (
                  <>
                    <span className="btn-spinner">⏳</span>
                    Sauvegarde du brouillon...
                  </>
                ) : (
                  '📝 Enregistrer comme brouillon'
                )}
              </button>
              <button
                onClick={handleSaveHunt}
                disabled={saving || loading}
                className="form-btn form-btn-save"
                type="button"
              >
                {saving ? (
                  <>
                    <span className="btn-spinner">⏳</span>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    {isEdit ? '✏️ Modifier la chasse' : '🆕 Créer la chasse'}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
      </div>
      </View>
  );
};

export default HuntFormPage;
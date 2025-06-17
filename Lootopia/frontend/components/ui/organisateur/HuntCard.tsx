import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import '../../../app/src/styles.css';
import Constants from 'expo-constants';
import { useLocation } from 'wouter';

const API_URL = Constants.expoConfig?.extra?.API_URL;

interface Hunt {
  id: number;
  title: string;
  description: string;
  world: number;
  duration: string;
  mode: number;
  max_participants: number;
  chat_enabled: boolean;
  map_id: number;
  participation_fee: number;
  search_delay: string;
  partner_id: number;
  status: number;
  created_at: string;
  updated_at: string | null;
}

const HuntCard: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, inactive: 0, totalParticipants: 0 });
  const [location, setLocation] = useLocation();

  // Navigation vers création
  const handleCreateNew = () => {
    setLocation('/hunt');
  };

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    if (currentIndex.current < hunts.length - 1) {
      currentIndex.current += 1;
      scrollToCard(currentIndex.current);
    }
  };

  const handlePrev = () => {
    if (currentIndex.current > 0) {
      currentIndex.current -= 1;
      scrollToCard(currentIndex.current);
    }
  };

  // Navigation vers édition
  const handleEdit = (huntId: number) => {
    setLocation(`/hunt/${huntId}`);
  };

  const handleDelete = async (huntId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chasse ?')) {
      try {
        const response = await fetch(`${API_URL}/hunts?id=${huntId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setHunts(hunts.filter(hunt => hunt.id !== huntId));
        } else {
          const errorData = await response.json();
          alert(`Erreur lors de la suppression : ${errorData.error || response.statusText}`);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };
  

  const toggleStatus = async (huntId: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await fetch(`${API_URL}/hunts?id=${huntId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setHunts(hunts.map(hunt => 
          hunt.id === huntId 
            ? { ...hunt, status: newStatus }
            : hunt
        ));
      } else {
        alert('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getModeInfo = (mode: number) => {
    const modes = {
      1: { name: 'Solo', icon: 'user', color: '#2196f3' },
      2: { name: 'Équipe', icon: 'users', color: '#4CAF50' },
      3: { name: 'Compétition', icon: 'trophy', color: '#ff9800' },
      4: { name: 'Coopératif', icon: 'handshake-o', color: '#9c27b0' }
    };
    return modes[mode as keyof typeof modes] || { name: 'Standard', icon: 'play', color: '#666' };
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? '#4CAF50' : '#f44336';
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

  const formatDuration = (duration: string) => {
    const date = new Date(duration);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const formatSearchDelay = (delay: string | null | undefined) => {
    if (typeof delay !== 'string' || !delay.includes(':')) {
      return 'N/A'; // ou une autre valeur par défaut ou format alternatif
    }
    const [hours, minutes] = delay.split(':');
    return `${hours}h${minutes}`;
  };
  

  useEffect(() => {
    const fetchHunts = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL + '/hunts?partner_id=1');
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
        const data = await response.json();
        setHunts(data);
        
        // Calculer les statistiques
        const active = data.filter((h: Hunt) => h.status === 1).length;
        const inactive = data.filter((h: Hunt) => h.status === 0).length;
        const totalParticipants = data.reduce((sum: number, h: Hunt) => sum + h.max_participants, 0);
        setStats({ active, inactive, totalParticipants });
      } catch (error) {
        console.error('Erreur lors de la récupération des chasses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHunts();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="section-title">Mes chasses</h2>
        <div className="hunting-card-row">
          <div className="hunting-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="spinner" size={30} className="fa-spin" />
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hunts.length === 0) {
    return (
      <div>
        <h2 className="section-title">Mes chasses</h2>
        <div className="hunting-card-row">
          <div className="hunting-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="search" size={40}/>
            <p style={{ color: '#666' }}>Aucune chasse disponible</p>
            <button className="add-button" onClick={handleCreateNew} style={{ marginTop: '10px' }}>
              <Icon name="plus" size={16} /> Créer une chasse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 className="section-title">Mes chasses ({hunts.length})</h2>
        <button className="add-button" onClick={handleCreateNew}>
          <Icon name="plus" size={16} /> Nouvelle chasse
        </button>
      </div>

      <div className="stats-row" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div className="stat-item">
          <Icon name="check-circle" size={16} style={{ color: '#4CAF50' }} />
          <span>Actives: {stats.active}</span>
        </div>
        <div className="stat-item">
          <Icon name="times-circle" size={16} style={{ color: '#f44336' }} />
          <span>Inactives: {stats.inactive}</span>
        </div>
        <div className="stat-item">
          <Icon name="users" size={16} style={{ color: '#2196f3' }} />
          <span>Places totales: {stats.totalParticipants}</span>
        </div>
      </div>

      <div className="hunting-card-row">
        <button 
          onClick={handlePrev} 
          className="icon-button"
          disabled={currentIndex.current === 0}
          style={{ opacity: currentIndex.current === 0 ? 0.5 : 1 }}
        >
          <Icon name="chevron-left" size={30} />
        </button>

        <div
          className="scroll-container"
          ref={scrollRef}
          style={{ overflowX: 'hidden', display: 'flex' }}
        >
          {hunts.map((hunt) => {
            const modeInfo = getModeInfo(hunt.mode);
            return (
              <div key={hunt.id} className="hunting-card hunt-card">
                <div className="card-header">
                  <div className="card-icon">
                    <Icon name={modeInfo.icon} size={24} color={modeInfo.color} />
                  </div>
                  <div className="card-actions">
                    <button 
                      className={`action-btn status-btn ${hunt.status === 1 ? 'active' : 'inactive'}`}
                      onClick={() => toggleStatus(hunt.id, hunt.status)}
                      title={hunt.status === 1 ? 'Désactiver' : 'Activer'}
                    >
                      <Icon name={hunt.status === 1 ? 'play' : 'pause'} size={14} />
                    </button>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(hunt.id)}
                      title="Éditer"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(hunt.id)}
                      title="Supprimer"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
                
                <h3 className="card-title">{hunt.title}</h3>
                <p className="card-description">{hunt.description}</p>
                
                <div className="card-details">
                  <div className="detail-row">
                    <Icon name={modeInfo.icon} size={12} style={{ color: modeInfo.color }} />
                    <span>{modeInfo.name}</span>
                  </div>
                  <div className="detail-row">
                    <Icon name="users" size={12} />
                    <span>{hunt.max_participants} places</span>
                  </div>
                  <div className="detail-row">
                    <Icon name="clock-o" size={12} />
                    <span>Délai: {formatSearchDelay(hunt.search_delay)}</span>
                  </div>
                  <div className="detail-row">
                    <Icon name="circle" size={8} style={{ color: getStatusColor(hunt.status) }} />
                    <span>{getStatusText(hunt.status)}</span>
                  </div>
                  {hunt.participation_fee > 0 && (
                    <div className="detail-row">
                      <Icon name="euro" size={12} />
                      <span>{hunt.participation_fee}€</span>
                    </div>
                  )}
                  {hunt.chat_enabled && (
                    <div className="detail-row">
                      <Icon name="comments" size={12} style={{ color: '#4CAF50' }} />
                      <span>Chat activé</span>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <small className="creation-date">
                    Créée le {new Date(hunt.created_at).toLocaleDateString('fr-FR')}
                  </small>
                  <small className="duration-date">
                    Fin: {formatDuration(hunt.duration)}
                  </small>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={handleNext} 
          className="icon-button"
          disabled={currentIndex.current === hunts.length - 1}
          style={{ opacity: currentIndex.current === hunts.length - 1 ? 0.5 : 1 }}
        >
          <Icon name="chevron-right" size={30} />
        </button>
      </div>
    </div>
  );
};

export default HuntCard;
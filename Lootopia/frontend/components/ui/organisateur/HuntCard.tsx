import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import '../../../app/src/styles.css';
import Constants from 'expo-constants';
import { useLocation } from 'wouter';
import { useRouter } from 'expo-router';

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
  code_secret: string | null;
}

const HuntCard: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, inactive: 0, totalParticipants: 0 });
  const router = useRouter();
  const [scrollIndex, setScrollIndex] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 0 | 1 | 3 | 4>('all');
  const [revealedId, setRevealedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);



  // Navigation vers création
  const handleCreateNew = () => {
    router.push('/hunt');
  };

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 0;
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
    router.push(`/hunt/${huntId}`);
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
    switch (status) {
      case 0: return '#9e9e9e'; // gris
      case 1: return '#4CAF50'; // vert
      case 3: return '#ff9800'; // orange (brouillon)
      case 4: return '#607d8b'; // bleu-gris (clôturée)
      default: return '#ccc';
    }
  };
  

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Inactive';
      case 1: return 'Active';
      case 3: return 'Brouillon';
      case 4: return 'Clôturée';
      default: return 'Inconnu';
    }
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

  const handleCloseHunt = async (huntId: number) => {
    if (window.confirm("Clôturer cette chasse ? Cette action est irréversible.")) {
      try {
        const response = await fetch(`${API_URL}/hunts?id=${huntId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: 4 }), // Clôturée
        });

        if (response.ok) {
          const updated = await response.json();
          setHunts(hunts.map(h => h.id === huntId ? updated : h));
        } else {
          alert("Erreur lors de la clôture de la chasse.");
        }
      } catch (err) {
        console.error("Erreur lors de la clôture :", err);
        alert("Erreur inattendue.");
      }
    }
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

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;

      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 1;

      const index = Math.round(scrollLeft / cardWidth);
      currentIndex.current = index;
      setScrollIndex(index);
    };

    const el = scrollRef.current;
    el?.addEventListener('scroll', handleScroll);

    return () => el?.removeEventListener('scroll', handleScroll);
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

  const filteredHunts = filterStatus === 'all'
  ? hunts
  : hunts.filter(h => h.status === filterStatus);


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 className="section-title">Mes chasses ({hunts.length})</h2>
        <button className="add-button" onClick={handleCreateNew}>
          <Icon name="plus" size={16} /> Nouvelle chasse
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div>
        <strong>Total :</strong> {hunts.length} chasses | <strong>Affichées :</strong> {filteredHunts.length}
      </div>
      <div>
        <label htmlFor="filter-select" style={{ marginRight: '8px' }}><strong>Filtrer :</strong></label>
        <select
          id="filter-select"
          value={filterStatus}
          onChange={(e) => {
            const val = e.target.value;
            setFilterStatus(val === 'all' ? 'all' : parseInt(val) as 0 | 1 | 3 | 4);
          }}
          className="filter-select"
        >
          <option value="all">Toutes les chasses</option>
          <option value="1">Actives</option>
          <option value="0">Inactives</option>
          <option value="3">Brouillons</option>
          <option value="4">Clôturées</option>
        </select>
      </div>
    </div>

      <div className="hunting-card-row">
        <button 
          onClick={handlePrev}
          className={`icon-button ${scrollIndex === 0 ? 'disabled' : ''}`}
        >
          <Icon name="chevron-left" size={30} />
        </button>

        <div
          className="scroll-container"
          ref={scrollRef}
          style={{ overflowX: 'hidden', display: 'flex' }}
        >
          {filteredHunts.map((hunt) => {
            const modeInfo = getModeInfo(hunt.mode);
            return (
              <div
                key={hunt.id}
                className={`hunting-card hunt-card ${
                  hunt.status === 4
                    ? 'hunt-closed'
                    : hunt.status === 3
                    ? 'hunt-draft'
                    : hunt.status === 0
                    ? 'hunt-inactive'
                    : 'hunt-active'
                }`}                
              >
                <div className="card-header">
                  <div className="card-icon">
                    <Icon name={modeInfo.icon} size={24} color={modeInfo.color} />
                  </div>
                  <div className="card-actions">
                  
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(hunt.id)}
                      title="Éditer"
                    >
                      {hunt.status !== 4 && (<Icon name="edit" size={14} />)}
                      {hunt.status == 4 && (<Icon name="eye" size={14} />)}
                      </button>
                      
                    {hunt.status !== 4 && (
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={hunt.status === 1}
                        onChange={() => {
                          if (hunt.status === 1) {
                            if (window.confirm('Voulez-vous vraiment désactiver cette chasse ?')) {
                              toggleStatus(hunt.id, hunt.status);
                            }
                          } else {
                            if (window.confirm('Voulez-vous vraiment activer cette chasse ?')) {
                              toggleStatus(hunt.id, hunt.status);
                            }
                          }
                        }}
                      />
                      <span className="slider round" title={hunt.status === 1 ? 'Active' : 'Inactive'}></span>
                      </label>
                      )}
                    {hunt.status !== 4 && (
                      <button
                        className="action-btn close-btn"
                        onClick={() => handleCloseHunt(hunt.id)}
                        title="Clôturer"
                      >
                        <Icon name="lock" size={14} />
                      </button>
                    )}
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
                
                <div className="card-details">
                  <div className="detail-row">
                    <Icon name="circle" size={8} style={{ color: getStatusColor(hunt.status) }} />
                    <span>{getStatusText(hunt.status)}</span>
                  </div>
                  <div className="detail-row">
                    {hunt.mode === 0 ? <Icon name="lock" size={12} /> : <Icon name="unlock" size={12} />}
                    <span>{hunt.mode === 0 ? "Privée" : "Public"}</span>
                  </div>
                  <div className="detail-row">
                    <Icon name="users" size={12} />
                    <span>{hunt.max_participants ?? "∞"} participants max</span>
                  </div>
                  <div className="detail-row">
                    <Icon name="euro" size={12} />
                    <span>{hunt.participation_fee} €</span>
                  </div>
                </div>

                <div className="card-extras">
                  <div className="hunt-actions-row">
                    <button
                      className="participants-btn"
                      onClick={() => router.push(`/hunt/${hunt.id}/participants`)}
                    >
                      <Icon name="users" size={14} /> Participants
                    </button>
                    {hunt.code_secret && (
                    <div className="secret-box">
                      <span className="secret-label">Code</span>
                      <div className="secret-mask">
                        {hunt.id === revealedId ? hunt.code_secret : '••••••••'}
                      </div>
                      <div className="secret-buttons">
                        <button
                          onClick={() =>
                            setRevealedId(hunt.id === revealedId ? null : hunt.id)
                          }
                        >
                          <Icon name={hunt.id === revealedId ? 'eye-slash' : 'eye'} size={12} /> {hunt.id === revealedId ? 'Masquer' : 'Voir'}
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(hunt.code_secret || '');
                            setCopiedId(hunt.id);
                            setTimeout(() => setCopiedId(null), 1500);
                          }}
                        >
                          <Icon name="clipboard" size={12} /> Copier
                        </button>
                        </div>
                        {copiedId === hunt.id && (
                          <div className="copy-feedback">Code copié ✓</div>
                        )}
                      </div>
                      )}
                  </div>
                </div>
                
                <div className="card-footer">
                  <small className="creation-date">
                    Créée le {new Date(hunt.created_at).toLocaleDateString('fr-FR')}
                  </small>
                  <small className="update-date">
                    Mise à jour le {hunt.updated_at ? new Date(hunt.updated_at).toLocaleDateString('fr-FR') : '—'}
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
          disabled={scrollIndex >= hunts.length - 1}
          style={{ opacity: scrollIndex >= hunts.length - 1 ? 0.5 : 1 }}
        >
          <Icon name="chevron-right" size={30} />
        </button>
      </div>
    </div>
  );
};

export default HuntCard;
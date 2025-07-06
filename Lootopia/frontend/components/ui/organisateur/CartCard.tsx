import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import '../../../app/src/styles.css';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

const API_URL = Constants.expoConfig?.extra?.API_URL;

interface Map {
  id: number;
  name: string;
  skin: number;
  zone: string;
  scale: string;
  partner_id: number;
  status: number;
  created_at: string;
  updated_at: string | null;
}

const CartCard: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    if (currentIndex.current < maps.length - 1) {
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

  const handleEdit = (mapId: number) => {
    router.push({
      pathname: '/map/[id]',
      params: { id: String(mapId) }
    });    
  };  

  const handleDelete = async (mapId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      try {
        const response = await fetch(`${API_URL}/maps?id=${mapId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setMaps(maps.filter(map => map.id !== mapId));
        } else {
          alert('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? '#4CAF50' : '#f44336';
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

  const getSkinIcon = (skin: number) => {
    const skinIcons = {
      1: 'map-o',
      2: 'globe',
      3: 'compass',
      4: 'location-arrow'
    };
    return skinIcons[skin as keyof typeof skinIcons] || 'map-o';
  };

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL + '/maps?partner_id=1');
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
        const data = await response.json();
        setMaps(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des cartes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, []);

  const handleCreateNew = () => {
    router.push('/map/index');
  };

  if (loading) {
    return (
      <div>
        <h2 className="section-title">Mes cartes</h2>
        <div className="hunting-card-row">
          <div className="hunting-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="spinner" size={30} className="fa-spin" />
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (maps.length === 0) {
    return (
      <div>
        <h2 className="section-title">Mes cartes</h2>
        <div className="hunting-card-row">
          <div className="hunting-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="map-o" size={40} />
            <p style={{ color: '#666' }}>Aucune carte disponible</p>
            <button className="add-button" style={{ marginTop: '10px' }} onClick={handleCreateNew}>
              <Icon name="plus" size={16} /> Créer une carte
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="section-title">Mes cartes ({maps.length})</h2>
        <button className="add-button" onClick={handleCreateNew}>
          <Icon name="plus" size={16} /> Nouvelle carte
        </button>
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
          {maps.map((map) => (
            <div key={map.id} className="hunting-card map-card">
              <div className="card-header">
                <div className="card-icon">
                  <Icon name={getSkinIcon(map.skin)} size={24} color="#007bff" />
                </div>
                <div className="card-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(map.id)}
                    title="Éditer"
                  >
                    <Icon name="edit" size={14} />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(map.id)}
                    title="Supprimer"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
              
              <h3 className="card-title">{map.name}</h3>
              
              <div className="card-details">
                <div className="detail-row">
                  <Icon name="location-arrow" size={12} />
                  <span>{map.zone || 'Zone non définie'}</span>
                </div>
                <div className="detail-row">
                  <Icon name="search" size={12} />
                  <span>Échelle {map.scale}</span>
                </div>
                <div className="detail-row">
                  <Icon name="circle" size={8} style={{ color: getStatusColor(map.status) }} />
                  <span>{getStatusText(map.status)}</span>
                </div>
              </div>

              <div className="card-footer">
                <small className="creation-date">
                  Créée le {new Date(map.created_at).toLocaleDateString('fr-FR')}
                </small>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleNext} 
          className="icon-button"
          disabled={currentIndex.current === maps.length - 1}
          style={{ opacity: currentIndex.current === maps.length - 1 ? 0.5 : 1 }}
        >
          <Icon name="chevron-right" size={30} />
        </button>
      </div>
    </div>
  );
};

export default CartCard;
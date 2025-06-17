import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import '../../../app/src/styles.css';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

interface Collection {
  id: number;
  name: string;
  admin_id: number;
  type: number;
  status: number;
  created_at: string;
  updated_at: string | null;
}

const CollectionsCard: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, inactive: 0 });

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
    if (currentIndex.current < collections.length - 1) {
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

  const handleEdit = (collectionId: number) => {
    console.log(`Éditer la collection ${collectionId}`);
    // Logique pour éditer la collection
  };

  const handleDelete = async (collectionId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette collection ?')) {
      try {
        const response = await fetch(`${API_URL}/collections/${collectionId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setCollections(collections.filter(collection => collection.id !== collectionId));
        } else {
          alert('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const toggleStatus = async (collectionId: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await fetch(`${API_URL}/collections/${collectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setCollections(collections.map(collection => 
          collection.id === collectionId 
            ? { ...collection, status: newStatus }
            : collection
        ));
      } else {
        alert('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getTypeInfo = (type: number) => {
    const types = {
      1: { name: 'Publique', icon: 'globe', color: '#4CAF50' },
      2: { name: 'Privée', icon: 'lock', color: '#ff9800' },
      3: { name: 'Premium', icon: 'star', color: '#9c27b0' },
      4: { name: 'Collaborative', icon: 'users', color: '#2196f3' }
    };
    return types[type as keyof typeof types] || { name: 'Standard', icon: 'folder', color: '#666' };
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? '#4CAF50' : '#f44336';
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL + '/collections?admin_id=1');
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
        const data = await response.json();
        setCollections(data);
        
        // Calculer les statistiques
        const active = data.filter((c: Collection) => c.status === 1).length;
        const inactive = data.filter((c: Collection) => c.status === 0).length;
        setStats({ active, inactive });
      } catch (error) {
        console.error('Erreur lors de la récupération des collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="section-title">Mes collections</h2>
        <div className="hunting-card-row">
          <div className="hunting-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="spinner" size={30} className="fa-spin" />
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div>
        <h2 className="section-title">Mes collections</h2>
        <div className="hunting-card-row">
          <div className="hunting-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="folder-open" size={40} />
            <p style={{ color: '#666' }}>Aucune collection disponible</p>
            <button className="add-button" style={{ marginTop: '10px' }}>
              <Icon name="plus" size={16} /> Créer une collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 className="section-title">Mes collections ({collections.length})</h2>
        <button className="add-button">
          <Icon name="plus" size={16} /> Nouvelle collection
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
          {collections.map((collection) => {
            const typeInfo = getTypeInfo(collection.type);
            return (
              <div key={collection.id} className="hunting-card collection-card">
                <div className="card-header">
                  <div className="card-icon">
                    <Icon name={typeInfo.icon} size={24} color={typeInfo.color} />
                  </div>
                  <div className="card-actions">
                    <button 
                      className={`action-btn status-btn ${collection.status === 1 ? 'active' : 'inactive'}`}
                      onClick={() => toggleStatus(collection.id, collection.status)}
                      title={collection.status === 1 ? 'Désactiver' : 'Activer'}
                    >
                      <Icon name={collection.status === 1 ? 'eye' : 'eye-slash'} size={14} />
                    </button>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(collection.id)}
                      title="Éditer"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(collection.id)}
                      title="Supprimer"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
                
                <h3 className="card-title">{collection.name}</h3>
                
                <div className="card-details">
                  <div className="detail-row">
                    <Icon name={typeInfo.icon} size={12} style={{ color: typeInfo.color }} />
                    <span>{typeInfo.name}</span>
                  </div>
                  <div className="detail-row">
                    <Icon name="circle" size={8} style={{ color: getStatusColor(collection.status) }} />
                    <span>{getStatusText(collection.status)}</span>
                  </div>
                  <div className="detail-row">
                    <Icon name="user" size={12} />
                    <span>Admin ID: {collection.admin_id}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <small className="creation-date">
                    Créée le {new Date(collection.created_at).toLocaleDateString('fr-FR')}
                  </small>
                  {collection.updated_at && (
                    <small className="update-date">
                      Modifiée le {new Date(collection.updated_at).toLocaleDateString('fr-FR')}
                    </small>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={handleNext} 
          className="icon-button"
          disabled={currentIndex.current === collections.length - 1}
          style={{ opacity: currentIndex.current === collections.length - 1 ? 0.5 : 1 }}
        >
          <Icon name="chevron-right" size={30} />
        </button>
      </div>
    </div>
  );
};

export default CollectionsCard;
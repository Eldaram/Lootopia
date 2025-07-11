import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import '../../../app/src/styles.css';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { Colors } from '@/constants/Colors';

const API_URL = Constants.expoConfig?.extra?.API_URL;

interface Artifact {
  id: number;
  title: string | null;
  type: number | null;
  theme_id: number | null;
  rarity: number | null;
  illustration_id: number | null;
  collection_id: number | null;
  usage: number | null;
  admin_id: number;
  status: number;
  created_at: string;
  updated_at: string | null;
}

const RecompensesCard: React.FC = () => {
  const { theme } = useTheme();
  const themeColors = Colors[theme]; 
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 0 | 1>('all');
  const router = useRouter();
  const params = useLocalSearchParams();
  const collectionIdParam = Array.isArray(params.collection_id)
    ? parseInt(params.collection_id[0])
    : parseInt(params.collection_id || '0');

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
    if (currentIndex.current < artifacts.length - 1) {
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

  const handleEdit = (artifactId: number) => {
    router.push({
      pathname: '/recompense/[id]',
      params: { id: String(artifactId) }
    });
  };

  const handleCreateNew = () => {
    router.push(`/recompense/index?collection_id=${collectionIdParam}`);
  };

  const handleDelete = async (artifactId: number) => {
    if (window.confirm('Supprimer cette récompense ?')) {
      try {
        const response = await fetch(`${API_URL}/artifacts?id=${artifactId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setArtifacts(artifacts.filter(r => r.id !== artifactId));
        } else {
          alert('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const toggleStatus = async (artifactId: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await fetch(`${API_URL}/artifacts?id=${artifactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updated = await response.json();
        setArtifacts(artifacts.map(a => a.id === artifactId ? updated : a));
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (status: number) => status === 1 ? '#4CAF50' : '#f44336';
  const getStatusText = (status: number) => status === 1 ? 'Active' : 'Inactive';

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        setLoading(true);
        const url = collectionIdParam
          ? `${API_URL}/artifacts?collection_id=${collectionIdParam}`
          : `${API_URL}/artifacts?admin_id=1`;

        const response = await fetch(url);
        const data = await response.json();
        setArtifacts(data);
      } catch (error) {
        console.error('Erreur récupération:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtifacts();
  }, []);

  const filteredArtifacts = filterStatus === 'all'
    ? artifacts
    : artifacts.filter(a => a.status === filterStatus);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <div>
        <h2 className="section-title">Mes récompenses</h2>
        <div className="hunting-card-row">
          <div className="hunting-card">
            <Icon name="spinner" size={30} className="fa-spin" />
            <p>Chargement...</p>
          </div>
        </div>
        </div>
        </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 className="section-title">Mes récompenses ({artifacts.length})</h2>
        <button className="add-button" onClick={handleCreateNew}>
          <Icon name="plus" size={16} /> Nouvelle récompense
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <strong>Total :</strong> {artifacts.length} | <strong>Affichées :</strong> {filteredArtifacts.length}
        </div>
        <div>
          <label htmlFor="filter-status" style={{ marginRight: '8px' }}><strong>Filtrer :</strong></label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => {
              const val = e.target.value;
              setFilterStatus(val === 'all' ? 'all' : parseInt(val) as 0 | 1);
            }}
            className="filter-select"
          >
            <option value="all">Toutes</option>
            <option value="1">Actives</option>
            <option value="0">Inactives</option>
          </select>
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

        <div className="scroll-container" ref={scrollRef} style={{ overflowX: 'hidden', display: 'flex' }}>
          {filteredArtifacts.map((artifact) => (
            <div key={artifact.id} className={`hunting-card artifact-card ${artifact.status === 0 ? 'disabled-card' : ''}`}>
              <div className="card-header">
                <div className="card-icon">
                  <Icon name="gift" size={24} color="#ff9800" />
                </div>
                <div className="card-actions">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={artifact.status === 1}
                      onChange={() => {
                        const confirmMsg = artifact.status === 1
                          ? 'Désactiver cette récompense ?'
                          : 'Activer cette récompense ?';
                        if (window.confirm(confirmMsg)) {
                          toggleStatus(artifact.id, artifact.status);
                        }
                      }}
                    />
                    <span className="slider round" title={getStatusText(artifact.status)}></span>
                  </label>
                  <button className="action-btn edit-btn" onClick={() => handleEdit(artifact.id)} title="Éditer">
                    <Icon name="edit" size={14} />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(artifact.id)} title="Supprimer">
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>

              <h3 className="card-title">{artifact.title ?? 'Récompense'}</h3>

              <div className="card-details">
                <div className="detail-row">
                  <Icon name="star" size={12} />
                  <span>Rareté : {artifact.rarity ?? 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <Icon name="folder" size={12} />
                  <span>Collection : {artifact.collection_id ?? 'Aucune'}</span>
                </div>
                <div className="detail-row">
                  <Icon name="circle" size={8} style={{ color: getStatusColor(artifact.status) }} />
                  <span>{getStatusText(artifact.status)}</span>
                </div>
              </div>

              <div className="card-footer">
                <small className="creation-date">Créée le {new Date(artifact.created_at).toLocaleDateString('fr-FR')}</small>
                {artifact.updated_at && (
                  <small className="update-date">Modifiée le {new Date(artifact.updated_at).toLocaleDateString('fr-FR')}</small>
                )}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="icon-button"
          disabled={currentIndex.current === artifacts.length - 1}
          style={{ opacity: currentIndex.current === artifacts.length - 1 ? 0.5 : 1 }}
        >
          <Icon name="chevron-right" size={30} />
        </button>
      </div>
      </div>
      </View>
  );
};

export default RecompensesCard;

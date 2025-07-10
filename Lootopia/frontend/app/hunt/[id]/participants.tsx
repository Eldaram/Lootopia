import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  ActivityIndicator
} from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { Colors } from '@/constants/Colors';
import '@/app/src/styles.css';
import { View } from 'react-native';

const API_URL = Constants.expoConfig?.extra?.API_URL;

interface Participant {
  id: number;
  user_id: number;
  email: string | null;
  username: string | null;
  excluded: boolean;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

const ParticipantsScreen = () => {
  const { id } = useLocalSearchParams();
  const huntId = Number(id);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'excluded'>('all');

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { theme } = useTheme();
  const themeColors = Colors[theme];

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/hunts_participants?hunt_id=${huntId}`);
      const data = await res.json();
      setParticipants(data);
    } catch {
      setErrorMsg("Erreur lors du chargement des participants.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search) return;
    setIsSearching(true);
    try {
      const res = await fetch(`${API_URL}/users?search=${search}`);
      const data = await res.json();
      setSearchResults(data);
    } catch {
      setErrorMsg("Erreur lors de la recherche.");
    }
  };

  const handleAddOrBan = async (user: User, exclude = false) => {
    try {
      const res = await fetch(`${API_URL}/hunts_participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hunt_id: huntId,
          email: user.email,
          username: user.username,
          excluded: exclude,
        })
      });
      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(err.error || 'Erreur.');
      } else {
        setSearchResults([]);
        setSearch('');
        setIsSearching(false);
        fetchParticipants();
      }
    } catch {
      setErrorMsg("Erreur réseau.");
    }
  };
  

  const toggleExclusion = async (participantId: number, current: boolean) => {
    try {
      await fetch(`${API_URL}/hunts_participants?id=${participantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ excluded: !current })
      });
      fetchParticipants();
    } catch {
      setErrorMsg("Erreur de mise à jour.");
    }
  };

  const filteredParticipants = participants.filter(p =>
    filter === 'all' || (filter === 'active' && !p.excluded) || (filter === 'excluded' && p.excluded)
  );

  useEffect(() => {
    if (huntId) fetchParticipants();
  }, [huntId]);

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
    <div className={`participants-container ${theme}`}>
      <h1 className="participants-title" style={{color: themeColors.text}}>Participants de la chasse #{huntId}</h1>

      <div className="participants-card">
        <h2 className="participants-subtitle">Ajouter ou bannir un utilisateur</h2>
        <div className="participants-row">
          <input
            className="participants-input"
            placeholder="Rechercher email ou username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="participants-btn" onClick={handleSearch}>
            <Icon name="search" size={16} color="white" />
          </button>
        </div>

        {isSearching && searchResults.map(user => (
          <div key={user.id} className="participants-result-row">
            <span>{user.email || user.username}</span>
            <div className="participants-actions">
              <button onClick={() => handleAddOrBan(user, false)} className="participants-icon-button">
                <Icon name="plus" size={16} color="green" />
              </button>
              <button onClick={() => handleAddOrBan(user, true)} className="participants-icon-button">
                <Icon name="ban" size={16} color="red" />
              </button>
            </div>
          </div>
        ))}

        {isSearching && (
          <button className="participants-link" onClick={() => { setIsSearching(false); setSearchResults([]); }}>
            Retour à la liste
          </button>
        )}
      </div>

      {!isSearching && (
        <div className="participants-card">
          <h2 className="participants-subtitle">Liste des participants</h2>
          <select className="participants-picker" value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'excluded')}>
            <option value="all">Tous</option>
            <option value="active">Ajoutés</option>
            <option value="excluded">Exclus</option>
          </select>

          {loading ? (
            <ActivityIndicator />
          ) : (
            filteredParticipants.map((item, index) => (
              <div key={item.id} className="participants-result-row">
                <span>{index + 1}. {item.email || item.username}</span>
                <span className={item.excluded ? 'participants-status-excluded' : 'participants-status-active'}>
                  {item.excluded ? 'Exclu' : 'Ajouté'}
                </span>
                <button onClick={() => toggleExclusion(item.id, item.excluded)} className="participants-icon-button">
                  <Icon name={item.excluded ? 'undo' : 'ban'} size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {errorMsg && <p className="participants-error">{errorMsg}</p>}
      </div>
      </View>
  );
};

export default ParticipantsScreen;

import React from 'react';
import '../../../app/src/styles.css';

export const InfoCard: React.FC = () => {
  return (
    <div className="info-card">
      <div className="info-section">
        <p className="info-title">Achetez le !</p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/263/263115.png"
          alt="Gems"
          className="info-image"
        />
        <p className="info-price">3,99 €</p>
        <p className="info-description">1500 Gemmes +<br />3000 pièces d’or</p>
      </div>

      <div className="info-section">
        <p className="info-title">Mes derniers artéfacts</p>
        <p className="info-item">👁️ L’œil d’Astra</p>
        <p className="info-item">👁️ L’œil d’Astra</p>
        <p className="info-item">👁️ L’œil d’Astra</p>
      </div>

      <div className="info-section">
        <p className="info-title">Meilleurs Chasseurs</p>
        <p className="info-item">🥇 ShadowFlux</p>
        <p className="info-item">🥈 ShadowFlux</p>
        <p className="info-item">🥉 ShadowFlux</p>
      </div>
    </div>
  );
};
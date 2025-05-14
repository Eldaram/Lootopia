import React, { useRef, useState, useLayoutEffect } from 'react';
import { InfoCard } from '@/components/ui/home/InfoCard';
import Icon from 'react-native-vector-icons/FontAwesome';
import '../../../app/src/styles.css';


const EvenementCard: React.FC = () => {
  const totalCards = 5;
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);

  const [cardWidth, setCardWidth] = useState(window.innerWidth * 0.3);

  useLayoutEffect(() => {
    const updateCardWidth = () => {
      const screenWidth = window.innerWidth;
      setCardWidth(screenWidth * 0.3);
    };

    updateCardWidth();

    window.addEventListener('resize', updateCardWidth);

    return () => {
      window.removeEventListener('resize', updateCardWidth);
    };
  }, []);

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    if (currentIndex.current < totalCards - 1) {
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

  return (
    <div>
    <h2 className="section-title">Évènements</h2>
    <div className="evenement-card-container">
      <div className="evenement-card-section">
        <div className="evenement-card-row">
          <button onClick={handlePrev} className="icon-button">
            <Icon name="chevron-left" size={24} />
          </button>

          <div
            ref={scrollRef}
            className="scroll-container"
          >
            <div className="scroll-track">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="evenement-card">
                  <h3 className="card-title">{`Évènement ${item}`}</h3>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleNext} className="icon-button">
            <Icon name="chevron-right" size={24} />
          </button>
        </div>
      </div>

      <div className="info-card-container">
        <InfoCard />
      </div>
      </div>
      </div>
  );
};

export default EvenementCard;
import React, { useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import '../../../app/src/styles.css';

const HuntingCard: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const totalCards = 4;


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
      <h2 className="section-title">Chasses disponibles 🟢</h2>

      <div className="hunting-card-row">
        <button onClick={handlePrev} className="icon-button">
          <Icon name="chevron-left" size={30} />
        </button>

        <div
          className="scroll-container"
          ref={scrollRef}
          style={{ overflowX: 'hidden', display: 'flex' }}
        >
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="hunting-card">
              <h3 className="card-title">{`Chasse ${item}`}</h3>
              <p className="card-description">{`Description courte de la chasse ${item}`}</p>
            </div>
          ))}
        </div>

        <button onClick={handleNext} className="icon-button">
          <Icon name="chevron-right" size={30} />
        </button>
      </div>
    </div>
  );
};

export default HuntingCard;
import img1 from "/src/assets/images/9438.png";
import img2 from "/src/assets/images/9439.png";
import img3 from "/src/assets/images/9440.png";
import img4 from "/src/assets/images/9441.png";
import img5 from "/src/assets/images/9442.png";
import img6 from "/src/assets/images/20289.png";
import img7 from "/src/assets/images/20290.png";
import { Link } from "react-router-dom";

const linkItems = [
  { id: 1, name: 'Casino', href: '/casino', image: img1 },
  { id: 2, name: 'Casino en vivo', href: '/live-casino', image: img2 },
  { id: 3, name: 'Deporte', href: '/sports', image: img3 },
  { id: 4, name: 'Deporte en vivo', href: '/live-sports', image: img4 },
  // { id: 5, name: 'Esport', href: '/esport', image: img5 },
  // { id: 6, name: 'Fast Games', href: '/fast-games-lobby', image: img6 },
  // { id: 7, name: 'Cash Back', href: '/cashback', image: img7 },
];


const LinkCards = () => {
  return (
    <div className="link-cards-wrapper">
      {linkItems.map((item, index) => (
        <Link
          key={item.id}
          to={item.href}
          className={`link-card ${index >= 4 ? 'hide-on-mobile' : ''}`}
        >
          <img src={item.image} alt={item.name} />
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default LinkCards;


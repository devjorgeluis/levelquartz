import React from 'react';
import promoImg1 from '../../assets/images/35868.webp';
import promoImg2 from '../../assets/images/35867.webp';
import promoImg3 from '../../assets/images/35866.webp';
import promoImg4 from '../../assets/images/35865.webp';
import promoImg5 from '../../assets/images/35864.webp';
import promoImg6 from '../../assets/images/35863.webp';
import { Link } from 'react-router-dom';

const promoData = [
  {
    id: 1,
    title: 'GANA PREMIOS - Torneos y promociones',
    href: '/casino',
    desktopImage: promoImg1,
    mobileImage: promoImg1,
  },
  {
    id: 2,
    title: 'POPULAR - Gates of Olympus',
    href: '/live-casino',
    desktopImage: promoImg2,
    mobileImage: promoImg2,
  },
  {
    id: 3,
    title: 'TRENDING - FAST GAMES',
    href: '/live-casino',
    desktopImage: promoImg3,
    mobileImage: promoImg3, // Mobile shows "HOT" version
  },
  {
    id: 4,
    title: 'ROCKETON - Gates of Asgard',
    href: '/live-casino',
    desktopImage: promoImg6,
    mobileImage: promoImg6,
  },
  {
    id: 5,
    title: 'APUESTA EN DEPORTES',
    href: '/sports',
    desktopImage: promoImg4,
    mobileImage: promoImg4,
  },
  {
    id: 6,
    title: 'ROCKETON - Gates of Asgard',
    href: '/live-casino',
    desktopImage: promoImg5,
    mobileImage: promoImg5,
  },
];

const PromoCardGrid = () => {
  return (
    <div className="promo-grid">
      {promoData.map((card, index) => (
        <Link
          key={card.id}
          to={card.href}
          className={`promo-card ${(index === 0 || index === 3) ? 'promo-card-featured' : ''} ${(index === 2 || index === 4) ? 'mobile-hidden' : ''}`}
        >
          <picture>
            {/* Swap image source when viewport is below 1024px */}
            <source media="(max-width: 1023px)" srcSet={card.mobileImage} />
            <img src={card.desktopImage} alt={card.title} loading="lazy" />
          </picture>
        </Link>
      ))}
    </div>
  );
};

export default PromoCardGrid;
import React from 'react';
import img1 from '../../assets/images/tc1.webp';
import img2 from '../../assets/images/tc2.webp';
import img3 from '../../assets/images/tc3.webp';
import img4 from '../../assets/images/tc4.webp';
import img5 from '../../assets/images/tc5.webp';
import img6 from '../../assets/images/tc6.webp';
import img7 from '../../assets/images/tc7.webp';
import img8 from '../../assets/images/tc8.webp';
import img9 from '../../assets/images/tc9.webp';
import { Link } from 'react-router-dom';

const data = [
  {
    id: 1,
    href: '/live-casino',
    desktopImage: img1,
    mobileImage: img1,
  },
  {
    id: 2,
    href: '/live-casino',
    desktopImage: img2,
    mobileImage: img2,
  },
  {
    id: 3,
    href: '/live-casino',
    desktopImage: img3,
    mobileImage: img3, // Mobile shows "HOT" version
  },
  {
    id: 4,
    href: '/live-casino',
    desktopImage: img4,
    mobileImage: img4,
  },
  {
    id: 5,
    href: '/live-casino',
    desktopImage: img5,
    mobileImage: img5,
  },
  {
    id: 6,
    href: '/live-casino',
    desktopImage: img6,
    mobileImage: img6,
  },
  {
    id: 7,
    href: '/live-casino',
    desktopImage: img7,
    mobileImage: img7,
  },
  {
    id: 8,
    href: '/live-casino',
    desktopImage: img8,
    mobileImage: img8,
  },
  {
    id: 9,
    href: '/live-casino',
    desktopImage: img9,
    mobileImage: img9,
  },
];

const TopLiveCasinos = () => {
  return (
    <div className='l5--wrapper l5--wrapper-mobile tb--temporary-banner tb--temporary-first l5--wrapper-space l5--casino-slider'>
      <h3 className="tb--section-header tb--section-header_border tb--section-header_mobile tb--section-header_icon">
        Top Juegos de Casino En Vivo
      </h3>
      <div className="casino-grid">
        {data.map((card, index) => (
          <Link
            key={card.id}
            to={card.href}
            className={`casino-card ${(index === 4) ? 'casino-card-featured' : ''} ${(index === 5) ? 'casino-card-featured-mobile' : ''} ${(index === 8) ? 'mobile-hidden' : ''}`}
          >
            <picture>
              {/* Swap image source when viewport is below 1024px */}
              <source media="(max-width: 1023px)" srcSet={card.mobileImage} />
              <img src={card.desktopImage} loading="lazy" />
            </picture>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopLiveCasinos;
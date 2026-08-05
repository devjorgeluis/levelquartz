import React from 'react';
import img1 from '../../assets/images/bc1.webp';
import img2 from '../../assets/images/bc2.webp';
import img3 from '../../assets/images/bc3.webp';
import img4 from '../../assets/images/bc4.webp';
import img5 from '../../assets/images/bc5.webp';
import img6 from '../../assets/images/bc6.webp';
import img7 from '../../assets/images/bc7.webp';
import img8 from '../../assets/images/bc8.webp';
import img9 from '../../assets/images/bc9.webp';
import { Link } from 'react-router-dom';

const data = [
  {
    id: 1,
    href: '/casino-lobby',
    desktopImage: img1,
    mobileImage: img1,
  },
  {
    id: 2,
    href: '/casino-lobby',
    desktopImage: img2,
    mobileImage: img2,
  },
  {
    id: 3,
    href: '/casino-lobby',
    desktopImage: img3,
    mobileImage: img3, // Mobile shows "HOT" version
  },
  {
    id: 4,
    href: '/fastgames-lobby/',
    desktopImage: img4,
    mobileImage: img4,
  },
  {
    id: 5,
    href: '/sport',
    desktopImage: img5,
    mobileImage: img5,
  },
  {
    id: 6,
    href: '/fastgames-lobby/',
    desktopImage: img6,
    mobileImage: img6,
  },
  {
    id: 7,
    href: '/fastgames-lobby/',
    desktopImage: img7,
    mobileImage: img7,
  },
  {
    id: 8,
    href: '/fastgames-lobby/',
    desktopImage: img8,
    mobileImage: img8,
  },
  {
    id: 9,
    href: '/fastgames-lobby/',
    desktopImage: img9,
    mobileImage: img9,
  },
];

const BestCasinos = () => {
  return (
    <div className='l5--wrapper l5--wrapper-mobile tb--temporary-banner tb--temporary-first l5--wrapper-space l5--casino-slider'>
      <h3 className="tb--section-header tb--section-header_border tb--section-header_mobile tb--section-header_icon"><span className="category_icon-casino"></span>Los mejores juegos de casino</h3>
      <div className="casino-grid">
        {data.map((card, index) => (
          <Link
            key={card.id}
            to={card.href}
            className={`casino-card ${(index === 0) ? 'casino-card-featured' : ''} ${(index === 5) ? 'casino-card-featured-mobile' : ''} ${(index === 8) ? 'mobile-hidden' : ''}`}
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

export default BestCasinos;
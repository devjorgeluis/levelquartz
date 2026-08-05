import React from 'react';
import { Link } from 'react-router-dom';
import img from '../../assets/images/casino-lobby-banner.webp'

const CasinoBanner = () => {
  return (
    <div
      id="custom-casino-full-banner"
      className="l5--wrapper l5--wrapper-mobile l5--wrapper-space custom-casino-full-banner"
    >
      <Link to={"/casino-lobby"}>
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={img}
          />
          <img
            src={img}
            alt="Casino lobby"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </Link>
    </div>
  );
};

export default CasinoBanner;

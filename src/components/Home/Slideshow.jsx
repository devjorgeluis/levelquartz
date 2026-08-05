import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ImgBanner1 from "/src/assets/images/lq_home_banner_1.webp";
import ImgBanner2 from "/src/assets/images/lq_home_banner_2.webp";
import ImgBanner3 from "/src/assets/images/lq_home_banner_3.webp";
import ImgMobileBanner1 from "/src/assets/images/lq_home_mobile_banner_1.webp";
import ImgMobileBanner2 from "/src/assets/images/lq_home_mobile_banner_2.webp";
import ImgMobileBanner3 from "/src/assets/images/lq_home_mobile_banner_3.webp";
import IconNext from "/src/assets/svg/next.svg";
import IconCheck from "/src/assets/svg/check.svg";

const Slideshow = () => {
  const slides = [
    {
      id: 0,
      title: "¡Únete a Betpanda y gana un",
      subtitle: "Reembolso",
      highlight: "SEMANAL 10%",
      imageDesktop: ImgBanner1,
      imageMobile: ImgMobileBanner1
    },
    {
      id: 1,
      title: "Únete a Betpanda y gana",
      subtitle: "APUESTAS GRATIS",
      highlight: "SEMANALES",
      imageDesktop: ImgBanner2,
      imageMobile: ImgMobileBanner2
    },
    {
      id: 2,
      title: "¡Únete a Betpanda y gana",
      subtitle: "HASTA 1 BTC!",
      highlight: "",
      imageDesktop: ImgBanner3,
      imageMobile: ImgMobileBanner3
    }
  ];

  return (
    <div className="panel-section full-width hero-landing-banner hide-logged-in">
      <div className="container-full-width desktop">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: '.slideshow-navigate-next',
            prevEl: '.slideshow-navigate-prev',
          }}
          pagination={{
            el: '.swiper-pagination',
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          // loop={true}
          className="panel-wrapper desktop"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <a className="panel-card link-to">
                <div className="panel-inner">
                  <div className="text-wrapper">
                    <div className="tagline slide-img slide-img-desktop">
                      <span><img alt="Slide image" src={slide.imageDesktop} /></span>
                    </div>
                    <div className="tagline slide-img slide-img-mobile">
                      <span><img alt="Slide image" src={slide.imageMobile} /></span>
                    </div>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="navigate-wrapper navigate-bottom">
        <button type="button" className="navigate-prev slideshow-navigate-prev">
          <svg className="icon icon-arrowLeft" viewBox="0 0 24 24" width="24px" height="24px">
            <title>Arrow Left</title>
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path>
          </svg>
        </button>
        <div className="swiper-pagination"></div>
        <button type="button" className="navigate-prev slideshow-navigate-next">
          <svg className="icon icon-arrowRight" viewBox="0 0 24 24" width="24px" height="24px">
            <title>Arrow Right</title>
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Slideshow

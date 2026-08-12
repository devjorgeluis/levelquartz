import React from 'react';
import ImgBanner1 from "../../assets/images/live-casino-banner.webp";
import ImgMobileBanner1 from "../../assets/images/live-casino-banner-mobile.webp";

const Slideshow = () => {
    // En caso de que haya más banners en el futuro, se pueden agregar aquí.
    const slides = [
        {
            id: 1,
            desktopImage: ImgBanner1,
            mobileImage: ImgMobileBanner1,
            alt: "casino page main section"
        }
    ];

    return (
        <div className="main--slider-top main--slider-right banner-items-count-1">
            <div className="">
                <div className="slick-slider slick-initialized">
                    <div className="slick-list">
                        <div className="slick-track" style={{ width: '100%', left: 0, opacity: 1 }}>
                            {slides.map((slide) => (
                                <div key={slide.id} className="slick-slide slick-active slick-current" style={{ outline: 'none', width: '100%' }}>
                                    <div>
                                        <div style={{ width: '100%', display: 'inline-block' }}>
                                            <picture>
                                                <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
                                                <img
                                                    loading="eager"
                                                    fetchPriority="high"
                                                    src={slide.desktopImage}
                                                    alt={slide.alt}
                                                />
                                            </picture>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slideshow;

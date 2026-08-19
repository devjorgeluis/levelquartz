import React from 'react';
import Slider from 'react-slick';
import certImage from '../../assets/images/20495.jpg'
import providerImage from '../../assets/images/providers_sprite.png'

// Provider data extracted from the HTML (icons are sprites – adjust as needed)
const providers = [
    'pragmatic',
    'rubyplay',
    'fugaso',
    'betsoft',
    'genii',
    'galaxsys',
    'inbet',
    'evoplay',
    'imaginelive',
    'betsolutions',
    'felixgaming',
    'platipus',
    'wazdan',
    'ezugioriginal',
    'worldmatch',
    'digitainvirtualsport',
    'tvbet',
    'vivogaming',
];

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow:
            typeof window === "undefined"
                ? 11
                : window.innerWidth < 480
                    ? 3
                    : window.innerWidth < 768
                        ? 4
                        : window.innerWidth < 1024
                            ? 6
                            : window.innerWidth < 1280
                                ? 8
                                : window.innerWidth < 1562
                                    ? 10
                                    : 11,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 1562,
                settings: { slidesToShow: 10 },
            },
            {
                breakpoint: 1280,
                settings: { slidesToShow: 8 },
            },
            {
                breakpoint: 1024,
                settings: { slidesToShow: 6 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 4 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 2 },
            },
        ],
    };

    return (
        <footer className="footer-container">
            {/* Scroll to top button */}
            <div className="scroll--top-container tb--position-sticky">
                <a className="scroll--top tb--cp" onClick={scrollToTop}>
                    <i className="digi_icon-arrow_up"></i>
                </a>
            </div>

            <div className="footer-container-inner">
                <div className="footer">
                    <div className="tb--widgets-footer previewtable">
                        <div className="tb--widget-container">
                            <div
                                style={{
                                    display: 'grid',
                                    gap: '12px',
                                    gridTemplateColumns: 'repeat(12, 1fr)',
                                    gridTemplateRows: 'auto',
                                }}
                            >
                                {/* License / Certificate */}
                                <div
                                    style={{
                                        gridArea: '9 / 1 / 22 / 4',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        display: 'flex',
                                        padding: '0px',
                                        color: 'rgb(249, 249, 249)',
                                        fontSize: '16px',
                                        position: 'relative',
                                    }}
                                >
                                    <div className="tb--logos-block_wrapper">
                                        <section className="logos-block footer--separator footer--divider-title tb--text_upercase">
                                            <span className="tb--separator"></span>
                                            <div className="logos-block_holder tb--flex">
                                                <div className="logos-block_item">
                                                    <a
                                                        target="_blank"
                                                        href="https://cert.cga.cw/certificate?id=ZXlKcGRpSTZJa2MyT0RoQ1pUaHZSbFJoUlZSYVYybG9ZbXh5VG1jOVBTSXNJblpoYkhWbElqb2lWVzlxU25WbGMxRjNlVTh2TVRCdVZuQktlVkpUUVQwOUlpd2liV0ZqSWpvaVpEWm1aRGxoWW1ZMlpXSXhZelkzTkRrNVpqVTNZbU5oTm1VNU9HWTBaREZqTkdSaE1UaGhaakl3TVdRMU9UQXpaR1F3TVRabE5UWTFZVGMxTXpRd09DSXNJblJoWnlJNklpSjk="
                                                        className="logos-item tb--block"
                                                    >
                                                        <img
                                                            loading="lazy"
                                                            src={certImage}
                                                            alt="license"
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                {/* Navigation Menus */}
                                <div
                                    style={{
                                        gridArea: '9 / 4 / 22 / 10',
                                        textAlign: 'left',
                                        padding: '0px',
                                        fontSize: '16px',
                                        color: 'rgb(249, 249, 249)',
                                        position: 'relative',
                                    }}
                                >
                                    <div className="footer-menu-block f-row">
                                        {/* Deportes */}
                                        <div className="footer-menu-block_col">
                                            <div
                                                className="footer-menu-block_title tb--text_upercase footer--menu-dropdown digi_icon-arrow_down"
                                                style={{ color: 'rgb(249, 249, 249)' }}
                                            >
                                                <span className="tb--cd" style={{ fontSize: '16px', color: 'rgb(249, 249, 249)' }}>
                                                    Deportes
                                                </span>
                                            </div>
                                            <div className="footer-submenu">
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/sport" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            Apuestas Prematch
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/sport/Overview" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            Apuestas en vivo
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/sport/Results" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            Resultados
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Juegos */}
                                        <div className="footer-menu-block_col">
                                            <div
                                                className="footer-menu-block_title tb--text_upercase footer--menu-dropdown digi_icon-arrow_down"
                                                style={{ color: 'rgb(249, 249, 249)' }}
                                            >
                                                <span className="tb--cd" style={{ fontSize: '16px', color: 'rgb(249, 249, 249)' }}>
                                                    JUEGOS
                                                </span>
                                            </div>
                                            <div className="footer-submenu">
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/games/crash" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            Crash
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/games/keno" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            Keno
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/games/hilo" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            HiLo
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/games/domino" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            Dominó
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/games/backgammon" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            Backgammon
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Casino */}
                                        <div className="footer-menu-block_col">
                                            <div
                                                className="footer-menu-block_title tb--text_upercase footer--menu-dropdown digi_icon-arrow_down"
                                                style={{ color: 'rgb(249, 249, 249)' }}
                                            >
                                                <span className="tb--cd" style={{ fontSize: '16px', color: 'rgb(249, 249, 249)' }}>
                                                    CASINO
                                                </span>
                                            </div>
                                            <div className="footer-submenu">
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/casino-lobby" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            Slots
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/livecasino" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            Casino en vivo
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/tvgames-lobby" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            Juegos de televisión
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="link" style={{ color: 'rgb(249, 249, 249)' }}>
                                                    <div>
                                                        <a className="" target="_self" href="/es/fast-games" style={{ fontSize: '12px', color: 'rgb(249, 249, 249)' }}>
                                                            Golden Race
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Age restriction */}
                                <div
                                    style={{
                                        gridArea: '10 / 10 / 14 / 11',
                                        justifyContent: 'end',
                                        alignItems: 'center',
                                        display: 'flex',
                                        padding: '0px',
                                        color: 'rgb(253, 253, 253)',
                                        position: 'relative',
                                    }}
                                >
                                    <section className="tb--flex age-restriction-wrapper">
                                        <div className="age-restriction">
                                            <div className="age-restriction_img f-row tb--justify-center tb--align-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="42.33"
                                                    height="40.001"
                                                    viewBox="0 0 42.33 40.001"
                                                >
                                                    <defs>
                                                        <style>
                                                            {`
                                .age-svg-a { fill: rgb(253,253,253) !important; }
                                .age-svg-b { fill: rgb(253,253,253) !important; }
                              `}
                                                        </style>
                                                    </defs>
                                                    <g transform="translate(-88 -38.998)">
                                                        <path
                                                            className="age-svg-a"
                                                            d="M5.962,4.038H10V5.962H5.962V10H3.942V5.962H0V4.038H3.942V0H5.962Z"
                                                            transform="translate(130.33 63.999) rotate(180)"
                                                        />
                                                        <path
                                                            className="age-svg-b"
                                                            d="M-12133-7497a19.872,19.872,0,0,1-14.143-5.856A19.874,19.874,0,0,1-12153-7517a19.872,19.872,0,0,1,5.858-14.143A19.862,19.862,0,0,1-12133-7537a19.859,19.859,0,0,1,14.141,5.859,20.162,20.162,0,0,1,3.188,4.142h-2.37a17.99,17.99,0,0,0-14.958-8,18.021,18.021,0,0,0-18,18,18.02,18.02,0,0,0,18,18,18,18,0,0,0,14.958-8h2.371a20.125,20.125,0,0,1-3.188,4.142A19.869,19.869,0,0,1-12133-7497Z"
                                                            transform="translate(12241 7575.999)"
                                                        />
                                                    </g>
                                                </svg>
                                                <div className="age-restriction_int" style={{ color: 'rgb(253, 253, 253)' }}>
                                                    18
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Providers carousel */}
                                <div
                                    style={{
                                        gridArea: '31 / 1 / 43 / 13',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        display: 'flex',
                                        padding: '0px',
                                        color: 'rgb(255, 255, 255)',
                                        fontSize: '16px',
                                        position: 'relative',
                                    }}
                                >
                                    <section className="providers-block footer--separator footer--divider-title tb--text_upercase">
                                        <span className="footer_controls_title">Proveedor de casino</span>
                                        <div className="tb--justify-center providers-block_holder">
                                            <Slider {...sliderSettings}>
                                                {providers.map((provider) => (
                                                    <div key={provider} className="providers-block_item">
                                                        <a className="tb--cd socials-block_icon" href="#" onClick={(e) => {e.preventDefault()}}>
                                                            <span
                                                                className="providers-list_item"
                                                                style={{
                                                                    backgroundColor: 'rgb(244, 244, 244)',
                                                                    borderRadius: '12px',
                                                                }}
                                                            >
                                                                <i
                                                                    className={`providers--sprite icon-ic_provider_${provider}_bw`}
                                                                    style={{
                                                                        backgroundImage: `url(${providerImage})`,
                                                                    }}
                                                                />
                                                            </span>
                                                            <i
                                                                className={`providers--sprite icon-ic_provider_${provider}_col`}
                                                                style={{
                                                                    backgroundImage: `url(${providerImage})`,
                                                                }}
                                                            />
                                                        </a>
                                                    </div>
                                                ))}
                                            </Slider>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

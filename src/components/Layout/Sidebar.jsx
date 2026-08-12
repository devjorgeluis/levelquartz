import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import IconDots from "/src/assets/svg/dots.svg";
import IconDownload from "/src/assets/svg/download.svg";
import ImgLogo from "/src/assets/svg/logo.svg";

const Sidebar = ({ isSlotsOnly, isMobile }) => {
    const { isSidebarExpanded, toggleSidebar } = useContext(LayoutContext);
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isSportsPage = location.pathname === "/sports" || location.pathname === "/live-sports";
    const [expandedMenus, setExpandedMenus] = useState([""]);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState({ code: "es", name: "Spanish" });
    const [liveCasinoMenus, setLiveCasinoMenus] = useState([]);
    const [hasFetchedLiveCasino, setHasFetchedLiveCasino] = useState(false);
    const [activeSubmenuItem, setActiveSubmenuItem] = useState("");
    const [countdown, setCountdown] = useState({
        days: 1,
        hours: 5,
        minutes: 8,
        seconds: 25
    });

    const languages = [
        { code: "en", name: "English" },
        { code: "de", name: "German" },
        { code: "ja", name: "Japanese" },
        { code: "fr", name: "French" },
        { code: "nl", name: "Dutch" },
        { code: "pt", name: "Portuguese" },
        { code: "tr", name: "Turkish" },
        { code: "es", name: "Spanish" },
        { code: "ko", name: "Korean" },
        { code: "it", name: "Italian" },
        { code: "el", name: "Greek" },
        { code: "ar", name: "Arabic" },
        { code: "zh", name: "Chinese" },
        { code: "cs", name: "Czech" }
    ];

    const isMenuExpanded = (menuName) => expandedMenus.includes(menuName);

    const toggleLanguageDropdown = () => setShowLanguageDropdown(!showLanguageDropdown);
    const closeLanguageDropdown = () => setShowLanguageDropdown(false);
    const handleLanguageSelect = (languageCode) => {
        const language = languages.find(lang => lang.code === languageCode) || currentLanguage;
        setCurrentLanguage(language);
        closeLanguageDropdown();
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else {
                    seconds = 59;
                    if (minutes > 0) minutes--;
                    else {
                        minutes = 59;
                        if (hours > 0) hours--;
                        else {
                            hours = 23;
                            if (days > 0) days--;
                            else {
                                days = 1;
                                hours = 5;
                                minutes = 8;
                                seconds = 25;
                            }
                        }
                    }
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!hasFetchedLiveCasino) getPage("livecasino");

        const hash = location.hash;
        if (hash && hash.startsWith('#')) {
            const categoryCode = hash.substring(1);
            setActiveSubmenuItem(categoryCode);
            if (location.pathname === '/live-casino' && !expandedMenus.includes('live-casino')) {
                setExpandedMenus(prev => [...prev, 'live-casino']);
            }
        } else {
            setActiveSubmenuItem("");
        }
        window.scrollTo(0, 0);
    }, [location.pathname, location.hash, hasFetchedLiveCasino]);

    const getPage = (page) => {
        callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
    };

    const callbackGetPage = (result) => {
        if (result.status === 500 || result.status === 422) return;
        let menus = [{
            name: "Home",
            code: "home",
            id: null,
            table_name: null,
            href: "/live-casino#home"
        }];
        result.data.categories.forEach(element => {
            menus.push({
                name: element.name,
                icon: element.image_local != null && element.image_local !== "" ? contextData.cdnUrl + element.image_local : null,
                href: "/live-casino#" + element.code
            });
        });
        setLiveCasinoMenus(menus);
        setHasFetchedLiveCasino(true);
    };

    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;

    // Menú principal: exactamente los mismos elementos que en el target
    const mainMenuItems = [
        { id: 'home', name: 'Home', icon: 'category_icon-home', href: '/' },
        { id: 'casino', name: 'Casino', icon: 'category_icon-casino_1', href: '/casino' },
        { id: 'live-casino', name: 'Casino en vivo', icon: 'category_icon-tv_games', href: '/live-casino' },
        // { id: 'fastgames', name: 'Juegos rápidos', icon: 'category_icon-crash_1', href: '/fastgames-lobby', badge: 'Popular' },
        // { id: 'virtualsport', name: 'VirtualSport', icon: 'category_icon-fast_games_1', href: '/virtualsport-lobby' },
        { id: 'sports', name: 'Deportes', icon: 'category_icon-penalty', href: '/sports' },
        { id: 'live-sports', name: 'Partidos en Vivo', icon: 'category_icon-live_sport_1', href: '/live-sports' },
        // { id: 'esport', name: 'Esport', icon: 'category_icon-penalty_3', href: '/esport' },
    ];

    // Determinar si un item está activo
    const isActive = (item) => {
        if (item.href.startsWith('#')) {
            return location.hash === item.href;
        }
        if (item.href === '/') return location.pathname === '/';
        return location.pathname === item.href || location.pathname.startsWith(item.href + '/');
    };

    const handleClickMenu = (menu) => {
        navigate(menu.href);
        if (isMobile) {
            toggleSidebar();
        }
    };

    const mobileBottomItems = [
        { id: "casino", name: "Casino", icon: "category_icon-casino", href: "/casino" },
        { id: "live-casino", name: "CasinoEnVivo", icon: "category_icon-live_casino", href: "/live-casino" },
        { id: "home", name: "Home", icon: "category_icon-home", href: "/" },
        { id: "sports", name: "Deportes", icon: "category_icon-sport", href: "/sports" },
        { id: "promotions", name: "Promociones", icon: "category_icon-promotions", href: "/promotions" },
    ];

    const mobileMoreItems = [
        { id: "rules", name: "Reglamentos", icon: "category_icon-regulation" },
        { id: "live-score", name: "Live Score", icon: "category_icon-live_score" },
        { id: "promotions", name: "Promociones", icon: "category_icon-promotions" },
    ];

    if (isMobile) {
        return (
            <>
                <aside className={`lq-mobile-more-menu ${isSidebarExpanded ? "is-open" : ""}`} aria-hidden={!isSidebarExpanded}>
                    <div className="lq-mobile-more-menu__grid">
                        {mobileMoreItems.map((item) => (
                            <div
                                key={item.id}
                                className="lq-mobile-more-menu__card"
                                aria-disabled="true"
                            >
                                <i className={item.icon} />
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </aside>

                {!isSidebarExpanded && !isSportsPage && (
                    <nav className="tb--mobile-nav lq-mobile-nav" aria-label="Navegación principal">
                        <ul className="mobile-nav_list mobile-nav_list-5">
                            {mobileBottomItems.map((item) => (
                                <li className="mobile-nav_item" key={item.id}>
                                    <button
                                        type="button"
                                        className={`mobile-nav_item-inner ${isActive(item) ? "active" : ""}`}
                                        onClick={() => navigate(item.href)}
                                    >
                                        <span className="icon-wrapper"><i className={item.icon} /></span>
                                        <span className="mobile-nav_item__text">{item.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </>
        );
    }

    return (
        <>
            <div className={`menu-layout-sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
                {/* Estructura exacta del target: un único contenedor con scroll y menú */}
                <div className={`tb--sidebar-wrapper ${isSidebarExpanded ? 'tb--sidebar-wr-open' : ''}`}>
                    <div className="tb--scrollbar-wrapper tb--hide">
                        <div className="tb--scrollbar" style={{ height: '366px' }}></div>
                    </div>
                    <div className={`tb--sidebar-menu_wrapper ${isSidebarExpanded ? 'tb--sidebar-open' : ''}`}>
                        <nav className="tb--sidebar-menu">
                            <div className="tb--sidebar-main tb--text_upercase">
                                {mainMenuItems.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className={`tb--sidebar-main_item show-icon tb--sidebar-main_style ${isActive(item) ? 'active' : ''}`}
                                    >
                                        <div className="tb--sidebar-main_item">
                                            <div>
                                                <a
                                                    target="_self"
                                                    className={`tb--flex tb--align-center tb--cp tb--sidebar-main_link menu-block-medium tb--bold ${item.badge ? 'show-badge' : ''}`}
                                                    href={item.href}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleClickMenu(item);
                                                    }}
                                                >
                                                    <span className="tb--sidebar-icon_block">
                                                        <i className={item.icon}></i>
                                                    </span>
                                                    <span className="tb--item-text burger-no-collapse">
                                                        {item.name}
                                                    </span>
                                                    {item.badge && (
                                                        <span className="tb--badge tb--badge-side tb--hot">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Elementos adicionales que estaban en la versión expandida (idioma, footer) - los dejamos pero con d-none si no se usan */}
                <div className="language-wrapper-container d-none">
                    <div className="dropdown-btn small dropdown">
                        <button
                            aria-haspopup="true"
                            aria-expanded={showLanguageDropdown}
                            id="dropdown-btn"
                            type="button"
                            className="dropdown-toggle btn btn-secondary"
                            onClick={toggleLanguageDropdown}
                        >
                            <i className="material-icons">language</i>
                            {currentLanguage.name} ({currentLanguage.code})
                        </button>
                        {showLanguageDropdown && (
                            <div aria-labelledby="dropdown-btn" className="dropdown-menu show">
                                {languages.map((language) => (
                                    <a
                                        key={language.code}
                                        href="#"
                                        className={`dropdown-item ${language.code === currentLanguage.code ? 'active' : ''}`}
                                        role="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLanguageSelect(language.code);
                                        }}
                                    >
                                        {language.name} ({language.code})
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="footer-content footer-content-fixed d-none">
                    <div className="app-install-container">
                        <div className="app-buttons-container">
                            <div className="download-text-area">Download App</div>
                            <button name="windows app download button" aria-label="windows app download button" className="app-button windows">
                                <i className="device-icon">
                                    <img src={IconDownload} alt="Windows app" />
                                </i>
                                <div className="hoverBubble bubblePosition windows">
                                    <p></p>
                                    <p></p>
                                    <p>Haz clic para instalar la aplicación</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Sidebar;

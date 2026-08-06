import { useState, useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import LoadApi from "../Loading/LoadApi";
import ImgLogo from "/src/assets/images/Logo.png";
import IconClose from "/src/assets/svg/close.svg";

const Header = ({
    isLogin,
    isMobile,
    userBalance,
    supportParent,
    handleLoginClick,
    handleLogoutClick,
    openSupportModal
}) => {
    const { isSidebarExpanded, toggleSidebar } = useContext(LayoutContext);
    const navigate = useNavigate();
    const location = useLocation();
    const popupPath = (name) => {
        const currentPath = location.pathname.split("/popup/")[0];
        const basePath = currentPath === "/" || /^\/profile(?:\/.*)?$/.test(currentPath)
            ? ""
            : currentPath.replace(/\/$/, "");
        return `${basePath}/popup/${name}`;
    };
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const userMenuRef = useRef(null);
    const moreMenuRef = useRef(null);
    const userButtonRef = useRef(null);
    const moreButtonRef = useRef(null);

    // Función para formatear el saldo de forma segura
    const formatBalance = (balance) => {
        if (balance === null || balance === undefined) return "0.00";
        const num = typeof balance === 'string' ? parseFloat(balance) : balance;
        if (isNaN(num)) return "0.00";
        return num.toFixed(2);
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
        if (showMoreMenu) setShowMoreMenu(false);
    };

    const toggleMoreMenu = () => {
        setShowMoreMenu(!showMoreMenu);
        if (showUserMenu) setShowUserMenu(false);
    };

    const closeUserMenu = () => setShowUserMenu(false);
    const closeMoreMenu = () => setShowMoreMenu(false);

    const handleLogout = () => {
        setIsLogoutLoading(true);
        handleLogoutClick();
        closeUserMenu();
    };

    // Cerrar menús al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current && !userMenuRef.current.contains(event.target) &&
                userButtonRef.current && !userButtonRef.current.contains(event.target)
            ) {
                closeUserMenu();
            }
            if (
                moreMenuRef.current && !moreMenuRef.current.contains(event.target) &&
                moreButtonRef.current && !moreButtonRef.current.contains(event.target)
            ) {
                closeMoreMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Menú de usuario (cuenta, transacciones, bonos, etc.)
    const userMenuItems = [
        { icon: "category_icon-user", label: "Cuenta", link: popupPath("myprofile") },
        { icon: "category_icon-transactions", label: "Historial de Transacciones", link: popupPath("history") },
        { icon: "category_icon-bonus", label: "Bonos", link: popupPath("bonuses") },
        { icon: "category_icon-game_history", label: "Historia del juego", link: "/profile/game-history" },
        { icon: "category_icon-sport_bet_history", label: "Historial apuestas deportivas", link: "/profile/sport-bets" },
    ];

    // Elementos del menú principal (siempre visibles)
    const mainMenuItems = [
        { icon: "category_icon-home", label: "Home", link: "/", badge: null },
        { icon: "category_icon-casino_1", label: "Casino", link: "/casino", badge: null },
        { icon: "category_icon-tv_games", label: "Casino en vivo", link: "/live-casino", badge: null },
        { icon: "category_icon-penalty", label: "Deportes", link: "/sports" },
        // { icon: "category_icon-crash_1", label: "Juegos rápidos", link: "/fastgames-lobby", badge: "Popular" },
        // { icon: "category_icon-fast_games_1", label: "VirtualSport", link: "/virtualsport-lobby", badge: null },
    ];

    // Elementos del menú "Más" (ocultos inicialmente, visibles en el desplegable)
    const moreMenuItems = [
        // { icon: "category_icon-penalty", label: "Deportes", link: "/sports" },
        { icon: "category_icon-live_sport_1", label: "Partidos en Vivo", link: "/live-sport" },
        // { icon: "category_icon-penalty_3", label: "Esport", link: "/esport" },
    ];

    return (
        <header className="true header-block header-block__fix has-euro-counter">
            <div className="header-block_holder tb--flex f-row tb--justify-between tb--align-center f-temp tb--logo-align-left">
                {/* Botón burger (menú lateral) */}
                <div className="burger-btn" onClick={toggleSidebar}>
                    <span></span>
                </div>

                {/* Lado izquierdo: logo + flecha */}
                <div className="header-block_left-side f-row tb--align-center">
                    <div className="nav--arrow-btn">
                        <button className="nav--arrow-wrapper tb--flex tb--align-center tb--justify-center" onClick={toggleSidebar}>
                            {isSidebarExpanded && (<span className="nav--arrow-lines"></span>)}
                            <div className={`nav--arrow-icon nav--burger-arrow ${isSidebarExpanded ? 'nav--arrow-icon_active' : ''}`}></div>
                        </button>
                    </div>
                    <a className="logoBlock" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                        <img className="logoBlock_img loaded ready" alt="Logo" src={ImgLogo} />
                    </a>
                </div>

                {/* Menú central */}
                <div className="header-block_middle-side tb--align-center">
                    <nav className="menu-block_holder main--menu-left">
                        <div className="mainmenu-block--mutation menu-block f-row" style={{ height: '56px', opacity: 1 }}>
                            {mainMenuItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="mainmenu-block--mutation-menu main--menu-item-cont tb--rel tb--flex tb--align-center menu-block-medium tb--text_upercase"
                                >
                                    <a
                                        className="no-mutation menu--block-item tb--flex tb--align-center menu-block-medium tb--bold"
                                        onClick={() => { navigate(item.link); closeMoreMenu(); }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span className="header-icon no-mutation">
                                            <i className={item.icon}></i>
                                        </span>
                                        <span className="tb--menu-item_text no-mutation">{item.label}</span>
                                        {item.badge && (
                                            <span className="tb--badge-top tb--badge tb--hot no-mutation">{item.badge}</span>
                                        )}
                                    </a>
                                </div>
                            ))}

                            {/* Elementos ocultos que se mueven al menú "Más" (no se muestran) */}
                            {moreMenuItems.map((item, idx) => (
                                <div
                                    key={`hidden-${idx}`}
                                    className="mainmenu-block--mutation-menu main--menu-item-cont tb--rel tb--flex tb--align-center menu-block-medium tb--text_upercase"
                                    style={{ display: 'none', height: 0, width: 0 }}
                                >
                                    <a
                                        className="no-mutation menu--block-item tb--flex tb--align-center menu-block-medium tb--bold"
                                        onClick={() => { navigate(item.link); closeMoreMenu(); }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span className="header-icon no-mutation">
                                            <i className={item.icon}></i>
                                        </span>
                                        <span className="tb--menu-item_text no-mutation">{item.label}</span>
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* Botón "Más" y desplegable */}
                        <div className="more--menu-block">
                            <div
                                role="button"
                                className="more--menu-btn tb--f-24"
                                ref={moreButtonRef}
                                onClick={toggleMoreMenu}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="digi_icon-more_horiz"></i>
                            </div>
                            {showMoreMenu && (
                                <div className="more--menu-items more--menu-items-mutations no-mutation" ref={moreMenuRef}>
                                    {moreMenuItems.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="main--menu-item-cont tb--flex tb--align-center menu-block tb--text_upercase"
                                        >
                                            <a
                                                className="no-mutation menu--block-item tb--flex tb--align-center menu-block-medium tb--bold"
                                                onClick={() => { navigate(item.link); closeMoreMenu(); }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span className="header-icon no-mutation">
                                                    <i className={item.icon}></i>
                                                </span>
                                                <span className="tb--menu-item_text no-mutation">{item.label}</span>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>
                </div>

                {/* Lado derecho: mensajes, billetera, usuario/login */}
                <div className="header-block_right-side f-row tb--align-center">
                    {isLogin ? (
                        <>
                            {/* Icono de mensajes */}
                            <div className="account-m-block account-block-bg tb--radius-btn account-m-one">
                                <div className="account-block_item tb--flex tb--justify-between tb--align-center" title="Mensajes">
                                    <i className="account-block_item-icon category_icon-inbox"></i>
                                </div>
                            </div>

                            {/* Botón de billetera / depósito */}
                            <div className="f-pad-32 tb--cp">
                                <a className="btn-wb-size-m btn btn-primary deposit-btn" onClick={() => navigate("/deposit")}>
                                    <span className="deposit-btn_text tb--nowrap">Billetera</span>
                                    <i className="digi_icon-deposit_two"></i>
                                </a>
                            </div>

                            {/* Bloque de usuario (saldo + avatar + menú desplegable) */}
                            <div className="account-block_items f-row">
                                <div className="account-block_user-select">
                                    <div className="account-block_balance">
                                        <div
                                            className="item__left-side tb--cp"
                                            ref={userButtonRef}
                                            onClick={toggleUserMenu}
                                        >
                                            <div className="account-block_user-cash tb--flex tb--align-center">
                                                <span className="balance">{formatBalance(userBalance)}</span>
                                                <span className="currency">ARS</span>
                                            </div>
                                            <i className="digi_icon-arrow_down"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            className="item__right-side tb--cp"
                                            ref={userButtonRef}
                                            onClick={toggleUserMenu}
                                        >
                                            <span className="account-block_icon-shape">
                                                <div className="account-block_icon">
                                                    <i className="digi_icon-user account-block_icon"></i>
                                                </div>
                                            </span>
                                        </div>

                                        {/* Menú desplegable de usuario */}
                                        {showUserMenu && (
                                            <div className="account-block_sub-menu" ref={userMenuRef} style={{ display: 'block' }}>
                                                <div>
                                                    <span
                                                        className="account-block_sub-menu_item tb--flex tb--justify-between tb--text_upercase tb--fs-small"
                                                        onClick={() => { navigate(popupPath("myprofile")); closeUserMenu(); }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <span className="tb--flex tb--align-center">
                                                            <i className="account-block_item-icon category_icon-user"></i>Cuenta
                                                        </span>
                                                        <span className="sub-menu_profile_id"><span>Id:</span>32474856</span>
                                                    </span>
                                                    {userMenuItems.map((item, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="account-block_sub-menu_item tb--text_upercase tb--fs-small"
                                                            onClick={() => { navigate(item.link); closeUserMenu(); }}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <i className={`account-block_item-icon ${item.icon}`}></i>
                                                            {item.label}
                                                        </span>
                                                    ))}
                                                    {supportParent && (
                                                        <span
                                                            className="account-block_sub-menu_item tb--text_upercase tb--fs-small"
                                                            onClick={() => { openSupportModal(true); closeUserMenu(); }}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <i className="account-block_item-icon category_icon-support"></i>Contactá a Tu Cajero
                                                        </span>
                                                    )}
                                                    <span
                                                        className="account-block_sub-menu_item logout-link tb--text_upercase tb--fs-small"
                                                        onClick={handleLogout}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <i className="account-block_item-icon category_icon-logout"></i>
                                                        {isLogoutLoading ? <LoadApi /> : "Cerrar sesión"}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Usuario no logueado
                        <div className="header-block_right-side f-row tb--align-center">
                            <div className="f-pad-32 tb--cp">
                                <a className="btn-wb-size-m btn btn-primary deposit-btn" onClick={handleLoginClick}>
                                    <span className="deposit-btn_text tb--nowrap">Acceso</span>
                                    <i className="digi_icon-deposit_two"></i>
                                </a>
                            </div>
                            <div className="account-m-block account-block-bg tb--radius-btn account-m-one">
                                <div
                                    className="account-block_item tb--flex tb--justify-between tb--align-center"
                                    title="Soporte"
                                    onClick={() => openSupportModal(false)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="account-block_item-icon category_icon-inbox"></i>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="header-language"></div>
                </div>
            </div>
        </header>
    );
};

export default Header;

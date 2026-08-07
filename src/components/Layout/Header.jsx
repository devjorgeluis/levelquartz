import { useState, useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import LoadApi from "../Loading/LoadApi";
import ImgLogo from "/src/assets/images/Logo.png";
import { AppContext } from "../../AppContext";

const Header = ({
    isLogin,
    isMobile,
    userBalance,
    supportParent,
    handleLoginClick,
    handleLogoutClick,
    openSupportModal
}) => {
    const { contextData } = useContext(AppContext);
    const user = contextData?.session?.user || {};
    const playerId = user.id || "******";
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
    const [showBalanceDropdown, setShowBalanceDropdown] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const balanceDropdownRef = useRef(null);
    const balanceButtonRef = useRef(null);
    const userMenuRef = useRef(null);
    const userButtonRef = useRef(null);
    const moreMenuRef = useRef(null);
    const moreButtonRef = useRef(null);
    const [showBalance, setShowBalance] = useState(true);

    const toggleBalance = () => {
        setShowBalance(!showBalance);
    }

    const formatBalance = (balance) => {
        if (balance === null || balance === undefined) return "0.00";
        const num = typeof balance === "string" ? parseFloat(balance) : balance;
        if (Number.isNaN(num)) return "0.00";
        return num.toFixed(2);
    };

    const formattedBalance = formatBalance(userBalance);

    const toggleBalanceDropdown = () => {
        setShowBalanceDropdown((isOpen) => !isOpen);
        setShowUserMenu(false);
        setShowMoreMenu(false);
    };

    const toggleUserMenu = () => {
        setShowUserMenu((isOpen) => !isOpen);
        setShowBalanceDropdown(false);
        setShowMoreMenu(false);
    };

    const toggleMoreMenu = () => {
        setShowMoreMenu((isOpen) => !isOpen);
        setShowBalanceDropdown(false);
        setShowUserMenu(false);
    };

    const closeBalanceDropdown = () => setShowBalanceDropdown(false);
    const closeUserMenu = () => setShowUserMenu(false);
    const closeMoreMenu = () => setShowMoreMenu(false);

    const handleLogout = () => {
        setIsLogoutLoading(true);
        handleLogoutClick();
        closeUserMenu();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                balanceDropdownRef.current && !balanceDropdownRef.current.contains(event.target) &&
                balanceButtonRef.current && !balanceButtonRef.current.contains(event.target)
            ) {
                closeBalanceDropdown();
            }
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

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                closeBalanceDropdown();
                closeUserMenu();
                closeMoreMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const userMenuItems = [
        { icon: "category_icon-transactions", label: "Historial de Transacciones", link: popupPath("history") },
        { icon: "category_icon-bonus", label: "Bonos", link: popupPath("bonuses") },
    ];

    const mainMenuItems = [
        { icon: "category_icon-home", label: "Home", link: "/", badge: null },
        { icon: "category_icon-casino_1", label: "Casino", link: "/casino", badge: null },
        { icon: "category_icon-tv_games", label: "Casino en vivo", link: "/live-casino", badge: null },
        { icon: "category_icon-penalty", label: "Deportes", link: "/sports" },
    ];

    const moreMenuItems = [
        { icon: "category_icon-live_sport_1", label: "Partidos en Vivo", link: "/live-sport" },
    ];

    return (
        <header className="true header-block header-block__fix has-euro-counter">
            <div className="header-block_holder tb--flex f-row tb--justify-between tb--align-center f-temp tb--logo-align-left">
                <div className="burger-btn" onClick={toggleSidebar}>
                    <span></span>
                </div>

                <div className="header-block_left-side f-row tb--align-center">
                    <div className="nav--arrow-btn">
                        <button className="nav--arrow-wrapper tb--flex tb--align-center tb--justify-center" onClick={toggleSidebar}>
                            {isSidebarExpanded && (<span className="nav--arrow-lines"></span>)}
                            <div className={`nav--arrow-icon nav--burger-arrow ${isSidebarExpanded ? "nav--arrow-icon_active" : ""}`}></div>
                        </button>
                    </div>
                    <a className="logoBlock" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                        <img className="logoBlock_img loaded ready" alt="Logo" src={ImgLogo} />
                    </a>
                </div>

                <div className="header-block_middle-side tb--align-center">
                    <nav className="menu-block_holder main--menu-left">
                        <div className="mainmenu-block--mutation menu-block f-row" style={{ height: "56px", opacity: 1 }}>
                            {mainMenuItems.map((item, idx) => (
                                <div key={idx} className="mainmenu-block--mutation-menu main--menu-item-cont tb--rel tb--flex tb--align-center menu-block-medium tb--text_upercase">
                                    <a className="no-mutation menu--block-item tb--flex tb--align-center menu-block-medium tb--bold" onClick={() => { navigate(item.link); closeMoreMenu(); }} style={{ cursor: "pointer" }}>
                                        <span className="header-icon no-mutation"><i className={item.icon}></i></span>
                                        <span className="tb--menu-item_text no-mutation">{item.label}</span>
                                        {item.badge && <span className="tb--badge-top tb--badge tb--hot no-mutation">{item.badge}</span>}
                                    </a>
                                </div>
                            ))}
                            {moreMenuItems.map((item, idx) => (
                                <div key={`hidden-${idx}`} className="mainmenu-block--mutation-menu main--menu-item-cont tb--rel tb--flex tb--align-center menu-block-medium tb--text_upercase" style={{ display: "none", height: 0, width: 0 }}>
                                    <a className="no-mutation menu--block-item tb--flex tb--align-center menu-block-medium tb--bold" onClick={() => { navigate(item.link); closeMoreMenu(); }} style={{ cursor: "pointer" }}>
                                        <span className="header-icon no-mutation"><i className={item.icon}></i></span>
                                        <span className="tb--menu-item_text no-mutation">{item.label}</span>
                                    </a>
                                </div>
                            ))}
                        </div>

                        <div className="more--menu-block">
                            <div role="button" className="more--menu-btn tb--f-24" ref={moreButtonRef} onClick={toggleMoreMenu} style={{ cursor: "pointer" }}>
                                <i className="digi_icon-more_horiz"></i>
                            </div>
                            {showMoreMenu && (
                                <div className="more--menu-items more--menu-items-mutations no-mutation" ref={moreMenuRef}>
                                    {moreMenuItems.map((item, idx) => (
                                        <div key={idx} className="main--menu-item-cont tb--flex tb--align-center menu-block tb--text_upercase">
                                            <a className="no-mutation menu--block-item tb--flex tb--align-center menu-block-medium tb--bold" onClick={() => { navigate(item.link); closeMoreMenu(); }} style={{ cursor: "pointer" }}>
                                                <span className="header-icon no-mutation"><i className={item.icon}></i></span>
                                                <span className="tb--menu-item_text no-mutation">{item.label}</span>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>
                </div>

                <div className="header-block_right-side f-row tb--align-center">
                    {isLogin ? (
                        <>
                            <div className="f-pad-32 tb--cp">
                                <a className="btn-wb-size-m btn btn-primary deposit-btn" onClick={() => navigate("/deposit")}>
                                    <span className="deposit-btn_text tb--nowrap">Billetera</span>
                                    <i className="digi_icon-deposit_two"></i>
                                </a>
                            </div>

                            <div className="account-block_items f-row">
                                <div className="account-block_user-select">
                                    <div className="account-block_balance wrapper">
                                        <div
                                            className={`item__left-side tb--cp ${showBalanceDropdown ? "balance_list_open" : ""}`}
                                            ref={balanceButtonRef}
                                            onClick={toggleBalanceDropdown}
                                            role="button"
                                            tabIndex={0}
                                            aria-expanded={showBalanceDropdown}
                                            aria-haspopup="dialog"
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter" || event.key === " ") {
                                                    event.preventDefault();
                                                    toggleBalanceDropdown();
                                                }
                                            }}
                                        >
                                            <div className="account-block_user-cash tb--flex tb--align-center">
                                                <span className="balance">{showBalance ? formattedBalance : '******'}</span>
                                                <span className="currency">{showBalance && "ARS"}</span>
                                            </div>
                                            <i className="digi_icon-arrow_down"></i>
                                        </div>
                                        {showBalanceDropdown && (
                                            <div
                                                ref={balanceDropdownRef}
                                                className="tb--profile-balance-info tb--flex tb--justify-center tb--align-center tb--f-14 tb--flex-col"
                                                role="dialog"
                                                aria-label="Información del saldo"
                                            >
                                                <div className="tb--profile-balance-content tb--w_100 tb--flex tb--justify-between tb--align-center tb--flex-wrap">
                                                    <div>
                                                        <div className="tb--info tb--flex tb--align-center tb--balance_info-box">
                                                            <span className="tb--profile-balance_txt tb--f-16">Saldo</span>
                                                            <div className="tb--balance_info-tooltip">
                                                                <i className="digi_icon-info-full"></i>
                                                                <span className="tb--tooltip">
                                                                    <ul className="tb--balance_info-list" role="list" aria-label="Balance information">
                                                                        <li><span>extraíble</span><span>El importe total de todos las carteras que se puede retirar de su cuenta.</span></li>
                                                                        <li><span>Usó</span><span>La cantidad que se forma a partir de las apuestas y que se puede retirar sin ninguna restricción.</span></li>
                                                                        <li><span>No usado</span><span>La cantidad que no se ha apostado y que sólo se puede retirar con una comisión porcentual, que depende del sistema de pago</span></li>
                                                                        <li><span>Bono</span><span>El importe de las bonificaciones (activadas) disponibles para apostar, que sólo pueden retirarse después de realizar las apuestas.</span></li>
                                                                    </ul>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className="tb--f-medium tb--f-24 tb---rtl-currency tb--balance">
                                                            <span>{showBalance ? formattedBalance : "******"}</span>
                                                            <span className="tb--balance_currency">{showBalance && 'ARS'}</span>
                                                        </span>
                                                    </div>
                                                    <i className={`show-balance-icon digi_icon-eye${!showBalance ? '-slash' : ''}`} onClick={toggleBalance}></i>
                                                </div>
                                                <div className="tb--w_100 tb--divider">
                                                    <div className="tb--profile-balance-item tb--flex tb--justify-between tb--w_100">
                                                        <span className="tb--profile-balance_txt tb--ellipsis">extraíble</span>
                                                        <div className="tb--info"><span className="tb--profile-balance_amount">{showBalance ? formattedBalance : '******'} <span className="tb--profile-balance_currency">{showBalance && 'ARS'}</span></span></div>
                                                    </div>
                                                    <div className="tb--profile-balance-item tb--flex tb--justify-between tb--w_100">
                                                        <span className="tb--profile-balance_txt tb--ellipsis">Usó</span>
                                                        <div className="tb--info"><span className="tb--profile-balance_amount">{showBalance ? '0.00' : '******'} <span className="tb--profile-balance_currency">{showBalance && 'ARS'}</span></span></div>
                                                    </div>
                                                    <div className="tb--profile-balance-item tb--flex tb--justify-between tb--w_100">
                                                        <span className="tb--profile-balance_txt tb--ellipsis">No usado</span>
                                                        <div className="tb--info"><span className="tb--profile-balance_amount">{showBalance ? '0.00' : '******'} <span className="tb--profile-balance_currency">{showBalance && 'ARS'}</span></span></div>
                                                    </div>
                                                </div>
                                                <div className="tb--w_100 tb--divider">
                                                    <div className="tb--profile-balance-item tb--flex tb--justify-between tb--w_100">
                                                        <span className="tb--profile-balance_txt tb--ellipsis">Bono</span>
                                                        <div className="tb--info"><span className="tb--profile-balance_amount">{showBalance ? '0.00' : '******'} <span className="tb--profile-balance_currency">{showBalance && 'ARS'}</span></span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className={`item__right-side tb--cp ${showUserMenu ? "my_profile_open" : ""}`} ref={userButtonRef} onClick={toggleUserMenu}>
                                            <span className="account-block_icon-shape">
                                                <div className="account-block_icon"><i className="digi_icon-user account-block_icon"></i></div>
                                            </span>
                                        </div>

                                        {showUserMenu && (
                                            <div className="account-block_sub-menu" ref={userMenuRef} style={{ display: "block" }}>
                                                <div>
                                                    <span className="account-block_sub-menu_item tb--flex tb--justify-between tb--text_upercase tb--fs-small" onClick={() => { navigate(popupPath("myprofile")); closeUserMenu(); }} style={{ cursor: "pointer" }}>
                                                        <span className="tb--flex tb--align-center"><i className="account-block_item-icon category_icon-user"></i>Cuenta</span>
                                                        <span className="sub-menu_profile_id"><span>Id:</span>{playerId}</span>
                                                    </span>
                                                    {userMenuItems.map((item, idx) => (
                                                        <span key={idx} className="account-block_sub-menu_item tb--text_upercase tb--fs-small" onClick={() => { navigate(item.link); closeUserMenu(); }} style={{ cursor: "pointer" }}>
                                                            <i className={`account-block_item-icon ${item.icon}`}></i>{item.label}
                                                        </span>
                                                    ))}
                                                    <span className="account-block_sub-menu_item logout-link tb--text_upercase tb--fs-small" onClick={handleLogout} style={{ cursor: "pointer" }}>
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
                        <div className="header-block_right-side f-row tb--align-center">
                            <div className="tb--ph-8 tb--login-btn-box standard-with-icon">
                                <a href="#" onClick={handleLoginClick} className="btn btn-secondary btn-wb-size-m btn-mb-size-s tb--access-btn">
                                    <i className="digi_icon-login"></i>
                                    <span>Acceso</span>
                                </a>
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

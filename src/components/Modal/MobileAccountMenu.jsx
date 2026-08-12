import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AppContext } from "../../AppContext";

const formatMoney = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed.toFixed(2) : "0.00";
};

const MobileAccountMenu = ({ basePath, onClose }) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const user = contextData?.session?.user || {};
    const username = user.username || "jugador2323";
    const playerId = user.id || "******";
    const balance = formatMoney(user.balance);
    const [showBalanceDetails, setShowBalanceDetails] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(true);
    const [offersOpen, setOffersOpen] = useState(true);

    const popupPath = (name) => `${basePath === "/" ? "" : basePath}/popup/${name}`;
    const openPopup = (name) => navigate(popupPath(name));
    const copyPlayerId = () => navigator.clipboard?.writeText(String(playerId));

    return (
        <div className="tb--mobile-menu account-block_items__mob lq-mobile-account">
            <div className="tb--menu-header lq-mobile-account__header">
                <button type="button" className="tb--menu-close" onClick={onClose} aria-label="Cerrar perfil">
                    <i className="digi_icon-close" />
                </button>
            </div>

            <div className="tb--mobile-menu-body mobile-right-menu lq-mobile-account__body">
                <section className="ptp--user-block lq-mobile-account__user">
                    <div className="ptp-mob-user-info lq-mobile-account__identity">
                        <div className="ptp--user-avatar"><i className="digi_icon-user" /></div>
                        <strong className="ptp--user-name">{username}</strong>
                    </div>
                    <div className="ptp-user-id lq-mobile-account__id-row">
                        <span className="ptp-user-id_txt">ID del jugador</span>
                        <span className="ptp-user-id_num">
                            <b>{playerId}</b>
                            <button type="button" className="tb--copy-wrapper" onClick={copyPlayerId} aria-label="Copiar ID del jugador">
                                <i className="tb--player-copy digi_icon-copied" />
                            </button>
                        </span>
                    </div>
                </section>

                <section className="ptp--user-balance lq-mobile-account__balance">
                    <div className="ptp--main-balance">
                        <div className="ptp--balance-head"><span className="ptp--balance-title">Saldo</span></div>
                        <div className="ptp--main-cont">
                            <div className="balance-number">{balance}<span>ARS</span></div>
                            <button type="button" className="lq-mobile-account__eye" aria-label="Mostrar u ocultar saldo"><i className="digi_icon-eye" /></button>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={`ptp--top-lines ${showBalanceDetails ? "is-open" : ""}`}
                        onClick={() => setShowBalanceDetails((open) => !open)}
                        aria-expanded={showBalanceDetails}
                    >
                        <span className="ptp--left-line" />
                        <i className="digi_icon-arrow_down" />
                        <span className="ptp--right-line" />
                    </button>
                    {showBalanceDetails && (
                        <div className="ptp--balance-list ptp--active">
                            {["extraíble", "Usó", "No usado", "Bono", "Casino tax"].map((label, index) => (
                                <div className="ptp--list-item" key={label}>
                                    <span className="ptp--item-title">{label}</span>
                                    <span className="ptp--item-count">{index === 0 ? balance : "0.00"} <small>ARS</small></span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <nav className="tb--menu-items lq-mobile-account__menu" aria-label="Menú de cuenta">
                    <section className={`tb--menu-item tb--sub-arrow_mob ${historyOpen ? "open" : ""}`}>
                        <button type="button" className="lq-mobile-account__menu-title" onClick={() => setHistoryOpen((open) => !open)} aria-expanded={historyOpen}>
                            <span><i className="category_icon-game_history tb--icon" />Historia del juego</span>
                            <i className="digi_icon-arrow_down" />
                        </button>
                        {historyOpen && (
                            <div className="tb--account-submenu show-submenu">
                                <button type="button" onClick={() => openPopup("history")}>Historia del juego</button>
                                <button type="button" onClick={() => openPopup("history")}>Historial apuestas deportivas</button>
                                <button type="button" onClick={() => openPopup("history")}>Historial de Transacciones</button>
                            </div>
                        )}
                    </section>

                    <section className={`tb--menu-item tb--sub-arrow_mob ${offersOpen ? "open" : ""}`}>
                        <button type="button" className="lq-mobile-account__menu-title" onClick={() => setOffersOpen((open) => !open)} aria-expanded={offersOpen}>
                            <span><i className="category_icon-bonus tb--icon" />Ofertas</span>
                            <i className="digi_icon-arrow_down" />
                        </button>
                        {offersOpen && (
                            <div className="tb--account-submenu show-submenu">
                                <button type="button" onClick={() => openPopup("bonuses")}>Bonos</button>
                                <button type="button" onClick={() => openPopup("bonuses")}>Historial de bonos</button>
                            </div>
                        )}
                    </section>

                    <button type="button" className="tb--menu-item lq-mobile-account__single-item">
                        <span><i className="category_icon-inbox tb--icon" />Mensajes</span>
                    </button>
                    <button type="button" className="tb--menu-item lq-mobile-account__single-item">
                        <span><i className="category_icon-change_password tb--icon" />Cambio de contraseña</span>
                    </button>
                </nav>

                <button type="button" className="tb--mobile-logout lq-mobile-account__logout">
                    <i className="category_icon-logout" />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </div>
    );
};

MobileAccountMenu.propTypes = {
    basePath: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default MobileAccountMenu;

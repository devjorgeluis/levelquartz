import { useCallback, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Profile from "../../pages/Profile/Profile";
import ProfileBalance from "../../pages/Profile/ProfileBalance";
import ProfileBonuses from "../../pages/Profile/ProfileBonuses";
import ProfileGameHistory from "../../pages/Profile/ProfileGameHistory";

const popupViews = {
    myprofile: { label: "Cuenta", icon: "account_circle", component: Profile },
    balance: { label: "Cajero", icon: "digi_icon-cashier_new", component: ProfileBalance },
    bonuses: { label: "Ofertas", icon: "digi_icon-offer", component: ProfileBonuses },
    history: { label: "Historia", icon: "digi_icon-history", component: ProfileGameHistory },
};

export const getPopupRoute = (pathname) => {
    const match = pathname.match(/^(.*?)\/popup\/(myprofile|balance|bonuses|history)\/?$/);
    if (!match) return null;

    return {
        basePath: match[1] || "/",
        popupName: match[2],
    };
};

const buildPopupPath = (basePath, popupName) =>
    `${basePath === "/" ? "" : basePath}/popup/${popupName}`;

const AccountPopup = ({ basePath, popupName }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dialogRef = useRef(null);
    const View = popupViews[popupName].component;

    const closePopup = useCallback(
        () => navigate(`${basePath}${location.search}${location.hash}`),
        [basePath, location.hash, location.search, navigate]
    );

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialogRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") closePopup();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [closePopup]);

    return (
        <div className="tb--modal-lvl1 account-popup-backdrop" onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePopup();
        }}>
            <section
                className="tb--modal-lvl2 account-popup"
                role="dialog"
                aria-modal="true"
                aria-label={popupViews[popupName].label}
                ref={dialogRef}
                tabIndex={-1}
            >
                <div className="tb--modal-lvl3 tb--rel"><div className="tb--h_100"><div className="tb--my-profile tb--modal-account tb--custom-scroll tb--rel">
                <header className="tb--main-header tb--flex tb--align-center tb--justify-between tb--f-14 tb--mobile-hide account-popup__header">
                    <nav className="tb--flex f-h-100 tb--header-items account-popup__tabs" aria-label="Navegación de la cuenta">
                        {Object.entries(popupViews).map(([name, item]) => (
                            <NavLink
                                key={name}
                                to={buildPopupPath(basePath, name)}
                                className={({ isActive }) => `tb--header-item tb--flex tb--align-center tb--ph-24 tb--text_upercase account-popup__tab ${isActive ? "active" : ""}`}
                            >
                                <i className={`${item.icon.startsWith("digi_") ? item.icon : "digi_icon-user"} tb--main-header_icon`} aria-hidden="true" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                    <button className="tb--modal-close tb--mh-24 account-popup__close" type="button" onClick={closePopup} aria-label="Cerrar">
                        <i className="digi_icon-close" aria-hidden="true" />
                    </button>
                </header>
                <div className="account-popup__body">
                    <View />
                </div>
                </div></div></div>
            </section>
        </div>
    );
};

AccountPopup.propTypes = {
    basePath: PropTypes.string.isRequired,
    popupName: PropTypes.oneOf(Object.keys(popupViews)).isRequired,
};

export default AccountPopup;

import { useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "../../components/Layout/LayoutContext";
import ProfileIllustration from "../../assets/svg/profile-illustration.svg";

const money = (value) => {
    const amount = Number.parseFloat(value);
    return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
};

const Profile = () => {
    const { contextData } = useContext(AppContext);
    const { userBalance } = useContext(LayoutContext);
    const user = contextData?.session?.user || {};
    const [email, setEmail] = useState(user.email || "");
    const [phone, setPhone] = useState(user.mobile_number || user.phone || "");
    const [section, setSection] = useState("details");
    const username = user.username || "-";
    const playerId = user.id || "******";
    const balance = money(userBalance ?? user.balance);

    const copyPlayerId = () => navigator.clipboard?.writeText(String(playerId));

    return (
        <div className="account-menu account-menu-details target-profile">
            <nav className="tb--subhead tb--subhead-trans main-tab-menu tb--flex tb--align-center tb--mobile-hide target-profile__subnav" aria-label="Configuración del perfil">
                <div className="tb--submenu tb--submenu-trans tb--flex tb--f-14">
                <button className={`tb--submenu-item tb--submenu-item-tans tb--ph-16 ${section === "details" ? "active" : ""}`} onClick={() => setSection("details")}>Detalles personales</button>
                <button className={`tb--submenu-item tb--submenu-item-tans tb--ph-16 ${section === "documents" ? "active" : ""}`} onClick={() => setSection("documents")}>Documentos</button>
                <button className={`tb--submenu-item tb--submenu-item-tans tb--ph-16 ${section === "security" ? "active" : ""}`} onClick={() => setSection("security")}>Seguridad</button>
                </div>
            </nav>

            {section === "details" ? (
                <div className="tb--acount-body-personal_details tb--account-body tb--profile-scroll target-profile__layout">
                    <div className="tb--empty-profile_banner profile--banner-spacing tb--banner tb--rel" />
                    <div className="tb--profile-body fade-appear-done fade-enter-done"><div className="tb--flex f-h-100 tb-mobile-full">
                    <aside className="tb--profile-right-cont tb--col-2 tb--flex target-profile__summary">
                        <div className="tb--profile-user-right">
                        <div className="tb--user-info_block tb--flex tb--mobile-hide target-profile__identity">
                            <div className="tb--w_100"><div className="tb--user-info_cont"><div className="tb--user-info_cont-top tb--flex tb--align-center">
                            <div className="tb--user-avatar target-profile__avatar"><i className="digi_icon-user" /></div>
                            <div className="tb--user-info tb--my-profile-info">
                                <p className="tb--user-name tb--bold">{username}</p>
                                <div className="tb--player-id_cont tb--flex tb--align-center"><span className="tb--player-id_txt tb--text-capitalize">ID del jugador:</span><p><span className="tb--player-id tb--id_color tb--ph-4 tb--bold">{playerId}</span>
                                    <button className="tb--copy-wrapper" type="button" onClick={copyPlayerId} aria-label="Copiar ID"><i className="tb--cp tb--player-copy digi_icon-copied" /></button>
                                </p>
                            </div>
                            </div></div></div></div>
                        </div>

                        <div className="tb--profile-balance-info tb--flex tb--justify-center tb--align-center tb--f-14 tb--flex-col target-profile__balance-card">
                            <div className="tb--profile-balance-content tb--w_100 tb--flex tb--justify-between tb--align-center tb--flex-wrap">
                            <div><div className="tb--info tb--flex tb--align-center tb--balance_info-box"><span className="tb--profile-balance_txt tb--f-16">Saldo</span><i className="digi_icon-info-full" /></div>
                            <span className="tb--f-medium tb--f-24 tb---rtl-currency tb--balance target-profile__balance-total"><span>{balance}</span><span className="tb--balance_currency"> ARS</span></span></div>
                                <i className="show-balance-icon digi_icon-eye" />
                            </div>
                            <div className="tb--w_100 tb--divider target-profile__balance-list">
                                <p className="tb--profile-balance-item tb--flex tb--justify-between tb--w_100"><span className="tb--profile-balance_txt tb--ellipsis">extraíble</span><b className="tb--profile-balance_amount">{balance} <small>ARS</small></b></p>
                                <p className="tb--profile-balance-item tb--flex tb--justify-between tb--w_100"><span className="tb--profile-balance_txt tb--ellipsis">Usó</span><b className="tb--profile-balance_amount">0.00 <small>ARS</small></b></p>
                                <p className="tb--profile-balance-item tb--flex tb--justify-between tb--w_100"><span className="tb--profile-balance_txt tb--ellipsis">No usado</span><b className="tb--profile-balance_amount">0.00 <small>ARS</small></b></p>
                                <p className="tb--profile-balance-item tb--flex tb--justify-between tb--w_100"><span className="tb--profile-balance_txt tb--ellipsis">Bono</span><b className="tb--profile-balance_amount">0.00 <small>ARS</small></b></p>
                            </div>
                            </div>
                        </div>
                    </aside>

                    <form name="myProfileForm" className="tb--profile-left-cont tb--personal-details-content tb--col-10 tb--flex tb--flex-grid__item8 tb--flex-col tb--col1 target-profile__details" onSubmit={(event) => event.preventDefault()}>
                        <h4 className="tb--personal-details">Detalles personales</h4>
                        <div className="tb--flex tb--profile-lcont tb--justify-between target-profile__details-grid">
                            <div className="tb--details_wrapper tb--col-4 target-profile__fields"><div className="tb--pd-inputs"><div className="tb--space tb--col-12">
                                <label className="tb--flex tb--flex-col tb--mb-16 tb--w_100 tb--input-group tb--pc-input tb--input-group__disabled"><span className="tb--lbl tb--f-12 tb--login-lbl">Nombre de usuario</span>
                                    <input className="tb--input tb--input-white tb--ellipsis" disabled value={username} />
                                </label>
                                <label className="tb--flex tb--flex-col tb--mb-16 tb--w_100 tb--input-group tb--pc-input"><span className="tb--lbl tb--f-12 tb--login-lbl">Correo electrónico *</span>
                                    <input className="tb--input tb--input-white tb--ellipsis" type="email" value={email} placeholder="Introduce tu correo electrónico" onChange={(event) => setEmail(event.target.value)} />
                                </label>
                                <label className="tb--flex tb--flex-col tb--mb-16 tb--w_100 tb--input-group tb--pc-input"><span className="tb--lbl tb--f-12 tb--login-lbl">Número de teléfono celular</span>
                                    <input className="tb--input tb--input-white tb--ellipsis" type="tel" value={phone} placeholder="Ingrese su numero celular" onChange={(event) => setPhone(event.target.value)} />
                                </label>
                            </div></div></div>
                            <div className="tb--illustration tb--col-8 tb--mobile-hide" aria-hidden="true">
                                <img className="tb--my-account_illustration" src={ProfileIllustration} alt="" />
                            </div>
                        </div>
                        <div className="tb--profile-footer tb--mt-8 tb--button-space_mobile tb--w_32"><input className="btn btn-wb-size-l btn-mb-size-l btn-primary__popup" type="button" disabled value="Actualizar" /></div>
                    </form>
                    </div></div>
                </div>
            ) : (
                <div className="target-profile__placeholder">
                    <i className="material-icons">{section === "documents" ? "description" : "security"}</i>
                    <h2>{section === "documents" ? "Documentos" : "Seguridad"}</h2>
                    <p>Esta sección estará disponible próximamente.</p>
                </div>
            )}
        </div>
    );
};

export default Profile;

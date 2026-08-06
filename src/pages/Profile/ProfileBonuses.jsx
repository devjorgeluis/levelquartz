import { useState } from "react";

const categories = ["Deporte", "Casino", "Giros Gratuitos", "Dinero Real"];

const ProfileBonuses = () => {
    const [category, setCategory] = useState("Deporte");
    const [tab, setTab] = useState("Bonos");

    return (
        <div className="account-menu">
            <div className="tb--subhead tb--subhead-trans main-tab-menu tb--flex tb--align-center tb--mobile-hide tb--offers-subhead">
                <div className="tb--submenu tb--submenu-trans tb--flex tb--f-14">
                    {["Bonos", "Historial de bonos"].map((item) => (
                        <a key={item} className={`tb--submenu-item tb--submenu-item-tans tb--ph-16 ${tab === item ? "active" : ""}`} onClick={() => setTab(item)}>{item}</a>
                    ))}
                </div>
            </div>
            <div className="tb--account-body tb--profile-scroll tb--bg-mobile-margin tb--subtab-section">
                <div className="tb--submenu__content tb--new-offers-container fade-appear-done fade-enter-done">
                    <div className="tb--new-offers">
                        <div className="tb--submenu__list tb--mobile-hide">
                            <div className="tb--submenu"><div className="slick-slider slick-initialized"><div className="slick-list"><div className="slick-track">
                                {categories.map((item, index) => <div key={item} className={`slick-slide ${category === item ? "slick-active slick-current" : ""}`}><div><a className={`tb--submenu__item ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</a></div></div>)}
                            </div></div></div></div>
                        </div>
                    </div>
                    <div className="two-level-table_container bg--transparent">
                        <div className="tb--flex tb--web-hide">
                            {categories.map((item) => <a key={item} className={`tb--mob-menu-item tb--flex tb--center tb--text_upercase tb--f-12 tb--cp ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</a>)}
                        </div>
                        <div className="tb--h_100 bonuses-container--empty-block">
                            <div className="bonuses-container tb--empty_content">
                                <div className="tb--empty-cont tb--tac">
                                    <div className="tb--nodata-icon"><i className="digi_icon-offer" /></div>
                                    <span>{tab === "Bonos" ? "Sin bonificaciones" : "Sin historial de bonos"}</span>
                                    <p>No hay bonos para el tipo seleccionado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileBonuses;

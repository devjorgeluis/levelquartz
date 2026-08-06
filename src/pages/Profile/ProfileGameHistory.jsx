import { useState } from "react";
import Select, { components } from "react-select";

const periodOptions = [
    { value: "day", label: "Últimos 24 horas", days: 1 },
    { value: "week", label: "Últimos 7 días", days: 7 },
    { value: "month", label: "Últimos 30 días", days: 30 },
    { value: "custom", label: "Período personalizado", days: null },
];

const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <i className="tb--custom-sel digi_icon-arrow_down" />
    </components.DropdownIndicator>
);

const toInputDate = (date) => date.toISOString().slice(0, 10);

const ProfileGameHistory = () => {
    const now = new Date();
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    const [from, setFrom] = useState(toInputDate(yesterday));
    const [to, setTo] = useState(toInputDate(now));
    const [period, setPeriod] = useState(periodOptions[0]);

    const handlePeriodChange = (option) => {
        setPeriod(option);
        if (!option?.days) return;

        const end = new Date();
        const start = new Date(end);
        start.setDate(end.getDate() - option.days);
        setFrom(toInputDate(start));
        setTo(toInputDate(end));
    };

    return (
        <div className="tb--popup-wrapper tb--game-history fade-appear-done fade-enter-done">
            <div className="tb--account-body tb--profile-scroll tl_gh">
                <div className="tb--empty-profile_banner tb--banner tb--rel" />
                <div className="tb--history tb--empty-history">
                    <form name="myProfileForm" className="myProfileForm tb--game-history_tbl cashier-form-wrapper tb--recent-nodata" onSubmit={(event) => event.preventDefault()}>
                        <div className="transaction-header tb--history-filter tb--flex tb--align-end">
                            <div className="tb--col-2 tb--mh-4 tb--col-4"><div className="tb--pay-inner-input tb--flex tb--flex-col tb--mb-14 tb--width-5 tb--select-element"><span className="tb--custom-data-title tb--f-12">Período</span><div className="tb--rel">
                                <Select
                                    className="custom-select custom-select-bottom"
                                    classNamePrefix="react-select"
                                    value={period}
                                    options={periodOptions}
                                    onChange={handlePeriodChange}
                                    isSearchable={false}
                                    components={{ DropdownIndicator, IndicatorSeparator: null }}
                                    menuPlacement="auto"
                                    aria-label="Período"
                                />
                            </div></div></div>
                            <div className="tb--col-2 tb--mh-4 tb--col-fromdate tb--col-4">
                                <div className="tb--datepicker-group tb--flex tb--flex-col tb--mb-12">
                                    <span className="tb--custom-data-title tb--f-12">De</span>
                                    <div className="tb--rel">
                                        <input className="tb--input tb--input-white input--birthdate" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
                                        <i className="tb--calendar-icon digi_icon-calendar" />
                                    </div>
                                </div>
                            </div>
                            <div className="tb--col-2 tb--mh-4 tb--col-todate tb--col-4">
                                <div className="tb--datepicker-group tb--flex tb--flex-col tb--mb-12">
                                    <span className="tb--custom-data-title tb--f-12">A</span>
                                    <div className="tb--rel">
                                        <input className="tb--input tb--input-white input--birthdate" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
                                        <i className="tb--calendar-icon digi_icon-calendar" />
                                    </div>
                                </div>
                            </div>
                            <div className="tb--col-2 tb--mh-4 tb--mb-12 tb--button-space_mobile tb--button-space_web">
                                <input type="submit" className="btn btn-wb-size-l btn-mb-size-l btn-primary__popup tb--mh-0" value="Ver detalles" />
                            </div>
                        </div>
                        <div className="tb--table-container tb--tabel-empty">
                            <div className="tb--home-game-heading tb--flex tb--align-center tb--ph-20 tb--mobile-hide"><div className="id tb--acc22 tb--ns">Identificación</div><div className="dt tb--acc22 tb--ns">Fecha</div><div className="gn tb--acc22 tb--ns">Juego</div><div className="wg tb--acc22 tb--ns">Apuesta</div><div className="win tb--acc12 tb--ns tb--tar">Ganar</div></div>
                            <div className="table-height tb--flex-box"><div className="tb--game-history"><div className="tb--history-empty tb--flex tb--align-center tb--justify-center f-h-100 tb--mt-24"><div className="tb--empty-cont tb--tac"><div className="tb--nodata-icon"><i className="digi_icon-history" /></div><span>Sin datos</span><p>No hay datos para este período de tiempo</p></div></div></div></div>
                        </div>
                    </form>
                    <div className="tb--recent-game_cont-wrapper"><div className="tb--recent-game_cont tb--mobile-hide"><p className="tb--recent-header tb--mb-16">Juegos utilizados recientemente</p></div></div>
                </div>
            </div>
        </div>
    );
};

export default ProfileGameHistory;

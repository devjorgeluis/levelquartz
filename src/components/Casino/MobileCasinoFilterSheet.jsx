import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

const CATEGORY_LIMIT = 5;
const PROVIDER_LIMIT = 6;
const THEME_LIMIT = 6;

const MobileCasinoFilterSheet = ({
    isOpen,
    onClose,
    onApply,
    categories,
    selectedCategoryIndex,
    providers,
    selectedProviderId,
    themes,
    selectedTheme,
    searchValue,
    totalGames,
}) => {
    const [draftSearch, setDraftSearch] = useState(searchValue);
    const [draftCategoryIndex, setDraftCategoryIndex] = useState(selectedCategoryIndex);
    const [draftProviderId, setDraftProviderId] = useState(selectedProviderId);
    const [draftTheme, setDraftTheme] = useState(selectedTheme);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllProviders, setShowAllProviders] = useState(false);
    const [showAllThemes, setShowAllThemes] = useState(false);

    useEffect(() => {
        if (!isOpen) return undefined;

        setDraftSearch(searchValue);
        setDraftCategoryIndex(selectedCategoryIndex);
        setDraftProviderId(selectedProviderId);
        setDraftTheme(selectedTheme);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose, searchValue, selectedCategoryIndex, selectedProviderId, selectedTheme]);

    if (!isOpen) return null;

    const visibleCategories = showAllCategories ? categories : categories.slice(0, CATEGORY_LIMIT);
    const visibleProviders = showAllProviders ? providers : providers.slice(0, PROVIDER_LIMIT);
    const visibleThemes = showAllThemes ? themes : themes.slice(0, THEME_LIMIT);

    const resetDrafts = () => {
        setDraftSearch("");
        setDraftCategoryIndex(0);
        setDraftProviderId(null);
        setDraftTheme("TODAS");
    };

    const applyDrafts = () => {
        onApply({
            searchValue: draftSearch,
            categoryIndex: draftCategoryIndex,
            providerId: draftProviderId,
            theme: draftTheme,
        });
    };

    return createPortal(
        <div
            className="lq-mobile-filter-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                id="mobile-casino-filter"
                className="lq-mobile-filter-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-casino-filter-title"
            >
                <div className="lq-mobile-filter-sheet__handle" aria-hidden="true" />

                <header className="lq-mobile-filter-sheet__header">
                    <h2 id="mobile-casino-filter-title">Filtrar y Buscar</h2>
                    <button type="button" onClick={onClose} aria-label="Cerrar filtros">
                        <i className="digi_icon-close" />
                    </button>
                </header>

                <div className="lq-mobile-filter-sheet__body">
                    <label className="lq-mobile-filter-sheet__search">
                        <i className="digi_icon-search" aria-hidden="true" />
                        <input
                            type="search"
                            value={draftSearch}
                            onChange={(event) => setDraftSearch(event.target.value)}
                            placeholder="Buscar"
                            aria-label="Buscar juegos"
                        />
                    </label>

                    <div className="lq-mobile-filter-sheet__panel">
                        <section className="lq-mobile-filter-sheet__section">
                            <h3>Categorías</h3>
                            <div className="lq-mobile-filter-sheet__radios">
                                {visibleCategories.map((category, index) => {
                                    const categoryIndex = categories.indexOf(category);
                                    const checked = draftCategoryIndex === categoryIndex;
                                    return (
                                        <button
                                            type="button"
                                            key={category.code || category.name}
                                            className={checked ? "active" : ""}
                                            onClick={() => setDraftCategoryIndex(categoryIndex)}
                                            role="radio"
                                            aria-checked={checked}
                                        >
                                            <span>{category.name}</span>
                                            <span className="lq-mobile-filter-sheet__radio" aria-hidden="true" />
                                        </button>
                                    );
                                })}
                            </div>
                            {categories.length > CATEGORY_LIMIT && (
                                <button
                                    type="button"
                                    className="lq-mobile-filter-sheet__more"
                                    onClick={() => setShowAllCategories((show) => !show)}
                                >
                                    {showAllCategories ? "Mostrar menos" : "Mostrar más"}
                                </button>
                            )}
                        </section>

                        <section className="lq-mobile-filter-sheet__section">
                            <h3>Proveedores</h3>
                            <div className="lq-mobile-filter-sheet__chips">
                                <button
                                    type="button"
                                    className={draftProviderId === null ? "active" : ""}
                                    onClick={() => setDraftProviderId(null)}
                                >
                                    TODAS ({totalGames})
                                </button>
                                {visibleProviders.map((provider) => (
                                    <button
                                        type="button"
                                        key={provider.id}
                                        className={draftProviderId === provider.id ? "active" : ""}
                                        onClick={() => setDraftProviderId(provider.id)}
                                    >
                                        {provider.name}
                                    </button>
                                ))}
                            </div>
                            {providers.length > PROVIDER_LIMIT && (
                                <button
                                    type="button"
                                    className="lq-mobile-filter-sheet__more"
                                    onClick={() => setShowAllProviders((show) => !show)}
                                >
                                    {showAllProviders ? "Mostrar menos" : "Mostrar más"}
                                </button>
                            )}
                        </section>

                        {themes.length > 0 && (
                            <section className="lq-mobile-filter-sheet__section">
                                <h3>Theme</h3>
                                <div className="lq-mobile-filter-sheet__chips">
                                    {visibleThemes.map((theme) => (
                                        <button
                                            type="button"
                                            key={theme}
                                            className={draftTheme === theme ? "active" : ""}
                                            onClick={() => setDraftTheme(theme)}
                                        >
                                            {theme}
                                        </button>
                                    ))}
                                </div>
                                {themes.length > THEME_LIMIT && (
                                    <button
                                        type="button"
                                        className="lq-mobile-filter-sheet__more"
                                        onClick={() => setShowAllThemes((show) => !show)}
                                    >
                                        {showAllThemes ? "Mostrar menos" : "Mostrar más"}
                                    </button>
                                )}
                            </section>
                        )}
                    </div>
                </div>

                <footer className="lq-mobile-filter-sheet__footer">
                    <button type="button" className="lq-mobile-filter-sheet__reset" onClick={resetDrafts}>
                        Reiniciar
                    </button>
                    <button type="button" className="lq-mobile-filter-sheet__apply" onClick={applyDrafts}>
                        Aplicar&nbsp; ({totalGames})
                    </button>
                </footer>
            </section>
        </div>,
        document.body
    );
};

MobileCasinoFilterSheet.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedCategoryIndex: PropTypes.number.isRequired,
    providers: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedProviderId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    themes: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedTheme: PropTypes.string.isRequired,
    searchValue: PropTypes.string.isRequired,
    totalGames: PropTypes.number.isRequired,
};

MobileCasinoFilterSheet.defaultProps = {
    selectedProviderId: null,
};

export default MobileCasinoFilterSheet;

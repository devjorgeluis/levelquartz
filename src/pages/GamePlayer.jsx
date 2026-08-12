import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import {
    clearGamePlayerPayload,
    readGamePlayerPayload,
} from "../utils/gamePlayerNavigation";
import LoadCasino from "../components/Loading/LoadCasino";
import ImgLogo from "/src/assets/images/Logo.png";
import "./game-player.css";

const GRID_COUNTS = { "1x1": 1, "2x1": 2, "2x2": 4 };

const CASINO_FILTERS = [
    { name: "All", code: "casino" },
    { name: "Más Popular", code: "MostPopular", badge: "Premium" },
    { name: "Favourites", code: "Favourites" },
    { name: "New", code: "New" },
    { name: "Slots", code: "Slots" },
    { name: "Roulette", code: "Roulette" },
    { name: "BlackJack", code: "BlackJack" },
    { name: "Poker", code: "Poker" },
    { name: "Last Played Games", code: "LastPlayedGames" },
    { name: "Other", code: "Other" },
    { name: "Most Liked", code: "MostLiked" },
    { name: "Jackpot", code: "Jackpot" },
];

const LIVE_FILTERS = [
    { name: "All", code: "livecasino" },
    { name: "Most Popular", code: "MostPopular" },
    { name: "Baccarat", code: "Baccarat" },
    { name: "Roulette", code: "Roulette" },
    { name: "BlackJack", code: "BlackJack" },
    { name: "Poker", code: "Poker" },
    { name: "Trending Games", code: "TrendingGames" },
    { name: "Other", code: "Other" },
    { name: "Most Liked", code: "MostLiked" },
];

const formatBalance = (value) => {
    const balance = Number.parseFloat(value);
    return Number.isFinite(balance) ? balance.toFixed(2) : "0.00";
};

const gameImage = (game, cdnUrl) => {
    if (game?.imageDataSrc) return game.imageDataSrc;
    if (game?.image_local) return `${cdnUrl || ""}${game.image_local}`;
    return game?.image_url || game?.image || "";
};

const normalizeGames = (games, cdnUrl) => (games || []).map((game) => ({
    ...game,
    image: gameImage(game, cdnUrl),
}));

const AddGameModal = ({
    filters,
    selectedFilter,
    providers,
    selectedProvider,
    games,
    loading,
    onClose,
    onFilterSelect,
    onProviderSelect,
    onGameSelect,
}) => {
    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const [providersExpanded, setProvidersExpanded] = useState(false);
    const [search, setSearch] = useState("");

    const visibleGames = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return games;
        return games.filter((game) => game.name?.toLowerCase().includes(keyword));
    }, [games, search]);

    return (
        <div className="add-game-backdrop" role="presentation" onMouseDown={onClose}>
            <section className="add-game-modal" role="dialog" aria-modal="true" aria-labelledby="add-game-title" onMouseDown={(event) => event.stopPropagation()}>
                <header className="add-game-modal__header">
                    <h2 id="add-game-title">+Añadir Juego</h2>
                    <button type="button" onClick={onClose} aria-label="Cerrar"><i className="material-icons">close</i></button>
                </header>

                <div className="add-game-modal__body">
                    <div className={`add-game-bar add-game-bar--filters ${filtersExpanded ? "is-expanded" : ""}`}>
                        <div className="add-game-bar__items">
                            {filters.map((filter) => (
                                <button
                                    type="button"
                                    key={filter.code}
                                    className={selectedFilter.code === filter.code ? "is-active" : ""}
                                    onClick={() => onFilterSelect(filter)}
                                >
                                    {filter.name}
                                    {filter.badge && <small>{filter.badge}</small>}
                                </button>
                            ))}
                        </div>
                        <button type="button" className="add-game-bar__toggle" onClick={() => setFiltersExpanded((expanded) => !expanded)} aria-label="Expandir categorías">
                            <i className="material-icons">expand_more</i>
                        </button>
                        <label className="add-game-search">
                            <i className="material-icons">search</i>
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar" />
                        </label>
                    </div>

                    <div className={`add-game-bar add-game-bar--providers ${providersExpanded ? "is-expanded" : ""}`}>
                        <div className="add-game-bar__items">
                            <button type="button" className={!selectedProvider ? "is-active" : ""} onClick={() => onProviderSelect(null)}>
                                TODAS
                            </button>
                            {providers.map((provider) => (
                                <button
                                    type="button"
                                    key={provider.id || provider.code || provider.name}
                                    className={selectedProvider?.id === provider.id ? "is-active" : ""}
                                    onClick={() => onProviderSelect(provider)}
                                >
                                    {provider.name} {provider.element_count != null && `(${provider.element_count})`}
                                </button>
                            ))}
                        </div>
                        <button type="button" className="add-game-bar__toggle" onClick={() => setProvidersExpanded((expanded) => !expanded)} aria-label="Expandir proveedores">
                            <i className="material-icons">expand_more</i>
                        </button>
                    </div>

                    <div className="add-game-results">
                        {loading ? (
                            <div className="add-game-loading"><LoadCasino /></div>
                        ) : visibleGames.length ? (
                            <div className="add-game-grid">
                                {visibleGames.map((game) => (
                                    <button type="button" key={game.id} onClick={() => onGameSelect(game)} title={game.name}>
                                        <img src={game.image} alt={game.name} />
                                        <span>{game.name}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="add-game-empty">No se encontraron juegos.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const GamePlayer = ({ lobbyType }) => {
    const { contextData } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();
    const stageRef = useRef(null);
    const payloadRef = useRef(readGamePlayerPayload(lobbyType, location.state));
    const payload = payloadRef.current;
    const returnTo = payload?.returnTo || `/${lobbyType}`;
    const basePage = lobbyType === "live-casino" ? "livecasino" : "casino";
    const filters = lobbyType === "live-casino" ? LIVE_FILTERS : CASINO_FILTERS;

    const [layout, setLayout] = useState("1x1");
    const [slots, setSlots] = useState(() => payload?.game ? [{ ...payload.game, image: payload.game.image || "", loading: true }] : []);
    const [activeSlot, setActiveSlot] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [baseCatalog, setBaseCatalog] = useState({ pageGroupCode: "", categories: [] });
    const [drawerCategories, setDrawerCategories] = useState([{ name: "All", code: "all" }]);
    const [drawerCategoryIndex, setDrawerCategoryIndex] = useState(0);
    const [drawerGames, setDrawerGames] = useState([]);
    const [drawerLoading, setDrawerLoading] = useState(true);

    const [modalFilter, setModalFilter] = useState(filters[0]);
    const [modalCatalog, setModalCatalog] = useState({ pageGroupCode: "", categories: [] });
    const [modalProvider, setModalProvider] = useState(null);
    const [modalGames, setModalGames] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    const closePlayer = useCallback(() => {
        clearGamePlayerPayload(lobbyType);
        navigate(returnTo, { replace: true });
    }, [lobbyType, navigate, returnTo]);

    const fetchContent = useCallback((catalog, category, callback) => {
        if (!catalog?.pageGroupCode) {
            callback([]);
            return;
        }

        let endpoint = `/get-content?page_group_type=categories&page_group_code=${encodeURIComponent(catalog.pageGroupCode)}&page=0&length=60`;
        if (category?.id && category?.table_name) {
            endpoint += `&table_name=${encodeURIComponent(category.table_name)}&apigames_category_id=${encodeURIComponent(category.id)}`;
        }

        callApi(contextData, "GET", endpoint, (result) => {
            callback(normalizeGames(result?.content || [], contextData.cdnUrl));
        }, null);
    }, [contextData]);

    const loadGameIntoSlot = useCallback((game, slotIndex) => {
        if (!game?.id) return;

        const normalizedGame = { ...game, image: gameImage(game, contextData.cdnUrl), loading: true, error: "", iframeLoaded: false, url: "" };
        setSlots((current) => {
            const next = Array.from({ length: GRID_COUNTS[layout] }, (_, index) => current[index] || null);
            next[slotIndex] = normalizedGame;
            return next;
        });
        setActiveSlot(slotIndex);

        callApi(contextData, "GET", `/get-game-url?game_id=${encodeURIComponent(game.id)}`, (result) => {
            setSlots((current) => current.map((slot, index) => {
                if (index !== slotIndex || slot?.id !== game.id) return slot;
                if (result?.status === "0" && result.url) return { ...slot, url: result.url, loading: false };
                return { ...slot, loading: false, error: "Error al cargar el juego. Inténtalo de nuevo." };
            }));
        }, null);
    }, [contextData, layout]);

    useEffect(() => {
        if (!payload?.game?.id) {
            navigate(returnTo, { replace: true });
            return;
        }
        loadGameIntoSlot(payload.game, 0);
    }, [loadGameIntoSlot, navigate, payload, returnTo]);

    useEffect(() => {
        callApi(contextData, "GET", `/get-page?page=${encodeURIComponent(basePage)}`, (result) => {
            const data = result?.data || {};
            const catalog = { pageGroupCode: data.page_group_code || "", categories: data.categories || [] };
            setBaseCatalog(catalog);
            setModalCatalog(catalog);
            setDrawerCategories([{ name: "All", code: "all" }, ...catalog.categories]);
            setDrawerLoading(true);
            fetchContent(catalog, null, (games) => {
                setDrawerGames(games);
                setDrawerLoading(false);
            });
            setModalLoading(true);
            fetchContent(catalog, null, (games) => {
                setModalGames(games);
                setModalLoading(false);
            });
        }, null);
    }, [basePage, contextData, fetchContent]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key !== "Escape" || document.fullscreenElement) return;
            if (isAddModalOpen) setIsAddModalOpen(false);
            else if (isDrawerOpen) setIsDrawerOpen(false);
            else closePlayer();
        };
        const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));

        document.addEventListener("keydown", handleEscape);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [closePlayer, isAddModalOpen, isDrawerOpen]);

    const selectDrawerCategory = (nextIndex) => {
        const total = drawerCategories.length;
        const index = (nextIndex + total) % total;
        const category = drawerCategories[index];
        setDrawerCategoryIndex(index);
        setDrawerLoading(true);
        fetchContent(baseCatalog, index === 0 ? null : category, (games) => {
            setDrawerGames(games);
            setDrawerLoading(false);
        });
    };

    const selectModalFilter = (filter) => {
        setModalFilter(filter);
        setModalProvider(null);
        setModalLoading(true);
        callApi(contextData, "GET", `/get-page?page=${encodeURIComponent(filter.code)}`, (result) => {
            const data = result?.data || {};
            const directGames = data.page_group_type === "games" ? normalizeGames(data.categories || [], contextData.cdnUrl) : null;
            const catalog = {
                pageGroupCode: data.page_group_code || "",
                categories: directGames ? [] : (data.categories || []),
            };
            setModalCatalog(catalog);
            if (directGames) {
                setModalGames(directGames);
                setModalLoading(false);
            } else {
                fetchContent(catalog, null, (games) => {
                    setModalGames(games);
                    setModalLoading(false);
                });
            }
        }, null);
    };

    const selectModalProvider = (provider) => {
        setModalProvider(provider);
        setModalLoading(true);
        fetchContent(modalCatalog, provider, (games) => {
            setModalGames(games);
            setModalLoading(false);
        });
    };

    const changeLayout = (nextLayout) => {
        const count = GRID_COUNTS[nextLayout];
        setLayout(nextLayout);
        setSlots((current) => Array.from({ length: count }, (_, index) => current[index] || null));
        setActiveSlot((current) => Math.min(current, count - 1));
    };

    const addGame = (game) => {
        const emptyIndex = slots.findIndex((slot) => !slot);
        const targetIndex = emptyIndex === -1 ? activeSlot : emptyIndex;
        loadGameIntoSlot(game, targetIndex);
        setIsAddModalOpen(false);
    };

    const replaceFromDrawer = (game) => {
        loadGameIntoSlot(game, activeSlot);
        if (window.innerWidth < 900) setIsDrawerOpen(false);
    };

    const retryActiveGame = () => {
        const game = slots[activeSlot];
        if (game) loadGameIntoSlot(game, activeSlot);
    };

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) await stageRef.current?.requestFullscreen();
            else await document.exitFullscreen();
        } catch {
            // Fullscreen may be blocked by browser permissions.
        }
    };

    const activeGame = slots[activeSlot];
    const userBalance = contextData?.session?.user?.balance;

    if (!payload?.game?.id) return null;

    return (
        <div className="game-player-page" style={{ "--game-background": `url("${activeGame?.image || payload.game.image || ""}")` }}>
            <header className="game-player-header">
                <div className="game-player-header__start">
                    <button type="button" className="game-player-logo" onClick={closePlayer} aria-label="Volver al casino">
                        <img src={ImgLogo} alt="LevelQuartz" />
                    </button>
                    <button type="button" className={`game-player-drawer-toggle ${isDrawerOpen ? "is-open" : ""}`} onClick={() => setIsDrawerOpen((open) => !open)} aria-expanded={isDrawerOpen} aria-label="Mostrar otros juegos">
                        <i className="material-icons">chevron_right</i>
                    </button>
                    <div className="game-player-layout-icons" aria-label="Vista de juegos">
                        <button type="button" className={layout === "1x1" ? "is-active layout-one" : "layout-one"} onClick={() => changeLayout("1x1")} aria-label="Vista 1 por 1"><span /></button>
                        <button type="button" className={layout === "2x1" ? "is-active layout-two" : "layout-two"} onClick={() => changeLayout("2x1")} aria-label="Vista 2 por 1"><span /><span /></button>
                        <button type="button" className={layout === "2x2" ? "is-active layout-four" : "layout-four"} onClick={() => changeLayout("2x2")} aria-label="Vista 2 por 2"><span /><span /><span /><span /></button>
                    </div>
                </div>
                <span className="game-player-balance">Saldo: <b>{formatBalance(userBalance)} ARS</b></span>
            </header>

            <aside className={`game-player-drawer ${isDrawerOpen ? "is-open" : ""}`} aria-hidden={!isDrawerOpen}>
                <div className="game-player-drawer__header">
                    <h2>{drawerCategories[drawerCategoryIndex]?.name || "All"}</h2>
                    <div>
                        <button type="button" onClick={() => selectDrawerCategory(drawerCategoryIndex - 1)} aria-label="Categoría anterior"><i className="material-icons">chevron_left</i></button>
                        <button type="button" onClick={() => selectDrawerCategory(drawerCategoryIndex + 1)} aria-label="Categoría siguiente"><i className="material-icons">chevron_right</i></button>
                    </div>
                </div>
                <div className="game-player-drawer__games">
                    {drawerLoading ? <div className="game-player-drawer__loading"><LoadCasino /></div> : drawerGames.map((game) => (
                        <button type="button" key={game.id} onClick={() => replaceFromDrawer(game)} title={game.name}>
                            <img src={game.image} alt={game.name} />
                            <span>{game.name}</span>
                        </button>
                    ))}
                </div>
            </aside>

            <main className="game-player-main">
                <section className={`game-player-stage-shell layout-${layout}`} ref={stageRef} aria-label="Reproductor de juegos">
                    <div className="game-player-grid">
                        {Array.from({ length: GRID_COUNTS[layout] }, (_, index) => {
                            const slot = slots[index];
                            return (
                                <div key={index} className={`game-player-slot ${activeSlot === index ? "is-active" : ""}`} onClick={() => setActiveSlot(index)}>
                                    {GRID_COUNTS[layout] > 1 && (
                                        <button type="button" className="game-player-slot-selector" onClick={() => setActiveSlot(index)} aria-label={`Seleccionar juego ${index + 1}`}>
                                            {index + 1}
                                        </button>
                                    )}
                                    {slot ? (
                                        <>
                                            {(slot.loading || !slot.iframeLoaded) && !slot.error && <div className="game-player-loader"><LoadCasino /></div>}
                                            {slot.error ? (
                                                <div className="game-player-error"><p>{slot.error}</p><button type="button" onClick={() => loadGameIntoSlot(slot, index)}>Reintentar</button></div>
                                            ) : slot.url ? (
                                                <iframe
                                                    className={slot.iframeLoaded ? "is-loaded" : ""}
                                                    src={slot.url}
                                                    title={slot.name}
                                                    allow="camera; microphone; autoplay; fullscreen *"
                                                    allowFullScreen
                                                    onLoad={() => setSlots((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, iframeLoaded: true, loading: false } : item))}
                                                    onError={() => setSlots((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, loading: false, error: "Error al cargar el juego." } : item))}
                                                />
                                            ) : null}
                                        </>
                                    ) : (
                                        <button type="button" className="game-player-add-slot" onClick={() => { setActiveSlot(index); setIsAddModalOpen(true); }}>+Añadir Juego</button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <nav className="game-player-controls" aria-label="Controles del juego">
                        <button type="button" onClick={closePlayer} aria-label="Cerrar juego"><i className="material-icons">close</i></button>
                        <button type="button" onClick={() => activeGame?.url && window.open(activeGame.url, "_blank", "noopener,noreferrer")} aria-label="Abrir en otra ventana" disabled={!activeGame?.url}><i className="material-icons">content_copy</i></button>
                        <button type="button" onClick={toggleFullscreen} aria-label="Pantalla completa"><i className="material-icons">{isFullscreen ? "fullscreen_exit" : "fullscreen"}</i></button>
                        <button type="button" onClick={retryActiveGame} aria-label="Recargar juego"><i className="material-icons">refresh</i></button>
                    </nav>
                </section>
            </main>

            {isAddModalOpen && (
                <AddGameModal
                    filters={filters}
                    selectedFilter={modalFilter}
                    providers={modalCatalog.categories}
                    selectedProvider={modalProvider}
                    games={modalGames}
                    loading={modalLoading}
                    onClose={() => setIsAddModalOpen(false)}
                    onFilterSelect={selectModalFilter}
                    onProviderSelect={selectModalProvider}
                    onGameSelect={addGame}
                />
            )}
        </div>
    );
};

export default GamePlayer;

import PropTypes from "prop-types";
import EmptyGamesIcon from "../../assets/svg/no-data.svg";

export const MobileLobbyTabs = ({ activeTab, onChange }) => (
    <nav className="lq-mobile-lobby-tabs" aria-label="Vista de juegos">
        <button type="button" className={activeTab === "all" ? "active" : ""} onClick={() => onChange("all")}>
            Todos los juegos
        </button>
        <button type="button" className={activeTab === "mine" ? "active" : ""} onClick={() => onChange("mine")}>
            Mis juegos
        </button>
    </nav>
);

export const MobileMyGames = ({ games, onGameClick }) => {
    const availableGames = games.filter((game) => game && (game.imageDataSrc || game.image_url));
    const sections = [
        { title: "All", games: availableGames.slice(0, 6) },
        { title: "Most Popular", games: availableGames.slice(6, 12) },
    ].filter((section) => section.games.length > 0);

    return (
        <main className="lq-mobile-my-games">
            <section className="lq-mobile-my-games__empty">
                <img src={EmptyGamesIcon} alt="" aria-hidden="true" />
                <h1>Mis juegos</h1>
                <p>Actualmente su lista está vacía. Añada sus juegos favoritos a la lista.</p>
            </section>

            <div className="lq-mobile-my-games__recommendations">
                {sections.map((section) => (
                    <section className="lq-mobile-my-games__section" key={section.title}>
                        <h2>{section.title}</h2>
                        <div className="lq-mobile-my-games__grid">
                            {section.games.map((game, index) => (
                                <button type="button" key={game.id || `${section.title}-${index}`} onClick={() => onGameClick(game)}>
                                    <img loading="lazy" src={game.imageDataSrc || game.image_url} alt={game.name || "Juego"} />
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
};

MobileLobbyTabs.propTypes = {
    activeTab: PropTypes.oneOf(["all", "mine"]).isRequired,
    onChange: PropTypes.func.isRequired,
};

MobileMyGames.propTypes = {
    games: PropTypes.arrayOf(PropTypes.object).isRequired,
    onGameClick: PropTypes.func.isRequired,
};

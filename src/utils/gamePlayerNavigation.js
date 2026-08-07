const storageKey = (lobbyType) => `levelquartz:game-player:${lobbyType}`;

export const getGameImage = (game, cdnUrl = "") => {
    if (game?.imageDataSrc) return game.imageDataSrc;
    if (game?.image_local) return `${cdnUrl}${game.image_local}`;
    return game?.image_url || "";
};

export const openGamePlayer = (navigate, game, lobbyType, cdnUrl = "") => {
    if (!game?.id) return;

    const normalizedLobby = lobbyType === "live-casino" ? "live-casino" : "casino";
    const payload = {
        game: {
            id: game.id,
            name: game.name || "Casino game",
            image: getGameImage(game, cdnUrl),
        },
        lobbyType: normalizedLobby,
        returnTo: `/${normalizedLobby}`,
    };

    sessionStorage.setItem(storageKey(normalizedLobby), JSON.stringify(payload));
    navigate(`/play/${normalizedLobby}`, { state: payload });
};

export const readGamePlayerPayload = (lobbyType, routeState) => {
    if (routeState?.game?.id) return routeState;

    try {
        return JSON.parse(sessionStorage.getItem(storageKey(lobbyType))) || null;
    } catch {
        return null;
    }
};

export const clearGamePlayerPayload = (lobbyType) => {
    sessionStorage.removeItem(storageKey(lobbyType));
};

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Casino from "./pages/Casino";
import LiveCasino from "./pages/LiveCasino";
import Sports from "./pages/Sports";
import LiveSports from "./pages/LiveSports";
import NoAuthGamePage from "./pages/NoAuthGamePage";
import NoPage from "./pages/NoPage";
import Layout from "./components/Layout/Layout";
import AccountPopup, { getPopupRoute } from "./components/Modal/AccountPopup";
import GamePlayer from "./pages/GamePlayer";

export default function AppRoutes() {
    const location = useLocation();
    const popupRoute = getPopupRoute(location.pathname);
    const backgroundLocation = popupRoute
        ? { ...location, pathname: popupRoute.basePath }
        : location;

    return (
        <>
            <Routes location={backgroundLocation}>
                <Route path="/play/casino" element={<GamePlayer lobbyType="casino" />} />
                <Route path="/play/live-casino" element={<GamePlayer lobbyType="live-casino" />} />
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/casino" element={<Casino />} />
                    <Route path="/live-casino" element={<LiveCasino />} />
                    <Route path="/sports" element={<Sports />} />
                    <Route path="/live-sports" element={<LiveSports />} />
                    <Route path="/profile" element={<Navigate to="/popup/myprofile" replace />} />
                    <Route path="/profile/balance" element={<Navigate to="/popup/balance" replace />} />
                    <Route path="/profile/history" element={<Navigate to="/popup/history" replace />} />
                    <Route path="/profile/bonus" element={<Navigate to="/popup/bonuses" replace />} />
                    <Route path="/game-login" element={<NoAuthGamePage gameName="Game" gameImg="" />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
            {popupRoute && <AccountPopup {...popupRoute} />}
        </>
    );
}

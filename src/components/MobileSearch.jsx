import { useContext, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutContext } from "./Layout/LayoutContext";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import { openGamePlayer } from "../utils/gamePlayerNavigation";
import LoadApi from "./Loading/LoadApi";
import LoginModal from "./Modal/LoginModal";

const MobileSearch = ({
    isLogin, isMobile, onClose
}) => {
    const { contextData } = useContext(AppContext);
    const { setShowMobileSearch } = useContext(LayoutContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [games, setGames] = useState([]);
    const [txtSearch, setTxtSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const searchRef = useRef(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [searchDelayTimer, setSearchDelayTimer] = useState();

    const handleClearClick = () => {
        if (onClose) {
            onClose();
        }
        if (setShowMobileSearch) {
            setShowMobileSearch(false);
        }
        setTxtSearch("");
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginConfirm = () => {
        setShowLoginModal(false);
    };

    const launchGame = (game) => {
        const lobbyType = location.pathname.startsWith("/live-casino") ? "live-casino" : "casino";
        handleClearClick();
        openGamePlayer(navigate, game, lobbyType, contextData.cdnUrl);
    };

    const configureImageSrc = (result) => {
        (result.content || []).forEach((element) => {
            let imageDataSrc = element.image_url;
            if (element.image_local != null) {
                imageDataSrc = contextData.cdnUrl + element.image_local;
            }
            element.imageDataSrc = imageDataSrc;
        });
    };

    const search = (e) => {
        let keyword = e.target.value;
        setTxtSearch(keyword);

        if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
            let keyword = e.target.value;
            do_search(keyword);
        } else {
            if (
                (e.keyCode >= 48 && e.keyCode <= 57) ||
                (e.keyCode >= 65 && e.keyCode <= 90) ||
                e.keyCode == 8 ||
                e.keyCode == 46
            ) {
                do_search(keyword);
            }
        }

        if (e.key === "Enter" || e.keyCode === 13 || e.key === "Escape" || e.keyCode === 27) {
            searchRef.current?.blur();
        }
    };

    const do_search = (keyword) => {
        setIsSearch(true);
        clearTimeout(searchDelayTimer);

        if (keyword == "") {
            return;
        }

        setGames([]);

        let pageSize = 20;
        let searchDelayTimerTmp = setTimeout(function () {
            callApi(
                contextData,
                "GET",
                "/search-content?keyword=" + txtSearch + "&page_group_code=" + "default_pages_home" + "&length=" + pageSize,
                callbackSearch,
                null
            );
        }, 1000);

        setSearchDelayTimer(searchDelayTimerTmp);
    };

    const callbackSearch = (result) => {
        setIsSearch(false);
        if (result.status === 500 || result.status === 422) {

        } else {
            configureImageSrc(result, true);
            setGames(result.content);
        }
    };

    return (
        <>
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onConfirm={handleLoginConfirm}
                />
            )}
            <div className="mobile-search focused">
                <div className="search-container float-right">
                    <div className="input-group">
                        <input
                            ref={searchRef}
                            className="form-control mobile-form-control"
                            placeholder="Buscar"
                            value={txtSearch}
                            onChange={(event) => {
                                setTxtSearch(event.target.value);
                            }}
                            onKeyUp={(event) => {
                                search(event);
                            }}
                            autoFocus
                        />
                        <span className="input-group-append" onClick={handleClearClick}>
                            <button type="button">
                                <i className="material-icons">close</i>
                            </button>
                        </span>
                    </div>
                </div>
                <div className="search-results-container">
                    <div className="search-results-inner-container">
                        {
                            isSearch ? <>
                                <div className="pt-1">
                                    <LoadApi />
                                </div>
                            </> :
                            games.length > 0 && games.map((item, index) => {
                                let imageDataSrc = item.image_url;
                                if (item.image_local != null) {
                                    imageDataSrc = contextData.cdnUrl + item.image_local;
                                }

                                return (
                                    <div
                                        className="game-result-row"
                                        key={index}
                                        onClick={() => launchGame(item)}
                                    >
                                        <div className="game-image" style={{ backgroundImage: `url(${imageDataSrc})` }}></div>
                                        <div className="game-title">
                                            <span className="game-name">{item.name}</span>
                                            <span className="game-studio"><span className="text-uppercase">{item.type}</span></span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </>
    );
};

export default MobileSearch;

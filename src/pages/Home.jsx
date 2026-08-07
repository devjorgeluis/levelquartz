import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { callApi } from "../utils/Utils";
import { openGamePlayer } from "../utils/gamePlayerNavigation";
import Slideshow from "../components/Home/Slideshow";
import GameLogos from "../components/Home/GameLogos";
import GameSlideshow from "../components/Home/GameSlideshow";
import Welcome from "../components/Home/Welcome";
import GameProviders from "../components/Home/GameProviders";
import Discover from "../components/Home/Discover";
import Promotions from "../components/Home/Promotions";
import About from "../components/Home/About";
import Footer from "../components/Layout/Footer";
import LoginModal from "../components/Modal/LoginModal";

import IconLive from "/src/assets/svg/live.svg";
import IconHot from "/src/assets/svg/hot.svg";
import LinkCards from "../components/Home/LinkCards";
import JackpotCards from "../components/Home/JackpotCards";
import BestCasinos from "../components/Home/BestCasinos";
import TopLiveCasinos from "../components/Home/TopLiveCasinos";
import SuperPromotionsWidget from "../components/Home/SuperPromotions";
import CasinoBanner from "../components/Home/CasinoBanner";
import SportPrematchWidget from "../components/Home/SportPrematch";

let pageCurrent = 0;

const Home = () => {
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [topLiveCasino, setTopLiveCasino] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [pageData, setPageData] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isSlotsOnly } = useOutletContext();

  useEffect(() => {
    getPage("home");
    getStatus();

    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getStatus = () => {
    callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
  };

  const callbackGetStatus = (result) => {
    if (result.status === 500 || result.status === 422) {
      console.log(result);      
    } else {
      setTopGames(result.top_hot);
      setTopLiveCasino(result.top_livecasino);
      contextData.slots_only = result && result.slots_only;
    }
  };

  const getPage = (page) => {
    setCategories([]);
    setGames([]);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      console.log(result);      
    } else {
      setCategories(result.data.categories);
      setPageData(result.data);

      if (result.data.menu === "home") {
        setMainCategories(result.data.categories);
      }

      if (pageData.url && pageData.url !== null) {
        if (contextData.isMobile) {
          // Mobile sports workaround
        }
      } else {
        if (result.data.page_group_type === "categories") {
          setSelectedCategoryIndex(-1);
        }
        if (result.data.page_group_type === "games") {
          loadMoreContent();
        }
      }
      pageCurrent = 0;
    }
  };

  const loadMoreContent = () => {
    let item = categories[selectedCategoryIndex];
    if (item) {
      fetchContent(item, item.id, item.table_name, selectedCategoryIndex, false);
    }
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    let pageSize = 30;

    if (resetCurrentPage === true) {
      pageCurrent = 0;
      setGames([]);
    }

    setSelectedCategoryIndex(categoryIndex);

    const groupCode = pageGroupCode || pageData.page_group_code;

    callApi(
      contextData,
      "GET",
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize,
      callbackFetchContent,
      null
    );
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      console.log(result);
      
    } else {
      if (pageCurrent === 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      pageCurrent += 1;
    }
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      let imageDataSrc = element.image_url;
      if (element.image_local !== null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const launchGame = (game, lobbyType = "casino") => {
    openGamePlayer(navigate, game, lobbyType, contextData.cdnUrl);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
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

      <Slideshow />
          <LinkCards />
          <Promotions />
          {/* <JackpotCards /> */}
          <SuperPromotionsWidget />
          <BestCasinos />
          <TopLiveCasinos />
          <CasinoBanner />
          <SportPrematchWidget />
          <Footer />
          {/* <div className="landingPage">
            <div className="root-container" id="pageContainer">
              <div className="root-wrapper">
                <div className="page">
                  {topLiveCasino.length > 0 && <GameSlideshow games={topLiveCasino} name="liveCasino" title="Juegos en vivo principales" icon={IconLive} link="/live-casino" onGameClick={(game) => {
                    if (isLogin) {
                      launchGame(game, "live-casino");
                    } else {
                      setShowLoginModal(true);
                    }
                  }} />}
                  {topGames.length > 0 && <GameSlideshow games={topGames} name="casino" title="Juegos más populares" icon={IconHot} link="/casino" onGameClick={(game) => {
                    if (isLogin) {
                      launchGame(game, "casino");
                    } else {
                      setShowLoginModal(true);
                    }
                  }} />}
                  {
                    !isLogin && <>
                      <Welcome />
                      {mainCategories.length > 0 && <GameProviders categories={mainCategories} />}
                      <Discover />
                    </>
                  }
                  <About />
                </div>
              </div>
              <Footer isSlotsOnly={isSlotsOnly} />
            </div>
          </div> */}
    </>
  );
};

export default Home;

import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import Slideshow from "../components/LiveCasino/Slideshow";
import GameModal from "../components/Modal/GameModal";
import About from "../components/Home/About";
import Footer from "../components/Layout/Footer";
import LoadGames from "../components/Loading/LoadGames";
import SearchInput from "../components/SearchInput";
import LoginModal from "../components/Modal/LoginModal";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const LiveCasino = () => {
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const originalCategoriesRef = useRef([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [txtSearch, setTxtSearch] = useState("");
  const [searchDelayTimer, setSearchDelayTimer] = useState();
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isGameLoadingError, setIsGameLoadingError] = useState(false);
  const [mobileShowMore, setMobileShowMore] = useState(false);
  const [isSingleCategoryView, setIsSingleCategoryView] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const searchRef = useRef(null);
  const { isSlotsOnly, isMobile } = useOutletContext();
  const hasFetchedContentRef = useRef(false);
  const prevHashRef = useRef("");
  const pendingCategoryFetchesRef = useRef(0);
  const lastLoadedCategoryRef = useRef(null);
  const [hasMoreGames, setHasMoreGames] = useState(true);

  // Categorías fijas según el target (Live Casino)
  const liveCasinoTags = [
    { name: "All", code: "All" },
    { name: "Most Popular", code: "MostPopular" },
    { name: "Baccarat", code: "Baccarat" },
    { name: "Roulette", code: "Roulette" },
    { name: "BlackJack", code: "BlackJack" },
    { name: "Poker", code: "Poker" },
    { name: "Trending Games", code: "TrendingGames" },
    { name: "Other", code: "Other" },
    { name: "Most Liked", code: "MostLiked" },
  ];

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setActiveCategory({});
    setIsSingleCategoryView(false);
    hasFetchedContentRef.current = false;
    lastLoadedCategoryRef.current = null;
    getPage("livecasino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getPage = (page) => {
    setIsLoadingGames(true);
    setCategories([]);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      const homeCategory = {
        name: "Lobby",
        code: "home",
        id: 0,
        table_name: "apigames_categories"
      };
      const updatedCategories = [homeCategory, ...(result.data.categories || [])];
      setCategories(updatedCategories);
      if (!originalCategoriesRef.current || originalCategoriesRef.current.length === 0) {
        originalCategoriesRef.current = updatedCategories;
      }
      setSelectedProvider(null);
      setPageData(result.data);
      const firstFiveCategories = updatedCategories.slice(1, 6);
      if (firstFiveCategories.length > 0) {
        setFirstFiveCategoriesGames([]);
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, result.data.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      setActiveCategory(homeCategory);
      setSelectedCategoryIndex(0);
    }
  };

  const fetchContentForCategory = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    if (!categoryId || !tableName) {
      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
      return;
    }
    const pageSize = 8;
    const groupCode = pageGroupCode || pageData.page_group_code;
    const apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=0&length=" +
      pageSize +
      (selectedProvider && selectedProvider.id ? "&provider=" + selectedProvider.id : "");

    callApi(contextData, "GET", apiUrl, (result) => callbackFetchContentForCategory(result, category, categoryIndex), null);
  };

  const callbackFetchContentForCategory = (result, category, categoryIndex) => {
    if (result.status === 500 || result.status === 422) {
      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc: game.image_local != null ? contextData.cdnUrl + game.image_local : game.image_url,
      }));

      setGames((prev) => {
        return [...prev, ...gamesWithImages];
      });

      setFirstFiveCategoriesGames((prev) => {
        return [...prev, ...gamesWithImages];
      });

      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    }
  };

  useEffect(() => {
    if (categories.length === 0) return;
    const hash = location.hash;
    if (hash && hash.startsWith('#')) {
      if (prevHashRef.current !== hash) {
        const categoryCode = hash.substring(1);
        if (categoryCode === "home") {
          setSelectedProvider(null);
          setActiveCategory(categories[0]);
          setSelectedCategoryIndex(0);
          setIsSingleCategoryView(false);
          setGames([]);
          setFirstFiveCategoriesGames([]);
          const firstFiveCategories = categories.slice(1, 6);
          if (firstFiveCategories.length > 0) {
            pendingCategoryFetchesRef.current = firstFiveCategories.length;
            setIsLoadingGames(true);
            firstFiveCategories.forEach((item, index) => {
              fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
            });
          } else {
            setIsLoadingGames(false);
          }
          prevHashRef.current = hash;
          hasFetchedContentRef.current = true;
          lastLoadedCategoryRef.current = null;
          return;
        }
        const category = categories.find(cat => cat.code === categoryCode);
        if (category) {
          const categoryIndex = categories.indexOf(category);
          setSelectedProvider(null);
          setActiveCategory(category);
          setSelectedCategoryIndex(categoryIndex);
          setIsSingleCategoryView(true);
          fetchContent(category, category.id, category.table_name, categoryIndex, true);
          prevHashRef.current = hash;
          hasFetchedContentRef.current = true;
          lastLoadedCategoryRef.current = category.code;
          return;
        }
      }
    }

    if (!hasFetchedContentRef.current) {
      const urlParams = new URLSearchParams(location.search);
      const providerName = urlParams.get('provider');
      const providerId = urlParams.get('providerId');

      if (providerName && providerId) {
        const provider = categories.find(cat => cat.id.toString() === providerId.toString());
        if (provider) {
          const providerIndex = categories.indexOf(provider);
          setSelectedProvider(provider);
          setActiveCategory(provider);
          setSelectedCategoryIndex(providerIndex);
          setIsSingleCategoryView(true);
          fetchContent(provider, provider.id, provider.table_name, providerIndex, true);
          prevHashRef.current = hash;
          hasFetchedContentRef.current = true;
          lastLoadedCategoryRef.current = provider.code;
          return;
        }
      }

      setActiveCategory(categories[0] || {});
      setSelectedCategoryIndex(0);
      setIsSingleCategoryView(false);
      hasFetchedContentRef.current = true;
      lastLoadedCategoryRef.current = null;
    }
  }, [categories, location.search, location.hash]);

  const loadMoreContent = (category, categoryIndex) => {
    if (!category) return;
    const isSameCategory = lastLoadedCategoryRef.current === category.code;
    const resetCurrentPage = !isSameCategory;
    if (category.code === "home") {
      setIsSingleCategoryView(true);
      setSelectedCategoryIndex(0);
      setActiveCategory(category);
      if (resetCurrentPage) {
        setGames([]);
      }
      fetchContent(category, category.id, category.table_name, categoryIndex, resetCurrentPage);
      if (isMobile) {
        setMobileShowMore(true);
      }
      navigate("/live-casino#home");
      lastLoadedCategoryRef.current = category.code;
      return;
    }
    if (isMobile) {
      setMobileShowMore(true);
    }
    setIsSingleCategoryView(true);
    setSelectedCategoryIndex(categoryIndex);
    setActiveCategory(category);
    fetchContent(category, category.id, category.table_name, categoryIndex, resetCurrentPage);
    lastLoadedCategoryRef.current = category.code;
  };

  const loadMoreGames = () => {
    if (!activeCategory) return;
    fetchContent(activeCategory, activeCategory.id, activeCategory.table_name, selectedCategoryIndex, false);
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage) => {
    if (!categoryId || !tableName) {
      if (category.code === "home") {
        const pageSize = 30;
        setIsLoadingGames(true);
        if (resetCurrentPage) {
          pageCurrent = 0;
          setGames([]);
        }
        const apiUrl =
          "/get-content?page_group_type=categories&page_group_code=" +
          pageData.page_group_code +
          "&page=" +
          pageCurrent +
          "&length=" +
          pageSize;
        callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
        return;
      }
      setIsLoadingGames(false);
      return;
    }
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      pageData.page_group_code +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize;

    if (selectedProvider && selectedProvider.id) {
      apiUrl += "&provider=" + selectedProvider.id;
    }

    callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setHasMoreGames(false);
      setIsLoadingGames(false);
    } else {
      if (pageCurrent == 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      setHasMoreGames(result.content.length === 30);
      pageCurrent += 1;
      setIsLoadingGames(false);
    }
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

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status == "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
      }
    } else {
      setIsGameLoadingError(true);
    }
  };

  const closeGameModal = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const handleCategorySelect = (category, index) => {
    setSelectedProvider(null);
    setTxtSearch("");
    setSelectedCategoryIndex(index);
    if (category.code === "home") {
      setIsSingleCategoryView(false);
      setActiveCategory(category);
      setGames([]);
      setFirstFiveCategoriesGames([]);
      const firstFiveCategories = categories.slice(1, 6);
      if (firstFiveCategories.length > 0) {
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        firstFiveCategories.forEach((item, idx) => {
          fetchContentForCategory(item, item.id, item.table_name, idx, true, pageData.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      navigate("/live-casino#home");
      lastLoadedCategoryRef.current = null;
    } else {
      setIsSingleCategoryView(true);
      setActiveCategory(category);
      fetchContent(category, category.id, category.table_name, index, true);
      lastLoadedCategoryRef.current = category.code;
    }
  };

  const handleProviderSelect = (provider, index = 0) => {
    if (!provider || selectedProvider?.id == provider.id) {
      setSelectedProvider(null);
      setGames(firstFiveCategoriesGames);
    } else {
      setIsProviderDropdownOpen(false);
      setTxtSearch("");
      if (categories.length > 0 && provider) {
        if (provider.code === "home") {
          setSelectedProvider(null);
          setIsSingleCategoryView(false);
          setActiveCategory(provider);
          setSelectedCategoryIndex(0);
          setGames([]);
          setFirstFiveCategoriesGames([]);
          const firstFiveCategories = categories.slice(1, 6);
          if (firstFiveCategories.length > 0) {
            pendingCategoryFetchesRef.current = firstFiveCategories.length;
            setIsLoadingGames(true);
            firstFiveCategories.forEach((item, idx) => {
              fetchContentForCategory(item, item.id, item.table_name, idx, true, pageData.page_group_code);
            });
          } else {
            setIsLoadingGames(false);
          }
          navigate("/live-casino#home");
          lastLoadedCategoryRef.current = null;
        } else {
          setSelectedProvider(provider);
          setIsSingleCategoryView(true);
          const providerIndex = categories.findIndex(cat => cat.id === provider.id);
          setActiveCategory(provider);
          setSelectedCategoryIndex(providerIndex !== -1 ? providerIndex : index);
          fetchContent(provider, provider.id, provider.table_name, providerIndex !== -1 ? providerIndex : index, true);
          lastLoadedCategoryRef.current = provider.code;
          if (isMobile) {
            setMobileShowMore(true);
          }
        }
      } else if (!provider && categories.length > 0) {
        const firstCategory = categories[0];
        setSelectedProvider(null);
        setIsSingleCategoryView(false);
        setActiveCategory(firstCategory);
        setSelectedCategoryIndex(0);
        setGames([]);
        setFirstFiveCategoriesGames([]);
        const firstFiveCategories = categories.slice(1, 6);
        if (firstFiveCategories.length > 0) {
          pendingCategoryFetchesRef.current = firstFiveCategories.length;
          setIsLoadingGames(true);
          firstFiveCategories.forEach((item, idx) => {
            fetchContentForCategory(item, item.id, item.table_name, idx, true, pageData.page_group_code);
          });
        } else {
          setIsLoadingGames(false);
        }
        navigate("/live-casino#home");
        lastLoadedCategoryRef.current = null;
      }
    }
  };

  const search = (e) => {
    let keyword = e.target.value;
    setTxtSearch(keyword);
    setIsSingleCategoryView(true);
    lastLoadedCategoryRef.current = null;

    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
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
    clearTimeout(searchDelayTimer);
    if (keyword === "") return;

    setGames([]);
    setIsLoadingGames(true);

    let pageSize = 20;
    let searchDelayTimerTmp = setTimeout(function () {
      callApi(
        contextData,
        "GET",
        "/search-content?keyword=" + txtSearch + "&page_group_code=" + pageData.page_group_code + "&length=" + pageSize,
        callbackSearch,
        null
      );
    }, 1000);

    setSearchDelayTimer(searchDelayTimerTmp);
  };

  const callbackSearch = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      configureImageSrc(result);
      setGames(result.content);
      pageCurrent = 0;
      lastLoadedCategoryRef.current = null;
      setIsLoadingGames(false);
    }
  };

  const clearSearch = () => {
    setTxtSearch("");
    setSelectedProvider(null);
    setIsSingleCategoryView(false);
    navigate("/live-casino#home");
    lastLoadedCategoryRef.current = null;
    if (categories.length > 0) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory);
      setSelectedCategoryIndex(0);
      setIsLoadingGames(true);
      const firstFiveCategories = categories.slice(1, 6);
      if (firstFiveCategories.length > 0) {
        setFirstFiveCategoriesGames([]);
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        firstFiveCategories.forEach((item, idx) => {
          fetchContentForCategory(item, item.id, item.table_name, idx, true, pageData.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      if (isMobile) {
        setMobileShowMore(false);
      }
    } else {
      getPage("livecasino");
    }
  };

  // Renderizado de tarjeta de juego estilo target
  const renderGameCard = (game, providerName) => {
    // Extraer rango de apuesta si existe (simulado, ya que la API podría no tenerlo)
    const minBet = game.min_bet || "200";
    const maxBet = game.max_bet || "1.8M";
    const currency = game.currency || "ARS";

    return (
      <div className="games--grid-item tb--rel grid--item-only-img" key={game.id}>
        <div className="tb--rel tb--games-grid-front">
          <div className="games--grid-img">
            <div className="games--grid-img-box">
              <img loading="lazy" src={game.imageDataSrc || game.image_url} alt={game.name} />
            </div>
          </div>
        </div>
        <div className="games--grid-hover tb--flex tb--justify-between tb--flex-col">
          <div className="games--grid-header">
            <div className="games--grid-header_top">
              <div className="tb--game-name tb--mobile-hide tb--ellipsis"></div>
              <i className="digi_icon-favorite tb--cp tb--mobile-hide"></i>
            </div>
            <div className="games--grid-name tb--ellipsis tb--web-hide">
              <span className="tb--ellipsis">{game.name}</span>
            </div>
          </div>
          <div>
            <div className="games--grid-hover-btn">
              <div className="games--grid-btn btn btn-primary btn-wb-size-s" onClick={() => (isLogin ? launchGame(game, "slot", "tab") : handleLoginClick())}>
                Juega ahora
              </div>
            </div>
          </div>
          <div className="games--grid-footer tb--flex tb--justify-between tb--mobile-hide">
            <div className="games--grid-amount tb--mobile-hide tb--nowrap tb--text_upercase tb--ellipsis">
              <span>{minBet} - </span>
              <span>{maxBet} </span>
              <span>{currency} </span>
            </div>
            <div className="games--grid-like tb--flex tb--align-center">
              <i className="digi_icon-unlike tb--cp"></i>
              <span>{game.likes || 0}</span>
            </div>
          </div>
          <div className="games--grid-footer_mobile tb--flex tb--justify-between tb--web-hide">
            <div className="games--grid-like tb--flex tb--align-center">
              <i className="digi_icon-unlike tb--cp"></i>
              <span>{game.likes || 0}</span>
            </div>
            <div className="games--grid-favorite">
              <i className="digi_icon-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    );
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
      {shouldShowGameModal && selectedGameId !== null ? (
        <GameModal
          gameUrl={gameUrl}
          gameName={selectedGameName}
          gameImg={selectedGameImg}
          reload={launchGame}
          launchInNewTab={() => launchGame(null, null, "tab")}
          ref={refGameModal}
          onClose={closeGameModal}
          isMobile={isMobile}
        />
      ) : (
        <>
          <div className={`root-container ${isMobile ? 'mobile' : ''}`} id="pageContainer">
            <div className="root-wrapper">
              <div className="page">
                {/* ===== MAIN BLOCK ===== */}
                <main className="main-block main-h_100 fade-appear-done fade-enter-done" style={{ minHeight: '477px' }}>
                  <div className="l5--sidebar tb--flex tb--flex-col">
                    <div className="l5--main">
                      {/* Banner superior */}
                      <div className="main--slider-top main--slider-right casino-slider-container livecasino-slider-container fade-appear-done fade-enter-done">
                        <div className="slider_casino tb--rel top-banner-section">
                          <Slideshow />
                        </div>
                      </div>

                      {/* Top Space (stories, jackpot, games) */}
                      <div className="livecasino--top-space">
                        <div className="">
                          <div className="stories-wrapper stories-wrapper--standard" style={{ margin: 0 }}>
                            <div className="page_stories page_stories--large"></div>
                            <div></div>
                          </div>
                        </div>
                        <div className="casino--container casino--container-mobile casino-jackpot-section">
                          <div className="hover-bottom top--jackpots-container">
                            <div className="top--jackpots-row"></div>
                          </div>
                        </div>
                        <div className="tb--mt-16"></div>

                        {/* Games Wrapper */}
                        <div className="games-wrapper">
                          <div className="tb--lobby-content tb--categories_extend-view tb--h_fc">
                            {/* Filter / Navbar */}
                            <div className="tb--live-casino_navbar_wrapper casino--container tb--w_100 livecasino-filter">
                              <div className="tb--filter-desktop">
                                <div className="tb--live-casino_navbar tb--flex live-casino_group">
                                  <ul className="tb--navbar_left tb--flex tb--align-center" style={{ height: '36px', overflow: 'hidden' }}>
                                    {liveCasinoTags.map((tag, index) => {
                                      // Mapear los códigos de las categorías del target con las de la API
                                      let isActive = false;
                                      if (txtSearch !== "" || selectedProvider) {
                                        isActive = false;
                                      } else if (isSingleCategoryView && activeCategory) {
                                        // Intentar coincidir con el nombre o código
                                        const categoryName = activeCategory.name || '';
                                        const categoryCode = activeCategory.code || '';
                                        isActive = categoryName === tag.name || categoryCode === tag.code;
                                      } else {
                                        isActive = selectedCategoryIndex === index && index === 0;
                                      }

                                      return (
                                        <li
                                          key={tag.code}
                                          className={`${isActive ? 'active' : ''} tb--badge tb--badge-top tb--none groups-both`}
                                        >
                                          <a
                                            className="tb--badge__link"
                                            href={`#${tag.code}`}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              // Buscar categoría que coincida con el código o nombre
                                              const matchedCategory = categories.find(
                                                cat => cat.code === tag.code || cat.name === tag.name
                                              );
                                              if (matchedCategory) {
                                                const idx = categories.indexOf(matchedCategory);
                                                handleCategorySelect(matchedCategory, idx);
                                              } else {
                                                // Si no se encuentra, intentar con "home" o el primero
                                                if (categories.length > 0) {
                                                  handleCategorySelect(categories[0], 0);
                                                }
                                              }
                                            }}
                                          >
                                            <span>{tag.name}</span>
                                          </a>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                  <div className="tb--navbar_right tb--flex">
                                    <div className="tb--live-casino_search tb--lobby-search">
                                      <input
                                        id="search"
                                        ref={searchRef}
                                        placeholder="Buscar"
                                        className="search-box "
                                        value={txtSearch}
                                        onChange={search}
                                      // onKeyUp={search}
                                      ></input>
                                      <i className="digi_icon-search"></i>
                                      {/* <SearchInput
                                        txtSearch={txtSearch}
                                        setTxtSearch={setTxtSearch}
                                        searchRef={searchRef}
                                        search={search}
                                        clearSearch={clearSearch}
                                        isMobile={isMobile}
                                      /> */}
                                    </div>
                                    <div className="tb--sorting-wrapper tb--flex tb--justify-between tb--gap-12"></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Provider List */}
                            <div className="casino--container tb--categories_list tb--w_100">
                              <div className="tb--providers-block tb--providers_list-only-text">
                                <div className="tb--categories_list-title tb--text_upercase">
                                  <div className="tb--live-casino_search tb--providers-search tb--lobby-search">
                                    <input required className="search-box" type="text" placeholder="Buscar proveedores" value="" />
                                    <i className="digi_icon-search"></i>
                                  </div>
                                </div>
                                <ul className="tb--providers_list tb--flex tb--text_upercase">
                                  <li className={`active tb--category-all ${!selectedProvider ? 'active' : ''}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleProviderSelect(null);
                                    }}
                                  >
                                    <span className="tb--categories-item_text">TODAS</span>
                                    <span className="tb--categories-item_count">({categories.length > 0 ? categories.reduce((acc, cat) => acc + (cat.element_count || 0), 0) : 0})</span>
                                    <div className="tb--chb-ico tb--cp tb--tac">
                                      <i className={`digi_icon-${!selectedProvider ? 'checkbox_selected' : 'checkbox'}`}></i>
                                    </div>
                                  </li>
                                  {categories.slice(1).map((provider) => (
                                    <li key={provider.id} className={`tb--badge tb--badge-top tb--none ${selectedProvider?.id === provider.id ? 'active' : ''}`}>
                                      <a
                                        className="tb--flex"
                                        href={`#provider-${provider.id}`}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleProviderSelect(provider);
                                        }}
                                      >
                                        <span className="tb--categories-item_text">{provider.name}</span>
                                        <span className="tb--categories-item_count">({provider.element_count || 0})</span>
                                        <div className="tb--chb-ico tb--cp tb--tac">
                                          <i className={`digi_icon-${selectedProvider?.id === provider.id ? 'checkbox_selected' : 'checkbox'}`}></i>
                                        </div>
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Game Grid */}
                            <div className="casino--container casino--container--wrapper">
                              <div className="tb--w_100 tb--flex">
                                <div className="games--grid-layout tb--w_100 games--grid-layout_standard">
                                  {games.map((game) => renderGameCard(game, activeCategory?.name || 'Casino en Vivo'))}
                                  {isLoadingGames && <LoadGames />}
                                </div>
                              </div>

                              {/* Botón "Más" global */}
                              {hasMoreGames && (
                                <div className="text-center">
                                  <button className="btn btn-secondary btn-wb-size-l btn-mb-size-l tb--more-btn" onClick={() => {
                                    // Cargar más categorías o similar
                                    if (categories.length > 0) {
                                      loadMoreContent(categories[0], 0);
                                    }
                                  }}>
                                    Más
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
            <Footer isSlotsOnly={isSlotsOnly} />
          </div>
        </>
      )}
      {isGameLoadingError && (
        <div className="container">
          <div className="row">
            <div className="col-md-6 error-loading-game">
              <div className="alert alert-warning">Error al cargar el juego. Inténtalo de nuevo o ponte en contacto con el equipo de soporte.</div>
              <a className="btn btn-primary" onClick={() => window.location.reload()}>
                Volver a la página principal
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveCasino;

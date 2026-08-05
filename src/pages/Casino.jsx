import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import Slideshow from "../components/Casino/Slideshow";
import GameModal from "../components/Modal/GameModal";
import About from "../components/Home/About";
import Footer from "../components/Layout/Footer";
import LoadGames from "../components/Loading/LoadGames";
import SearchInput from "../components/SearchInput";
import LoginModal from "../components/Modal/LoginModal";
import "animate.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const Casino = () => {
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [tags, setTags] = useState([]);
  const [games, setGames] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
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
  const [isExplicitSingleCategoryView, setIsExplicitSingleCategoryView] = useState(false);
  const [hasMoreGames, setHasMoreGames] = useState(true);
  const refGameModal = useRef();
  const location = useLocation();
  const searchRef = useRef(null);
  const { isSlotsOnly, isMobile } = useOutletContext();

  const pendingCategoryFetchesRef = useRef(0);

  // Winners dummy data – se puede reemplazar con API real
  const topWinners = [
    { user: "32****550", amount: 400, currency: "ARS", game: "Joker's Jewels™", img: "https://a8krw6.d7vnb8.xyz/plat/prd/Img/Games/Pragmatic/14852_JokersJewels.jpg", date: "2/8/2026, 21:54:36" },
    { user: "32****550", amount: 239, currency: "ARS", game: "Gates of Olympus", img: "https://a8krw6.d7vnb8.xyz/plat/prd/Img/partners/10290/Games/Gates-of-Olympus-PragmaticPlay/GatesofOlympus_20250310131312986.webp", date: "2/8/2026, 22:04:08" },
    { user: "32****550", amount: 160, currency: "ARS", game: "Joker's Jewels™", img: "https://a8krw6.d7vnb8.xyz/plat/prd/Img/Games/Pragmatic/14852_JokersJewels.jpg", date: "2/8/2026, 22:21:26" },
    { user: "32****550", amount: 160, currency: "ARS", game: "Joker's Jewels™", img: "https://a8krw6.d7vnb8.xyz/plat/prd/Img/Games/Pragmatic/14852_JokersJewels.jpg", date: "2/8/2026, 22:18:59" },
    { user: "32****550", amount: 83, currency: "ARS", game: "Sweet Bonanza™", img: "https://a8krw6.d7vnb8.xyz/plat/prd/Img/partners/10290/Games/Sweet-Bonanza-PragmaticPlay/SweetBonanza_20250312173428199.webp", date: "2/8/2026, 22:14:44" },
  ];

  // Slider settings para ganadores (vertical)
  const winnersSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Slider settings para "Más votados"
  const mostLikedSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    if (!location.hash || tags.length === 0) return;
    const hashCode = location.hash.replace('#', '');
    const tagIndex = tags.findIndex(t => t.code === hashCode);
    if (tagIndex !== -1 && selectedCategoryIndex !== tagIndex) {
      setSelectedCategoryIndex(tagIndex);
      setIsSingleCategoryView(false);
      setIsExplicitSingleCategoryView(false);
      getPage(hashCode);
    }
  }, [location.hash, tags]);

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
    setIsExplicitSingleCategoryView(false);
    getPage("casino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Categorías del target
    const newTags = [
      { name: "All", code: "All" },
      { name: "Más popular", code: "MostPopular", badge: "Premium", badgeColor: "#775bbc" },
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
    setTags(newTags);
  }, []);

  const getPage = (page) => {
    setIsLoadingGames(true);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    setIsSingleCategoryView(false);
    setIsExplicitSingleCategoryView(false);
    callApi(contextData, "GET", "/get-page?page=" + page, (result) => callbackGetPage(result, page), null);
  };

  const callbackGetPage = (result, page) => {
    if (result.status === 500 || result.status === 422) {
      // manejar error
    } else {
      setSelectedProvider(null);
      setPageData(result.data);

      const hashCode = location.hash.replace('#', '');
      const tagIndex = tags.findIndex(t => t.code === hashCode);
      setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);

      if (result.data && result.data.page_group_type === "categories" && result.data.categories && result.data.categories.length > 0) {
        setCategories(result.data.categories);
        if (page === "casino") {
          setMainCategories(result.data.categories);
        }
        const firstCategory = result.data.categories[0];
        setActiveCategory(firstCategory);

        const firstFiveCategories = result.data.categories.slice(0, 5);
        if (firstFiveCategories.length > 0) {
          setFirstFiveCategoriesGames([]);
          pendingCategoryFetchesRef.current = firstFiveCategories.length;
          setIsLoadingGames(true);
          firstFiveCategories.forEach((item, index) => {
            fetchContentForCategory(item, item.id, item.table_name, index, true, result.data.page_group_code);
          });
        }
      } else if (result.data && result.data.page_group_type === "games") {
        setIsSingleCategoryView(true);
        setIsExplicitSingleCategoryView(false);
        setCategories(mainCategories.length > 0 ? mainCategories : []);
        configureImageSrc(result);
        setGames(result.data.categories || []);
        setActiveCategory(tags[tagIndex] || { name: page });
        setHasMoreGames(result.data.categories && result.data.categories.length === 30);
        pageCurrent = 1;
      }

      setIsLoadingGames(false);
    }
  };

  const fetchContentForCategory = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
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
      // manejar error
    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc: game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url,
      }));

      const categoryGames = {
        category: category,
        games: gamesWithImages,
      };

      setFirstFiveCategoriesGames((prev) => {
        const updated = [...prev];
        updated[categoryIndex] = categoryGames;
        return updated;
      });
    }

    pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
    if (pendingCategoryFetchesRef.current === 0) {
      setIsLoadingGames(false);
    }
  };

  const loadMoreContent = (category, categoryIndex) => {
    if (!category) return;
    if (isMobile) setMobileShowMore(true);
    setIsSingleCategoryView(true);
    setIsExplicitSingleCategoryView(true);
    setSelectedCategoryIndex(categoryIndex);
    setActiveCategory(category);
    fetchContent(category, category.id, category.table_name, categoryIndex, true);
    window.scrollTo(0, 0);
  };

  const loadMoreGames = () => {
    if (!activeCategory) return;
    fetchContent(activeCategory, activeCategory.id, activeCategory.table_name, selectedCategoryIndex, false);
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode) => {
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    const groupCode = pageGroupCode || pageData.page_group_code;

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
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
    }
    setIsLoadingGames(false);
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      element.imageDataSrc = element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
    });
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : game.image_url;
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

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProvider(null);
    setTxtSearch("");
  };

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setIsProviderDropdownOpen(false);
    setTxtSearch("");
    setIsExplicitSingleCategoryView(true);
    if (categories.length > 0 && provider) {
      setActiveCategory(provider);
      fetchContent(provider, provider.id, provider.table_name, index, true);
      if (isMobile) setMobileShowMore(true);
    } else if (!provider && categories.length > 0) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory);
      fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true);
    }
  };

  const search = (e) => {
    let keyword = e.target.value;
    setTxtSearch(keyword);
    setIsExplicitSingleCategoryView(true);

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
    if (keyword == "") return;

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
      // manejar error
    } else {
      configureImageSrc(result);
      setGames(result.content);
      pageCurrent = 0;
    }
    setIsLoadingGames(false);
  };

  const clearSearch = () => {
    setTxtSearch("");
    setSelectedProvider(null);
    setIsSingleCategoryView(false);
    setIsExplicitSingleCategoryView(false);
    navigate("/casino");
    if (categories.length > 0) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory);
      setSelectedCategoryIndex(0);
      fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true, "default_pages_home");
      if (isMobile) setMobileShowMore(false);
    }
  };

  // Renderizado de tarjeta de juego con las clases del target
  const renderGameCard = (game, providerName) => (
    <div className="games--grid-item tb--rel" key={game.id}>
      <div className="tb--rel tb--games-grid-front">
        <div className="games--grid-img">
          <div className="games--grid-img-box">
            <img loading="lazy" src={game.imageDataSrc} alt={game.name} />
          </div>
        </div>
        <div className="games--grid-footer tb--flex tb--justify-between">
          <div className="games--grid-name tb--ellipsis tb--mobile-hide">{game.name}</div>
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
            <div className="games--grid-btn btn btn-secondary btn-wb-size-s tb--mt-12">Demo</div>
          </div>
        </div>
        <div className="games--grid-footer tb--flex tb--justify-between tb--mobile-hide">
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
                        <div className="container slider_casino tb--rel top-banner-section">
                          <Slideshow />
                        </div>
                      </div>

                      {/* Top Winners Slider */}
                      <div className="top--winners-slider top--winners-slider--absolute">
                        <div className="top--winners-section tb--flex tb--align-center top--widget-name_scroll">
                          <div className="top--winners-page tb--cp">
                            <div className="top--widget-name top--widget-name_active tb--text_upercase" data-for="dailyTopWinners">
                              <span className="top--widget-name_text tb--ellipsis">Principales ganadores del día</span>
                            </div>
                          </div>
                          <div className="top--winners-page tb--cp">
                            <div className="top--widget-name tb--text_upercase" data-for="monthlyTopWinners">
                              <span className="top--widget-name_text tb--ellipsis">Principales ganadores del mes</span>
                            </div>
                          </div>
                        </div>
                        <Slider {...winnersSettings}>
                          {topWinners.map((winner, idx) => (
                            <div key={idx}>
                              <div className="top--winners-game_wrapper">
                                <h4 className="top--winners-game_title">Top de Ganadores</h4>
                                <div className="top--winners-game_container">
                                  <div className="top--winners-game tb--flex tb--align-center">
                                    <div className="tb--cp top--winners-img">
                                      <p className="top--winners-img_link">
                                        <img loading="lazy" src={winner.img} alt={winner.game} />
                                      </p>
                                    </div>
                                    <div className="top--winners-desc">
                                      <div className="top--winners-date tb--ellipsis">{winner.user}</div>
                                      <div className="top--winners-value tb--flex tb--ellipsis">
                                        <div className="top--winners-amount tb--ellipsis" title={winner.amount}>{winner.amount}</div>
                                        <div className="top--winners-crns">{winner.currency}</div>
                                      </div>
                                      <div className="top--winners-bet tb--ellipsis">{winner.date}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Slider>
                      </div>

                      {/* Espacio para contenido adicional (jackpot, stories) - lo omitimos o lo dejamos como está */}
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

                        {/* Most Liked Slider */}
                        <div className="most--liked-slider casino--container">
                          <span className="tb--most-liked_header tb--text_upercase">Más votados</span>
                          <Slider {...mostLikedSettings}>
                            {firstFiveCategoriesGames.length > 0 && firstFiveCategoriesGames[0]?.games?.slice(0, 8).map((game) => (
                              <div key={game.id}>
                                {renderGameCard(game, activeCategory?.name || 'Casino')}
                              </div>
                            ))}
                          </Slider>
                        </div>

                        {/* Games Wrapper */}
                        <div className="games-wrapper">
                          <div className="tb--lobby-content tb--categories_extend-view tb--h_fc">
                            {/* Filter / Navbar */}
                            <div className="tb--live-casino_navbar_wrapper casino--container tb--w_100 casino-filter">
                              <div className="tb--filter-desktop">
                                <div className="tb--live-casino_navbar tb--flex live-casino_group">
                                  <ul className="tb--navbar_left tb--flex tb--align-center" style={{ height: '36px', overflow: 'hidden' }}>
                                    {tags.map((tag, index) => (
                                      <li
                                        key={tag.code}
                                        className={`${selectedCategoryIndex === index ? 'active' : ''} tb--badge tb--badge-top tb--none groups-both`}
                                      >
                                        <a
                                          className="tb--badge__link"
                                          href={`#${tag.code}`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            if (window.location.hash !== `#${tag.code}`) {
                                              window.location.hash = `#${tag.code}`;
                                            } else {
                                              setSelectedCategoryIndex(index);
                                              setIsSingleCategoryView(false);
                                              setIsExplicitSingleCategoryView(false);
                                              getPage(tag.code);
                                            }
                                          }}
                                        >
                                          <span>{tag.name}</span>
                                          {tag.badge && (
                                            <span className="tb--custom-badge" style={{ backgroundColor: tag.badgeColor, color: '#fff' }}>
                                              {tag.badge}
                                            </span>
                                          )}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="tb--navbar_right tb--flex">
                                    <div className="tb--live-casino_search tb--lobby-search">
                                      <SearchInput
                                        txtSearch={txtSearch}
                                        setTxtSearch={setTxtSearch}
                                        searchRef={searchRef}
                                        search={search}
                                        clearSearch={clearSearch}
                                        isMobile={isMobile}
                                      />
                                    </div>
                                    <button type="button" className="tb--text_upercase tb--live-casino_filter tb--flex tb--align-center tb--justify-center tb--flex-wrap">
                                      <span className="filter-icon"></span>
                                      <span className="filter-icon filter-icon-middle"></span>
                                      <span className="filter-icon"></span>
                                    </button>
                                    <div className="tb--sorting-wrapper tb--flex tb--justify-between tb--gap-12">
                                      <button type="button" className="tb--filter-button_mobile tb--flex tb--justify-center">
                                        <span className="filter-icon"></span>
                                        <span className="filter-icon filter-icon-middle"></span>
                                        <span className="filter-icon"></span>
                                      </button>
                                    </div>
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
                                  <li className="active tb--category-all">
                                    <span className="tb--categories-item_text">TODAS</span>
                                    <span className="tb--categories-item_count">(7543)</span>
                                    <div className="tb--chb-ico tb--cp tb--tac">
                                      <i className="digi_icon-checkbox_selected"></i>
                                    </div>
                                  </li>
                                  {categories.map((provider) => (
                                    <li key={provider.id} className={`tb--badge tb--badge-top tb--none ${selectedProvider?.id === provider.id ? 'active' : ''}`}>
                                      <a
                                        className="tb--flex"
                                        href={`#provider-${provider.id}`}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleProviderSelect(provider);
                                        }}
                                      >
                                        {provider.badge && (
                                          <span className="tb--custom-badge" style={{ backgroundColor: provider.badgeColor || '#ff0000', color: '#fff' }}>
                                            {provider.badge}
                                          </span>
                                        )}
                                        <span className="tb--categories-item_text">{provider.name}</span>
                                        <span className="tb--categories-item_count">({provider.count || 0})</span>
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
                                  {(txtSearch !== "" || selectedProvider || isExplicitSingleCategoryView) ? (
                                    <>
                                      {games.map((game) => renderGameCard(game, activeCategory?.name || 'Casino'))}
                                      {isLoadingGames && <LoadGames />}
                                      {hasMoreGames && (
                                        <div className="text-center">
                                          <button className="btn btn-secondary btn-wb-size-l btn-mb-size-l tb--more-btn" onClick={loadMoreGames}>
                                            Más
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {isSingleCategoryView ? (
                                        <>
                                          {games.map((game) => renderGameCard(game, activeCategory?.name || 'Casino'))}
                                          {isLoadingGames && <LoadGames />}
                                          {hasMoreGames && (
                                            <div className="text-center">
                                              <button className="btn btn-secondary btn-wb-size-l btn-mb-size-l tb--more-btn" onClick={loadMoreGames}>
                                                Más
                                              </button>
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        firstFiveCategoriesGames.map((entry, catIndex) => {
                                          if (!entry || !entry.games) return null;
                                          return (
                                            <div className="category-block" key={entry.category?.id || catIndex}>
                                              <div className="row games-list popular">
                                                <h2>
                                                  {entry.category?.name || ''}
                                                  <a className="show-all" onClick={() => loadMoreContent(entry.category, catIndex)}>Mostrar todo</a>
                                                </h2>
                                              </div>
                                              <div className={`row games-list popular ${mobileShowMore ? '' : 'limited-games-list'}`}>
                                                {entry.games.slice(0, 5).map((game) => renderGameCard(game, entry.category?.name || 'Casino'))}
                                              </div>
                                            </div>
                                          );
                                        })
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              {/* Botón "Más" global (solo si no hay filtros activos y no estamos en vista de categoría única) */}
                              {!isSingleCategoryView && !txtSearch && !selectedProvider && !isExplicitSingleCategoryView && (
                                <div className="text-center">
                                  <button className="btn btn-secondary btn-wb-size-l btn-mb-size-l tb--more-btn" onClick={() => { /* Acción para cargar más categorías o similar */ }}>
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

export default Casino;
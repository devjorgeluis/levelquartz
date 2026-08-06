import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// If you have custom icons, you can import them as in your example:
// import IconNext from "/src/assets/svg/next.svg";

const SportPrematchWidget = () => {
  // Data extracted from the static HTML slides
  const matches = [
    {
      id: 1,
      league: 'Liga de la Conferencia de la UEFA. Clasificación',
      flagClass: 'f113',
      teams: ['Tobol Kostanay', 'FK Panevezys'],
      logos: [
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/babcfa8d-ac07-45bb-b28f-87aba7e9f575.png',
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/bd1027a2-3f0f-4631-ab9b-eb6e098098f8.png',
      ],
      date: '30.07',
      time: '7:00',
      odds: {
        home: 1.26,
        draw: 5.2,
        away: 9.5,
        over: { label: 'Más de (3)', value: 2 },
        under: { label: 'Menos de (3)', value: 1.74 },
      },
    },
    {
      id: 2,
      league: 'Amistosos. Top-Clubs',
      flagClass: 'f152',
      teams: ['Augsburg', 'Bournemouth'],
      logos: [
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/6f7640ad-229e-40e1-adfa-ef9501b39d35.png',
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/50e9e17f-c85d-4243-8775-07ff51286a19.png',
      ],
      date: '30.07',
      time: '7:00',
      odds: {
        home: 3.8,
        draw: 3.8,
        away: 1.7,
        over: { label: 'Más de (3)', value: 1.54 },
        under: { label: 'Menos de (3)', value: 2.32 },
      },
    },
    {
      id: 3,
      league: 'Liga de la Conferencia de la UEFA. Clasificación',
      flagClass: 'f113',
      teams: ['Auda', 'FCSB'],
      logos: [
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/01a20b67-4c29-4972-b65d-e317182b1b23.png',
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/f9cb0564-6acd-463b-a7e8-a01c9675138e.png',
      ],
      date: '30.07',
      time: '9:00',
      odds: {
        home: 4.6,
        draw: 4,
        away: 1.6,
        over: { label: 'Más de (2.5)', value: 1.66 },
        under: { label: 'Menos de (2.5)', value: 2.05 },
      },
    },
    {
      id: 4,
      league: 'Liga de la Conferencia de la UEFA. Clasificación',
      flagClass: 'f113',
      teams: ['FC Noah', 'Zimbru Chisinau'],
      logos: [
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/767e9d9c-94b6-432d-950b-01ebaa90d2b0.png',
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/969359dc-eaf8-4879-a286-2d51f044f688.png',
      ],
      date: '30.07',
      time: '9:00',
      odds: {
        home: 1.27,
        draw: 5.35,
        away: 9.3,
        over: { label: 'Más de (2.5)', value: 1.68 },
        under: { label: 'Menos de (2.5)', value: 2.1 },
      },
    },
    {
      id: 5,
      league: 'UEFA Europa League. Clasificación',
      flagClass: 'f113',
      teams: ['Maccabi Tel Aviv', 'Sheriff Tiraspol'],
      logos: [
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/778e60b5-730c-4010-901a-98eb431934da.png',
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/9e7c0c4e-fb5d-4fcc-8f8c-2489cd1cd6c8.png',
      ],
      date: '30.07',
      time: '9:00',
      odds: {
        home: 1.33,
        draw: 4.8,
        away: 8.5,
        over: { label: 'Más de (3)', value: 1.88 },
        under: { label: 'Menos de (3)', value: 1.82 },
      },
    },
    {
      id: 6,
      league: 'Liga de la Conferencia de la UEFA. Clasificación',
      flagClass: 'f113',
      teams: ['FC Inter Turku', 'Istanbul Basaksehir'],
      logos: [
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/a55f23d4-35f7-48d1-a884-f248f826462a.png',
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/6c6f7ab6-1527-485c-8e00-d6b0830197bf.png',
      ],
      date: '30.07',
      time: '9:00',
      odds: {
        home: 5,
        draw: 3.8,
        away: 1.62,
        over: { label: 'Más de (2.5)', value: 1.74 },
        under: { label: 'Menos de (2.5)', value: 1.98 },
      },
    },
    {
      id: 7,
      league: 'Liga de la Conferencia de la UEFA. Clasificación',
      flagClass: 'f113',
      teams: ['Jablonec', 'Varazdin'],
      logos: [
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/462a3c10-8897-4182-a3a0-a7858bf030aa.png',
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/28124714-bd67-4ab5-8182-738c909bde50.png',
      ],
      date: '30.07',
      time: '9:00',
      odds: {
        home: 1.66,
        draw: 3.8,
        away: 4.6,
        over: { label: 'Más de (3)', value: 2.05 },
        under: { label: 'Menos de (3)', value: 1.68 },
      },
    },
    {
      id: 8,
      league: 'Liga de la Conferencia de la UEFA. Clasificación',
      flagClass: 'f113',
      teams: ['Ilves', 'Stjarnan'],
      logos: [
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/3dba28d7-0c4e-4838-aec5-2659ecb05052.png',
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/1ea2381a-a33d-4a68-8de1-91e046e018f2.png',
      ],
      date: '30.07',
      time: '9:00',
      odds: {
        home: 1.68,
        draw: 3.9,
        away: 4.4,
        over: { label: 'Más de (3)', value: 1.94 },
        under: { label: 'Menos de (3)', value: 1.78 },
      },
    },
    {
      id: 9,
      league: 'Liga de la Conferencia de la UEFA. Clasificación',
      flagClass: 'f113',
      teams: ['Pyunik', 'DVSC-DEAC'],
      logos: [
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/99a26810-3f7c-4b81-b75d-4f241d6d8b9f.png',
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/64ec7d57-73f5-4df8-b3e5-3a47bb181b4d.png',
      ],
      date: '30.07',
      time: '9:00',
      odds: {
        home: 2.05,
        draw: 3.2,
        away: 3.4,
        over: { label: 'Más de (2.5)', value: 2.05 },
        under: { label: 'Menos de (2.5)', value: 1.68 },
      },
    },
    {
      id: 10,
      league: 'Amistosos. Top-Clubs',
      flagClass: 'f152',
      teams: ['Olympique de Marseill', 'Nimes Olympique'],
      logos: [
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/891029b8-87e1-4252-acd4-df40797ea2f5.png',
        'https://sport.levelquartz.net/sportcdn/assets/logos/latest/team/7bdeb1b5-c01d-4ef7-9d2b-3450e664298d.png',
      ],
      date: '30.07',
      time: '9:00',
      odds: {
        home: 1.22,
        draw: 6.5,
        away: 10,
        over: { label: 'Más de (3.5)', value: 2 },
        under: { label: 'Menos de (3.5)', value: 1.74 },
      },
    },
  ];

  return (
    <div className="l5--wrapper l5--wrapper-space l5-wrapper-iframe l3-sport-widget">
      <h3 className="sport-widget_title tb-separator">Todos los Top Partidos</h3>
      <div
        id="top_prematches_sport_widget"
        className="top-prematches-sport-widget multiboot-widget"
      >
        <div id="sport-prematch">
        <div className="dgw_event_widget_wrapper dgw_event_pre_match_widget dg_sport_icons dgw_event_widget_swiper_wrapper">
            {/* Header with tabs (static for now) */}
            <div className="dgw_event_widget_wrapper_header">
            <div className="dgw_event_widget_tab_wrapper">
                <div className="dgw_event_widget_tab_item dgw_event_widget_tab_item_active">
                <i className="imgSpr1 sport_front_icon-1"></i>
                <span>Fútbol</span>
                </div>
                <div className="dgw_event_widget_tab_item">
                <i className="imgSpr4 sport_front_icon-4"></i>
                <span>Basquet</span>
                </div>
                <div className="dgw_event_widget_tab_item">
                <i className="imgSpr12 sport_front_icon-12"></i>
                <span>Voleibol</span>
                </div>
                <div className="dgw_event_widget_tab_item">
                <i className="imgSpr3 sport_front_icon-3"></i>
                <span>Tenis</span>
                </div>
                <div className="dgw_event_widget_tab_item">
                <i className="imgSpr5 sport_front_icon-5"></i>
                <span>Béisbol</span>
                </div>
            </div>
            <div className="dgw_event_widget_wrapper_controls">
                <button
                className="dgw_event_widget_wrapper_controls_btn swiper-button-disabled slideshow-navigate-prev"
                disabled
                >
                <i className="sport_front_icon-arrow-left"></i>
                </button>
                <button className="dgw_event_widget_wrapper_controls_btn slideshow-navigate-next">
                <i className="sport_front_icon-arrow-right"></i>
                </button>
            </div>
            </div>

            {/* Body with Swiper */}
            <div className="dgw_event_widget_wrapper_body">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={8} // matches the margin-right from original
                slidesPerView="auto"
                navigation={{
                nextEl: '.slideshow-navigate-next',
                prevEl: '.slideshow-navigate-prev',
                }}
                pagination={{
                el: '.swiper-pagination',
                clickable: true,
                }}
                autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                }}
                className="dgw_event_widget_swiper"
                // you can add loop if needed
            >
                {matches.map((match) => (
                <SwiperSlide key={match.id} style={{ width: '454.333px' }}>
                    <div className="dgw_event_card">
                    <div className="dgw_event_card_header">
                        <span className={`flag cHFlag ${match.flagClass}`}></span>
                        <span className="dgw_event_card_header_name">{match.league}</span>
                    </div>
                    <div className="dgw_event_card_body">
                        <div className="dgw_event_card_event">
                        <div className="dgw_event_card_event_name_wrapper">
                            <div>
                            <div className="dgw_event_card_team_logo_wrapper">
                                <img
                                className="dgw_event_card_team_logo"
                                role="img"
                                alt=""
                                src={match.logos[0]}
                                srcSet={match.logos[0]}
                                />
                            </div>
                            <span>{match.teams[0]}</span>
                            </div>
                            <div>
                            <div className="dgw_event_card_team_logo_wrapper">
                                <img
                                className="dgw_event_card_team_logo"
                                role="img"
                                alt=""
                                src={match.logos[1]}
                                srcSet={match.logos[1]}
                                />
                            </div>
                            <span>{match.teams[1]}</span>
                            </div>
                        </div>
                        <div className="dgw_event_card_prematch_info">
                            <span>{match.date}</span>
                            <span>{match.time}</span>
                        </div>
                        </div>
                        <div className="dgw_event_card_odds">
                        <div className="dgw_event_card_odds_items_wrapper">
                            <div className="dgw_boosted_bicolor_icon">
                            <i className=""></i>
                            </div>
                            <div className="dgw_event_card_odds_items">
                            <button className="dgw_event_card_odd">
                                <span>{match.teams[0]} </span>
                                <span className="dgw_event_card_stakes_odd" data-change={match.odds.home}>
                                {match.odds.home}
                                </span>
                            </button>
                            <button className="dgw_event_card_odd">
                                <span>Empate </span>
                                <span className="dgw_event_card_stakes_odd" data-change={match.odds.draw}>
                                {match.odds.draw}
                                </span>
                            </button>
                            <button className="dgw_event_card_odd">
                                <span>{match.teams[1]} </span>
                                <span className="dgw_event_card_stakes_odd" data-change={match.odds.away}>
                                {match.odds.away}
                                </span>
                            </button>
                            </div>
                        </div>
                        <div className="dgw_event_card_odds_items">
                            <button className="dgw_event_card_odd">
                            <span>{match.odds.over.label}</span>
                            <span className="dgw_event_card_stakes_odd" data-change={match.odds.over.value}>
                                {match.odds.over.value}
                            </span>
                            </button>
                            <button className="dgw_event_card_odd">
                            <span>{match.odds.under.label}</span>
                            <span className="dgw_event_card_stakes_odd" data-change={match.odds.under.value}>
                                {match.odds.under.value}
                            </span>
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </SwiperSlide>
                ))}
            </Swiper>
            <div className="swiper-pagination"></div>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SportPrematchWidget;

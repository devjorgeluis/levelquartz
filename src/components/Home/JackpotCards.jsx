import React from 'react';
import icon1 from '../../assets/images/diamond_blue.webp';
import icon2 from '../../assets/images/diamond_red.webp';
import icon3 from '../../assets/images/diamond_white.webp';
import icon4 from '../../assets/images/diamond_gold.webp';
import { Swiper, SwiperSlide } from 'swiper/react';

const jackpotData = [
    {
        id: 1,
        title: 'MEGA',
        minBet: 'ARS 3 000',
        amount: 'ARS 150 040.06',
        icon: icon1
    },
    {
        id: 2,
        title: 'MAJOR',
        minBet: 'ARS 2 000',
        amount: 'ARS 75 040.07',
        icon: icon2
    },
    {
        id: 3,
        title: 'MINOR',
        minBet: 'ARS 1 000',
        amount: 'ARS 30 148.24',
        icon: icon3
    },
    {
        id: 4,
        title: 'MINI',
        minBet: 'ARS 300',
        amount: 'ARS 15 172.31',
        icon: icon4
    },
];
const items = [
    {
        id: 1,
        title: 'MEGA',
        minBet: '3 000',
        amount: '150 041.99',
        variant: 'diamond',
        iconUrl: icon1,
        lastWin: '0',
        lastBetId: '',
        lastDate: '',
        maxWin: '0',
        maxBetId: '',
        maxDate: '',
    },
    {
        id: 2,
        title: 'MAJOR',
        minBet: '2 000',
        amount: '75 042.00',
        variant: 'amethyst',
        iconUrl: icon2,
        lastWin: '0',
        lastBetId: '',
        lastDate: '',
        maxWin: '0',
        maxBetId: '',
        maxDate: '',
    },
    {
        id: 3,
        title: 'MINOR',
        minBet: '1 000',
        amount: '30 155.44',
        variant: 'emerald',
        iconUrl: icon3,
        lastWin: '0',
        lastBetId: '',
        lastDate: '',
        maxWin: '0',
        maxBetId: '',
        maxDate: '',
    },
    {
        id: 4,
        title: 'MINI',
        minBet: '300',
        amount: '15 180.62',
        variant: 'gold',
        iconUrl: icon4,
        lastWin: '0',
        lastBetId: '',
        lastDate: '',
        maxWin: '0',
        maxBetId: '',
        maxDate: '',
    },
];

const JackpotCards = () => {
    return (
        <div className="l5--placeholder8 l5--wrapper l3-sport-widget  mobile--sport_jackpot">
            <div id="sport_jackpot_widget" className="multiboot-widget">
                <div className='dg_jackpot dg_jackpot_rtl'>
                    <div className="swiper-wrapper dg_jackpot_slider">
                        <Swiper
                            slidesPerView="auto"
                            spaceBetween={8}
                            simulateTouch={true}
                            mousewheel={true}
                            freeMode={true}
                            grabCursor={true}
                            className="dg_promotion_widgets_content"
                        >
                            {items.map((item) => (
                                <SwiperSlide
                                    key={item.id}
                                    className={`dg_jackpot_slider_item variant_${item.variant}`}
                                >
                                    {/* Decorative SVG */}
                                    <div className="dg_jackpot_item_deco">
                                        <svg className="dg_jackpot_deco" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 160 72">
                                            <use className="dg_jackpot_deco_bg" vectorEffect="non-scaling-stroke" href="#dg_jackpot_deco_bg"></use>
                                            <use className="dg_jackpot_deco_stroke" vectorEffect="non-scaling-stroke" href="#dg_jackpot_deco_stroke"></use>
                                            <use className="dg_jackpot_deco_fill" vectorEffect="non-scaling-stroke" href="#dg_jackpot_deco_fill"></use>
                                        </svg>
                                    </div>

                                    {/* Main content */}
                                    <div className="dg_jackpot_content">
                                        <div className="dg_jackpot_content_name_wrap">
                                            <div className="dg_jackpot_content_name">
                                                <span className="dg_jackpot_content_name_txt">
                                                    {item.title}
                                                </span>
                                                <span className="dg_jackpot_content_name_minbet">
                                                    <span className="dg_jackpot_separator"></span>
                                                    <span className="dg_jackpot_content_name_minbet_txt">
                                                        Apuesta mín.
                                                    </span>
                                                    <span className="dg_jackpot_content_name_num">
                                                        <span>ARS</span>
                                                        <span className="dg_jackpot_preserve_ltr">
                                                            {item.minBet}
                                                        </span>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="dg_jackpot_content_amount">
                                            <span className="dg_jackpot_content_amount_num">
                                                <span>ARS</span>
                                                <span className="dg_jackpot_preserve_ltr dg_jackpot_content_amount_num_wrap">
                                                    <span className="jackpot_amount_number dg_preserve_ltr">
                                                        {item.amount}
                                                    </span>
                                                </span>
                                            </span>
                                        </div>

                                        <i
                                            className="dg_jackpot_content_icon"
                                            style={{ backgroundImage: `url(${item.iconUrl})` }}
                                        ></i>
                                    </div>

                                    {/* Info footer */}
                                    {/* <div className="dg_jackpot_info">
                            <div className="dg_jackpot_info_content">
                                <div className="dg_jackpot_info_content_item">
                                    <div className="dg_jackpot_info_content_item_title">
                                        <span className="dg_jackpot_info_content_item_title_txt">
                                            &nbsp;Última ganancia
                                        </span>
                                        <div className="dg_jackpot_info_content_item_title_amount">
                                            <span className="dg_jackpot_info_content_item_title_amount_sign">
                                                ARS
                                            </span>
                                            <span className="dg_jackpot_info_content_item_title_amount_txt dg_jackpot_preserve_ltr">
                                                {item.lastWin}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="dg_jackpot_info_content_item_bet dg_jackpot_info_content_item_bet_date">
                                        <span>ID de la Apuesta</span>
                                        <span className="dg_preserve_ltr">{item.lastBetId}</span>
                                    </div>
                                    <div className="dg_jackpot_info_content_item_date dg_jackpot_info_content_item_bet_date">
                                        <span>Fecha y Hora</span>
                                        <span className="dg_jackpot_info_content_item_bet_date_wrapper">
                                            <span>{item.lastDate?.split(' ')[0] || ''}</span>
                                            <span>{item.lastDate?.split(' ')[1] || ''}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="dg_jackpot_separator_line"></div>

                                <div className="dg_jackpot_info_content_item">
                                    <div className="dg_jackpot_info_content_item_title">
                                        <span className="dg_jackpot_info_content_item_title_txt">
                                            {' '}
                                            Mayor ganancia
                                        </span>
                                        <div className="dg_jackpot_info_content_item_title_amount">
                                            <span className="dg_jackpot_info_content_item_title_amount_sign">
                                                ARS
                                            </span>
                                            <span className="dg_jackpot_info_content_item_title_amount_txt dg_jackpot_preserve_ltr">
                                                {item.maxWin}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="dg_jackpot_info_content_item_bet dg_jackpot_info_content_item_bet_date">
                                        <span>ID de la Apuesta</span>
                                        <span className="dg_preserve_ltr">{item.maxBetId}</span>
                                    </div>
                                    <div className="dg_jackpot_info_content_item_date dg_jackpot_info_content_item_bet_date">
                                        <span>Fecha y Hora</span>
                                        <span className="dg_jackpot_info_content_item_bet_date_wrapper">
                                            <span>{item.maxDate?.split(' ')[0] || ''}</span>
                                            <span>{item.maxDate?.split(' ')[1] || ''}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div></div>
    );
};

export default JackpotCards;

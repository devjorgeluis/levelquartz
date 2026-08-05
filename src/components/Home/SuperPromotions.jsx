import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const SuperPromotionsWidget = () => {
    const containerRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    // ─── Detect overflow ──────────────────────────────────────────────
    useEffect(() => {
        const checkOverflow = () => {
            const el = containerRef.current;
            if (!el) return;
            const hasOverflow =
                el.scrollWidth > el.clientWidth ||
                el.scrollHeight > el.clientHeight;

            console.log("Overflowed: ", hasOverflow);

            setIsOverflowing(hasOverflow);
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    // ─── Drag‑to‑scroll logic ────────────────────────────────────────
    useEffect(() => {
        const el = containerRef.current;
        if (!el || !isOverflowing) return;

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let scrollLeft = 0;
        let scrollTop = 0;

        const onDragStart = (e) => {
            // Ignore if the target is interactive (button, link, input, etc.)
            const tag = e.target.tagName.toLowerCase();
            if (['button', 'a', 'input', 'select', 'textarea'].includes(tag)) return;

            isDragging = true;
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            startX = clientX;
            startY = clientY;
            scrollLeft = el.scrollLeft;
            scrollTop = el.scrollTop;
            el.style.cursor = 'grabbing';
            el.style.userSelect = 'none';
        };

        const onDragMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            const dx = clientX - startX;
            const dy = clientY - startY;
            el.scrollLeft = scrollLeft - dx;
            el.scrollTop = scrollTop - dy;
        };

        const onDragEnd = () => {
            isDragging = false;
            el.style.cursor = '';
            el.style.userSelect = '';
        };

        // Mouse events
        el.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);

        // Touch events
        el.addEventListener('touchstart', onDragStart, { passive: true });
        window.addEventListener('touchmove', onDragMove, { passive: false });
        window.addEventListener('touchend', onDragEnd, { passive: true });

        return () => {
            el.removeEventListener('mousedown', onDragStart);
            window.removeEventListener('mousemove', onDragMove);
            window.removeEventListener('mouseup', onDragEnd);
            el.removeEventListener('touchstart', onDragStart);
            window.removeEventListener('touchmove', onDragMove);
            window.removeEventListener('touchend', onDragEnd);
        };
    }, [isOverflowing]);


    return (
        <div className="l5--wrapper l5--wrapper-space l5-wrapper-iframe l3-sport-widget super-promotions-wrapper">
            <div id="super_promotions" className="super-promotions super-promotion-widget">
                <div className="ai_root dg_widget_root dg_promotion_widgets_root">
                    <div className="ai_widget_container">
                        <div className="dg_events_widget_header">
                            <span className="dg__ellipsis" title="SÚPER PROMOCIONES">
                                SÚPER PROMOCIONES
                            </span>
                        </div>
                        <div className="dg_promotion_widgets dg_sport_icons">
                            <div className="dg_promotion_widgets_header">
                                <div className="dg_promotion_widgets_header_tabs">
                                    <div className="tab_active dg_promotion_widgets_header_tab">
                                        Combinadas Aumentadas
                                    </div>
                                </div>
                            </div>
                            {/* <div
                                ref={containerRef}
                                className="dg_promotion_widgets_content dg_promotion_widgets_content--shadow_end"
                                style={{
                                    overflow: 'auto',
                                    cursor: isOverflowing ? 'grab' : 'default',
                                    // Ensure the container has a defined size so overflow can be detected
                                    maxWidth: '100%',
                                    whiteSpace: 'nowrap', // force horizontal overflow if needed
                                }}
                            > */}
                            <Swiper
                                slidesPerView="auto"
                                spaceBetween={8}
                                simulateTouch={true}
                                mousewheel={true}
                                freeMode={true}
                                grabCursor={true}
                                className="dg_promotion_widgets_content"
                            >
                                <div
                                    className="swiper swiper-initialized swiper-horizontal swiper-watch-progress swiper-backface-hidden"
                                    id="dg_promotion_widgets_content"
                                >
                                    <div className="swiper-wrapper" style={{ transitionDuration: '0ms', transitionDelay: '0ms', transform: 'translate3d(16px, 0px, 0px)' }}>
                                        {/* Slide 1 */}
                                        <SwiperSlide>
                                        <div className="swiper-slide swiper-slide-visible swiper-slide-fully-visible swiper-slide-active" style={{ marginRight: '8px' }}>
                                            <div className="super_promotions">
                                                <div>
                                                    <div className="super_promotions_header">
                                                        <div className="super_promotions_header_title"></div>
                                                    </div>
                                                    <div className="super_promotions_content">
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-1 imgSpr1"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">05:00</span> <span>Midtjylland - Horsens</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Resultado final.: </span>
                                                                        <span>Midtjylland </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.33</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-46 imgSpr46"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">09:20</span> <span>Ludovit Klein - Tofik Musaev</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Resultado: </span>
                                                                        <span>Ludovit Klein </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.46</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-3 imgSpr3"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">08:00</span> <span>Brandon Nakashima - Jakub Mensik</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Ganador: </span>
                                                                        <span>Jakub Mensik </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.66</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="super_promotions_footer">
                                                    <i className="super_promotions_footer_icon dg_icon_enhanced_odd"></i>
                                                    <div className="super_promotions_footer_info">
                                                        <del className="super_promotions_footer_del">3.22</del>
                                                        <span className="super_promotions_footer_num">3.70</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </SwiperSlide>

                                        {/* Slide 2 */}
                                        <SwiperSlide>
                                        <div className="swiper-slide swiper-slide-visible swiper-slide-fully-visible swiper-slide-next" style={{ marginRight: '8px' }}>
                                            <div className="super_promotions">
                                                <div>
                                                    <div className="super_promotions_header">
                                                        <div className="super_promotions_header_title"></div>
                                                    </div>
                                                    <div className="super_promotions_content">
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-1 imgSpr1"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">06:00</span> <span>Gazovik Orenburg - Zenit</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Resultado final.: </span>
                                                                        <span>Zenit </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.37</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-1 imgSpr1"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">10:00</span> <span>Rodina Moscow - Rostov</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Resultado final.: </span>
                                                                        <span>Rostov </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">2.25</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-46 imgSpr46"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">08:20</span> <span>Dennis Buzukia - Bogdan Grad </span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Resultado (2 vías): </span>
                                                                        <span>Bogdan Grad  </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.46</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="super_promotions_footer">
                                                    <i className="super_promotions_footer_icon dg_icon_enhanced_odd"></i>
                                                    <div className="super_promotions_footer_info">
                                                        <del className="super_promotions_footer_del">4.50</del>
                                                        <span className="super_promotions_footer_num">5.17</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </SwiperSlide>

                                        {/* Slide 3 */}
                                        <SwiperSlide>
                                        <div className="swiper-slide swiper-slide-visible swiper-slide-fully-visible" style={{ marginRight: '8px' }}>
                                            <div className="super_promotions">
                                                <div>
                                                    <div className="super_promotions_header">
                                                        <div className="super_promotions_header_title"></div>
                                                    </div>
                                                    <div className="super_promotions_content">
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-5 imgSpr5"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">02:30</span> <span>Doosan Bears - SSG Landers</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Ganador: </span>
                                                                        <span>Doosan Bears </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.8</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-5 imgSpr5"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">02:30</span> <span>Kiwoom Heroes - LG Twins</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Ganador: </span>
                                                                        <span>LG Twins </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.6</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-5 imgSpr5"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">02:30</span> <span>Lotte Giants - Hanwha Eagles</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Total: </span>
                                                                        <span>Más de (7.5)</span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.35</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="super_promotions_footer">
                                                    <i className="super_promotions_footer_icon dg_icon_enhanced_odd"></i>
                                                    <div className="super_promotions_footer_info">
                                                        <del className="super_promotions_footer_del">3.88</del>
                                                        <span className="super_promotions_footer_num">4.47</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </SwiperSlide>

                                        {/* Slide 4 */}
                                        <SwiperSlide>
                                        <div className="swiper-slide swiper-slide-visible swiper-slide-fully-visible" style={{ marginRight: '8px' }}>
                                            <div className="super_promotions">
                                                <div>
                                                    <div className="super_promotions_header">
                                                        <div className="super_promotions_header_title"></div>
                                                    </div>
                                                    <div className="super_promotions_content">
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-5 imgSpr5"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">10:40</span> <span>Kansas City Royals - Minnesota Twins</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Ganador: </span>
                                                                        <span>Minnesota Twins </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.68</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-5 imgSpr5"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">16:10</span> <span>Pittsburgh Pirates - Cincinnati Reds</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Ganador: </span>
                                                                        <span>Pittsburgh Pirates </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.86</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-5 imgSpr5"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">16:15</span> <span>Washington Nationals - Atlanta Braves</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Ganador: </span>
                                                                        <span>Atlanta Braves </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.66</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="super_promotions_item">
                                                            <div className="super_promotions_item_left_box">
                                                                <i className="super_promotions_item_icon sport_front_icon-5 imgSpr5"></i>
                                                            </div>
                                                            <div className="super_promotions_item_right_box">
                                                                <div className="super_promotions_item_first_info ellipsis-2-lines">
                                                                    <span className="super_promotions_item_time">18:40</span> <span>Boston Red Sox - Athletics</span>
                                                                </div>
                                                                <div className="super_promotions_item_second_info">
                                                                    <div className="ellipsis-2-lines">
                                                                        <span className="super_promotions_item_second_info_half">Ganador: </span>
                                                                        <span>Boston Red Sox </span>
                                                                    </div>
                                                                    <div className="super_promotions_item_second_info_num">1.58</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="super_promotions_footer">
                                                    <i className="super_promotions_footer_icon dg_icon_enhanced_odd"></i>
                                                    <div className="super_promotions_footer_info">
                                                        <del className="super_promotions_footer_del">8.19</del>
                                                        <span className="super_promotions_footer_num">9.42</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </SwiperSlide>
                                    </div>
                                </div>
                                {/* </div> */}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperPromotionsWidget;
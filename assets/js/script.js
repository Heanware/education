let isScrolling = false,
    isAnchorUsed = false,
    windowWidth = $(window).outerWidth();

const videoBeforeAnimation = 300,
    slideChangeSpeed = 1000,
    slideChangeOffset = 210;

class Slider {
    $wrapper;
    wrapperOffset;
    $active;
    scrollPrev;
    verticalHeight;
    slideChangeSpeed;
    slideChangeOffset;
    isSlideSetActive = false;

    constructor($wrapper, verticalHeight, slideChangeSpeed, slideChangeOffset) {
        this.$wrapper = $wrapper;
        this.verticalHeight = verticalHeight;
        this.slideChangeSpeed = slideChangeSpeed;
        this.slideChangeOffset = slideChangeOffset;
        let thisSlider = this,
            sliderOffset = $wrapper.find(".slider").offset().top;
        $(window).on("scroll", function () {
                let scrollTop = $(this).scrollTop();
                thisSlider.wrapperOffset = thisSlider.$wrapper.offset().top;
                if (!thisSlider.isSlideSetActive) {
                    let currentSlideIndex = Math.floor((sliderOffset - thisSlider.wrapperOffset) / thisSlider.verticalHeight);
                    if (currentSlideIndex < 0) {
                        currentSlideIndex = 0;
                    }
                    thisSlider.setSlideActive(currentSlideIndex);
                    thisSlider.scrollPrev = thisSlider.wrapperOffset + thisSlider.verticalHeight * thisSlider.$active.index();
                }
                if (isAnchorUsed && scrollTop > thisSlider.wrapperOffset) {
                    thisSlider.setLastSlideActive();
                }
                if (scrollTop > thisSlider.wrapperOffset &&
                    scrollTop < thisSlider.wrapperOffset + parseInt(thisSlider.$wrapper.css("height")) &&
                    !isScrolling) {
                    if (scrollTop - thisSlider.scrollPrev > thisSlider.slideChangeOffset) {
                        thisSlider.scrollSlider(thisSlider.$active.next());
                    } else if (scrollTop - thisSlider.scrollPrev < -thisSlider.slideChangeOffset) {
                        thisSlider.scrollSlider(thisSlider.$active.prev());
                    }
                }
            }
        );
        $(window).trigger("scroll");
    }

    setSlideActive(currentSlideIndex) {
        this.$active = this.$wrapper.find(".slider .city__facts--slider-item").eq(currentSlideIndex);
        this.$active.addClass("slide-active");
        this.isSlideSetActive = true;
    }

    setLastSlideActive() {
        this.$active.removeClass("slide-active");
        this.$active = this.$wrapper.find(".slider .city__facts--slider-item").last();
        this.$active.addClass("slide-active");
        this.scrollPrev = this.wrapperOffset + this.verticalHeight * this.$active.index();
    }

    scrollSlider($slide) {
        if ($slide.length > 0) {
            isScrolling = true;
            let range = this.wrapperOffset + this.verticalHeight * $slide.index(),
                thisSlider = this;
            this.$active.removeClass("slide-active");
            $("html").animate({
                scrollTop: range
            }, thisSlider.slideChangeSpeed, "linear", function () {
                isScrolling = false;
                thisSlider.scrollPrev = range;
            });
            this.$active = $slide;
            $slide.addClass("slide-active");
        }
    }
}

$(function () {
    let $cover = $(".js-anchor-cover"),
        $cities = $(".city"),
        $videoWrappers = $(".js-wider"),
        $sliders = $(".js-slider"),
        $anchors = $(".js-anchor"),
        scrollBarWidth = window.innerWidth - $(window).width(),
        verticalHeight = $(window).outerHeight(),
        scrollPrev = 0,
        $inactiveSlide;

    $(window).on("scroll", function () {
        let scroll = $(this).scrollTop(),
            isScrollingDown;

        isScrollingDown = scrollPrev < scroll;
        scrollPrev = scroll;

        $videoWrappers.each(function () {
            let $videoWrapper = $(this),
                offset = $videoWrapper.offset().top,
                width = windowWidth - scrollBarWidth,
                $video = $videoWrapper.find("video");
            if (scroll > offset - videoBeforeAnimation) {
                $video.css("max-width", width + "px");
            } else {
                $video.css("max-width", "calc(100vw - 60px)");
            }
        });

        $cities.each(function () {
            let $city = $(this),
                offset = $city.offset().top;
            if (scroll + verticalHeight > offset &&
                scroll + verticalHeight < offset + slideChangeOffset &&
                isScrollingDown) {
                $("a[href='#" + $city.attr("id") + "']").trigger("click");
            }
        });
    });

    if (window.matchMedia("(max-width: 768px)").matches) {
        let effect = new Rellax(".rellax-img", {speed: 1.5}),
            mobileSlider = $(".owl-carousel").owlCarousel({
                center: true,
                margin: 30,
                onDragged: function (e) {
                    let $currentSlide = $(e.target),
                        count = e.item.count,
                        index = e.item.index;
                    if (index > count) {
                        index = index - count;
                    }
                    let $closestCityMobile = $currentSlide.closest(".city__mobile"),
                        $titles = $closestCityMobile.find(".city__mobile--title-item");
                    $titles.removeClass("title-active");
                    $titles.eq(index).addClass("title-active");
                    if (typeof ($inactiveSlide) !== "undefined") {
                        $inactiveSlide.removeClass("slide-hide");
                    }
                    $inactiveSlide = $closestCityMobile.find(".city__mobile--slider-items-item").eq(index - 1);
                    $inactiveSlide.addClass("slide-hide");
                },
                responsive: {
                    0: {
                        items: 1,
                        center: false, // если установлено в false, и items не целое число, слайдер начинает баговать
                                       // даёт посмотреть только первые 2 слайда, не пускает до третьего
                        // и в принципе непредсказуемо себя ведёт. Если отключить mobileSliderCallback то проблема не уходит, то есть причина не в нём
                        margin: 40
                    },
                    320: {
                        items: 2
                    },
                    568: {
                        items: 1.9
                    }
                }
            });
    } else {
        let effect = new Rellax(".rellax-img", {speed: 3});
        $sliders.each(function () {
            new Slider($(this), verticalHeight, slideChangeSpeed, slideChangeOffset);
        });
    }

    $anchors.on("click", function (e) {
        e = e.originalEvent;
        if (e) {
            e.preventDefault();
        }
        $anchor = $(this);
        isScrolling = true;
        $cover.css("background-color", $anchor.data("color"));
        $cover.addClass("cover-active");
        setTimeout(function () {
            $("html").stop().animate({
                    scrollTop: $($anchor.data("href")).offset().top
                }, 400, "linear", function () {
                    isAnchorUsed = true;
                    $(window).trigger("scroll");
                    $cover.removeClass("cover-active");
                    $cover.css("background-color", "");
                    isScrolling = false;
                    isAnchorUsed = false;
                }
            );
        }, 400);
    });
});
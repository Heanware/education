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

    let effect = new Rellax(".rellax-img", {speed: 3}),
        $cover = $(".js-anchor-cover"),
        $videos = $(".js-wider"),
        $sliders = $(".js-slider"),
        $anchors = $(".js-anchor"),
        scrollBarWidth = window.innerWidth - $(window).width(),
        verticalHeight = $(window).outerHeight();

    $(window).on("scroll", function () {
        let scroll = $(this).scrollTop();
        $videos.each(function () {
            let $videos = $(this),
                offset = $videos.offset().top,
                width = windowWidth - scrollBarWidth,
                $video = $videos.find("video");
            if (scroll > offset - videoBeforeAnimation) {
                $video.css("max-width", width + "px");
            } else {
                $video.css("max-width", "calc(100vw - 60px)");
            }
        });
    });

    if (window.matchMedia("(max-width: 768px)").matches) {
        $(".owl-carousel").owlCarousel({
            center: true,
            items: 1,
        });
    } else {
        $sliders.each(function () {
            new Slider($(this), verticalHeight, slideChangeSpeed, slideChangeOffset);
        });

    }

    $anchors.on("click", function () {
        $anchor = $(this);
        isScrolling = true;
        $cover.addClass("cover-active");
        $cover.css("background-color", $anchor.data("color"));
        $("html").stop().animate({
            scrollTop: $($anchor.data("href")).offset().top
        }, 1500, "linear", function () {
            isAnchorUsed = true;
            $(window).trigger("scroll");
            $cover.removeClass("cover-active");
            isScrolling = false;
            isAnchorUsed = false;
        });
    })
});
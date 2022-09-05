let isScrolling = false,
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
        $(window).on("scroll", function (e) {
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
        $videos = $(".js-wider"),
        $sliders = $(".js-slider"),
        scrollBarWidth = window.innerWidth - $(window).width(),
        verticalHeight = $(window).outerHeight();

    $sliders.each(function () {
        new Slider($(this), verticalHeight, slideChangeSpeed, slideChangeOffset);
    })

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
                $video.css("max-width", "1800px");
            }
        });
    });
});
let isScrolling = false,
    windowWidth = $(window).outerWidth();

const videoBeforeAnimation = 300,
    slideChangeSpeed = 1000,
    slideChangeOffset = 200;

class Slider {
    $wrapper;
    wrapperOffset;
    $active;
    scrollPrev;
    verticalHeight;
    slideChangeSpeed;
    slideChangeOffset

    constructor($wrapper, verticalHeight, slideChangeSpeed, slideChangeOffset) {
        this.$wrapper = $wrapper;
        this.wrapperOffset = this.$wrapper.offset().top;
        this.verticalHeight = verticalHeight;
        this.slideChangeSpeed = slideChangeSpeed;
        this.slideChangeOffset = slideChangeOffset;
        let thisSlider = this,
            sliderOffset = $wrapper.find(".slider").offset().top,
            currentSlideIndex = Math.floor((sliderOffset - this.wrapperOffset) / this.verticalHeight);
        this.scrollPrev = sliderOffset;
        this.$active = $wrapper.find(".slider .city__facts--slider-item").eq(currentSlideIndex);
        this.$active.addClass("slide-active");
        $(window).on("scroll", function () {
            let scroll = $(this).scrollTop();
            if (scroll > thisSlider.wrapperOffset &&
                scroll < thisSlider.wrapperOffset + parseInt(thisSlider.$wrapper.css("height")) &&
                !isScrolling) {
                if (scroll - thisSlider.scrollPrev > thisSlider.slideChangeOffset) {
                    thisSlider.scrollSlider(thisSlider.$active.next());
                } else if (scroll - thisSlider.scrollPrev < -thisSlider.slideChangeOffset) {
                    thisSlider.scrollSlider(thisSlider.$active.prev());
                }
            }
        });
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

    setTimeout(function () {
        $sliders.each(function () {
            new Slider($(this), verticalHeight, slideChangeSpeed, slideChangeOffset);
        })
    }, 100);

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
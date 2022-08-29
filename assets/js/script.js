$(function () {

    let effect = new Rellax(".rellax-img", {speed: 3}),
        $videos = $(".js-wider"),
        $sliders = $(".js-slider"),
        scrollBarWidth = window.innerWidth - $(window).width(),
        verticalHeight = $(window).outerHeight(),
        scrollPrev = 0,
        isScrolling = false,
        oSliders = new Array(),
        activeSliderIndex = -1;

    class Slider {

        $wrapper;
        $active;

        constructor($wrapper) {
            this.$wrapper = $wrapper;
            let $sliderOffset = $wrapper.find(".slider").offset().top,
                currentSlideIndex = Math.floor(($sliderOffset - $wrapper.offset().top) / verticalHeight);
            this.$active = $wrapper.find(".slider").children().eq(currentSlideIndex);
            this.$active.addClass("slide-active");
        }

        scrollSlider($slide) {
            if ($slide.length > 0) {
                isScrolling = true;
                let range = this.$wrapper.offset().top + verticalHeight * $slide.index();
                this.$active.removeClass("slide-active");
                this.$active = $slide;  /* works here */
                $slide.addClass("slide-active");
                $("html").animate({
                    scrollTop: range
                }, 1000, "linear", function () {
                    isScrolling = false;
                    scrollPrev = range;
                    /* but not here */
                });
            }
        }

        next() {
            let $next = this.$active.next();
            this.scrollSlider($next);
        }

        previous() {
            let $prev = this.$active.prev();
            this.scrollSlider($prev);
        }
    }

    $sliders.each(function () {
        oSliders.push(new Slider($(this)));
    })

    $(window).on("scroll", function (e) {

        let scroll = $(this).scrollTop();

        $videos.each(function () {
            let $videos = $(this),
                offset = $videos.offset().top,
                width = 1920 - scrollBarWidth,
                $video = $videos.children();
            if (scroll > offset - 300) {
                $video.css("max-width", width + "px");
            } else {
                $video.css("max-width", "1800px");
            }
        });

        $sliders.each(function (index) {

            let $wrapper = $(this),
                $wrapperOffset = $wrapper.offset().top,
                $active = $wrapper.find(".slide-active"),
                sliderOffset = $wrapper.find(".sticky-slider").offset().top;

            if (scrollPrev === 0) {
                scrollPrev = scroll;
            }

            if (scroll > $wrapperOffset && !isScrolling) {

                activeSliderIndex = index;
                if (scroll - scrollPrev > 200) {
                    oSliders[activeSliderIndex].next();
                } else if (scroll - scrollPrev < -200) {
                    oSliders[activeSliderIndex].previous();
                }
            }
        });
    });
});
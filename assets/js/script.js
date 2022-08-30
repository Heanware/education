$(function () {

    let effect = new Rellax(".rellax-img", {speed: 3}),
        $videos = $(".js-wider"),
        $sliders = $(".js-slider"),
        scrollBarWidth = window.innerWidth - $(window).width(),
        verticalHeight = $(window).outerHeight(),
        isScrolling = false;

    class Slider {

        $wrapper;
        wrapperOffset;
        $active;
        scrollPrev;

        constructor($wrapper) {
            this.$wrapper = $wrapper;
            this.wrapperOffset = this.$wrapper.offset().top;
            this.scrollPrev = this.wrapperOffset;
            let thisSlider = this,
                sliderOffset = $wrapper.find(".slider").offset().top,
                currentSlideIndex = Math.floor((sliderOffset - this.wrapperOffset) / verticalHeight);
            this.$active = $wrapper.find(".slider .city__facts--slider-item").eq(currentSlideIndex);
            this.$active.addClass("slide-active");
            $(window).on("scroll", function () {
                let scroll = $(this).scrollTop();
                if (scroll > thisSlider.wrapperOffset &&
                    scroll < thisSlider.wrapperOffset + parseInt(thisSlider.$wrapper.css("height")) &&
                    !isScrolling) {
                    if (scroll - thisSlider.scrollPrev > 200) {
                        thisSlider.scrollSlider(thisSlider.$active.next());
                    } else if (scroll - thisSlider.scrollPrev < -200) {
                        thisSlider.scrollSlider(thisSlider.$active.prev());
                    }
                }
            });
        }

        scrollSlider($slide) {
            if ($slide.length > 0) {
                isScrolling = true;
                let range = this.wrapperOffset + verticalHeight * $slide.index(),
                    thisSlider = this;
                this.$active.removeClass("slide-active");
                $("html").animate({
                    scrollTop: range
                }, 1000, "linear", function () {
                    isScrolling = false;
                    thisSlider.scrollPrev = range;
                });
                this.$active = $slide;
                $slide.addClass("slide-active");
            }
        }
    }

    setTimeout(function () {
        $sliders.each(function () {
            new Slider($(this));
        })
    }, 100);


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
    });
});
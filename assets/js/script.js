$(function () {

    let effect = new Rellax(".rellax-img", {speed: 3}),
        $videos = $(".js-wider"),
        $sliders = $(".js-slider"),
        scrollBarWidth = window.innerWidth - $(window).width(),
        verticalHeight = $(window).outerHeight(),
        scroll = 0,
        scrollPrev = 0,
        isScrolling = false,
        oSliders = new Array(),
        activeSliderIndex = -1;

    class Slider {

        $wrapper;
        wrapperOffset;
        $active;

        constructor($wrapper) {
            this.$wrapper = $wrapper;
            this.wrapperOffset = this.$wrapper.offset().top;
            let thisSlider = this,
                sliderOffset = $wrapper.find(".slider").offset().top,
                currentSlideIndex = Math.floor((sliderOffset - this.wrapperOffset) / verticalHeight);
            this.$active = $wrapper.find(".slider .city__facts--slider-item").eq(currentSlideIndex);
            this.$active.addClass("slide-active");
            $(window).on("scroll", function () {
                if (scroll > thisSlider.wrapperOffset &&
                    scroll < thisSlider.wrapperOffset + parseInt(thisSlider.$wrapper.css("height")) &&
                    !isScrolling) {
                    console.log(scroll > thisSlider.wrapperOffset);
                    if (scroll - scrollPrev > 200) {

                        /*     thisSlider.next();*/
                        thisSlider.scrollSlider(thisSlider.$active.next());
                    } else if (scroll - scrollPrev < -200) {
                        /*       thisSlider.previous();*/
                        thisSlider.scrollSlider(thisSlider.$active.prev());
                    }
                }
            });
        }

        scrollSlider($slide) {
            if ($slide.length > 0) {
                isScrolling = true;
                let range = this.wrapperOffset + verticalHeight * $slide.index();
                this.$active.removeClass("slide-active");
                $("html").animate({
                    scrollTop: range
                }, 1000, "linear", function () {
                    isScrolling = false;
                    scrollPrev = range;
                });
                console.log(outerHeight);
                this.$active = $slide;
                $slide.addClass("slide-active");
            }
        }

        /*
                next() {
                    let $next = this.$active.next();
                    this.scrollSlider($next);
                }

                previous() {
                    let $prev = this.$active.prev();
                    this.scrollSlider($prev);
                }*/
    }

    $sliders.each(function () {
        oSliders.push(new Slider($(this)));
    })

    $(window).on("scroll", function (e) {

        scroll = $(this).scrollTop();

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

        if (scrollPrev === 0) {
            scrollPrev = scroll;
        }
    });
});
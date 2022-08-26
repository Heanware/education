$(function () {

    let effect = new Rellax(".rellax-img", {speed: 3});

    let $videos = $(".js-wider"),
        scrollBarWidth = window.innerWidth - $(window).width(),
        $sliders = $(".js-slider"),
        scrollPrev = 0,
        isScrolling = false,
        verticalHeight = $(window).outerHeight();

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
        
        $sliders.each(function () {
            let $wrapper = $(this),
                sliderOffset = $wrapper.offset().top,
                $slider = $wrapper.find(".sticky-slider"),
                $active = $slider.find(".slide-active"),
                $slides = $slider.find(".slider").children(),
                currentSlideIndex = Math.floor(($slider.offset().top - sliderOffset) / verticalHeight);

            if ($active.length <= 0) {
                $slides.eq(currentSlideIndex).addClass("slide-active");
            }

            if (scrollPrev === 0) {
                scrollPrev = scroll;
            }

            if (scroll > sliderOffset && !isScrolling) {

                let $next = $active.next(),
                    $prev = $active.prev();

                if (scroll - scrollPrev > 200 && $next.length > 0) {
                    scrollSlider(sliderOffset + verticalHeight * $next.index(), $active, $next);
                } else if (scroll - scrollPrev < -200 && $prev.length > 0) {
                    scrollSlider(sliderOffset + verticalHeight * $prev.index(), $active, $prev);
                }
            }
        })
    });

    function scrollSlider(range, $active, $slide) {
        isScrolling = true;
        $active.removeClass("slide-active");
        $slide.addClass("slide-active");
        $("html").animate({
            scrollTop: range
        }, 1000, "linear", function () {
            isScrolling = false;
            scrollPrev = range;
        });
    }
});
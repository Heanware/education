$(window).on("load", function () {
    let effect = new Rellax(".rellax-img", {speed: 3});
})
$(window).on("scroll", function () {
    let $videos = $(".js-wider");
    let $scroll = $(this).scrollTop();
    let $scrollBarWidth = window.innerWidth - $(window).width();

    $videos.each(function () {
        let $videos = $(this);
        let $offset = $videos.offset().top;
        let width = 1920 - $scrollBarWidth;
        let $video = $videos.children();
        if ($scroll > $offset - 300) {
            $video.css("max-width", width + "px");
        } else {
            $video.css("max-width", "1800px");
        }
    });

    let $sliderContainer = $(".js-slider");
    $sliderContainer.each(function () {
        let $verticalH = $(window).height();
        let $container = $(this);
        let $slides = $container.find(".slider");
        let $parentOffset = $container.offset().top;
        let $sliderOffset = $slides.offset().top;
        let containerScroll = $sliderOffset - $parentOffset;
        let slidesPassed = Math.floor(containerScroll / $verticalH);
        let $next = $slides.children().eq(parseInt(slidesPassed));
        if (!$next.hasClass("slide-active")) {
            let $active = $slides.find(".slide-active");
            $active.removeClass("slide-active");
            $next.addClass("slide-active");
            $("html").animate({
                scrollTop: parseInt($parentOffset + $verticalH * slidesPassed)
            }, 900, "linear")
        }
    });
});
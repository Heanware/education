$(window).on("load", function () {
    let effect = new Rellax(".rellax-img", {speed: 3});
    /*  let $sliders = $(".slider");
      $sliders.each(function () {
          $(this).on("wheel", function () {
              let $child = $(this).children();
              let $active = $child.filter(".slide-active");
              let $next = $active.next();
              $active.removeClass("slide-active");
              $next.addClass("slide-active");
          });
      });*/
})
$(window).on("scroll", function () { /* везде где используется в переборе this заменить на elem */
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
            $("html, body").animate({
                scrollTop: parseInt($parentOffset + $verticalH * slidesPassed + ($verticalH/4))
            }, 900, "linear" )
        }
    });
});
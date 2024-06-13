document.addEventListener("DOMContentLoaded", () => {
	const catalogCarousel = document.querySelectorAll(".config__slider");

	if (catalogCarousel.length > 0) {
		catalogCarousel.forEach(elem => {
			const catalogNext = elem.querySelector(".config__nav .config__btn--next");
			const catalogPrev = elem.querySelector(".config__nav .config__btn--prev");

			const slider = new Swiper(elem, {
				slidesPerView: 1.23,
				spaceBetween: 16,
				centeredSlides: true,
				initialSlide: 1,
				loop: true,
				navigation: {
					nextEl: catalogNext,
					prevEl: catalogPrev,
				},
				pagination: {
					el: ".config__pagination",
					clickable: true,
				},
				on: {
					init: function (swiper) {
						swiper.el.querySelector(".config__nav").style.width = swiper.slides[0].swiperSlideSize + "px";
					},
				},
				breakpoints: {
					768: {
						slidesPerView: 1.3,
						spaceBetween: 120,
					},
					1440: {
						slidesPerView: 1.711,
						spaceBetween: 100,
					}
				}
			});
		});
	}
});

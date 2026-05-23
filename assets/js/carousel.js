(function () {

  let initialized = false;

  document.addEventListener("event:data:ready", () => {

    if (initialized) return;

    initialized = true;

    let index = 0;

    const track = document.querySelector(".carousel-track");

    const btnLeft = document.querySelector(".carousel-btn.left");

    const btnRight = document.querySelector(".carousel-btn.right");

    if (!track || !btnLeft || !btnRight) return;

    function getSlides() {

      return track.querySelectorAll(".carousel-img");

    }

    function updateCarousel() {

      const slides = getSlides();

      if (!slides.length) return;

      track.style.transform = `translateX(-${index * 100}%)`;

    }

    btnRight.addEventListener("click", () => {

      const slides = getSlides();

      if (!slides.length) return;

      index = (index + 1) % slides.length;

      updateCarousel();

    });

    btnLeft.addEventListener("click", () => {

      const slides = getSlides();

      if (!slides.length) return;

      index = (index - 1 + slides.length) % slides.length;

      updateCarousel();

    });

    /* estado inicial */

    index = 0;

    updateCarousel();

    /* ================= LIGHTBOX ================= */

    /* ================= LIGHTBOX ================= */

    getSlides().forEach((img, imgIndex) => {

      img.addEventListener("click", () => {

        const slides = getSlides();

        let currentIndex = imgIndex;

        const overlay = document.createElement("div");

        overlay.className = "lightbox";

        function renderImage() {

          overlay.innerHTML = `

        <button class="lightbox-close">✕</button>

        <button class="lightbox-nav left">‹</button>

        <img src="${slides[currentIndex].src}" alt="">

        <button class="lightbox-nav right">›</button>

      `;

          /* cerrar */

          overlay.querySelector(".lightbox-close")
            .addEventListener("click", (e) => {

              e.stopPropagation();

              overlay.remove();

            });

          /* anterior */

          overlay.querySelector(".lightbox-nav.left")
            .addEventListener("click", (e) => {

              e.stopPropagation();

              currentIndex =
                (currentIndex - 1 + slides.length) % slides.length;

              renderImage();

            });

          /* siguiente */

          overlay.querySelector(".lightbox-nav.right")
            .addEventListener("click", (e) => {

              e.stopPropagation();

              currentIndex =
                (currentIndex + 1) % slides.length;

              renderImage();

            });

        }

        renderImage();

        document.body.appendChild(overlay);

        /* click afuera */

        overlay.addEventListener("click", () => {

          overlay.remove();

        });

      });

    });

  });

})();
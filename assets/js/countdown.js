(function () {

  let initialized = false;

  document.addEventListener("event:data:ready", () => {

    if (initialized) return;
    initialized = true;

    const data = window.__EVENT_DATA__;

    if (!data?.evento?.fecha) return;

    const targetDate = new Date(data.evento.fecha).getTime();

    const diasEl = document.getElementById("dias");
    const horasEl = document.getElementById("horas");
    const minutosEl = document.getElementById("minutos");
    const segundosEl = document.getElementById("segundos");

    if (
      !diasEl ||
      !horasEl ||
      !minutosEl ||
      !segundosEl
    ) return;

    function updateCountdown() {

      const now = new Date().getTime();

      const distance = targetDate - now;

      if (distance <= 0) {

        diasEl.textContent = "00";
        horasEl.textContent = "00";
        minutosEl.textContent = "00";
        segundosEl.textContent = "00";

        return;
      }

      const dias =
        Math.floor(distance / (1000 * 60 * 60 * 24));

      const horas =
        Math.floor(
          (distance % (1000 * 60 * 60 * 24))
          / (1000 * 60 * 60)
        );

      const minutos =
        Math.floor(
          (distance % (1000 * 60 * 60))
          / (1000 * 60)
        );

      const segundos =
        Math.floor(
          (distance % (1000 * 60))
          / 1000
        );

      diasEl.textContent =
        String(dias).padStart(2, "0");

      horasEl.textContent =
        String(horas).padStart(2, "0");

      minutosEl.textContent =
        String(minutos).padStart(2, "0");

      segundosEl.textContent =
        String(segundos).padStart(2, "0");
    }

    updateCountdown();

    setInterval(updateCountdown, 1000);

  });

})();
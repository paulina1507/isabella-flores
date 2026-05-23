fetch("assets/js/evento.json")
  .then((res) => res.json())
  .then((data) => {
    window.__EVENT_DATA__ = data; // 👈 AGREGAR ESTA LÍNEA

    // ================= INVITADO (API o DEMO) =================
    const invitadoDemo = {
      nombre: "Familia Pérez",
      pases: 4,
      mesa: 8,
    };

    // Si la API ya definió __INVITADO__, se usa.
    // Si no, usamos el demo.
    window.__INVITADO__ = window.__INVITADO__ ?? invitadoDemo;

    /* ================= INVITADO ================= */

    document.querySelectorAll(".rsvp-guest-name").forEach((el) => {
      el.textContent = window.__INVITADO__.nombre || "";
    });
    /* ================= 🔧 HELPERS ================= */

    const isEnabled = (obj) => obj?.enabled !== false;

    const removeSection = (id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el && value !== undefined && value !== null) {
        el.textContent = value;
      }
    };

    const setHTML = (id, value) => {
      const el = document.getElementById(id);
      if (el && value !== undefined && value !== null) {
        el.innerHTML = value;
      }
    };

    /* ================= META ================= */

    if (data.meta?.title) document.title = data.meta.title;
    if (data.meta?.lang) document.documentElement.lang = data.meta.lang;

    if (data.meta?.favicon) {
      let link =
        document.querySelector("link[rel='icon']") ||
        document.createElement("link");
      link.rel = "icon";
      link.href = `assets/img/${data.meta.favicon}`;
      document.head.appendChild(link);
    }

    /* ================= LOGO ================= */

    const logoEl = document.querySelector(".logo");
    if (logoEl && data.logo?.type === "text") {
      logoEl.textContent = data.logo.value;
    }

    /* ================= AUDIO ================= */

    const audio = document.getElementById("bgSong");
    const musicToggle = document.getElementById("musicToggle");
    const musicIcon = document.getElementById("musicIcon");

    if (audio && isEnabled(data.audio)) {
      audio.src = `assets/audio/${data.audio.src}`;
      audio.loop = data.audio.loop ?? true;
      audio.volume = data.audio.volume ?? 1;

      if (musicIcon && data.audio.icons?.play) {
        musicIcon.src = `assets/img/${data.audio.icons.play}`;
      }


    }

    /* ================= NAVBAR ================= */

    const navMenu = document.getElementById("navMenu");

    if (navMenu && isEnabled(data.navbar)) {
      navMenu.innerHTML = "";

      data.navbar.items.forEach((item) => {
        if (!item.href || !item.label) return;

        const targetId = item.href.replace("#", "");
        if (data[targetId]?.enabled === false) return;

        navMenu.insertAdjacentHTML(
          "beforeend",
          `<li><a href="${item.href}">${item.label}</a></li>`,
        );
      });
    }

    /* ================= HERO ================= */

    if (isEnabled(data.hero)) {

      const hero = data.hero;

      const heroNamesEl = document.getElementById("hero-names");

      if (hero.names?.festejada) {

        const nombre = hero.names.festejada;

        heroNamesEl.innerHTML = `
      <span>${nombre}</span>
    `;

        const inviteName = document.getElementById("invite-name");

        if (inviteName) {
          inviteName.innerHTML = `
        <span>${nombre}</span>
      `;
        }

      } else if (hero.names?.novia && hero.names?.novio) {

        heroNamesEl.textContent = `${hero.names.novia} & ${hero.names.novio}`;
      }

      const heroBg = document.querySelector(".hero-bg");
      if (heroBg && data.media?.hero_background) {
        heroBg.style.backgroundImage = `url('assets/img/${data.media.hero_background}')`;
      }

      const labels = hero.countdown_labels;
      if (labels) {
        setText("label-dias", labels.dias);
        setText("label-horas", labels.horas);
        setText("label-minutos", labels.minutos);
        setText("label-segundos", labels.segundos || "Segundos");
      }
    } else {
      removeSection("inicio");
    }

    /* ================= INTRO MUSICAL ================= */

    if (isEnabled(data.intro_musical)) {

      const intro = data.intro_musical;

      setText(
        "intro-musical-title",
        intro.title
      );

      setText(
        "intro-musical-subtitle",
        intro.subtitle
      );

      const message =
        document.getElementById(
          "intro-musical-message"
        );

      if (message && intro.message?.length) {

        message.innerHTML = intro.message
          .map(text => `<p>${text}</p>`)
          .join("");

      }

      const audio =
        document.getElementById("bgSong");

      const playBtn =
        document.getElementById("introPlayBtn");

      const playIcon =
        document.getElementById("introPlayIcon");

      const progress =
        document.getElementById("introProgress");

      if (
        audio &&
        playBtn &&
        playIcon &&
        progress
      ) {

        let isPlaying = false;

        playBtn.addEventListener("click", async () => {

          try {

            if (!isPlaying) {

              await audio.play();

              isPlaying = true;

              playIcon.src =
                "assets/img/pause.png";

            } else {

              audio.pause();

              isPlaying = false;

              playIcon.src =
                "assets/img/play.png";

            }

          } catch (err) {

            console.log(
              "Error audio:",
              err
            );

          }

        });

        audio.addEventListener("timeupdate", () => {

          if (!audio.duration) return;

          progress.value =
            (audio.currentTime / audio.duration) * 100;

        });

        progress.addEventListener("input", () => {

          if (!audio.duration) return;

          audio.currentTime =
            (progress.value / 100) * audio.duration;

        });

        audio.addEventListener("ended", () => {

          isPlaying = false;

          playIcon.src =
            "assets/img/play.png";

          progress.value = 0;

        });

      }

    } else {

      removeSection("intro-musical");

    }
    /* ================= PRESENTACIÓN ================= */

    if (isEnabled(data.presentacion)) {
      const p = data.presentacion;

      setText("titulo-presentacion", p.titulo);
      setText("nombres-presentacion", p.nombres);
      setText("frase-presentacion", p.frase);

      const padresNoviaEl = document.getElementById("padres-novia");
      const padresNovioEl = document.getElementById("padres-novio");

      const labelPadresNoviaEl = document.getElementById("label-padres-novia");
      const labelPadresNovioEl = document.getElementById("label-padres-novio");

      /* ===== XV ===== */
      if (p.padres?.festejada) {
        setHTML("padres-novia", p.padres.festejada.join("<br>"));
        setText("label-padres-novia", p.labels?.padres || "Mis Padres");

        padresNovioEl?.closest(".arco-grupo")?.remove();

        if (p.padrinos?.length) {
          setHTML("padrinos", p.padrinos.join("<br>"));
          setText("label-padrinos", p.labels?.padrinos || "Mis Padrinos");
        }
      } else {
        /* ===== BODA ===== */
        setHTML("padres-novia", p.padres?.novia?.join("<br>") || "");
        setHTML("padres-novio", p.padres?.novio?.join("<br>") || "");

        setText("label-padres-novia", p.labels?.padres_novia || "");
        setText("label-padres-novio", p.labels?.padres_novio || "");
      }

      setText("texto-final-presentacion", p.texto_final || "");

      /* ================= PERGAMINO ================= */

      setText(
        "pergamino-name",
        p.nombres || ""
      );

      setText(
        "pergamino-padres-label",
        p.labels?.padres || "Mis Padres"
      );

      setHTML(
        "pergamino-padres",
        p.padres?.festejada?.join("<br>") || ""
      );

      setText(
        "pergamino-padrinos-label",
        p.labels?.padrinos || "Mis Padrinos"
      );

      setHTML(
        "pergamino-padrinos",
        p.padrinos?.join("<br>") || ""
      );

      const img = document.querySelector(".arco-img img");
      if (img && data.media?.presentacion) {
        img.src = `assets/img/${data.media.presentacion}`;
      }
    } else {
      removeSection("presentacion");
    }

    /* ================= UBICACIÓN ================= */

    if (isEnabled(data.ubicacion)) {
      const u = data.ubicacion;
      setText("ubicacion-titulo", u.titulo);

      const fechaGeneralEl = document.getElementById("ubicacion-fecha-general");

      if (fechaGeneralEl && data.evento?.fecha) {
        const fecha = new Date(data.evento.fecha);

        const dia = fecha.toLocaleDateString("es-MX", {
          weekday: "long",
        });

        const fechaBonita = fecha.toLocaleDateString("es-MX", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const hora = fecha.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        });

        fechaGeneralEl.innerHTML = `

<div class="fecha-title">
  mis XV años
</div>

<div class="fecha-wrapper">

  <div class="fecha-top">
    ${dia}
  </div>

  <div class="fecha-line"></div>

  <div class="fecha-center">

    <div class="fecha-month">
      ${fecha.toLocaleDateString("es-MX", {
          month: "long",
        })}
    </div>

    <div class="fecha-dia">
      ${fecha.getDate()}
    </div>

  </div>

  <div class="fecha-line"></div>

  <div class="fecha-year">
    ${fecha.getFullYear()}
  </div>

</div>
`;
      }

      const lista = document.getElementById("ubicacion-lista");
      lista.innerHTML = "";

      u.lugares
        .filter((l) => isEnabled(l) && l.lugar && l.hora)
        .forEach((lugar) => {

          lista.insertAdjacentHTML(
            "beforeend",
            `
<div class="ubicacion-card reveal">

  <div class="ubicacion-img-wrap">

    <img
      src="assets/img/${lugar.imagen}"
      class="ubicacion-img"
    >

  </div>

  <div class="ubicacion-body">

    <div class="ubicacion-subtitle">
      ${lugar.tipo}
    </div>

    <div class="ubicacion-lugar">
      ${lugar.lugar}
    </div>

    <div class="ubicacion-hora">
      ${lugar.hora}
    </div>

    ${lugar.mapa
              ? `
      <a
        href="${lugar.mapa}"
        target="_blank"
        class="btn-ubicacion"
      >
        Ver ubicación
      </a>
      `
              : ""
            }

  </div>

</div>
`
          );

        });
    } else {
      removeSection("ubicacion");
    }

    /* ================= PROGRAMA ================= */

    if (isEnabled(data.programa)) {
      const programa = data.programa;
      setText("programa-titulo", programa.titulo);

      const timeline = document.getElementById("timeline-programa");
      timeline.innerHTML = "";

      programa.items.forEach((item, index) => {
        const lado = index % 2 === 0 ? "left" : "right";

        timeline.insertAdjacentHTML(
          "beforeend",
          `
        <div class="item ${lado} reveal reveal-${lado}">
          
          <img
            class="icon"
            src="assets/img/${item.icono}"
          >

          <div class="hora">
            ${item.hora}
          </div>

          <div class="texto">
            ${item.texto}
          </div>

        </div>
        `,
        );
      });
    } else {
      removeSection("programa");
    }

    /* ================= VESTIMENTA ================= */

    if (isEnabled(data.vestimenta)) {
      const v = data.vestimenta;
      setText("vestimenta-titulo", v.titulo);

      const icon = document.getElementById("vestimenta-icon");
      if (icon && data.media?.vestimenta_icon) {
        icon.src = `assets/img/${data.media.vestimenta_icon}`;
      }

      setText("vestimenta-formal", v.formal);
      setHTML("vestimenta-mujeres", v.mujeres);
      setHTML("vestimenta-hombres", v.hombres);
    } else {
      removeSection("vestimenta");
    }

    /* ================= REGALOS ================= */

    if (isEnabled(data.regalos)) {
      const r = data.regalos;
      setText("regalos-titulo", r.titulo);
      setHTML("regalos-desc", r.descripcion);

      const cont = document.getElementById("regalos-inner");
      cont.innerHTML = "";

      r.items.forEach((item) => {
        cont.insertAdjacentHTML(
          "beforeend",
          `
          <div class="regalo-item reveal">
          <img src="assets/img/${item.icono}" class="regalo-icon">
            <p class="regalo-label">${item.label}</p>
          </div>
        `,
        );
      });
    } else {
      removeSection("regalos");
    }

    /* ================= GALERÍA ================= */

    if (isEnabled(data.galeria)) {
      const g = data.galeria;
      setText("galeria-titulo", g.titulo);

      const track = document.getElementById("carousel-track");
      track.innerHTML = "";

      (data.media?.galeria || []).forEach((img) => {
        track.insertAdjacentHTML(
          "beforeend",
          `<img src="assets/img/${img}" class="carousel-img"> `,
        );
      });
    } else {
      removeSection("galeria");
    }

    /* ================= RSVP ================= */

    if (isEnabled(data.rsvp)) {
      const rsvp = data.rsvp;
      const form = document.getElementById("rsvp-form");

      if (form) {
        setText("rsvp-form-title", rsvp.titulo || "");
        const textEl = form.querySelector(".rsvp-text");

        if (textEl) {
          textEl.innerHTML = rsvp.texto || "";
        } let nota = rsvp.nota || "";

        if (rsvp.fecha_limite) {
          const fecha = new Date(rsvp.fecha_limite);

          const fechaBonita = fecha.toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          nota = nota.replace("{{fecha_limite}}", fechaBonita);
        }

        const noteEl = form.querySelector(".rsvp-note");

        if (noteEl) {
          noteEl.innerHTML = nota;
        }

        const yesBtn = form.querySelector(".rsvp-btn.yes");
        const noBtn = form.querySelector(".rsvp-btn.no");

        if (yesBtn) {
          yesBtn.textContent = rsvp.botones?.si || "";
        }

        if (noBtn) {
          noBtn.textContent = rsvp.botones?.no || "";
        }
      }

      const passLabel = document.getElementById("rsvpPassLabel");
      const passValue = document.getElementById("rsvpPassValue");
      const tableLabel = document.getElementById("rsvpTableLabel");
      const tableValue = document.getElementById("rsvpTableValue");

      if (rsvp.pase?.enabled !== false && passLabel && passValue) {
        passLabel.textContent = rsvp.pase.label || "Pase para";
        passValue.textContent = `${window.__INVITADO__.pases ?? rsvp.pase.cantidad ?? 0} personas`;
      } else {
        passLabel?.closest(".rsvp-pass-item")?.remove();
      }

      if (rsvp.mesa?.enabled !== false && tableLabel && tableValue) {
        tableLabel.textContent = rsvp.mesa.label || "Mesa asignada";
        tableValue.textContent = `Mesa ${window.__INVITADO__.mesa ?? rsvp.mesa.numero ?? "-"}`;
      } else {
        tableLabel?.closest(".rsvp-pass-item")?.remove();
      }

      const passInfo = document.querySelector(".rsvp-pass-info");
      if (passInfo && !rsvp.pase?.enabled && !rsvp.mesa?.enabled) {
        passInfo.remove();
      }

      const rsvpNames = document.getElementById("rsvp-names");
      const rsvpFinalTitle = document.getElementById("rsvp-final-title");
      const rsvpFinalText = document.getElementById("rsvp-final-text");

      if (rsvp.final) {
        if (rsvpFinalTitle)
          rsvpFinalTitle.textContent = rsvp.final.titulo || "";
        if (rsvpFinalText) rsvpFinalText.textContent = rsvp.final.texto || "";
        if (rsvpNames) rsvpNames.textContent = rsvp.final.firma || "";
      }
    } else {
      removeSection("rsvp");
    }

    /* ================= FOOTER ================= */

    if (data.footer?.enabled !== false) {
      const footer = document.getElementById("footer-text");
      if (footer && data.footer?.text) {
        footer.innerHTML = data.footer.text;
      }
    }

    /* ================= EDITORIAL TEXTS ================= */

    applyEditorialTexts(data.editorial);

    /* ================= EVENT READY ================= */

    document.dispatchEvent(new Event("event:data:ready"));
    window.refreshScrollAnimations?.();
  })
  .catch((err) => {
    console.error("Error cargando evento.json:", err);
  });

/* ================= EDITORIAL ENGINE ================= */

function applyEditorialTexts(editorial) {
  if (!editorial) return;

  document.querySelectorAll("[data-editorial]").forEach((el) => {
    const key = el.dataset.editorial;
    const cfg = editorial[key];

    if (!cfg || !cfg.enabled || !cfg.text) {
      el.remove();
      return;
    }

    el.textContent = cfg.text;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
  });
}

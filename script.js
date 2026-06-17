document.addEventListener("DOMContentLoaded", function () {
  // 1. ANIMASI SCROLL REVEAL (Dioptimalkan)
  const scrollElements = document.querySelectorAll(".scroll-reveal");

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <=
      (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const displayScrollElement = (element) => {
    element.classList.add("visible");
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.15)) {
        displayScrollElement(el);
      }
    });
  };

  window.addEventListener("scroll", () => {
    handleScrollAnimation();
  });

  handleScrollAnimation();

  // 2. LOGIKA EFEK MENGETIK JAVASCRIPT
  const txtType = document.querySelector(".txt-type");

  if (txtType) {
    const words = JSON.parse(txtType.getAttribute("data-words"));
    const wait = parseInt(txtType.getAttribute("data-wait"), 10);

    let txt = "";
    let wordIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const current = wordIndex % words.length;
      const fullTxt = words[current];

      if (isDeleting) {
        txt = fullTxt.substring(0, txt.length - 1);
      } else {
        txt = fullTxt.substring(0, txt.length + 1);
      }

      txtType.innerHTML = txt;

      let typeSpeed = 150 - Math.random() * 50;

      if (isDeleting) {
        typeSpeed /= 2;
      }

      if (!isDeleting && txt === fullTxt) {
        typeSpeed = wait;
        isDeleting = true;
      } else if (isDeleting && txt === "") {
        isDeleting = false;
        wordIndex++;
        typeSpeed = 500;
      }

      setTimeout(() => typeEffect(), typeSpeed);
    }

    typeEffect();
  }

  // ==========================================
  // 3. AUDIO BACKGROUND MUSIC ENGINE & FADE CONTROL
  // ==========================================
  const bgm = document.getElementById("bgm");
  const musicBtn = document.getElementById("music-control");
  const musicIcon = document.getElementById("music-icon");

  function playMusicAudio() {
    if (!bgm) return;
    bgm
      .play()
      .then(() => {
        if (musicIcon && musicBtn) {
          musicIcon.innerText = "⏸️";
          musicBtn.classList.add("playing");
        }
      })
      .catch((error) => {
        console.log("Autoplay diblokir browser, menunggu interaksi pengguna.");
      });
  }

  window.toggleMusic = function () {
    if (!bgm) return;
    if (bgm.paused) {
      playMusicAudio();
    } else {
      bgm.pause();
      if (musicIcon && musicBtn) {
        musicIcon.innerText = "🎵";
        musicBtn.classList.remove("playing");
      }
    }
  };

  const pemicuAutoplay = () => {
    if (bgm && bgm.paused) {
      playMusicAudio();
    }
    document.removeEventListener("click", pemicuAutoplay);
    document.removeEventListener("touchstart", pemicuAutoplay);
  };
  document.addEventListener("click", pemicuAutoplay);
  document.addEventListener("touchstart", pemicuAutoplay);

  // Fungsi Transisi Audio (Fade-out -> Ganti Track -> Fade-in)
  function switchAudioSmoothly(newSrc) {
    if (!bgm) return;

    let vol = bgm.volume;
    const fadeOut = setInterval(() => {
      if (vol > 0.1) {
        vol -= 0.1;
        bgm.volume = vol;
      } else {
        clearInterval(fadeOut);
        bgm.pause();
        bgm.src = newSrc;
        bgm.load();
        bgm.volume = 0;

        bgm
          .play()
          .then(() => {
            if (
              musicIcon &&
              musicBtn &&
              !musicBtn.classList.contains("playing")
            ) {
              musicIcon.innerText = "⏸️";
              musicBtn.classList.add("playing");
            }
            let fadeInVol = 0;
            const fadeIn = setInterval(() => {
              if (fadeInVol < 0.9) {
                fadeInVol += 0.1;
                bgm.volume = fadeInVol;
              } else {
                clearInterval(fadeIn);
                bgm.volume = 1;
              }
            }, 150);
          })
          .catch((e) =>
            console.log("Menunggu interaksi user untuk ganti trek..."),
          );
      }
    }, 80);
  }

  // ==========================================
  // 4. LOGIKA MINI TERMINAL INTERACTIVE WIDGET
  // ==========================================
  const termToggleBtn = document.getElementById("term-toggle-btn");
  const miniTerminal = document.getElementById("mini-terminal");
  const termInput = document.getElementById("term-input");
  const termResponse = document.getElementById("term-response");
  let currentTheme = "default";

  if (termToggleBtn && miniTerminal) {
    termToggleBtn.addEventListener("click", () => {
      miniTerminal.classList.toggle("open");
      if (miniTerminal.classList.contains("open")) {
        setTimeout(() => termInput.focus(), 150);
      }
    });
  }

  if (termInput) {
    termInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const command = this.value.trim().toLowerCase();

        if (command === "make themes frappe" && currentTheme !== "frappe") {
          termResponse.innerHTML =
            "[Success]: Frappé theme applied! ☕<br>[Audio]: Switching to Retro Vibes...";
          termResponse.className = "term-success";
          document.body.classList.add("theme-frappe");
          currentTheme = "frappe";

          // Putar musik retro
          switchAudioSmoothly("audio/bgm-retro.mp3");

          setTimeout(() => {
            miniTerminal.classList.remove("open");
            this.value = "";
            termResponse.innerHTML = "";
          }, 3500);
        } else if (
          command === "make themes default" &&
          currentTheme !== "default"
        ) {
          document.body.classList.remove("theme-frappe");
          termResponse.innerHTML = "[Success]: Theme restored to Default 🍃";
          termResponse.className = "term-success";
          currentTheme = "default";

          // Kembalikan musik santai
          switchAudioSmoothly("audio/bgm-santai.mp3");

          setTimeout(() => {
            miniTerminal.classList.remove("open");
            this.value = "";
            termResponse.innerHTML = "";
          }, 2000);
        } else if (command === "") {
          termResponse.innerHTML = "";
        } else {
          termResponse.innerHTML = `[Error]: Command '${command}' not recognized.`;
          termResponse.className = "term-error";
        }

        if (
          command === "make themes frappe" ||
          command === "make themes default"
        ) {
          this.value = "";
        }
      }
    });
  }
});

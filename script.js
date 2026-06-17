document.addEventListener("DOMContentLoaded", function () {
  // 1. ANIMASI SCROLL REVEAL (Bawaan awal)
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

      let typeSpeed = 150;

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
  // LOGIKA UTAMA: BGM AUDIO ENGINE (DIPINDAHKAN KE DALAM DOM LOADED)
  // ==========================================
  const bgm = document.getElementById("bgm");
  const musicBtn = document.getElementById("music-control");
  const musicIcon = document.getElementById("music-icon");

  // Fungsi Internal untuk Memutar Audio & Mengubah Visual Tombol
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
        console.log(
          "Autoplay diblokir browser, menunggu interaksi pertama pengguna...",
        );
      });
  }

  // Fungsi Global untuk Tombol On/Off saat Diklik Manual (Ditempel ke window object agar HTML bisa membaca)
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

  // Trik Autoplay: Paksa Musik Berputar Begitu Mendeteksi Interaksi Pertama Pengguna
  const pemicuAutoplay = () => {
    if (bgm && bgm.paused) {
      playMusicAudio();
    }
    document.removeEventListener("click", pemicuAutoplay);
    document.removeEventListener("touchstart", pemicuAutoplay);
  };

  // Daftarkan event klik global begitu DOM siap
  document.addEventListener("click", pemicuAutoplay);
  document.addEventListener("touchstart", pemicuAutoplay);

  // ==========================================
  // LOGIKA MINI TERMINAL & EASTER EGG FRAPPÉ
  // ==========================================
  const termToggleBtn = document.getElementById("term-toggle-btn");
  const miniTerminal = document.getElementById("mini-terminal");
  const termInput = document.getElementById("term-input");
  const termResponse = document.getElementById("term-response");
  let currentTheme = "default";

  // Buka / Tutup Terminal
  if (termToggleBtn && miniTerminal) {
    termToggleBtn.addEventListener("click", () => {
      miniTerminal.classList.toggle("open");
      if (miniTerminal.classList.contains("open")) {
        setTimeout(() => termInput.focus(), 100); // Fokus kursor otomatis
      }
    });
  }

  // Fungsi Transisi Audio (Fade-out lagu lama -> Fade-in lagu baru)
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
            // Pastikan ikon tombol musik berubah jadi pause
            if (
              musicIcon &&
              musicBtn &&
              !musicBtn.classList.contains("playing")
            ) {
              musicIcon.innerText = "⏸️";
              musicBtn.classList.add("playing");
            }
            // Fade-in suara lagu baru
            let fadeInVol = 0;
            const fadeIn = setInterval(() => {
              if (fadeInVol < 0.9) {
                fadeInVol += 0.1;
                bgm.volume = fadeInVol;
              } else {
                clearInterval(fadeIn);
                bgm.volume = 1;
              }
            }, 200);
          })
          .catch((e) =>
            console.log("Menunggu interaksi untuk putar audio baru..."),
          );
      }
    }, 100);
  }

  // Deteksi Input Enter di Terminal
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

          // Ganti Audio ke Lagu Retro
          switchAudioSmoothly("audio/bgm-retro.mp3");

          // Tutup terminal otomatis setelah 3.5 detik
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

          // Balik ke lagu Yung Kai Blue / Santai
          switchAudioSmoothly("audio/bgm-santai.mp3");
        } else if (command === "") {
          termResponse.innerHTML = "";
        } else {
          termResponse.innerHTML = `[Error]: Command '${command}' not recognized.`;
          termResponse.className = "term-error";
        }

        // Kosongkan input setelah Enter jika bukan pesan error panjang
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

document.addEventListener("DOMContentLoaded", function() {
  
  // 1. ANIMASI SCROLL REVEAL (Bawaan awal)
  const scrollElements = document.querySelectorAll(".scroll-reveal");

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
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
  }

  window.addEventListener("scroll", () => {
    handleScrollAnimation();
  });
  
  handleScrollAnimation();


  // 2. LOGIKA EFEK MENGETIK JAVASCRIPT
  const txtType = document.querySelector('.txt-type');
  
  if (txtType) {
    const words = JSON.parse(txtType.getAttribute('data-words'));
    const wait = parseInt(txtType.getAttribute('data-wait'), 10);
    
    let txt = '';
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
      } else if (isDeleting && txt === '') {
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
  const bgm = document.getElementById('bgm');
  const musicBtn = document.getElementById('music-control');
  const musicIcon = document.getElementById('music-icon');

  // Fungsi Internal untuk Memutar Audio & Mengubah Visual Tombol
  function playMusicAudio() {
    if (!bgm) return; 
    bgm.play().then(() => {
      if (musicIcon && musicBtn) {
        musicIcon.innerText = '⏸️'; 
        musicBtn.classList.add('playing'); 
      }
    }).catch(error => {
      console.log("Autoplay diblokir browser, menunggu interaksi pertama pengguna...");
    });
  }

  // Fungsi Global untuk Tombol On/Off saat Diklik Manual (Ditempel ke window object agar HTML bisa membaca)
  window.toggleMusic = function() {
    if (!bgm) return;
    if (bgm.paused) {
      playMusicAudio();
    } else {
      bgm.pause();
      if (musicIcon && musicBtn) {
        musicIcon.innerText = '🎵'; 
        musicBtn.classList.remove('playing'); 
      }
    }
  }

  // Trik Autoplay: Paksa Musik Berputar Begitu Mendeteksi Interaksi Pertama Pengguna
  const pemicuAutoplay = () => {
    if (bgm && bgm.paused) {
      playMusicAudio();
    }
    document.removeEventListener('click', pemicuAutoplay);
    document.removeEventListener('touchstart', pemicuAutoplay);
  };

  // Daftarkan event klik global begitu DOM siap
  document.addEventListener('click', pemicuAutoplay);
  document.addEventListener('touchstart', pemicuAutoplay);

});

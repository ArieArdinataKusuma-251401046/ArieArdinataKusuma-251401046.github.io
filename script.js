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


  // 2. LOGIKA EFEK MENGETIK JAVASCRIPT (Tambahan Baru)
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

      // Tentukan apakah sedang mengetik atau menghapus huruf
      if (isDeleting) {
        txt = fullTxt.substring(0, txt.length - 1);
      } else {
        txt = fullTxt.substring(0, txt.length + 1);
      }

      // Masukkan teks ke dalam HTML
      txtType.innerHTML = txt;

      // Kecepatan ketik dasar (milidetik)
      let typeSpeed = 150;

      if (isDeleting) {
        typeSpeed /= 2; // Waktu menghapus dibuat lebih cepat
      }

      // Jika satu kata sudah selesai diketik penuh
      if (!isDeleting && txt === fullTxt) {
        typeSpeed = wait; // Berhenti sejenak (sesuai data-wait: 2 detik)
        isDeleting = true;
      } else if (isDeleting && txt === '') {
        isDeleting = false;
        wordIndex++; // Ganti ke kata berikutnya
        typeSpeed = 500; // Jeda sebelum mulai mengetik kata baru
      }

      setTimeout(() => typeEffect(), typeSpeed);
    }

    // Jalankan efek mengetik pertama kali
    typeEffect();
  }

});

// ==========================================
// LOGIKA GABUNGAN: AUTOPLAY & TOMBOL BGM
// ==========================================
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('music-control');
const musicIcon = document.getElementById('music-icon');

// 1. Fungsi Utama untuk Memutar Audio & Mengubah Visual Tombol
function playMusicAudio() {
  bgm.play().then(() => {
    if (musicIcon && musicBtn) {
      musicIcon.innerText = '⏸️'; // Ubah jadi ikon Pause
      musicBtn.classList.add('playing'); // Jalankan animasi berputar
    }
  }).catch(error => {
    console.log("Autoplay diblokir browser, menunggu interaksi pertama pengguna...");
  });
}

// 2. Fungsi untuk Tombol On/Off saat Diklik Manual oleh Pengunjung
function toggleMusic() {
  if (bgm.paused) {
    playMusicAudio();
  } else {
    bgm.pause();
    musicIcon.innerText = '🎵'; // Kembalikan jadi ikon Balok Musik
    musicBtn.classList.remove('playing'); // Hentikan animasi berputar
  }
}

// 3. Trik Autoplay: Paksa Musik Berputar Begitu Mendeteksi Klik Pertama di Area Mana Saja
const pemicuAutoplay = () => {
  if (bgm.paused) {
    playMusicAudio();
  }
  // Langsung hapus event listener ini setelah sukses berjalan 1 kali
  document.removeEventListener('click', pemicuAutoplay);
  document.removeEventListener('touchstart', pemicuAutoplay);
};

// Daftarkan event klik global ke browser
document.addEventListener('click', pemicuAutoplay);
document.addEventListener('touchstart', pemicuAutoplay);

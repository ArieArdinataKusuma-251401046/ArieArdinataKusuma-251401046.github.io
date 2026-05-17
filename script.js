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

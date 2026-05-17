// Menggunakan Intersection Observer untuk efek scroll modern
document.addEventListener("DOMContentLoaded", function() {
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

  // Trigger animasi saat scroll
  window.addEventListener("scroll", () => {
    handleScrollAnimation();
  });
  
  // Memeriksa elemen yang sudah terlihat saat halaman pertama kali dimuat
  handleScrollAnimation();
});
// WhatsApp contextual messages
(function () {
  const NUM = "5531982868343";
  const gerarLink = (msg) => `https://wa.me/${NUM}?text=${encodeURIComponent(msg)}`;

  const msgs = {
    "cta-navbar": "Olá, Dr. Guilherme Mol. Vim pelo seu site e gostaria de entender melhor como posso resolver meu caso.",
    "cta-mobile-nav": "Olá, Dr. Guilherme Mol. Vim pelo seu site e gostaria de entender melhor como posso resolver meu caso.",
    "cta-hero": "Olá, Dr. Guilherme Mol. Vim pelo seu site e gostaria de saber se ainda tenho direito ao meu benefício. Pode me orientar?",
    "cta-analise": "Dr. Guilherme Mol, tive um problema com meu benefício e preciso entender se tenho direito. Pode analisar meu caso?",
    "cta-faq": "Olá, Dr. Guilherme Mol. Ainda tenho algumas dúvidas e gostaria de falar diretamente com o senhor.",
    "cta-footer": "Dr. Guilherme Mol, quero entender minha situação e saber se ainda tenho direito. Pode me orientar?",
    "cta-fab": "Olá, Dr. Guilherme Mol. Gostaria de orientação jurídica."
  };

  Object.entries(msgs).forEach(([id, msg]) => {
    const el = document.getElementById(id);
    if (el) el.href = gerarLink(msg);
  });
})();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Smooth scroll for anchor links
const navbar = document.querySelector(".navbar");
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);

    if (target && navbar) {
      e.preventDefault();
      const navbarHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
      window.scrollTo({ top: targetPos, behavior: prefersReducedMotion ? "auto" : "smooth" });
      closeMobileNav();
    }
  });
});

// Mobile menu
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileNav = document.getElementById("mobile-nav");

function closeMobileNav() {
  if (!hamburgerBtn || !mobileNav) return;
  hamburgerBtn.classList.remove("is-open");
  hamburgerBtn.setAttribute("aria-expanded", "false");
  mobileNav.classList.remove("is-open");
  mobileNav.setAttribute("aria-hidden", "true");
}

if (hamburgerBtn && mobileNav) {
  hamburgerBtn.addEventListener("click", () => {
    const isOpen = hamburgerBtn.classList.toggle("is-open");
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
    mobileNav.classList.toggle("is-open", isOpen);
    mobileNav.setAttribute("aria-hidden", String(!isOpen));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNav();
  });

  document.addEventListener("click", (event) => {
    if (!mobileNav.classList.contains("is-open")) return;
    if (!mobileNav.contains(event.target) && !hamburgerBtn.contains(event.target)) {
      closeMobileNav();
    }
  });
}

// Carrossel da seção Sobre
(function () {
  const track = document.getElementById("sobreTrack");
  const dots = document.querySelectorAll("#sobreDots .carousel-dot");
  const prev = document.getElementById("sobrePrev");
  const next = document.getElementById("sobreNext");
  const carousel = document.querySelector(".sobre-carousel");

  if (!track || !dots.length || !prev || !next || !carousel) return;

  const total = dots.length;
  let current = 0;
  let timer;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      const active = i === current;
      d.classList.toggle("is-active", active);
      d.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  function startAutoPlay() {
    if (prefersReducedMotion) return;
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  function resetTimer() {
    clearInterval(timer);
    startAutoPlay();
  }

  prev.addEventListener("click", () => {
    goTo(current - 1);
    resetTimer();
  });

  next.addEventListener("click", () => {
    goTo(current + 1);
    resetTimer();
  });

  dots.forEach((dot, i) => dot.addEventListener("click", () => {
    goTo(i);
    resetTimer();
  }));

  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", startAutoPlay);

  goTo(0);
  startAutoPlay();
})();

// FAQ accordion
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    if (!item) return;
    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
      openItem.classList.remove("is-open");
      openItem.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});


// Lead form -> WhatsApp
(function () {
  const form = document.getElementById("lead-form");
  const feedback = document.getElementById("lead-feedback");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      feedback.textContent = "Revise os campos obrigatórios para continuar.";
      return;
    }

    const nome = document.getElementById("nome")?.value.trim();
    const assunto = document.getElementById("assunto")?.value.trim();
    const mensagem = document.getElementById("mensagem")?.value.trim();

    const texto = `Olá, Dr. Guilherme Mol. Meu nome é ${nome}.\nAssunto: ${assunto}.\nResumo: ${mensagem}`;
    const link = `https://wa.me/5531982868343?text=${encodeURIComponent(texto)}`;

    feedback.textContent = "Perfeito! Abrindo o WhatsApp...";
    window.open(link, "_blank", "noopener");
  });
})();

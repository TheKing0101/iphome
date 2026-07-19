/* ==========================================================================
   IPHOME Pizzaria Delivery — script.js
   Navbar fixa, menu mobile, scroll reveal, ano dinâmico e efeito de embers.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Ano dinâmico no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: muda de estilo ao rolar ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile (burger) ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.navbar__nav');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('is-open'));
    });
  }

  /* ---------- Scroll Reveal via IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = (index % 4) * 90;
          setTimeout(() => el.classList.add('is-visible'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Efeito de brasas/fumaça no Hero (canvas) ---------- */
  const canvas = document.getElementById('emberCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    let particles = [];
    let width, height;

    const resize = () => {
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['255,193,7', '193,18,31', '255,150,60'];

    function createParticle() {
      return {
        x: Math.random() * width,
        y: height + 10,
        radius: Math.random() * 2.2 + 0.6,
        speedY: Math.random() * 0.6 + 0.35,
        drift: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        flicker: Math.random() * 0.02 + 0.005
      };
    }

    const maxParticles = 55;
    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle();
      p.y = Math.random() * height;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.drift;
        p.opacity -= p.flicker * 0.15;

        if (p.y < -10 || p.opacity <= 0) {
          Object.assign(p, createParticle());
          p.y = height + 10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${Math.max(p.opacity, 0)})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

});

// =========================================================
// TITANIUM ARMY � FINAL GOD LEVEL ENGINE
// ULTRA SMOOTH + ZERO LAG + MOBILE SAFE
// CINEMATIC AAA PERFORMANCE SCRIPT
// =========================================================

(() => {

  "use strict";

  // =====================================================
  // DEVICE + PERFORMANCE DETECTION
  // =====================================================

  const html = document.documentElement;
  const body = document.body;

  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  const isMobile =
    window.innerWidth <= 768 || isTouch;

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const lowPowerDevice =
    navigator.hardwareConcurrency &&
    navigator.hardwareConcurrency <= 4;

  const allowHeavyEffects =
    !reduceMotion &&
    !lowPowerDevice;

  // =====================================================
  // PRELOADER
  // =====================================================

  const preloader = document.getElementById("preloader");

  if (preloader) {
    window.addEventListener("load", () => {
      preloader.classList.add("hidden");
    });

    setTimeout(() => {
      preloader.style.display = "none";
    }, 2600);
  }

  // =====================================================
  // RAF THROTTLE
  // =====================================================

  const rafThrottle = callback => {

    let ticking = false;

    return (...args) => {

      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {

        callback(...args);

        ticking = false;

      });

    };

  };

  // =====================================================
  // SMOOTH SCROLL
  // =====================================================

  const smoothLinks =
    document.querySelectorAll(
      "a[href^=\"#\"]"
    );

  smoothLinks.forEach(link => {

    link.addEventListener("click", e => {

      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) return;

      const target =
        document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      closeMobileMenu();

    });

  });

  // =====================================================
  // MOBILE MENU
  // =====================================================

  const navToggle =
    document.querySelector(".nav-toggle");

  const mobileNav =
    document.querySelector(".mobile-nav");

  let scrollPosition = 0;

  const openMobileMenu = () => {

    if (!mobileNav) return;

    scrollPosition = window.scrollY;

    body.style.position = "fixed";

    body.style.top = `-${ scrollPosition }px`;

    body.style.width = "100%";

    mobileNav.classList.add("open");

    if (navToggle) {
      navToggle.classList.add("active");
      navToggle.setAttribute("aria-expanded", "true");
    }

  };

  const closeMobileMenu = () => {

    if (!mobileNav) return;

    mobileNav.classList.remove("open");

    body.style.position = "";

    body.style.top = "";

    body.style.width = "";

    window.scrollTo(0, scrollPosition);

    if (navToggle) {
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    }

  };

  if (navToggle && mobileNav) {

    navToggle.addEventListener("click", e => {

      e.stopPropagation();

      mobileNav.classList.contains("open")
        ? closeMobileMenu()
        : openMobileMenu();

    });

    document.addEventListener("click", e => {

      if (
        !mobileNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }

    });

    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });

  }

  // =====================================================
  // HEADER EFFECT
  // =====================================================

  const header = document.querySelector(".site-header");

  const updateHeader = rafThrottle(() => {

    if (!header) return;

    header.classList.toggle(
      "header-active",
      window.scrollY > 40
    );

  });

  updateHeader();

  window.addEventListener("scroll", updateHeader, { passive: true });

  // =====================================================
  // REVEAL ANIMATION
  // =====================================================

  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length && !reduceMotion) {

    const revealObserver = new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("active");

            revealObserver.unobserve(entry.target);

          }

        });

      },

      {
        threshold: isMobile ? 0.08 : 0.15
      }

    );

    revealItems.forEach(el => {
      revealObserver.observe(el);
    });

  } else {

    revealItems.forEach(el => {
      el.classList.add("active");
    });

  }

  // =====================================================
  // COUNTER ANIMATION
  // =====================================================

  const counters = document.querySelectorAll(".counter");

  if (counters.length && !reduceMotion) {

    const counterObserver = new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          const counter = entry.target;

          const target = parseInt(counter.dataset.target) || 0;

          let current = 0;

          const increment = Math.max(1, target / 90);

          const update = () => {

            current += increment;

            if (current < target) {

              counter.textContent = Math.floor(current).toLocaleString();

              requestAnimationFrame(update);

            } else {

              counter.textContent = target.toLocaleString();

            }

          };

          update();

          counterObserver.unobserve(counter);

        });

      },

      { threshold: 0.4 }

    );

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });

  }

  // =====================================================
  // PARTICLES ENGINE
  // =====================================================

  if (allowHeavyEffects) {

    const canvas = document.getElementById("particles");

    if (canvas) {

      const ctx = canvas.getContext("2d", { alpha: true });

      let particles = [];

      const particleCount = isMobile ? 18 : 45;

      let animationId;

      const resizeCanvas = () => {

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = window.innerWidth * dpr;

        canvas.height = window.innerHeight * dpr;

        canvas.style.width = `${ window.innerWidth }px`;

        canvas.style.height = `${ window.innerHeight }px`;

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.scale(dpr, dpr);

      };

      resizeCanvas();

      class Particle {

        constructor() {
          this.reset();
        }

        reset() {

          this.x = Math.random() * window.innerWidth;

          this.y = Math.random() * window.innerHeight;

          this.size = Math.random() * 1.8 + 0.5;

          this.speedX = Math.random() * 0.3 - 0.15;

          this.speedY = Math.random() * 0.3 - 0.15;

        }

        update() {

          this.x += this.speedX;

          this.y += this.speedY;

          if (
            this.x < -10 ||
            this.x > window.innerWidth + 10 ||
            this.y < -10 ||
            this.y > window.innerHeight + 10
          ) {
            this.reset();
          }

        }

        draw() {

          ctx.beginPath();

          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

          ctx.fillStyle = "rgba(255,120,0,0.7)";

          ctx.fill();

        }

      }

      const initParticles = () => {

        particles = [];

        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle());
        }

      };

      initParticles();

      const animateParticles = () => {

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        particles.forEach(particle => {

          particle.update();

          particle.draw();

        });

        animationId = requestAnimationFrame(animateParticles);

      };

      animateParticles();

      document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
          cancelAnimationFrame(animationId);
        } else {
          animateParticles();
        }

      });

      window.addEventListener(
        "resize",
        rafThrottle(() => {
          resizeCanvas();
          initParticles();
        }),
        { passive: true }
      );

    }

  }

  // =====================================================
  // HERO PARALLAX
  // =====================================================

  if (allowHeavyEffects && !isMobile) {

    const heroContent = document.querySelector(".hero-content");

    if (heroContent) {

      heroContent.style.willChange = "transform";

      const updateParallax = rafThrottle(() => {

        heroContent.style.transform = `translate3d(0, ${ window.scrollY * 0.08 }px, 0)`;

      });

      window.addEventListener("scroll", updateParallax, { passive: true });

    }

  }

  // =====================================================
  // CARD TILT EFFECT
  // =====================================================

  if (allowHeavyEffects && !isMobile) {

    const cards = document.querySelectorAll(
      ".experiment-card, .gadget-box, .team-card"
    );

    cards.forEach(card => {

      card.style.transformStyle = "preserve-3d";

      card.style.willChange = "transform";

      card.addEventListener("mousemove", rafThrottle(e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 7;

        const rotateX = ((y / rect.height) - 0.5) * -7;

        card.style.transform = `perspective(1000px) rotateX(${ rotateX }deg) rotateY(${ rotateY }deg) translate3d(0,-6px,0)`;

      }));

      card.addEventListener("mouseleave", () => {

        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0,0,0)`;

      });

    });

  }

  // =====================================================
  // CUSTOM CURSOR
  // =====================================================

  // Always enable custom cursor on desktop (not mobile)
  const isDesktop = !isMobile && (window.matchMedia("(pointer:fine)").matches || window.matchMedia("(hover:hover)").matches);

  if (isDesktop) {

    const cursor = document.createElement("div");

    cursor.className = "custom-cursor";

    cursor.style.pointerEvents = "none";

    cursor.style.willChange = "transform";

    body.appendChild(cursor);

    body.classList.add("cursor-enabled");

    let isMouseDown = false;

    document.addEventListener(

      "mousemove",

      rafThrottle(e => {

        cursor.style.transform = `translate3d(${ e.clientX }px, ${ e.clientY }px, 0)`;

      }),

      { passive: true }

    );

    // Add click animation
    document.addEventListener("mousedown", () => {
      isMouseDown = true;
      cursor.classList.add("active");
    });

    document.addEventListener("mouseup", () => {
      isMouseDown = false;
      cursor.classList.remove("active");
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseout", () => {
      cursor.style.opacity = "0";
    });

    // Show cursor when entering window
    document.addEventListener("mouseover", () => {
      cursor.style.opacity = "1";
    });

  }

  // =====================================================
  // SCROLL PROGRESS BAR
  // =====================================================

  const progressBar = document.createElement("div");

  progressBar.className = "progress-bar";

  body.appendChild(progressBar);

  const updateProgress = rafThrottle(() => {

    const scrollHeight = html.scrollHeight - window.innerHeight;

    let progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;

    progress = Math.min(100, Math.max(0, progress));

    progressBar.style.width = `${ progress }%`;

  });

  updateProgress();

  window.addEventListener("scroll", updateProgress, { passive: true });

  // =====================================================
  // NEWSLETTER FORM
  // =====================================================

  const newsletterForm = document.querySelector("#newsletterForm");

  if (newsletterForm) {

    newsletterForm.addEventListener("submit", e => {

      e.preventDefault();

      const input = newsletterForm.querySelector("input");

      if (input && input.value.trim()) {

        alert("?? Welcome To Titanium Army! Check your email!");

        newsletterForm.reset();

      }

    });

  }

})();

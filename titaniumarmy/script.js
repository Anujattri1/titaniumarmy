(() => {
  "use strict";

  const html = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isMobile = window.innerWidth <= 768 || isTouch;
  const lowPowerDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const allowEffects = !reduceMotion && !lowPowerDevice;

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

  const preloader = document.getElementById("preloader");

  const hidePreloader = () => {
    if (!preloader || preloader.classList.contains("hidden")) return;
    preloader.classList.add("hidden");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 320);
  };

  if (preloader) {
    window.addEventListener("load", hidePreloader, { once: true });
    setTimeout(hidePreloader, 900);
  }

  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  let scrollPosition = 0;

  const openMobileMenu = () => {
    if (!mobileNav || !navToggle) return;

    scrollPosition = window.scrollY;
    body.style.position = "fixed";
    body.style.top = `-${scrollPosition}px`;
    body.style.width = "100%";

    mobileNav.classList.add("open");
    navToggle.classList.add("active");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  };

  const closeMobileMenu = () => {
    if (!mobileNav || !navToggle) return;

    mobileNav.classList.remove("open");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");

    body.style.position = "";
    body.style.top = "";
    body.style.width = "";
    window.scrollTo(0, scrollPosition);
  };

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", event => {
      event.stopPropagation();
      mobileNav.classList.contains("open") ? closeMobileMenu() : openMobileMenu();
    });

    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", event => {
      if (!mobileNav.classList.contains("open")) return;
      if (mobileNav.contains(event.target) || navToggle.contains(event.target)) return;
      closeMobileMenu();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMobileMenu();
    });
  }

  document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      closeMobileMenu();
    });
  });

  const header = document.querySelector(".site-header");
  const updateHeader = rafThrottle(() => {
    if (!header) return;
    header.classList.toggle("header-active", window.scrollY > 40);
  });

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  body.appendChild(progressBar);

  const updateProgress = rafThrottle(() => {
    const scrollHeight = html.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length && "IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: isMobile ? 0.08 : 0.15 });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("active"));
  }

  const counters = document.querySelectorAll(".counter");

  if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.target) || 0;
        const suffix = counter.dataset.suffix || "";
        const duration = 1100;
        const start = performance.now();

        const render = now => {
          const elapsed = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - elapsed, 3);
          const value = Math.round(target * eased);

          counter.textContent = `${value}${suffix}`;

          if (elapsed < 1) requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
        counterObserver.unobserve(counter);
      });
    }, { threshold: 0.35 });

    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(counter => {
      counter.textContent = `${counter.dataset.target || "0"}${counter.dataset.suffix || ""}`;
    });
  }

  if (allowEffects) {
    const canvas = document.getElementById("particles");

    if (canvas) {
      const ctx = canvas.getContext("2d", { alpha: true });
      const particleCount = isMobile ? 16 : 42;
      let particles = [];
      let animationId;

      const resizeCanvas = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      };

      const makeParticle = () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.7 + 0.5,
        speedX: Math.random() * 0.35 - 0.175,
        speedY: Math.random() * 0.35 - 0.175,
        color: Math.random() > 0.8 ? "rgba(61,214,208,.62)" : "rgba(255,120,0,.68)"
      });

      const resetParticles = () => {
        particles = Array.from({ length: particleCount }, makeParticle);
      };

      const animateParticles = () => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        particles.forEach(particle => {
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          if (
            particle.x < -10 ||
            particle.x > window.innerWidth + 10 ||
            particle.y < -10 ||
            particle.y > window.innerHeight + 10
          ) {
            Object.assign(particle, makeParticle());
          }

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
        });

        animationId = requestAnimationFrame(animateParticles);
      };

      resizeCanvas();
      resetParticles();
      animateParticles();

      window.addEventListener("resize", rafThrottle(() => {
        resizeCanvas();
        resetParticles();
      }), { passive: true });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          cancelAnimationFrame(animationId);
          return;
        }
        animateParticles();
      });
    }
  }
})();

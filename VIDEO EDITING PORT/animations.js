/* ==========================================================================
   FRAME//SHIFT — Animations
   Preloader, hero intro, split text, scroll transitions, marquees,
   stats counter, process progress, Lenis smooth scroll
   ========================================================================== */

/* ---------- LENIS SMOOTH SCROLL ---------- */
function initLenis() {
  if (typeof Lenis === "undefined" || isReducedMotion()) return;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });
  window.__lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Anchor links → smooth scroll via Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (typeof closeMobileMenu === "function") closeMobileMenu();
      lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    });
  });
}

/* ---------- PRELOADER ---------- */
function initPreloader() {
  const pre = document.getElementById("preloader");
  const light = document.getElementById("preLight");
  const logo = document.getElementById("preLogo");
  const pct = document.getElementById("prePct");
  const bar = document.getElementById("preBar");
  if (!pre || !light) return;

  if (isReducedMotion()) {
    pre.style.display = "none";
    document.body.style.overflow = "";
    playHeroIntro();
    return;
  }

  if (typeof gsap === "undefined") {
    pre.style.display = "none";
    document.body.style.overflow = "";
    playHeroIntro();
    return;
  }

  document.body.style.overflow = "hidden";
  const state = { value: 0 };
  let finished = false;
  let fallbackTimer;
  const finish = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(fallbackTimer);
    document.body.style.overflow = "";
    pre.style.display = "none";
    playHeroIntro();
  };
  fallbackTimer = window.setTimeout(finish, 5000);

  const tl = gsap.timeline({
    onComplete: finish,
  });

  tl.to(light, { scaleX: 80, scaleY: 0.4, duration: 0.7, ease: "expo.inOut" }, 0.1)
    .to(light, { scaleX: 1, scaleY: 1, opacity: 0, duration: 0.4, ease: "power2.out" }, 0.8)
    .to(logo, { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1, ease: "expo.inOut" }, 0.7)
    .to(state, {
      value: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(state.value);
        pct.textContent = v;
        bar.style.width = v + "%";
      },
    }, 0.6)
    .to([logo, pct, ".preloader__label"], { opacity: 0, duration: 0.5, ease: "power2.in" }, 2.6)
    .to(bar, { opacity: 0, duration: 0.4 }, 2.9)
    .to(pre, {
      clipPath: "inset(0 0 100% 0)",
      duration: 1,
      ease: "expo.inOut",
    }, 2.9);
}

/* ---------- HERO INTRO ---------- */
function playHeroIntro() {
  if (isReducedMotion() || typeof gsap === "undefined") {
    document.querySelectorAll(".hero__title .line span").forEach((el) => {
      el.style.transform = "translateY(0)";
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(".nav", { y: -40, opacity: 0, duration: 1 }, 0)
    .to(".hero__title .line span", {
      y: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: "expo.out",
    }, 0.2)
    .from(".hero__eyebrow", { opacity: 0, y: 20, duration: 0.8 }, 0.4)
    .from(".hero__sub span", { opacity: 0, y: 20, duration: 0.7, stagger: 0.08 }, 0.7)
    .from(".hero__desc", { opacity: 0, y: 20, duration: 0.8 }, 0.9)
    .from(".hero__ctas .btn", { opacity: 0, y: 24, duration: 0.8, stagger: 0.1 }, 1.0)
    .from(".hero__tech, .hero__scroll", { opacity: 0, duration: 0.8 }, 1.2);

  const hero = document.querySelector(".hero");
  if (hero) {
    hero.addEventListener("mousemove", (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w - 0.5) * 20;
      const y = (e.clientY / h - 0.5) * 20;
      gsap.to(".hero__video", { x, y, duration: 1, ease: "power2.out", overwrite: "auto" });
      gsap.to(".hero__title", { x: x * 0.4, y: y * 0.4, duration: 1.2, ease: "power2.out", overwrite: "auto" });
    });
  }

  gsap.to(".hero__video", {
    scale: 1.18,
    duration: 20,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}

/* ---------- SPLIT TEXT ---------- */
function initSplitText() {
  if (isReducedMotion() || typeof gsap === "undefined") return;

  document.querySelectorAll("[data-split]").forEach((el) => {
    const html = el.innerHTML;
    const lines = html.split("<br>");
    el.innerHTML = lines
      .map(
        (line) =>
          `<span style="display:block;overflow:hidden;"><span class="split-line" style="display:inline-block;transform:translateY(110%);">${line}</span></span>`
      )
      .join("");

    gsap.to(el.querySelectorAll(".split-line"), {
      y: 0,
      duration: 1.1,
      stagger: 0.08,
      ease: "expo.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });
  });
}

/* ---------- TRANSITION ---------- */
function initTransition() {
  const inner = document.getElementById("transitionInner");
  if (!inner || isReducedMotion() || typeof gsap === "undefined") return;
  gsap.to(inner, {
    xPercent: -50,
    ease: "none",
    scrollTrigger: {
      trigger: ".transition",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
}

/* ---------- MARQUEES ---------- */
function initMarquees() {
  if (typeof gsap === "undefined") return;

  document.querySelectorAll("[data-marquee]").forEach((track) => {
    const dir = track.dataset.direction === "right" ? 1 : -1;
    track.innerHTML += track.innerHTML;
    const itemWidth = track.scrollWidth / 2;
    if (isReducedMotion()) return;

    gsap.set(track, { x: dir === -1 ? 0 : -itemWidth });
    gsap.to(track, {
      x: dir === -1 ? -itemWidth : 0,
      duration: 30,
      ease: "none",
      repeat: -1,
    });
  });
}

/* ---------- STATS COUNTER ---------- */
function initStats() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const end = parseInt(el.dataset.count, 10);
    if (isReducedMotion() || typeof gsap === "undefined") {
      el.textContent = end;
      return;
    }
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: end,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => (el.textContent = Math.round(obj.v)),
        });
      },
    });
  });
}

/* ---------- PROCESS PROGRESS ---------- */
function initProcess() {
  const track = document.getElementById("processTrack");
  if (!track || typeof ScrollTrigger === "undefined") return;
  const steps = track.querySelectorAll("[data-step]");

  ScrollTrigger.create({
    trigger: track,
    start: "top 75%",
    end: "bottom 60%",
    onUpdate: (self) => {
      track.style.setProperty("--progress", self.progress * 100 + "%");
      steps.forEach((s, i) => {
        s.classList.toggle("is-active", self.progress >= (i + 0.5) / steps.length);
      });
    },
  });
}
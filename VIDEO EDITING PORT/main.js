/* ==========================================================================
   FRAME//SHIFT — Boot
   Config + initializes all modules after libraries are ready.
   ========================================================================== */

const CONFIG = {
  // Set to a Formspree/Getform URL to POST directly.
  // Leave empty to fall back to a mailto: handoff (honest fallback).
  FORM_ENDPOINT: "",
  CONTACT_EMAIL: "hello@frameshift.studio",
};

function isReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function whenReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

function openModal(selector) {
  const modal = document.querySelector(selector);
  if (!modal) {
    console.error(`Cannot open modal: ${selector} was not found.`);
    return;
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  const video = modal.querySelector("video");
  if (video) {
    const playback = video.play();
    if (playback) {
      playback.catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Could not start the modal video:", error);
        }
      });
    }
  }
}

function closeModal(modal) {
  const video = modal.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function initCursor() {
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");
  if (!cursor || !follower || window.matchMedia("(pointer: coarse)").matches) return;

  document.body.classList.add("has-custom-cursor");
  document.addEventListener("mousemove", (event) => {
    [cursor, follower].forEach((element) => {
      element.style.left = `${event.clientX}px`;
      element.style.top = `${event.clientY}px`;
      element.classList.add("is-visible");
    });
  });
  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible", "is-hover");
    follower.classList.remove("is-visible");
  });

  document.querySelectorAll("a, button, [role='button']").forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });
}

function initNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  let lastScrollY = window.scrollY;
  let updateScheduled = false;
  const updateNav = () => {
    const scrollY = window.scrollY;
    nav.classList.toggle("is-scrolled", scrollY > 20);

    if (scrollY <= 80 || scrollY < lastScrollY) {
      nav.classList.remove("is-hidden");
    } else if (scrollY > lastScrollY) {
      nav.classList.add("is-hidden");
    }

    lastScrollY = scrollY;
    updateScheduled = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (updateScheduled) return;
      updateScheduled = true;
      window.requestAnimationFrame(updateNav);
    },
    { passive: true }
  );
  updateNav();
}

function initVideoPlayback() {
  const hero = document.getElementById("heroVideo");
  if (hero) {
    hero.muted = true;
    hero.addEventListener("error", () => {
      console.error("Hero video failed to load:", hero.currentSrc, hero.error);
    });

    const playHero = () => {
      const playback = hero.play();
      if (playback) {
        playback.catch((error) => {
          if (error.name !== "AbortError") {
            console.warn("Hero video autoplay was blocked:", error);
          }
        });
      }
    };

    const soundToggle = document.getElementById("heroSoundToggle");
    if (soundToggle) {
      soundToggle.addEventListener("click", () => {
        hero.muted = !hero.muted;
        const soundOn = !hero.muted;
        soundToggle.textContent = soundOn ? "Sound on" : "Sound off";
        soundToggle.setAttribute("aria-label", soundOn ? "Turn video sound off" : "Turn video sound on");
        soundToggle.setAttribute("aria-pressed", String(soundOn));
        if (soundOn) {
          hero.volume = 1;
          playHero();
        }
      });
    }

    if (hero.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      playHero();
    } else {
      hero.addEventListener("canplay", playHero, { once: true });
    }
  }

  const showreelButton = document.getElementById("showreelOpen");
  if (showreelButton) {
    showreelButton.addEventListener("click", () => openModal("#showreelModal"));
  }

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => closeModal(modal));
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal.is-open").forEach(closeModal);
    }
  });
}

function boot() {
  // Register ScrollTrigger if present
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Interaction initializers are supplied by an optional interactions module.
  initLenis();
  const interactionInitializers = [
    "initCursor",
    "initMagnetic",
    "initNav",
    "initScrollProgress",
    "initNavActive",
    "initForm",
    "initMisc",
    "initModals",
  ];
  const missingInitializers = interactionInitializers.filter(
    (name) => typeof window[name] !== "function" && name !== "initModals"
  );
  if (missingInitializers.length > 0) {
    console.warn(
      "Interaction features are unavailable because interactions.js is missing:",
      missingInitializers.join(", ")
    );
  }
  interactionInitializers.forEach((name) => {
    if (typeof window[name] === "function") window[name]();
  });
  initVideoPlayback();

  // Animation / data systems
  initSplitText();
  initTransition();
  initMarquees();
  renderProjects();
  initStats();
  initProcess();
  initPreloader();

  // Refresh ScrollTrigger after assets load
  window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  });
}

whenReady(boot);
/* ==========================================================================
   FRAME//SHIFT — Projects Data & Rendering
   Edit the PROJECTS array to add, remove, or modify work items.
   Every card and modal is generated from this data.
   ========================================================================== */

/**
 * @typedef {Object} Project
 * @property {string} id       - unique slug
 * @property {string} title    - display title
 * @property {string} category - category label
 * @property {string} year     - year string
 * @property {string} client   - client name
 * @property {string} software - software used
 * @property {string} description - long description for modal
 * @property {string} image    - thumbnail URL
 * @property {string} video    - preview video URL (mp4)
 * @property {"featured"|"wide"|"narrow"|""} size - grid layout
 */

/** @type {Project[]} */
const PROJECTS = [
  {
    id: "project-1",
    title: "Silent Horizon",
    category: "Cinematic Video Editing",
    year: "2025",
    client: "Independent Film",
    software: "Premiere Pro · DaVinci Resolve",
    description:
      "A slow-burn short film about a lone traveler. Focused on pacing, atmosphere, and a restrained sound design that lets silence carry the emotion.",
    image: "videos/project-1-poster.jpg",
    video: "videos/project-1.mp4",
    size: "featured",
  },
  {
    id: "project-2",
    title: "Signal / Noise",
    category: "Commercial Advertising",
    year: "2025",
    client: "Placeholder Brand",
    software: "Premiere Pro · After Effects",
    description:
      "A 30-second product spot built around rapid cut-rhythm and kinetic typography. Designed for social-first vertical and 16:9 delivery.",
    image: "videos/project-2-poster.jpg",
    video: "videos/project-2.mp4",
    size: "wide",
  },
  {
    id: "project-3",
    title: "Nightloop",
    category: "Music Video",
    year: "2024",
    client: "Placeholder Artist",
    software: "Premiere Pro · After Effects",
    description:
      "A neon-drenched music video cut entirely to the beat. Layered overlays, chromatic shifts, and hand-cut flash frames.",
    image: "videos/project-3-poster.jpg",
    video: "videos/project-3.mp4",
    size: "narrow",
  },
  {
    id: "project-4",
    title: "Arena",
    category: "Gaming Trailer",
    year: "2024",
    client: "Placeholder Studio",
    software: "After Effects · Premiere Pro",
    description:
      "A 60-second cinematic gameplay trailer. Heavy sound design, punchy transitions, and a score that builds to a final drop.",
    image: "videos/project-4-poster.jpg",
    video: "videos/project-4.mp4",
    size: "wide",
  },
  {
    id: "project-5",
    title: "Shortform Series",
    category: "Social Media Content",
    year: "2025",
    client: "Placeholder Creator",
    software: "Premiere Pro",
    description:
      "A 12-part vertical short-form series engineered for retention — hook, cut, payoff, in under 30 seconds each.",
    image: "videos/project-5-poster.jpg",
    video: "videos/project-5.mp4",
    size: "narrow",
  },
  {
    id: "project-6",
    title: "Kinetic",
    category: "Motion Graphics",
    year: "2024",
    client: "Placeholder Agency",
    software: "After Effects · Blender",
    description:
      "An experimental motion piece exploring typography as material. Animated borders, fluid masks, and controlled distortion.",
    image: "videos/project-6-poster.jpg",
    video: "videos/project-6.mp4",
    size: "wide",
  },
];

/* ---------- RENDERING ---------- */
let activeProjectIndex = 0;

function renderProjects() {
  const grid = document.getElementById("workGrid");
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((p, i) => {
    const sizeClass =
      p.size === "featured"
        ? "project--featured"
        : p.size === "wide"
        ? "project--wide"
        : p.size === "narrow"
        ? "project--narrow"
        : "";
    return `
      <article class="project ${sizeClass}" data-project-index="${i}" tabindex="0" role="button" aria-label="Open project: ${p.title}">
        <div class="project__media">
          <img src="${p.image}" alt="${p.title}" loading="lazy" />
          <span class="project__frame" aria-hidden="true"></span>
        </div>
        <span class="project__num">${String(i + 1).padStart(2, "0")}</span>
        <span class="project__year">${p.year}</span>
        <div class="project__info">
          <span class="project__cat">${p.category}</span>
          <h3 class="project__title">${p.title}</h3>
          <p class="project__desc">${p.description.slice(0, 90)}…</p>
        </div>
      </article>
    `;
  }).join("");

  // Click / keydown → open modal
  grid.querySelectorAll("[data-project-index]").forEach((card) => {
    const open = () => openProject(parseInt(card.dataset.projectIndex, 10));
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  // Scroll reveal (if GSAP available)
  if (typeof gsap !== "undefined" && !isReducedMotion()) {
    grid.querySelectorAll(".project").forEach((p) => {
      gsap.from(p, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: p, start: "top 88%", once: true },
      });
    });
  }
}

function openProject(index) {
  const p = PROJECTS[index];
  if (!p) return;
  activeProjectIndex = index;

  document.getElementById("pmCat").textContent = p.category;
  document.getElementById("pmTitle").textContent = p.title;
  document.getElementById("pmYear").textContent = p.year;
  document.getElementById("pmClient").textContent = p.client;
  document.getElementById("pmSoftware").textContent = p.software;
  document.getElementById("pmDesc").textContent = p.description;
  document.getElementById("pmVideo").innerHTML = `
    <video controls playsinline preload="metadata" poster="${p.image}">
      <source src="${p.video}" type="video/mp4" />
    </video>`;

  // Prev/next
  const prevIdx = (index - 1 + PROJECTS.length) % PROJECTS.length;
  const nextIdx = (index + 1) % PROJECTS.length;
  const prev = document.getElementById("pmPrev");
  const next = document.getElementById("pmNext");
  prev.innerHTML = `<small>Previous</small>${PROJECTS[prevIdx].title}`;
  next.innerHTML = `<small>Next</small>${PROJECTS[nextIdx].title}`;
  prev.onclick = (e) => { e.preventDefault(); openProject(prevIdx); };
  next.onclick = (e) => { e.preventDefault(); openProject(nextIdx); };

  openModal("#projectModal");
}
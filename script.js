const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = navMenu ? navMenu.querySelectorAll("a") : [];
const searchInput = document.querySelector("#softwareSearch");
const tabs = document.querySelectorAll(".tab");
const softwareCards = document.querySelectorAll(".software-card");
const softwareSection = document.querySelector("#software");
const viewFreeToolsBtn = document.querySelector("#viewFreeToolsBtn");
const modal = document.querySelector("#downloadModal");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalVersion = document.querySelector("#modalVersion");
const modalStatus = document.querySelector("#modalStatus");
const modalDirectDownload = document.querySelector("#modalDirectDownload");
const modalGithubDownload = document.querySelector("#modalGithubDownload");
const swiftDropDownloadModal = document.querySelector("#swiftdropDownloadModal");
const futureModal = document.querySelector("#futureProductModal");
const clearDeskModal = document.querySelector("#clearDeskModal");
const swiftDropModal = document.querySelector("#swiftDropModal");
const supportModals = document.querySelectorAll(".support-modal");
const backToTop = document.querySelector(".back-to-top");
const canvas = document.querySelector("#particleCanvas");
const ctx = canvas?.getContext("2d");
const loader = document.querySelector(".site-loader");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canUsePointerHover = window.matchMedia("(hover: hover) and (pointer: fine)");

let activeFilter = "All";
let particles = [];
let particleFrame = null;
let particlePixelRatio = 1;

const ecosystemPathSets = {
  desktop: [
    "M500 280 C380 210 300 150 210 118",
    "M500 280 C620 200 704 148 810 116",
    "M500 280 C368 296 260 332 148 402",
    "M500 280 C636 292 746 330 858 408",
    "M500 280 C456 190 440 128 436 64",
    "M500 280 C548 370 574 454 606 510",
    "M500 280 C400 372 334 448 276 508"
  ],
  mobile: [
    "M500 269 C380 150 230 94 100 134",
    "M500 269 C620 150 770 94 900 134",
    "M500 269 C360 348 220 414 70 353",
    "M500 269 C640 348 780 414 930 353",
    "M500 269 C360 218 360 86 500 50",
    "M500 269 C690 328 790 490 920 493",
    "M500 269 C310 328 180 490 50 493"
  ]
};
const ecosystemMobileQuery = window.matchMedia("(max-width: 480px)");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader?.classList.add("hidden");
  }, prefersReducedMotion.matches ? 80 : 900);
});

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const sectionTargets = Array.from(navLinks)
  .map((link) => {
    const href = link.getAttribute("href");
    return href?.startsWith("#") ? document.querySelector(href) : null;
  })
  .filter(Boolean);

function updateActiveNavLink() {
  const scrollPosition = window.scrollY + 120;
  let currentSectionId = sectionTargets[0]?.id || "home";

  sectionTargets.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSectionId}`;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function filterSoftware() {
  const query = searchInput?.value.trim().toLowerCase() || "";

  softwareCards.forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category.toLowerCase();
    const matchesSearch = name.includes(query) || category.includes(query);
    const matchesFilter = activeFilter === "All" || category.includes(activeFilter.toLowerCase());
    card.style.display = matchesSearch && matchesFilter ? "" : "none";
  });
}

searchInput?.addEventListener("input", filterSoftware);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    activeFilter = tab.dataset.filter;
    filterSoftware();
  });
});

viewFreeToolsBtn?.addEventListener("click", (event) => {
  event.preventDefault();

  searchInput.value = "";
  tabs.forEach((item) => item.classList.toggle("active", item.dataset.filter === "Free"));
  activeFilter = "Free";
  filterSoftware();
  softwareSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

if (canUsePointerHover.matches && !prefersReducedMotion.matches) {
  softwareCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      const rotateX = (event.clientY - rect.top - rect.height / 2) / -34;
      const rotateY = (event.clientX - rect.left - rect.width / 2) / 34;

      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function updateEcosystemPaths() {
  const paths = ecosystemMobileQuery.matches ? ecosystemPathSets.mobile : ecosystemPathSets.desktop;
  const linePaths = document.querySelectorAll(".ecosystem-paths path");
  const motionPaths = document.querySelectorAll(".ecosystem-travelers animateMotion");

  linePaths.forEach((path, index) => {
    path.setAttribute("d", paths[index]);
  });

  motionPaths.forEach((path, index) => {
    path.setAttribute("path", paths[index]);
  });
}

updateEcosystemPaths();
ecosystemMobileQuery.addEventListener("change", updateEcosystemPaths);

document.querySelectorAll(".open-modal").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".software-card");
    if (!card || !modal) return;
    modalTitle.textContent = card.dataset.name;
    modalDescription.textContent = card.querySelector(".card-description")?.textContent || card.querySelector("p").textContent;
    modalVersion.textContent = card.dataset.version;
    modalStatus.textContent = card.dataset.status;
    modalDirectDownload.href = card.dataset.directDownload || "#";
    modalGithubDownload.href = card.dataset.githubDownload || "#";
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  });
});

document.querySelectorAll("[data-close-modal]").forEach((item) => {
  item.addEventListener("click", () => {
    modal?.classList.remove("active");
    modal?.setAttribute("aria-hidden", "true");
  });
});

document.querySelectorAll(".open-swiftdrop-download-modal").forEach((button) => {
  button.addEventListener("click", () => {
    if (!swiftDropDownloadModal) return;
    swiftDropDownloadModal.classList.add("active");
    swiftDropDownloadModal.setAttribute("aria-hidden", "false");
  });
});

document.querySelectorAll("[data-close-swiftdrop-download-modal]").forEach((item) => {
  item.addEventListener("click", () => {
    swiftDropDownloadModal?.classList.remove("active");
    swiftDropDownloadModal?.setAttribute("aria-hidden", "true");
  });
});

document.querySelectorAll(".open-future-modal").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (!futureModal) return;
    futureModal.classList.add("active");
    futureModal.setAttribute("aria-hidden", "false");
  });
});

document.querySelectorAll("[data-close-future-modal]").forEach((item) => {
  item.addEventListener("click", () => {
    futureModal?.classList.remove("active");
    futureModal?.setAttribute("aria-hidden", "true");
  });
});

document.querySelectorAll(".open-cleardesk-modal").forEach((button) => {
  button.addEventListener("click", () => {
    if (!clearDeskModal) return;
    clearDeskModal.classList.add("active");
    clearDeskModal.setAttribute("aria-hidden", "false");
  });
});

document.querySelectorAll("[data-close-cleardesk-modal]").forEach((item) => {
  item.addEventListener("click", () => {
    clearDeskModal?.classList.remove("active");
    clearDeskModal?.setAttribute("aria-hidden", "true");
  });
});

document.querySelectorAll(".open-swiftdrop-modal").forEach((button) => {
  button.addEventListener("click", () => {
    if (!swiftDropModal) return;
    swiftDropModal.classList.add("active");
    swiftDropModal.setAttribute("aria-hidden", "false");
  });
});

document.querySelectorAll("[data-close-swiftdrop-modal]").forEach((item) => {
  item.addEventListener("click", () => {
    swiftDropModal?.classList.remove("active");
    swiftDropModal?.setAttribute("aria-hidden", "true");
  });
});

document.querySelectorAll(".open-support-modal").forEach((button) => {
  button.addEventListener("click", () => {
    const targetModal = document.querySelector(`#${button.dataset.supportModal}`);
    if (!targetModal) return;

    targetModal.classList.add("active");
    targetModal.setAttribute("aria-hidden", "false");
  });
});

document.querySelectorAll("[data-close-support-modal]").forEach((item) => {
  item.addEventListener("click", () => {
    const targetModal = item.closest(".support-modal");
    if (!targetModal) return;

    targetModal.classList.remove("active");
    targetModal.setAttribute("aria-hidden", "true");
  });
});

document.querySelectorAll(".support-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector("button[type='submit']");
    const message = form.querySelector(".form-message");
    const submitText = submitButton.dataset.submitText || submitButton.textContent;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    message.textContent = "";
    message.classList.remove("error");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Form submission failed");

      form.reset();
      message.textContent = form.dataset.successMessage || "Thank you! Your request has been submitted.";
    } catch (error) {
      message.textContent = "Something went wrong. Please try again in a moment.";
      message.classList.add("error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = submitText;
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal?.classList.remove("active");
    modal?.setAttribute("aria-hidden", "true");
    swiftDropDownloadModal?.classList.remove("active");
    swiftDropDownloadModal?.setAttribute("aria-hidden", "true");
    futureModal?.classList.remove("active");
    futureModal?.setAttribute("aria-hidden", "true");
    clearDeskModal?.classList.remove("active");
    clearDeskModal?.setAttribute("aria-hidden", "true");
    swiftDropModal?.classList.remove("active");
    swiftDropModal?.setAttribute("aria-hidden", "true");
    supportModals.forEach((supportModal) => {
      supportModal.classList.remove("active");
      supportModal.setAttribute("aria-hidden", "true");
    });
  }
});

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const target = Number(entry.target.dataset.count);
    const suffix = entry.target.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);
      entry.target.textContent = target >= 1000 ? `${Math.floor(value / 100) / 10}K${suffix}` : `${value}${suffix}`;

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll("[data-count]").forEach((item) => counterObserver.observe(item));

window.addEventListener("scroll", () => {
  backToTop?.classList.toggle("visible", window.scrollY > 640);
  updateActiveNavLink();
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function resizeCanvas() {
  if (!canvas || !ctx || prefersReducedMotion.matches) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width <= 640;
  const isTablet = width > 640 && width <= 1024;
  const maxParticles = isMobile ? 30 : isTablet ? 50 : 96;
  const spacing = isMobile ? 15 : isTablet ? 17 : 14;

  particlePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width * particlePixelRatio);
  canvas.height = Math.floor(height * particlePixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(particlePixelRatio, 0, 0, particlePixelRatio, 0, 0);

  const particleCount = Math.min(maxParticles, Math.max(isMobile ? 22 : isTablet ? 38 : 70, Math.floor(width / spacing)));
  const maxSpeed = isMobile ? 0.075 : isTablet ? 0.1 : 0.14;

  particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * (isMobile ? 1.05 : 1.45) + 0.45,
    vx: (Math.random() - 0.5) * maxSpeed,
    vy: (Math.random() - 0.5) * maxSpeed,
    alpha: Math.random() * (isMobile ? 0.18 : 0.24) + (isMobile ? 0.18 : 0.2),
    hue: Math.random() > 0.55 ? "69, 230, 255" : "143, 124, 255"
  }));
}

function drawParticles() {
  if (!canvas || !ctx || prefersReducedMotion.matches) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width <= 640;
  const lineDistance = isMobile ? 82 : 126;
  const lineAlpha = isMobile ? 0.06 : 0.105;

  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -8) particle.x = width + 8;
    if (particle.x > width + 8) particle.x = -8;
    if (particle.y < -8) particle.y = height + 8;
    if (particle.y > height + 8) particle.y = -8;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.shadowBlur = isMobile ? 7 : 12;
    ctx.shadowColor = `rgba(${particle.hue}, 0.32)`;
    ctx.fillStyle = `rgba(${particle.hue}, ${particle.alpha})`;
    ctx.fill();
    ctx.shadowBlur = 0;

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < lineDistance) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(69, 230, 255, ${lineAlpha * (1 - distance / lineDistance)})`;
        ctx.stroke();
      }
    }
  });

  particleFrame = requestAnimationFrame(drawParticles);
}

if (!prefersReducedMotion.matches) {
  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas);
}

prefersReducedMotion.addEventListener("change", () => {
  if (prefersReducedMotion.matches) {
    if (particleFrame) cancelAnimationFrame(particleFrame);
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
    return;
  }

  resizeCanvas();
  drawParticles();
});

updateActiveNavLink();

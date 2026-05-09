const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = navMenu.querySelectorAll("a");
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
const futureModal = document.querySelector("#futureProductModal");
const supportModals = document.querySelectorAll(".support-modal");
const backToTop = document.querySelector(".back-to-top");
const canvas = document.querySelector("#particleCanvas");
const ctx = canvas.getContext("2d");

let activeFilter = "All";
let particles = [];

navToggle.addEventListener("click", () => {
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
  .map((link) => document.querySelector(link.getAttribute("href")))
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
  const query = searchInput.value.trim().toLowerCase();

  softwareCards.forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category.toLowerCase();
    const matchesSearch = name.includes(query) || category.includes(query);
    const matchesFilter = activeFilter === "All" || category.includes(activeFilter.toLowerCase());
    card.style.display = matchesSearch && matchesFilter ? "" : "none";
  });
}

searchInput.addEventListener("input", filterSoftware);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    activeFilter = tab.dataset.filter;
    filterSoftware();
  });
});

viewFreeToolsBtn.addEventListener("click", (event) => {
  event.preventDefault();

  searchInput.value = "";
  tabs.forEach((item) => item.classList.toggle("active", item.dataset.filter === "Free"));
  activeFilter = "Free";
  filterSoftware();
  softwareSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

softwareCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const rotateX = (event.clientY - rect.top - rect.height / 2) / -24;
    const rotateY = (event.clientX - rect.left - rect.width / 2) / 24;

    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".open-modal").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".software-card");
    modalTitle.textContent = card.dataset.name;
    modalDescription.textContent = card.querySelector("p").textContent;
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
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  });
});

document.querySelectorAll(".open-future-modal").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    futureModal.classList.add("active");
    futureModal.setAttribute("aria-hidden", "false");
  });
});

document.querySelectorAll("[data-close-future-modal]").forEach((item) => {
  item.addEventListener("click", () => {
    futureModal.classList.remove("active");
    futureModal.setAttribute("aria-hidden", "true");
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
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    futureModal.classList.remove("active");
    futureModal.setAttribute("aria-hidden", "true");
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
    const suffix = target >= 1000 ? "+" : "+";
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
  backToTop.classList.toggle("visible", window.scrollY > 640);
  updateActiveNavLink();
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = Array.from({ length: Math.min(80, Math.floor(window.innerWidth / 18)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    alpha: Math.random() * 0.6 + 0.2
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(69, 230, 255, ${particle.alpha})`;
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < 120) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(125, 255, 178, ${0.08 * (1 - distance / 120)})`;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener("resize", resizeCanvas);
updateActiveNavLink();

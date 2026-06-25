// Cadence — interações da landing
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 16);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Tema (persistido)
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("cadence-theme");
  if (saved) root.setAttribute("data-theme", saved);
  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("cadence-theme", next);
  });

  // Reveal on scroll + estados auxiliares
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        if (entry.target.dataset.count !== undefined) animateCount(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  document
    .querySelectorAll(".reveal, .step, #heroMock, [data-count]")
    .forEach((el) => io.observe(el));

  // Contadores animados das métricas
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const decimals = String(target).includes(".") ? 1 : 0;
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Alternância de cobrança mensal/anual
  const billing = document.getElementById("billingToggle");
  if (billing) {
    billing.addEventListener("click", (e) => {
      const opt = e.target.closest(".toggle__opt");
      if (!opt) return;
      billing.querySelectorAll(".toggle__opt").forEach((o) => o.classList.remove("is-active"));
      opt.classList.add("is-active");
      const cycle = opt.dataset.cycle;
      document.querySelectorAll(".plan__price b").forEach((b) => {
        const val = cycle === "year" ? b.dataset.year : b.dataset.month;
        if (val === undefined) return;
        b.style.opacity = "0";
        setTimeout(() => {
          b.textContent = val;
          b.style.opacity = "1";
        }, 160);
      });
    });
  }

  // Parallax sutil no glow do hero
  const glow = document.querySelector(".hero__glow");
  if (glow && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY * 0.15;
        glow.style.transform = `translate(-50%, ${y}px)`;
      },
      { passive: true }
    );
  }
})();

(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
  const topbar = document.getElementById("topbar");
  const themeBtn = document.getElementById("theme-btn");
  const themeIcon = document.getElementById("theme-icon");

  const menuBtn = document.getElementById("menu-btn");
  const navList = document.getElementById("nav-list");
  if (menuBtn && navList) {
    menuBtn.addEventListener("click", function () {
      const open = navList.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "Close" : "Menu";
    });
    navList.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navList.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "Menu";
      });
    });
  }

  function onScrollTopbar() {
    if (!topbar) return;
    topbar.classList.toggle("scrolled", window.scrollY > 6);
  }
  window.addEventListener("scroll", onScrollTopbar, { passive: true });
  onScrollTopbar();

  // Theme toggle (light/dark) with localStorage
  const THEME_KEY = "portfolio-theme";
  function applyTheme(theme) {
    const dark = theme === "dark";
    document.body.classList.toggle("theme-dark", dark);
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", String(dark));
      themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
    if (themeIcon) themeIcon.textContent = dark ? "☀" : "🌙";
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
  } else {
    applyTheme("light");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const darkNow = document.body.classList.contains("theme-dark");
      const next = darkNow ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const ids = navLinks
    .map(function (a) {
      const href = a.getAttribute("href") || "";
      return href.startsWith("#") ? href.slice(1) : null;
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.target.id) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0.1 }
    );

    ids.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }

  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();

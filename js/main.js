(function () {
  "use strict";

  var menuBtn = document.getElementById("menu-toggle");
  var navPanel = document.getElementById("site-nav");
  var backdrop = document.getElementById("nav-backdrop");
  var navLinks = navPanel ? navPanel.querySelectorAll("a[href^='#']") : [];

  function setNavOpen(open) {
    document.body.classList.toggle("nav-open", open);
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      var icon = menuBtn.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = open ? "close" : "menu";
    }
  }

  if (menuBtn && navPanel) {
    menuBtn.addEventListener("click", function () {
      setNavOpen(!document.body.classList.contains("nav-open"));
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setNavOpen(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNavOpen(false);
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setNavOpen(false);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    var target = document.querySelector(id);
    if (!target) return;
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      var header = document.querySelector("header");
      var offset = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var original = btn ? btn.textContent : "";
      if (btn) {
        btn.textContent = "Sent — we'll reply shortly";
        btn.disabled = true;
      }
      window.setTimeout(function () {
        contactForm.reset();
        if (btn) {
          btn.textContent = original;
          btn.disabled = false;
        }
      }, 2800);
    });
  }

  var heroStats = document.querySelectorAll("[data-telemetry]");
  if (heroStats.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var end = parseFloat(el.getAttribute("data-value"));
          var suffix = el.getAttribute("data-suffix") || "";
          if (isNaN(end)) return;
          var start = 0;
          var duration = 1200;
          var t0 = null;
          function step(ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var val = start + (end - start) * eased;
            el.textContent =
              (Number.isInteger(end) ? Math.round(val) : val.toFixed(1)) + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          obs.unobserve(el);
        });
      },
      { threshold: 0.2 }
    );
    heroStats.forEach(function (el) {
      obs.observe(el);
    });
  }
})();

/* ==========================================================================
   Alabaster & Ink — interactive behaviors
   --------------------------------------------------------------------------
   Four behaviors:
     1. Theme toggle (light/dark)  — toggles [data-theme], persists, mirrors
                                       prefers-color-scheme on first visit.
     2. Reveal on scroll           — IntersectionObserver, threshold 0.15,
                                       unobserve after first reveal.
     3. Unfold expand/collapse     — [data-unfold-target] / [data-unfold-panel]
                                       pairs, deep-link via #unfold-id, focus
                                       moves to panel content on open, returns
                                       to button on close.
     4. Skill filter               — multi-select chips, applies .is-hidden to
                                       cards whose data-skills don't match.
                                       Shows no-results state and Clear chip
                                       when any filter is active.

   All behaviors:
     • are scoped behind `document.documentElement.classList.contains("js")`,
       which is set by an inline script before this file loads.
     • honor `prefers-reduced-motion` (Reveal becomes a no-op; the rest are
       unaffected because they aren't motion-based).
   ========================================================================== */


(function () {
  "use strict";

  // Bail if the document wasn't marked JS-enhanced (belt + suspenders).
  if (!document.documentElement.classList.contains("js")) return;


  /* ── 1. Theme toggle ─────────────────────────────────────────────── */

  function initThemeToggle() {
    var STORAGE_KEY = "theme";
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    function currentTheme() {
      return document.documentElement.getAttribute("data-theme") || "light";
    }

    function syncPressedState() {
      var isDark = currentTheme() === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
    }

    function setTheme(next, persist) {
      document.documentElement.setAttribute("data-theme", next);
      if (persist) {
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* private mode */ }
      }
      syncPressedState();
    }

    syncPressedState();

    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      setTheme(next, true);
    });

    // If the user hasn't explicitly chosen, follow OS changes live.
    var mql = window.matchMedia("(prefers-color-scheme: dark)");
    var stored;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { stored = null; }
    if (!stored && mql.addEventListener) {
      mql.addEventListener("change", function (e) {
        setTheme(e.matches ? "dark" : "light", false);
      });
    }
  }


  /* ── 2. Reveal on scroll ────────────────────────────────────────── */

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      // Old browser fallback: just show everything.
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });
  }


  /* ── 3. Unfold expand/collapse ──────────────────────────────────── */

  function initUnfold() {
    var buttons = document.querySelectorAll("[data-unfold-target]");
    if (!buttons.length) return;

    function openPanel(btn) {
      var panelId = btn.getAttribute("data-unfold-target");
      var panel = document.getElementById(panelId);
      if (!panel) return;
      btn.setAttribute("aria-expanded", "true");
      panel.classList.add("is-open");
      // Focus moves to panel content for screen-reader / keyboard users.
      // Defer so the grid-template-rows transition has begun.
      requestAnimationFrame(function () {
        var focusable = panel.querySelector("a, button, [tabindex]");
        if (focusable) focusable.focus({ preventScroll: false });
      });
    }

    function closePanel(btn) {
      var panelId = btn.getAttribute("data-unfold-target");
      var panel = document.getElementById(panelId);
      if (!panel) return;
      btn.setAttribute("aria-expanded", "false");
      panel.classList.remove("is-open");
    }

    function togglePanel(btn) {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      if (expanded) closePanel(btn);
      else openPanel(btn);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () { togglePanel(btn); });
    });

    // Deep-link support: #unfold-ai-passwords or #unfold-ai-churn opens on load.
    if (location.hash) {
      var match = location.hash.match(/^#unfold-(.+)$/);
      if (match) {
        var panelId = "unfold-" + match[1];
        var panel = document.getElementById(panelId);
        if (panel) {
          var btn = document.querySelector('[data-unfold-target="' + panelId + '"]');
          if (btn) openPanel(btn);
        }
      }
    }

    // Escape closes the focused panel.
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var open = document.querySelector('[data-unfold-target][aria-expanded="true"]');
      if (!open) return;
      closePanel(open);
      open.focus();
    });
  }


  /* ── 4. Skill filter ────────────────────────────────────────────── */

  function initFilter() {
    var chips = document.querySelectorAll("[data-filter]");
    var cards = document.querySelectorAll("[data-skills]");
    var empty = document.getElementById("ai-grid-empty");
    var clearChip = document.querySelector('[data-filter="clear"]');
    if (!chips.length || !cards.length) return;

    var activeFilters = new Set();

    function applyFilters() {
      var visibleCount = 0;
      cards.forEach(function (card) {
        var cardSkills = (card.getAttribute("data-skills") || "")
          .split(/\s+/)
          .filter(Boolean);

        // Empty filter set → show all. Otherwise card must match ≥1 active filter.
        var match = activeFilters.size === 0 ||
                    cardSkills.some(function (s) { return activeFilters.has(s); });

        if (match) {
          card.classList.remove("is-hidden");
          visibleCount++;
        } else {
          card.classList.add("is-hidden");
        }
      });

      if (empty) empty.hidden = visibleCount > 0;
      if (clearChip) clearChip.hidden = activeFilters.size === 0;
    }

    function syncChipState() {
      chips.forEach(function (chip) {
        var filter = chip.getAttribute("data-filter");
        if (filter === "clear") return;
        chip.setAttribute(
          "aria-pressed",
          activeFilters.has(filter) ? "true" : "false"
        );
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var filter = chip.getAttribute("data-filter");
        if (filter === "clear") {
          activeFilters.clear();
        } else {
          if (activeFilters.has(filter)) activeFilters.delete(filter);
          else activeFilters.add(filter);
        }
        syncChipState();
        applyFilters();
      });
    });

    applyFilters();
  }


  /* ── Bootstrap ──────────────────────────────────────────────────── */

  function init() {
    initThemeToggle();
    initReveal();
    initUnfold();
    initFilter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

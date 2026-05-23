/**
 * Portfolio navigation — smooth scroll, section arrows, keyboard, TOC, slide animations
 */

(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));

  function getSlideIndex(el) {
    return slides.indexOf(el);
  }

  function scrollToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    slides[index].scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(updateSlideStates, 400);
    window.setTimeout(updateSlideStates, 900);
    window.setTimeout(updateSlideStates, 1500);
  }

  function scrollToNext(fromSection) {
    const idx = getSlideIndex(fromSection);
    scrollToSlide(idx + 1);
  }

  document.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".slide");
      if (section) scrollToNext(section);
    });
  });

  document.querySelectorAll("[data-top]").forEach((btn) => {
    btn.addEventListener("click", () => scrollToSlide(0));
  });

  document.querySelectorAll('.toc-pill[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select")) return;

    const scrollY = window.scrollY;
    let current = 0;
    slides.forEach((slide, i) => {
      if (slide.offsetTop <= scrollY + 100) current = i;
    });

    if (["ArrowDown", "PageDown"].includes(e.key)) {
      e.preventDefault();
      scrollToSlide(current + 1);
    } else if (["ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      scrollToSlide(current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollToSlide(0);
    } else if (e.key === "End") {
      e.preventDefault();
      scrollToSlide(slides.length - 1);
    }
  });

  // Scroll-linked reveal: progress follows scroll (≈1.5s worth of travel per section)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const REVEAL_START = 1.02;
  const REVEAL_END = 0.06;
  const SMOOTHING = 0.26;
  const smoothReveal = new WeakMap();
  let scrollTicking = false;

  function easeFormal(t) {
    return 1 - Math.pow(1 - t, 3.2);
  }

  function getSlideReveal(slide, vh) {
    const top = slide.getBoundingClientRect().top;
    const start = vh * REVEAL_START;
    const end = vh * REVEAL_END;
    const span = start - end;
    if (span <= 0) return 1;
    const linear = (start - top) / span;
    return easeFormal(Math.min(1, Math.max(0, linear)));
  }

  function applyReveal(slide, target, i, activeIndex) {
    slide.style.setProperty("--reveal", target.toFixed(4));
    slide.classList.toggle("is-revealing", target > 0.02 && target < 0.98);
    slide.classList.toggle("is-revealed", target >= 0.98);
    slide.classList.toggle("is-active", i === activeIndex);
  }

  function updateSlideStates(snapToScroll) {
    const vh = window.innerHeight;
    const viewportMid = window.scrollY + vh * 0.45;
    let activeIndex = 0;

    slides.forEach((slide, i) => {
      const top = slide.offsetTop;
      const bottom = top + slide.offsetHeight;
      if (viewportMid >= top && viewportMid < bottom) activeIndex = i;
      else if (viewportMid >= top) activeIndex = i;

      let target = prefersReducedMotion ? 1 : getSlideReveal(slide, vh);

      if (!prefersReducedMotion && !snapToScroll) {
        const prev = smoothReveal.get(slide) ?? target;
        target = prev + (target - prev) * SMOOTHING;
        smoothReveal.set(slide, target);
      } else if (!prefersReducedMotion) {
        smoothReveal.set(slide, target);
      }

      applyReveal(slide, target, i, activeIndex);
    });
  }

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateSlideStates();
      scrollTicking = false;
    });
  }

  if (slides.length) {
    slides.forEach((slide, i) => {
      const initial = i === 0 ? 1 : 0;
      smoothReveal.set(slide, initial);
      slide.style.setProperty("--reveal", String(initial));
      if (i === 0) slide.classList.add("is-revealed", "is-active");
    });
    updateSlideStates();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    if ("onscrollend" in window) {
      window.addEventListener("scrollend", () => updateSlideStates(true), { passive: true });
    }
  }

  // Introduction: hover reveals bio + portrait; tap toggles on touch
  const introZone = document.getElementById("intro-hover-zone");
  const introReveal = document.getElementById("intro-reveal");
  const canHover = window.matchMedia("(hover: hover)").matches;

  function setIntroRevealed(revealed) {
    if (!introZone || !introReveal) return;
    introZone.classList.toggle("is-revealed", revealed);
    introReveal.setAttribute("aria-hidden", revealed ? "false" : "true");
  }

  if (introZone && introReveal) {
    if (canHover) {
      introZone.addEventListener("mouseenter", () => setIntroRevealed(true));
      introZone.addEventListener("mouseleave", () => setIntroRevealed(false));
    } else {
      introZone.addEventListener("click", (e) => {
        if (e.target.closest(".toc-pill")) return;
        setIntroRevealed(!introZone.classList.contains("is-revealed"));
      });
    }

    introZone.addEventListener("focusin", () => {
      if (canHover) setIntroRevealed(true);
    });

    introZone.addEventListener("focusout", (e) => {
      if (!canHover) return;
      if (!introZone.contains(e.relatedTarget)) setIntroRevealed(false);
    });
  }
})();

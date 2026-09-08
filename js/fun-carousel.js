/* ── Fun photo carousel: infinite auto-scroll, starts once it enters view ──
   Images keep their natural aspect ratio (only height is constrained to the
   carousel's height). Speeds up smoothly while the page is being scrolled,
   eases back to normal once scrolling stops. */
(function () {
  const wrapper = document.getElementById('fun-carousel-wrapper');
  const track = document.getElementById('fun-carousel-track');
  if (!wrapper || !track) return;

  const baseSpeed = 18; // px per second, at rest
  const boostedSpeed = 90; // px per second, while page is scrolling
  const scrollIdleDelay = 200; // ms of no scroll events before easing back down
  const easeRate = 3; // higher = snappier transition between speeds

  // Duplicate the original items once so the track can loop seamlessly.
  const originalItems = Array.from(track.children);
  originalItems.forEach((item) => {
    track.appendChild(item.cloneNode(true));
  });
  const allItems = Array.from(track.children);
  const firstClone = allItems[originalItems.length];

  let setWidth = 0;

  function updateSetWidth() {
    // Distance from the start of the first set to the start of its clone —
    // measured from actual layout, so it's exact regardless of each image's
    // natural (auto) width.
    setWidth = firstClone.offsetLeft - allItems[0].offsetLeft;
  }

  // Recompute whenever the track's layout changes (images loading, resize).
  const resizeObserver = new ResizeObserver(updateSetWidth);
  resizeObserver.observe(track);
  updateSetWidth();

  let offset = 0;
  let currentSpeed = baseSpeed;
  let targetSpeed = baseSpeed;
  let running = false;
  let rafId = null;
  let lastTimestamp = null;
  let scrollIdleTimer = null;

  function step(timestamp) {
    if (lastTimestamp === null) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    // Ease currentSpeed toward targetSpeed instead of snapping.
    currentSpeed += (targetSpeed - currentSpeed) * Math.min(easeRate * delta, 1);

    offset += currentSpeed * delta;
    if (setWidth > 0 && offset >= setWidth) offset -= setWidth;
    track.style.transform = `translateX(-${offset}px)`;

    if (running) rafId = requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    running = true;
    lastTimestamp = null;
    rafId = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  function onPageScroll() {
    targetSpeed = boostedSpeed;
    if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(() => {
      targetSpeed = baseSpeed;
    }, scrollIdleDelay);
  }

  window.addEventListener('scroll', onPageScroll, { passive: true });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start();
        else stop();
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(wrapper);
})();
